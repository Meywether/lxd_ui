<template>
  <div>
    <v-tabs v-model="activeTab" show-arrows class="elevation-1">
      <v-tab ripple :href="`#active`">Active</v-tab>
      <v-tab ripple :href="`#public`">Public</v-tab>
      <v-tab ripple :href="`#private`">Private</v-tab>

      <v-tab-item :id="`active`">
        <v-data-table :headers="tableHeaders" :items="items" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <span v-if="props.item.static !== '1'">
                  <a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a>
                </span>
                <span v-else>
                  {{ props.item.name }}
                </span>
              </td>
              <td>{{ props.item.url }}</td>
              <td>{{ props.item.protocol }}</td>
              <td>{{ props.item.auth_type.toUpperCase() }}</td>
              <td>
                <v-btn dark depressed small color="red" @click="actionItem('remove', props.item)">Remove</v-btn>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
      
      <v-tab-item :id="`public`">
        <v-data-table :headers="tableHeaders" :items="public_remotes" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a></td>
              <td>{{ props.item.url }}</td>
              <td>{{ props.item.protocol }}</td>
              <td>{{ props.item.auth_type.toUpperCase() }}</td>
              <td>
                <!--<span v-if="linkedItem.devices">-->
                <!--  <v-btn depressed small @click="actionItem('', props.item)" v-if="!linkedItem.devices[props.item.name]">Attach</v-btn>-->
                <!--  <v-btn dark depressed small color="red" @click="actionItem('', props.item)" v-if="linkedItem.devices[props.item.name]">Detach</v-btn>-->
                <!--</span>-->
                <!--<v-tooltip left v-else>-->
                <!--  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)">-->
                <!--    <v-icon color="pink">delete</v-icon>-->
                <!--  </v-btn>-->
                <!--  <span>Delete</span>-->
                <!--</v-tooltip>-->
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item :id="`private`">
        <v-data-table :headers="tableHeaders" :items="private_remotes" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a></td>
              <td>{{ props.item.url }}</td>
              <td>{{ props.item.protocol }}</td>
              <td>{{ props.item.auth_type.toUpperCase() }}</td>
              <td>
                <!--<span v-if="linkedItem.devices">-->
                <!--  <v-btn depressed small @click="actionItem('', props.item)" v-if="!linkedItem.devices[props.item.name]">Attach</v-btn>-->
                <!--  <v-btn dark depressed small color="red" @click="actionItem('', props.item)" v-if="linkedItem.devices[props.item.name]">Detach</v-btn>-->
                <!--</span>-->
                <!--<v-tooltip left v-else>-->
                <!--  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)">-->
                <!--    <v-icon color="pink">delete</v-icon>-->
                <!--  </v-btn>-->
                <!--  <span>Delete</span>-->
                <!--</v-tooltip>-->
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>

    <!-- Dialog --> 
    <v-dialog v-model="dialog" max-width="700px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat>
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} Remote</v-toolbar-title>
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
            <pre>{{ editingItem }}</pre>
            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="The name of the remote."></v-text-field>
            <v-text-field v-model="editingItem.url" label="URL:" placeholder="" required hint="The url of the remote."></v-text-field>
            
            <v-select :items="['lxd', 'simplestreams']" v-model="editingItem.protocol" label="Protocol:" hint="Select the protocol type for the remote."></v-select>
            <v-select :items="['tls', 'macaroons']" v-model="editingItem.auth_type" label="Auth Type:" hint="Select the auth type for the remote."></v-select>

            <v-text-field v-model="editingItem.secret" label="Secret:" placeholder="" required hint="The client secret for the remote. (not stored)"></v-text-field>
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

  //const container = require('~/components/lxd/container')
  //const profile = require('~/components/lxd/profile')

  export default {
    components: {},
    props: [],
    computed: {
      ...mapGetters({
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      tableHeaders: function () {
        if (this.linked) {
          return [
            { text: 'Name', value: 'name' },
            { text: 'URL', value: 'url' },
            { text: 'Protocol', value: 'protocol' },
            { text: 'Auth Type', value: 'auth_type' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'Name', value: 'name' },
            { text: 'URL', value: 'url' },
            { text: 'Protocol', value: 'protocol' },
            { text: 'Auth Type', value: 'auth_type' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        }
      },
      active_remotes: function (){
        return this.items
        
        //
        return this.items.filter(row => {
          if (row.public === false) {
            return false
          }
          return row
        })
      },
      public_remotes: function (){
        return this.items.filter(row => {
          if (row.public === '1') {
            return row
          }
          return false
        })
      },
      private_remotes: function (){
        return this.items.filter(row => {
          if (row.public === '') {
            return row
          }
          return false
        })
      }
    },
    data: () => ({
      error: false,
      activeTab: 'active',
      valid: true,
      dialog: false,

      tableLoading: true,

      attachType: '',
      items: [],
      editingIndex: -1,
      editingItem: {
        id: -1,
        name: "",
        url: "",
        protocol: "lxd",
        auth_type: "tls",
        public: false
      },
      defaultItem: {
        id: -1,
        type: "",
        name: "",
        url: "",
        protocol: "lxd",
        auth_type: "tls",
        public: false
      },

      // container/profile
      linkedItem: {},

      // rules
      nameRule: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ]
    }),
    beforeDestroy: function() {},
    mounted: async function () {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.loggedToken
      
      // get LXD server info
      if (!this.$storage.isset('lxd')) {
        try {
          const response = await axios.get(this.loggedUser.sub + '/api/lxd')
          this.$storage.set('lxd', response.data.data)
          this.lxd = response.data
        } catch (error) {
          this.$storage.remove('lxd')
        }
      } else {
        this.lxd = this.$storage.get('lxd')
      }

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
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images/remotes')
          this.items = response.data.data

          //
        } catch (error) {
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      async publicRemotes () {
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images/remotes?type=public')
          this.items = response.data.data

          //
        } catch (error) {
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      }, 
      
      async privateRemotes () {
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images/remotes?type=private')
          this.items = response.data.data

          //
        } catch (error) {
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      /*
      async attachItem(item) {
        // infix
        if (this.attachType === 'profiles') {
          this.linkedItem = Object.assign({}, profile.outfix(this.linkedItem))
        } else {
          this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        }
        
        this.linkedItem.devices  = Object.assign({}, this.linkedItem.devices)

        this.$set(this.linkedItem.devices, item.dict.name, {
          "type": item.type
        })

        //
        const response = await axios.patch(this.loggedUser.sub + '/api/lxd/'+this.attachType+'/' + this.linkedItem.name, {
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

        // profile outfix
        if (this.attachType === 'profiles') {
          this.linkedItem = Object.assign({}, profile.outfix(this.linkedItem))
        } else {
          this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        }

        //
        const response = await axios.put(this.loggedUser.sub + '/api/lxd/'+this.attachType+'/' + this.linkedItem.name, {
          description: this.linkedItem.description,
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
      */

      // create or edit item
      /*
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));
        
        //this.editingItem.name = this.editingItem.dict.name

        this.dialog = true
      },
*/
      // save
      /*
      async saveItem () {
        if (this.$refs.form.validate()) {
          
          this.editingItem.name = this.editingItem.dict.name

          // remote
          try {

            var body = {
              id: this.editingItem.id,
              type: this.editingItem.type,
              name: this.editingItem.name,
              dict: {
                name: this.editingItem.dict.name
              }
            };

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/devices/none/'+this.editingItem.id, body)
            }
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/devices/none', body)
            }

            if (response.data.error) {
              if (response.data.error.name) {
                this.error = response.data.error.name
              }
              if (response.data.error.dict.name) {
                this.error = response.data.error.dict.name
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
      */

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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/devices/none/'+item.id)

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
