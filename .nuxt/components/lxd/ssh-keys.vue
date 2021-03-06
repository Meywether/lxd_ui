<template>
  <div>
    <v-alert type="error" :value="attachError">
      {{ attachError }}
    </v-alert>
    <v-card-text v-if="notRunning">
      <v-alert :value="true" outline color="info" icon="info">
        <v-layout row>
          <v-flex xs11>
            <p style="padding-top:10px;margin-bottom:10px" v-if="linkedItem.status !== 'Running'">Container must be running before toggling SSH keys.</p>
            <p style="padding-top:10px;margin-bottom:10px" v-if="linkedItem.status === 'Running'">You can add and remove SSH keys.</p>
          </v-flex>
          <v-flex xs1>
            <v-btn depressed small color="error" style="float:right" v-if="linkedItem.status !== 'Stopped'" @click="stopContainer(linkedItem)" :loading="statusChange" :disabled="statusChange">Stop</v-btn>
            <v-btn depressed small color="success" style="float:right" v-if="linkedItem.status === 'Stopped'" @click="startContainer(linkedItem)" :loading="statusChange" :disabled="statusChange">Start</v-btn>
          </v-flex>
        </v-layout>
      </v-alert>
    </v-card-text>
    <v-data-table :headers="tableHeaders" :items="items" hide-actions :loading="tableLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <span v-if="linkedItem.devices">{{ props.item.name }}</span>
            <span v-else><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a></span>
          </td>
          <td>{{ props.item.fingerprint }}</td>
          <td>
            <span v-if="linkedItem.devices">
              <v-btn depressed small @click="attachItem(props.item)" v-if="!selectedItems.includes(props.item.id)" :disabled="linkedItem.status !== 'Running'">Add</v-btn>
              <v-btn :dark="linkedItem.status === 'Running'" depressed small color="red" @click="detachItem(props.item)" v-if="selectedItems.includes(props.item.id)" :disabled="linkedItem.status !== 'Running'">Remove</v-btn>
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
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no SSH keys.' }}
      </template>
    </v-data-table>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="700px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat>
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} SSH key</v-toolbar-title>
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
            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="The name of the SSH key."></v-text-field>
            <v-text-field v-model="editingItem.key" :rules="keyRule" label="Public Key:" placeholder="" multi-line required hint="The SSH public key."></v-text-field>
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
            { text: 'Fingerprint', value: 'fingerprint' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'Name', value: 'name' },
            { text: 'Fingerprint', value: 'fingerprint' },
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

      statusChange: false,
      notRunning: false,
      tableLoading: true,

      items: [],
      selectedItems: [],
      editingIndex: -1,
      editingItem: {
        id: -1,
        name: "",
        key: "",
        fingerprint: ""
      },
      defaultItem: {
        id: -1,
        name: "",
        key: "",
        fingerprint: ""
      },

      // container/profile
      linkedItem: {},

      // rules
      nameRule: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ],
      // rules
      keyRule: [
        v => !!v || 'Public key is required'
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

      if (this.linked) {
        this.linkedItem = Object.assign({}, this.linked)
        
        // is container running
        this.notRunning = this.linked.status !== 'Running'
  
        // parse out current sshkeys
        if (this.linkedItem.config && this.linkedItem.config['user.sshkeys']) {
          var tmp = this.linkedItem.config['user.sshkeys']
          this.selectedItems = tmp.split("\n")
        } else {
          this.selectedItems = []
        }
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
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/ssh-keys')
          this.items = response.data.data
        } catch (error) {
          this.error = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },

      async attachItem(item) {
        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))

        this.selectedItems.push(item.id)

        this.$set(this.linkedItem.config, "user.sshkeys", this.selectedItems.join("\n"))

        // append key to authorized_keys
        var response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name + '/exec', {
          'command': ['/bin/bash', '-c', 'mkdir -p /root/.ssh && chmod 0700 /root/.ssh && echo "'+item.key+'" >> /root/.ssh/authorized_keys && chmod 0644 /root/.ssh/authorized_keys'],
          'environment': {
            'HOME': '/root',
            'TERM': 'xterm',
            'USER': 'root'
          },
          'wait-for-websocket': false,
          'interactive': false,
          'record-output': true,
          'width': 80,
          'height': 80
        })

        //
        response = await axios.patch(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
          config: this.linkedItem.config
        })

        if (response.data.error) {
          this.attachError = response.data.error
        }
      },

      async detachItem(item) {
        this.attachError = false
        
        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        
        const index = this.selectedItems.indexOf(item.id)
        this.selectedItems.splice(index, 1)

        // remove from linked item
        var replace = item.id
        
        var reg = new RegExp(replace, "g")
        this.linkedItem.config["user.sshkeys"] = this.linkedItem.config["user.sshkeys"].replace(reg, '')
        
        // remove key from authorized_keys
        var response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name + '/exec', {
          'command': ['/bin/bash', '-c', 'sed -i \'s|'+item.key+'||g\' /root/.ssh/authorized_keys && sed -i \'/^\s*$/d\' /root/.ssh/authorized_keys'],
          'environment': {
            'HOME': '/root',
            'TERM': 'xterm',
            'USER': 'root'
          },
          'wait-for-websocket': false,
          'interactive': false,
          'record-output': true,
          'width': 80,
          'height': 80
        })
        
        // clear if empty
        if (this.linkedItem.config["user.sshkeys"] === '') {
          delete this.linkedItem.config["user.sshkeys"]
        }

        //
        response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
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
        this.editingItem = JSON.parse(JSON.stringify(item))

        this.dialog = true
      },

      // save
      async saveItem () {
        this.error = false
        if (this.$refs.form.validate()) {
          // remote
          try {

            var body = {
              id: this.editingItem.id,
              name: this.editingItem.name,
              key: this.editingItem.key,
            }

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/ssh-keys/'+this.editingItem.id, body)
            }
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/ssh-keys', body)
            }

            if (response.data.error) {
              if (response.data.error.name) {
                this.error = response.data.error.name
              }
              if (response.data.error.key) {
                this.error = response.data.error.key
              }
            } else {
              //
              this.$emit('snackbar', 'SSH key successfully saved.')

              if (this.editingIndex === -1) {
                this.close()
              }

              this.initialize()
            }
          } catch (error) {
            this.error = 'Could not save SSH key to server.'
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
          title: 'Delete SSH key?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> key?<p class="text-md-center red--text"><br><b>Keys are not removed from containers!</b></p>',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/ssh-keys/'+item.id)

                  //
                  this.$emit('snackbar', 'SSH key successfully deleted.')
                } catch (error) {
                  //
                  this.error = 'Failed to delete SSH key.'
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
      
      stopContainer (item) {
        this.statusChange = true
        axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
          "action": 'stop',
          "timeout": 30,
          "force": true,
          "stateful": false
        })
        setTimeout(() => {
          this.statusChange = false
          this.$emit('initialize')
          item.status = 'Stopped'
        }, 2500)
      },
      
      startContainer (item) {
        this.statusChange = true
        axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
          "action": 'start',
          "timeout": 30,
          "force": true,
          "stateful": false
        })
        setTimeout(() => {
          this.statusChange = false
          this.$emit('initialize')
          item.status = 'Running'
        }, 2500)
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
          this.error = false
        }, 300)
      },

      ucfirst(str) {
          return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }
    }
  }
</script>

<style>

</style>
