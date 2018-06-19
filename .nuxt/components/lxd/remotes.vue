<template>
  <div>
    <v-tabs v-model="activeTab" show-arrows class="elevation-1">
      <v-tab ripple :href="`#active`">Active</v-tab>
      <v-tab ripple :href="`#public`">Public</v-tab>
      <v-tab ripple :href="`#private`">Private</v-tab>

      <v-tab-item :id="`active`">
        <v-data-table :headers="tableHeadersActive" :items="active_remotes" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <span v-if="props.item.static !== '1'">
                  <!--<a href="javascript:void(0)" @click.stop="editItem(props.item)">-->
                    {{ props.item.name }}
                  <!--</a>-->
                </span>
                <span v-else>
                  {{ props.item.name ? props.item.name : '-' }}
                </span>
              </td>
              <td>{{ props.item.url ? props.item.url : '-' }}</td>
              <td>{{ props.item.protocol ? (props.item.protocol == 'lxd' ? 'LXD' : 'Simplestreams') : '-' }}</td>
              <td>{{ props.item.auth_type ? props.item.auth_type.toUpperCase() : '-' }}</td>
              <td>
                <v-tooltip left>
                  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="disableItem(props.item)" :disabled="props.item.static === '1'">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                  <span>Disable Remote</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no active remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
      
      <v-tab-item :id="`public`">
        <v-data-table :headers="tableHeadersPublic" :items="public_remotes" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <span v-if="props.item.static !== '1'">
                  <!--<a href="javascript:void(0)" @click.stop="editItem(props.item)">-->
                    {{ props.item.name }}
                  <!--</a>-->
                </span>
                <span v-else>
                  {{ props.item.name ? props.item.name : '-' }}
                </span>
              </td>
              <td>{{ props.item.url ? props.item.url : '-' }}</td>
              <td>{{ props.item.protocol ? (props.item.protocol == 'lxd' ? 'LXD' : 'Simplestreams') : '-' }}</td>
              <td>
                <v-tooltip left>
                  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)" :disabled="props.item.static === '1'">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                  <span>Delete Remote</span>
                </v-tooltip>
                <v-tooltip left>
                  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="enableItem(props.item)" :disabled="active_remotes.includes(props.item)">
                    <v-icon color="success">add</v-icon>
                  </v-btn>
                  <span>Enable Remote</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no active remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item :id="`private`">
        <v-data-table :headers="tableHeadersPrivate" :items="private_remotes" hide-actions :loading="tableLoading">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <span v-if="props.item.static !== '1'">
                  <!--<a href="javascript:void(0)" @click.stop="editItem(props.item)">-->
                    {{ props.item.name }}
                  <!--</a>-->
                </span>
                <span v-else>
                  {{ props.item.name ? props.item.name : '-' }}
                </span>
              </td>
              <td>{{ props.item.url ? props.item.url : '-' }}</td>
              <td>{{ props.item.protocol ? (props.item.protocol == 'lxd' ? 'LXD' : 'Simplestreams') : '-' }}</td>
              <td>{{ props.item.auth_type ? props.item.auth_type.toUpperCase() : '-' }}</td>
              <td>
                <v-tooltip left>
                  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)" :disabled="props.item.static === '1'">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                  <span>Delete Remote</span>
                </v-tooltip>
                <v-tooltip left>
                  <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="enablePrivateRemote(props.item, true)" :disabled="active_remotes.includes(props.item)">
                    <v-icon color="success">add</v-icon>
                  </v-btn>
                  <span>Enable Remote</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no active remotes.' }}
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>

    <!-- Dialog --> 
    <v-dialog v-model="dialog.editing" max-width="600px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat>
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ editingIndex === -1 ? 'Add' : 'Edit' }} Remote</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="saveItem()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-alert type="error" :value="error.editing" v-html="error.editing"></v-alert>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="The name of the remote."></v-text-field>
            <v-text-field v-model="editingItem.url" :rules="urlRule" label="URL:" placeholder="" required hint="The url of the remote."></v-text-field>
            <v-select :items="['lxd', 'simplestreams']" v-model="editingItem.protocol" label="Protocol:" hint="Select the protocol type for the remote."></v-select>
            <v-select :items="['tls', 'macaroons']" v-model="editingItem.auth_type" label="Auth Type:" hint="Select the auth type for the remote."></v-select>
            <v-text-field v-model="editingItem.secret" label="Secret:" placeholder="" hint="The client secret for the remote. (not stored). If left blank treated as public."></v-text-field>
          </v-form>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
    
    <!-- Dialog --> 
    <v-dialog v-model="dialog.askSecret" max-width="500px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat>
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Enable Remote</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="enablePrivateRemote(editingItem)">Enable</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-form ref="secretform" v-model="valid" lazy-validation>
            <v-alert type="error" :value="error">
              {{ error }}
            </v-alert>
            <v-text-field v-model="editingItem.secret" :rules="secretRule" label="Secret:" placeholder="" required hint="The client secret for the remote. (not stored)"></v-text-field>
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

  export default {
    components: {},
    props: [],
    computed: {
      ...mapGetters({
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      active_remotes: function () {
        return this.items.filter(row => {
          if (row.active === '1' || row.static === '1') {
            return row
          }
          return false
        })
      },
      public_remotes: function () {
        return this.items.filter(row => {
          if (row.public === '1' && row.static === '') {
            return row
          }
          return false
        })
      },
      private_remotes: function () {
        return this.items.filter(row => {
          if (row.public === '' && row.static === '') {
            return row
          }
          return false
        })
      }
    },
    data: () => ({
      error: {global: '', editing: ''},
      activeTab: 'active',
      valid: true,
      dialog: {editing: false, askSecret: false},

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
        secret: "",
        public: false
      },
      defaultItem: {
        id: -1,
        type: "",
        name: "",
        url: "",
        protocol: "lxd",
        auth_type: "tls",
        secret: "",
        public: false
      },
      
      tableHeadersActive: [
        { text: 'Name', value: 'name' },
        { text: 'URL', value: 'url' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Auth Type', value: 'auth_type' },
        { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'200px' }
      ],
      tableHeadersPublic: [
        { text: 'Name', value: 'name' },
        { text: 'URL', value: 'url' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'200px' }
      ],
      tableHeadersPrivate: [
        { text: 'Name', value: 'name' },
        { text: 'URL', value: 'url' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Auth Type', value: 'auth_type' },
        { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'200px' }
      ],

      // container/profile
      linkedItem: {},

      // rules
      nameRule: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ],
      urlRule: [
        v => !!v || 'URL is required'
      ],
      secretRule: [
        v => !!v || 'Secret is required'
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
      'dialog.editing': function (val) {
        val || this.close()
      },
      'dialog.askSecret': function (val) {
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
          this.error.global = 'Could not fetch data from server.';
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
          this.error.global = 'Could not fetch data from server.';
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
          this.error.global = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      async saveItem () {
        if (this.$refs.form.validate()) {
          this.error.editing = '';
          try {

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/images/remotes/'+this.editingItem.name, this.editingItem)
            }
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/images/remotes', this.editingItem)
            }

            if (response.data.error) {
              if (typeof response.data.error == 'string') {
                this.error.editing = response.data.error
              } else {
                this.error.editing = '<ul style="padding-left:15px">'
                Object.keys(response.data.error).forEach(key => {
                  this.error.editing += '<li>'+response.data.error[key]+'.</li>'
                })
                this.error.editing += '</ul>'
              }
            } else {
              //
              this.$emit('snackbar', 'Remote successfully saved.')

              if (this.editingIndex === -1) {
                this.close()
              }
            }
          } catch (error) {
            this.error.global = 'Could not save remote to server.';
          }
          this.initialize()
          setTimeout(() => {
            this.$emit('reload')
          }, 500)
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
          title: 'Delete remote?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> remote?<p class="text-md-center red--text"><br><b>Delete remotes are removed from the LXD server and the database.</b></p>',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/images/remotes/'+item.name)

                  //
                  this.$emit('snackbar', 'Remote successfully deleted.')
                  this.$emit('reload')
                } catch (error) {
                  //
                  this.error.global = 'Failed to delete remote.';
                }
                this.initialize()
                setTimeout(() => {
                  this.$emit('reload')
                }, 500)
              }
            },
            {
              title: 'No',
              color: 'error'
            }
          ]
        })
      },

      async enableItem (item) {
        // remote
        try {
          item.active = true;
          //
          const response = await axios.put(this.loggedUser.sub + '/api/lxd/images/remotes/'+item.name, item)
          //
          this.$emit('snackbar', 'Remote successfully enabled.')
          this.initialize()
            
          setTimeout(() => {
            this.$emit('reload')
          }, 500)
        } catch (error) {
          //
          this.error.global = 'Failed to enabled remote.';
        }
      },
      
      async enablePrivateRemote (item, hasSecret = false) {
        if (!hasSecret) {
          if (this.$refs.secretform.validate()) {
            // remote
            try {
              item.active = true;
              //
              const response = await axios.put(this.loggedUser.sub + '/api/lxd/images/remotes/'+item.name, item)
      
              //
              this.$emit('snackbar', 'Remote successfully enabled.')
              this.initialize()
                
              setTimeout(() => {
                this.$emit('reload')
                this.editingIndex = this.items.indexOf(item)
                this.editingItem = Object.assign({}, item)
              }, 500)
                
              this.dialog.askSecret = !this.dialog.askSecret
            } catch (error) {
              //
              this.error.global = 'Failed to enabled remote.';
            }
          }
        } else {
          this.editingIndex = this.items.indexOf(item)
          this.editingItem = Object.assign({}, item)
          this.dialog.askSecret = true
        }
      },
      
      async disableItem (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Disable remote?',
          text: 'Are you sure you want to disable the <b>'+item.name+'</b> remote? <p class="text-md-center red--text"><br><b>Disabled remotes are removed from the LXD server.</b></p>',
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
                  const response = await axios.put(this.loggedUser.sub + '/api/lxd/images/remotes/'+item.name, {
                    active: false
                  })

                  //
                  this.$emit('snackbar', 'Remote successfully disabled.')
                } catch (error) {
                  //
                  this.error.global = 'Failed to disable remote.';
                }
                this.initialize()
                setTimeout(() => {
                  this.$emit('reload')
                }, 500)
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
        this.dialog.editing = true
      },

      // close item dialog, and reset to default item
      close () {
        this.dialog = {editing:false, askSecret: false}
        this.error.editing = ''
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
