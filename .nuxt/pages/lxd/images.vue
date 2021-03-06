<template>
  <v-app>

    <!-- Snackbar Alert -->
    <v-snackbar top :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar">
      {{ snackbarText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-content>
      <!-- Main Content -->
      <v-container fluid tag="section" id="grid">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="display mb-2">
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    LXD - Images <span v-if="state == 'remotes'">- Remotes</span>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small @click="state = 'images'" v-if="state == 'remotes'" style="float:right">Manage Images</v-btn>
                    <v-btn small @click="state = 'remotes'" v-if="state == 'images'" style="float:right">Manage Remotes</v-btn>
                    <v-btn small color="success" @click="openDialog('remotes')" v-if="state == 'remotes'" style="float:right">Add Remote</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex v-if="state == 'images'">
                <v-alert type="error" :value="error.global">
                  {{ error.global }}
                </v-alert>
                <div class="elevation-1">
                  <v-tabs v-model="activeRemote" right @input="loadRemoteImages">
                    <v-tab ripple :href="`#${item.name}`" v-for="item in remotes" :key="item.name">{{ item.name }}</v-tab>
                    <v-tab-item :id="`${item.name}`" v-for="item in remotes" :key="item.name"></v-tab-item>
                  </v-tabs>
                  <v-tabs v-model="activeDistro" show-arrows v-if="distros_list.length > 0">
                    <v-tab ripple :href="`#${dist}`" v-for="dist in distros_list" :key="dist">{{ dist }}</v-tab>
                    <v-tab-item :id="`${dist}`" v-for="dist in distros_list" :key="dist"></v-tab-item>
                  </v-tabs>
                </div>
                <v-data-table :headers="tableHeaders" :items="image_list" hide-actions class="elevation-1" :loading="tableLoading" :pagination.sync="tableSorting">
                  <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <td>
                      <span v-if="publicServers.includes(activeRemote)">{{ props.item.properties.description ? props.item.properties.description : '-' }}</span>
                      <span v-else><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.properties.description ? props.item.properties.description : '-' }}</a></span>
                    </td>
                    <td>{{ props.item.properties.version ? props.item.properties.version : '-' }}</td>
                    <td>{{ props.item.properties.release ? ucfirst(props.item.properties.release) : '-' }}</td>
                    <td>{{ formatBytes(props.item.size) }}</td>
                    <td>{{ new Date(props.item.uploaded_at).toLocaleString() }}</td>
                    <td>
                      <v-tooltip left>
                        <v-btn slot="activator" icon class="mx-0" style="float:right" @click="deleteItem(props.item)" v-if="show_delete">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                        <span>Delete Image</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <v-btn slot="activator" icon class="mx-0" style="float:right" @click="createContainer(props.item, false)">
                          <v-icon color="green">play_circle_outline</v-icon>
                        </v-btn>
                        <span>Launch Container</span>
                      </v-tooltip>
                      <v-tooltip left>
                        <v-btn slot="activator" icon class="mx-0" style="float:right" @click="copyItem(props.item, false)">
                          <v-icon color="blue-grey lighten-1">file_copy</v-icon>
                        </v-btn>
                        <span>Copy Image</span>
                      </v-tooltip>
                    </td>
                  </template>
                  <template slot="no-data">
                    <span v-if="tableLoading">Fetching data, please wait...</span>
                    <span v-else>Remote has no images. 
                    <!--<span v-if="!forceReloaded"><a @click="initialize(true)">Force Reload</a></span>-->
                    </span>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex v-if="state == 'remotes'">
                <remotes @snackbar="setSnackbar" @reload="initialize()" ref="remotes"></remotes>
              </v-flex> 
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      
      <!-- Copy Dialog -->
      <v-dialog v-model="dialog.copy" max-width="600px" scrollable>
        <v-card tile v-if="copy.properties">
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.copy = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Copy Image</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="copyItem(newItem, true)">Copy</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-alert :value="true" outline color="info" icon="info">
              Copying images between hosts may take a while, be patient.
            </v-alert>
            <v-form ref="formcopy" v-model="valid" lazy-validation>
              <v-select :items="[copy.properties.description]" v-model="copy.properties.description" label="Image:" required disabled></v-select>
              <v-select :items="[activeRemote]" v-model="activeRemote" label="From Remote:" required disabled></v-select>
              <v-select :items="private_remotes" v-model="copy.remote" item-text="name" item-value="name" :rules="remoteRule" label="To Remote:" required></v-select>
            </v-form>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog> 
      
      <!-- Create Container Dialog -->
      <v-dialog v-model="dialog.create" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.create = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Launch Container</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="createContainer(newItem, true)" :loading="launching" :disabled="launching">Launch</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-alert type="error" :value="error.launch">
              {{ error.launch }}
            </v-alert>
            <v-form ref="formcreate" v-model="valid" lazy-validation>
              <div v-if="launching">
                <v-progress-linear :indeterminate="query" :query="true" v-model="value" :active="show" height="20"></v-progress-linear>
                <span>{{ real_value }} {{ progress_text ? progress_text : (this.newItem.remote !== 'local' ? 'Initializing image download.' : '') }}</span>
              </div>
              <div v-else>
                <v-text-field v-model="newItem.name" label="Name:" :rules="nameRule" @input="safe_name()" hint="Enter name for new container." required :disabled="launching"></v-text-field>
                <v-select :items="[newItem.image]" v-model="newItem.image" label="Image:" required disabled></v-select>
                <v-select :items="profiles" :rules="profilesRule" v-model="newItem.profile" label="Profiles:" multiple chips required :disabled="launching"></v-select>
                <v-select :items="pools" v-model="newItem.pool" label="Storage Pool:" persistent-hint hint="Storage pool the root disk device belongs to." :disabled="launching"></v-select>
                <!--<v-select :items="networks" v-model="newItem.network" label="Network:" persistent-hint hint="Additional network device."></v-select>-->
                <v-switch :label="`${newItem.ephemeral ? 'Ephemeral' : 'Ephemeral'}`" color="success" v-model="newItem.ephemeral" :disabled="launching"></v-switch>
              </div>
              <!--<h3>Environment Variables</h3>-->
              <!--<v-layout row wrap>-->
              <!--  <v-flex xs6>-->
              <!--    <v-text-field v-model="newItem.newEnvironment" label="IP Address:" hint="Enter upstream IP address."></v-text-field>-->
              <!--  </v-flex>-->
              <!--  <v-flex xs5>-->
              <!--    <v-text-field v-model="newItem.newEnvironment" label="Port:" hint="Enter upstream port."></v-text-field>-->
              <!--  </v-flex>-->
              <!--  <v-flex xs1>-->
              <!--    <v-btn flat icon color="success" @click.native="addUpstream">-->
              <!--      <v-icon>add</v-icon>-->
              <!--    </v-btn>-->
              <!--  </v-flex>-->
              <!--</v-layout>-->
              <!--<v-layout row wrap v-for="environment in newItem.environment " :key="environment.id">-->
              <!--  <v-flex xs6>-->
              <!--    <v-text-field v-model="upstream.ip" label="IP Address:" hint="Empty or invalid ips are removed."></v-text-field>-->
              <!--  </v-flex>-->
              <!--  <v-flex xs5>-->
              <!--    <v-text-field v-model="upstream.port" label="Port:" hint="Empty or invalid ports are removed."></v-text-field>-->
              <!--  </v-flex>-->
              <!--  <v-flex xs1>-->
              <!--    <v-btn flat icon color="error" @click.native="removeUpstream(upstream)">-->
              <!--      <v-icon>remove</v-icon>-->
              <!--    </v-btn>-->
              <!--  </v-flex>-->
              <!--</v-layout>-->
            </v-form>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
      
      <!-- Edit Image Dialog -->
      <v-dialog v-model="dialog.edit" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.edit = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ publicServers.includes(activeRemote) ? 'View' : 'Edit' }} Image</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding: 0px;">
            <v-card flat>
              <v-card-text v-if="editingItem.properties">
                <v-alert type="error" :value="error.editing">
                  {{ error.editing }}
                </v-alert>
                <v-form ref="formedit" v-model="valid" lazy-validation>
                  <v-text-field v-model="editingItem.properties.description" label="Description:" :counter="60" :rules="descriptionRule" hint="Enter description for image." required></v-text-field>
                  <v-text-field v-model="editingItem.properties.version" label="Version:" hint="Enter version for image."></v-text-field>
                  <v-text-field v-model="editingItem.properties.release" label="Release:" hint="Enter release for image."></v-text-field>
                  <v-switch label="Auto Update:" color="success" v-model="editingItem.auto_update"></v-switch>
                  <v-switch label="Public:" color="success" v-model="editingItem.public"></v-switch>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { setToken } from '~/utils/auth'
  import axios from 'axios'
  
  import remotes from '~/components/lxd/remotes.vue'

  export default {
    middleware: [
      'authenticated'
    ],
    components: {
      remotes
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      image_list: function () {
        return this.items.filter(row => {
          if (this.activeDistro.toLowerCase() !== row.properties.os.toLowerCase()) {
            return false
          }
          return row
        })
      },
      distros_list: function () {
        return Array.from(new Set(this.distros))
      },
      private_remotes: function () {
        return this.remotes.filter(row => {
          if (this.publicServers.includes(row.name) || row.name === this.activeRemote) {
            return false
          }
          return row
        })
      }
    },
    data: () => ({
      value: 0,
      query: false,
      show: true,
      interval: 0,
      
      launching: false,
      progress_text: '',
      real_value: '',
      
      // global error
      error: {editing: false, global: false, launch: false},
      state: 'images',
      forceReloaded: false,

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,

      // table & items
      items: [],
      profiles: [],
      pools: [],
      remotes: [],
      networks: [],
      distros: [],
      publicServers: ['images', 'ubuntu', 'ubuntu-daily'],
      showDelete: false,
      
      activeRemote: 'local',
      activeDistro: 'ubuntu',
      
      tableSorting: {'sortBy': 'properties.version', 'descending': true, 'rowsPerPage': -1},
      tableLoading: true,
      tableNoData: 'You have not added any port forwards.',
      tableHeaders: [
        { text: 'Description', value: 'properties.description' },
        { text: 'Version', value: 'properties.version' },
        { text: 'Release', value: 'properties.release' },
        { text: 'Size', value: 'size' },
        { text: 'Uploaded', value: 'uploaded_at' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'right' }
      ],
      itemActions: [
        { title: 'Start' },
        { title: 'Stop' },
        { title: 'Delete' }
      ],

      // dialog
      dialog: {create: false, edit: false, copy: false},
      
      // item
      editingIndex: {create: -1, edit: -1},
      editingItem: {},
      // item
      newItem: {
        name: '',
        image: '',
        pool: 'default',
        network: '',
        image_fingerprint: '',
        profile: ['default'],
        ephemeral: false,
        remote: 'local'
      },
      defaultItem: {
        name: '',
        image: '',
        pool: 'default',
        network: '',
        image_fingerprint: '',
        profile: ['default'],
        ephemeral: false,
        remote: 'local'
      },
      
      copyIndex: -1,
      copy: {
        remote:"local"
      },
      
      // item form & validation
      valid: true,
      nameRule: [
        v => !!v || 'Name is required.',
        v => (v && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(v)) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.',
        v => (v && isNaN(v.charAt(0))) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.'
      ],
      remoteRule: [
        v => !!v || 'Remote is required.'
      ],      
      descriptionRule: [
        v => !!v || 'Description is required.',
        v => (v && v.length < 60) || 'Max length of description should not exceed 60 characters.'
      ],
      profilesRule: [
        v => v.length >= 1 || 'At least one profile is required.'
      ]
    }),
    beforeDestroy () {
      clearInterval(this.interval)
    },

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
      'dialog.copy': function (val) {
         val || this.close('copy')
      },
      'dialog.create': function (val) {
         val || this.close('create')
      },
      'dialog.edit': function (val) {
         val || this.close('edit')
      }
    },
    methods: {
      async initialize (force = false) {
        this.forceReloaded = force
        // fetch remote
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images/remotes?type=active')
          this.remotes = response.data.data

          //
          this.loadRemoteImages(this.activeRemote)

          //
        } catch (error) {
          this.tableNoData = 'No data.'
          this.error.global = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },
      
      async getProfiles () {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/profiles')
          
          this.profiles = []
          response.data.data.forEach(item => {
            this.profiles.push(item.name)
          })
        } catch (error) {
          this.profiles = []
        }
      }, 
      
      async getStoragePools () {
        //
        try {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/storage', {
            params: {
              types: ['name']
            }
          })
          response.data.data.forEach(item => {
            this.pools.push(item.name)
          })
        } catch (error) {
          this.pools = []
        }
      },

      async getNetworks () {
        //
        try {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/networks')
          response.data.data.forEach(item => {
            if (item.managed) {
              this.networks.push(item.name)
            }
          })
        } catch (error) {
          this.networks = []
        }
      },
      
      async loadRemoteImages(remote = 'local') {
        //
        this.items = []
        //
        this.distros = []
        //
        this.tableLoading = true
        //
        this.error.global = false
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images?remote='+remote+(this.forceReloaded ? '&force=1' : ''))
          
          this.items = response.data.data
          
          //
          if (response.data.error) {
            this.error.global = response.data.error
            this.distros = []
          } else {
            // assign distro list in background
            setTimeout(() => {
              this.distros = []
              for (var key in this.items) {
                this.distros.push(this.items[key].properties.os.toLowerCase())
              }
            }, 0)
            
            //set active distro to first
            setTimeout(() => {
              this.activeDistro = this.distros[0] ? this.distros[0] : ''
            }, 10)
            
            // show delete button
            this.show_delete = this.items.length > 0 && !this.publicServers.includes(this.activeRemote)
          }
        } catch (error) {
          this.tableNoData = 'No data.'
          this.error.global = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },
      
      createContainer (item, launch = false) {
        if (!launch) {
          this.getStoragePools()
          this.getNetworks()
          this.getProfiles()
          this.dialog.create = true
          this.newItem = {
            name: '',
            image: item.properties.description,
            image_fingerprint: item.fingerprint,
            profile: ['default'],
            pool: 'default',
            network: '',
            ephemeral: false,
            remote: this.activeRemote
          }
        } else {
          if (this.$refs.formcreate.validate() && this.valid) {

            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            //
            this.snackbar = true
            this.snackbarColor = 'green'
            this.snackbarText = 'Creating container.'
            this.query = true

            axios.post(this.loggedUser.sub + '/api/lxd/containers', this.newItem).then(response => {
              // all good task issued
              if (response.data.code === 200 && response.data.data.status_code === 103) {
                        
                this.show = true
                this.value = 0
                this.query = false

                //
                this.launching = true
                
                var creating_container = setInterval(async () => {
                  await axios.get(this.loggedUser.sub + '/api/lxd/operations/'+response.data.data.id).then(response => {
                    /* running 103, finished, 200 */
                    if (response.data.data.status_code == 103) {
                      //console.log('103', response.data.data)
                      // 
                      var download_progress = null
                      if (response.data.data.metadata) {
                        download_progress = response.data.data.metadata.download_progress
                        
                        //starts with metadata: or rootfs:
                        if (/^metadata:/i.test(download_progress)) {
                          download_progress = download_progress.replace('metadata:', '').trim()
                          download_progress = '0%'
                        } else if (/^rootfs:/i.test(download_progress)) {
                          download_progress = download_progress.replace('rootfs:', '').trim()
                        }
                        
                        this.value = download_progress.substr(0, download_progress.indexOf('%'))
                        this.real_value = download_progress
                      } else if(this.newItem.remote === 'local') {
                        this.value = 100
                        this.real_value = ''
                        this.query = true
                      } else {
                        this.value = 0
                        this.real_value = ''
                      }

                      //
                      if (this.value >= 0 && this.value < 1) {
                        this.progress_text = 'Initializing image download.'
                      } else if(this.value < 100) {
                        this.progress_text = 'Downloading image.'
                      } else {
                        this.progress_text = 'Unpacking filesystem into container.'
                      }
                    } else if (response.data.data.status_code == 200) {
                      //console.log('200', response.data.data)
                      this.value = 100
                      clearInterval(creating_container)
                      //
                      this.progress_text = 'Container created.'
                      //
                      this.snackbar = true
                      this.snackbarColor = 'green'
                      this.snackbarText = 'Container successfully created!'
                      this.progress_text = 'Complete'
                      
                      // close dialog and ask to start container
                      this.dialog.create = false
                      this.askStart()
                      //
                      setTimeout(() => {
                        this.launching = false
                        this.progress_text = ''
                      }, 300)
                    } else {
                      //console.log('not 103/200', response.data.data)
                      this.value = 100
                      clearInterval(creating_container)
                      //
                      this.progress_text = 'Container created.'
                      //
                      this.snackbar = true
                      this.snackbarColor = 'green'
                      this.snackbarText = 'Container successfully created!'
                      this.progress_text = 'Complete'
                      
                      // close dialog and ask to start container
                      this.dialog.create = false
                      this.askStart()
                      //
                      setTimeout(() => {
                        this.launching = false
                        this.progress_text = ''
                      }, 300)
                    }
                  }).catch(error => {
                    this.show = false
                    this.launching = false
                    this.dialog.create = false
                    this.error.global = 'Failed to create container.'
                    this.progress_text = 'Error'
                  })
                }, 1000)
              } else {
                // failed to launch
                this.launching = false
                this.error.launch = response.data.data.error
              }
            }).catch(error => {
              this.error.global = 'Failed to create container.'
            })
          }
        }
      },
      
      askStart() {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'blue darken-3',
            closable: false,
          },
          title: 'Start Container?',
          text: 'Would you like to start the newly created container?',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => { 
                axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.newItem.name + '/state', {
                  "action": 'start',
                  "timeout": 30,
                  "force": true,
                  "stateful": false
                })
                this.snackbar = true
                this.snackbarColor = 'green'
                this.snackbarText = 'Container started.'
              }
            },
            {
              title: 'No',
              color: 'error'
            }
         ]
        })
      },
      
      safe_name() {
        this.newItem.name = this.newItem.name.replace(".", "-")
      },

      // create or edit item
      copyItem (item, execute) {
         if (!execute) {
          this.copyIndex = this.items.indexOf(item)
          this.copy = Object.assign({}, this.copy, item)
          this.dialog.copy = true
        } else {
          if (this.$refs.formcopy.validate() && this.valid) {
            axios.post(this.loggedUser.sub + '/api/lxd/images/'+this.copy.fingerprint+'/copy?remote='+this.activeRemote, this.copy).then(response => {
              if (response.data.code === 200) {
                //
                this.snackbar = true
                this.snackbarText = 'Image copied from '+this.activeRemote+' to '+this.copy.remote+'.'
              } else {
                //
                this.snackbar = true
                this.snackbarColor = 'red'
                this.snackbarText = response.data.error
              }
            }).catch(error => {
              this.error.global = 'Could not copy image.'
            })
            
            //
            this.snackbar = true
            this.snackbarText = 'Image queued for copy.'
            this.dialog.copy = false
          }
        }
      },
      
      // create or edit item
      editItem (item) {
        this.editingIndex.edit = this.items.indexOf(item)
        this.editingItem = Object.assign({}, item)
        this.dialog.edit = true
      },

      // delete item
      deleteItem (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete image?',
          text: 'Are you sure you want to delete the <b>'+item.properties.description+'</b> image?',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => { 
                const index = this.items.indexOf(item)
        
                // local
                this.items.splice(index, 1)

                // remote
                try {
                  if (!this.loggedUser) {
                    this.$router.replace('/servers')
                  }

                  //
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/images/'+item.fingerprint+'?remote='+this.activeRemote)
                  //
                  this.snackbar = true
                  this.snackbarText = 'Image successfully deleted.'
                  
                } catch (error) {
                  this.error.global = 'Could not delete image from server.'
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

      // save item
      async save () {
        if (this.$refs.formedit.validate()) {
          // local
          if (this.editingIndex.edit > -1) {
            Object.assign(this.items[this.editingIndex.edit], this.editingItem)
          } else {
            this.items.push(Object.assign({}, this.editingItem))
          }
          
          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            //
            const response = await axios.put(this.loggedUser.sub + '/api/lxd/images/'+this.editingItem.fingerprint+'?remote='+this.activeRemote, this.editingItem)
            //
            this.snackbar = true
            this.snackbarText = 'Image successfully updated.'
          } catch (error) {
            this.error.global = 'Could not update image.'
          }
          
          this.close('edit')
          setTimeout(() => {
            this.initialize()
          }, 300)
        }
      },
      
      // close item dialog, and reset to default item
      close (type) {
        this.dialog[type] = false
        setTimeout(() => {
          this.launching = false
          this.progress_text = ''
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = {create: -1, edit: -1}
        }, 300)
      },
      
      // set snackbar (invoked from components)
      setSnackbar (msg) {
        this.snackbar = true
        this.snackbarTimeout = 2500
        this.snackbarText = msg
      },
      
      // set error (invoked from components)
      setError (msg) {
        this.error.global = msg
      },
      
      openDialog (ref) {
        this.$refs[ref].openDialog()
      },
      
      formatBytes (bytes, decimals) {
        if(bytes == 0) return '0 Bytes'
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
      },
      
      ucfirst(str) {
          return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }

    }
  }
</script>

<style>

</style>
