<template>
  <div>
    <v-alert type="error" :value="attachError">
      {{ attachError }}
    </v-alert>
    <v-data-table :headers="tableHeaders" :items="items" hide-actions :loading="tableLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <span v-if="linkedItem.devices">{{ props.item.name }}</span>
            <span v-else><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a></span>
          </td>
          <td>{{ props.item.dict.listen ? props.item.dict.listen.substring(props.item.dict.listen.indexOf(":") + 1) : '-' }}</td>
          <td>{{ props.item.dict.connect ? props.item.dict.connect.substring(props.item.dict.connect.indexOf(":") + 1) : '-' }}</td>
          <td>{{ props.item.dict.bind ? ucfirst(props.item.dict.bind) : '-' }}</td>
          <td>
            <span v-if="linkedItem.devices">
              <v-btn depressed small @click="attachItem(props.item)" v-if="!linkedItem.devices[props.item.name]">Attach</v-btn>
              <v-btn dark depressed small color="red" @click="detachItem(props.item)" v-if="linkedItem.devices[props.item.name]">Detach</v-btn>
            </span>
            <v-tooltip left v-else>
              <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
              <span>Delete</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no proxy devices.' }}
      </template>
    </v-data-table>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="700px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat style="overflow-x:hidden; overflow-y: auto; min-height:calc(100vh - 400px);">
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} Proxy Device</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="saveItem()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-alert type="error" :value="error">
              {{ error }}
            </v-alert>
            <h3>General</h3>

            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="Enter a name for the proxy device."></v-text-field>

            <h3>Device Settings</h3>
            <v-text-field v-model="editingItem.dict['listen']" :rules="listenRule" label="Listen:" placeholder="" required hint="The address and port to bind and listen."></v-text-field>
            <v-text-field v-model="editingItem.dict['connect']" :rules="connectRule" label="Connect:" placeholder="" required hint="The address and port to connect to."></v-text-field>
            <v-select :items="['host','container']" v-model="editingItem.dict['bind']" label="Bind:" persistent-hint hint="Which side to bind on."></v-select>
          </v-form>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

  const container = require('~/components/lxd/container')

  export default {
    components: {},
    props: [
      'linked'
    ],
    computed: {
      ...mapGetters({
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      tableHeaders: function () {
        if (this.linked) {
          return [
            { text: 'Name', value: 'name' },
            { text: 'Listen', value: 'listen' },
            { text: 'Connect', value: 'connect' },
            { text: 'Bind', value: 'bind' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'Name', value: 'name' },
            { text: 'Listen', value: 'listen' },
            { text: 'Connect', value: 'connect' },
            { text: 'Bind', value: 'bind' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        }
      }
    },
    data: () => ({
      error: false,
      attachError: false,
      valid: true,
      dialog: false,

      tableLoading: true,

      items: [],
      editingIndex: -1,
      editingItem: {
        id: -1,
        type: "proxy",
        name: "",
        dict: {
          "listen": "",
          "connect": "",
          "bind": "host"
        }
      },
      defaultItem: {
        id: -1,
        type: "proxy",
        name: "",
        dict: {
          "listen": "",
          "connect": "",
          "bind": "host"
        }
      },

      // container/profile
      linkedItem: {},

      // rules
      nameRule: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ],
      listenRule: [
        v => !!v || 'Listen address is required',
        v => (v && /^(?!0)(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}:\d+$/gm.test(v)) || 'Invalid IP address and port'
      ],
      connectRule: [
        v => !!v || 'Connect address is required',
        v => (v && /^(?!0)(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}:\d+$/gm.test(v)) || 'Invalid IP address and port'
      ]
    }),
    beforeDestroy: function() {},
    mounted: async function () {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.loggedToken
      
      // get LXD server info
      if (!this.$storage.isset('lxd')) {
        try {
          const response = await axios.get(this.loggedUser.sub + '/api/lxd')
          this.$storage.set('lxd', response.data)
          this.lxd = response.data
        } catch (error) {
          this.$storage.remove('lxd')
        }
      } else {
        this.lxd = this.$storage.get('lxd')
      }

      this.linkedItem = Object.assign({}, this.linked)

      this.$nextTick(() => {
        this.initialize()
      })
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      async initialize () {
        try {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/devices/proxy')
          this.items = response.data.data
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      async attachItem(item) {
        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        this.linkedItem.devices  = Object.assign({}, this.linkedItem.devices)

        this.$set(this.linkedItem.devices, item.name, {
          "type": item.type,
          ...item.dict
        })

        //
        const response = await axios.patch(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
          // config: this.linkedItem.config,
          devices: this.linkedItem.devices
        })

        if (response.data.error) {
          this.attachError = response.data.error
        }
      },

      async detachItem(item) {
        this.attachError = false;

        // remove from linked item
        this.$delete(this.linkedItem.devices, item.name)

        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))

        //
        const response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
          config: this.linkedItem.config,
          devices: this.linkedItem.devices,
          ephemeral: this.linkedItem.ephemeral,
          stateful: this.linkedItem.stateful,
          profiles: this.linkedItem.profiles
        })

        if (response.data.error) {
          this.attachError = response.data.error
        }
      },

      // create or edit item
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

        // remove connection type
        this.editingItem.dict.listen = this.editingItem.dict.listen.substring(this.editingItem.dict.listen.indexOf(":") + 1)
        this.editingItem.dict.connect = this.editingItem.dict.connect.substring(this.editingItem.dict.connect.indexOf(":") + 1)

        this.dialog = true
      },

      // save
      async saveItem () {
        if (this.$refs.form.validate()) {

          // remote
          try {

            var body = {
              id: this.editingItem.id,
              type: this.editingItem.type,
              name: this.editingItem.name,
              dict: {
                listen: 'tcp:' + this.editingItem.dict.listen,
                connect: 'tcp:' + this.editingItem.dict.connect,
                bind: this.editingItem.dict.bind
              }
            };

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/devices/proxy/'+this.editingItem.id, body)
            }
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/devices/proxy', body)
            }

            if (response.data.error) {
              if (response.data.error.listen) {
                this.error = response.data.error.listen
              }
              if (response.data.error.connect) {
                this.error = response.data.error.connect
              }
            } else {
              //
              this.$emit('snackbar', 'Device successfully saved.')

              if (this.editingIndex === -1) {
                this.close()
              }

              this.initialize()
            }
          } catch (error) {
            this.error = 'Could not save device to server.';
          }
        }
      },

      async deleteItem (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete device?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> device?<p class="text-md-center red--text"><br><b>Devices are not removed from containers!</b></p>',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => {
                // local
                const index = this.items.indexOf(item)
                this.items.splice(index, 1)

                // remote
                try {
                  //
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/devices/proxy/'+item.id)

                  //
                  this.$emit('snackbar', 'Device successfully deleted.')
                } catch (error) {
                  //
                  this.error = 'Failed to delete device.';
                }
              }
            },
            {
              title: 'No',
              color: 'error'
            }
          ]
        })
      },

      openDialog(){
        this.dialog = true
      },

      // close item dialog, and reset to default item
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
        }, 300)
      },

      ucfirst(str) {
          return String(str).charAt(0).toUpperCase() + String(str).slice(1);
      }
    }
  }
</script>

<style>

</style>
