<template>
  <v-app>
    <v-snackbar top :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar">
      {{ snackbarText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-content>
      <v-container fluid tag="section" id="grid">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="display mb-2">
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    LXD - Profiles
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small color="success" @click="newItem()" style="float:right">New Profile</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-data-table :headers="tableHeaders" :items="items" hide-actions class="elevation-1" :loading="tableLoading">
                  <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name }}</a></td>
                      <td>{{ props.item.description }}</td>
                      <td>{{ props.item.devices.root && props.item.devices.root.pool ? props.item.devices.root.pool : '-' }}</td>
                      <td>{{ props.item.devices.eth0 && props.item.devices.eth0.parent ? props.item.devices.eth0.parent : '-' }}</td>
                      <td><a href="javascript:void(0)" @click.stop="showUsedBy(props.item)">{{ props.item.used_by.length }}</a></td>
                      <td>
                        <v-btn icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)" :disabled="props.item.used_by.length > 0">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                  <template slot="no-data">
                    {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no profiles.' }}
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog.editing" max-width="750px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.editing = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} Profile</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding:0px">
            <v-tabs v-model="activeTab" show-arrows>
              <v-tab ripple :href="'#tab-configuration'">Configuration</v-tab>
              <v-tab ripple :href="'#tab-devices'" v-if="editingIndex !== -1" :disabled="editingItem.name === ''">Devices</v-tab>
               <v-tab ripple :href="`#tab-idmap`" v-if="editingIndex !== -1" :disabled="editingItem.name === ''">ID Map</v-tab>
              <v-tab-item :id="'tab-configuration'">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <h2>General</h2>
                      <v-layout row wrap style="margin-top:-20px">
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="Enter a name for the profile."></v-text-field>
                            <v-text-field v-model="editingItem.description" label="Description:" placeholder="" hint="Enter a description for the profile."></v-text-field>
                            <v-select :items="pools" v-model="editingItem.devices.root.pool" label="Storage Pool:" persistent-hint hint="Storage pool the root disk device belongs to."></v-select>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-4">
                            <v-layout row wrap>
                              <v-flex xs12>
                                <h4>Auto Start</h4>
                                <v-switch :label="`${editingItem.config['boot.autostart'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="editingItem.config['boot.autostart']"></v-switch>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs6>
                                <h4>Privileged</h4>
                                <v-switch :label="`${editingItem.config['security.privileged'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="editingItem.config['security.privileged']"></v-switch>
                              </v-flex>
                              <v-flex xs6>
                                <h4>Nesting</h4>
                                <v-switch :label="`${editingItem.config['security.nesting'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="editingItem.config['security.nesting']"></v-switch>
                              </v-flex>
                            </v-layout>
                            <v-select style="margin-top:-6px" v-if="editingItem.devices.eth0" :items="['None', ...networks]" v-model="editingItem.devices.eth0.parent" label="Network:" persistent-hint hint="Network bridge for eth0."></v-select>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                      <h2 style="margin-top:-15px">CPU</h2>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">CPU Cores ({{ editingItem.config['limits.cpu'] }})</h4>
                            <v-slider v-model="editingItem.config['limits.cpu']" thumb-label :max="max_cpu" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">Max Processes ({{ editingItem.config['limits.processes'] }})</h4>
                            <v-slider v-model="editingItem.config['limits.processes']" thumb-label max="20000" step="100" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">CPU Allowance ({{ editingItem.config['limits.cpu.allowance'] }}%)</h4>
                            <v-slider v-model="editingItem.config['limits.cpu.allowance']" thumb-label max="100" step="1" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">CPU Priority ({{ editingItem.config['limits.cpu.priority'] }}/10)</h4>
                            <v-slider v-model="editingItem.config['limits.cpu.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                      <h2 style="margin-top:-15px">Memory</h2>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Memory ({{ editingItem.config['limits.memory'] }}MB)</h4>
                            <v-slider v-model="editingItem.config['limits.memory']" :max="max_memory" thumb-label step="64" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">Swap Priority ({{ editingItem.config['limits.memory.swap.priority'] }}/10)</h4>
                            <v-slider v-model="editingItem.config['limits.memory.swap.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4>Enforce</h4>
                            <v-switch :label="`${editingItem.config['limits.memory.enforce'] === 'hard' ? 'Hard' : 'Soft'}`" true-value="hard" false-value="soft" color="success" v-model="editingItem.config['limits.memory.enforce']"></v-switch>
                            <h4>Swap</h4>
                            <v-switch :label="`${editingItem.config['limits.memory.swap'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="editingItem.config['limits.memory.swap']"></v-switch>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <h2>Disk</h2>
                        </v-flex>
                        <v-flex xs6>
                          <h2>Network</h2>
                        </v-flex> 
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Priority ({{ editingItem.config['limits.disk.priority'] }}/10)</h4>
                            <v-slider v-model="editingItem.config['limits.disk.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Priority ({{ editingItem.config['limits.network.priority'] }}/10)</h4>
                            <v-slider v-model="editingItem.config['limits.network.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-devices`" v-if="editingItem.name">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <v-tabs v-model="activeDeviceTab" show-arrows>
                    <v-tab ripple :href="`#nic`">Nic</v-tab>
                    <v-tab ripple :href="`#disk`">Disk</v-tab>
                    <v-tab ripple :href="`#unixchar`">Unix-char</v-tab>
                    <v-tab ripple :href="`#unixblock`">Unix-block</v-tab>
                    <v-tab ripple :href="`#usb`">USB</v-tab>
                    <v-tab ripple :href="`#gpu`">GPU</v-tab>
                    <v-tab ripple :href="`#proxy`">Proxy</v-tab>
                    <v-tab ripple :href="`#infiniband`">InfiniBand</v-tab>
                    <v-tab-item :id="`nic`" v-if="editingItem">
                      <nic @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></nic>
                    </v-tab-item>
                    <v-tab-item :id="`disk`" v-if="editingItem">
                      <disk @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></disk>
                    </v-tab-item>
                    <v-tab-item :id="`unixchar`" v-if="editingItem">
                      <unixchar @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></unixchar>
                    </v-tab-item>
                    <v-tab-item :id="`unixblock`" v-if="editingItem">
                      <unixblock @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></unixblock>
                    </v-tab-item>
                    <v-tab-item :id="`usb`" v-if="editingItem">
                      <usb @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></usb>
                    </v-tab-item>
                    <v-tab-item :id="`gpu`" v-if="editingItem">
                      <gpu @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></gpu>
                    </v-tab-item>
                    <v-tab-item :id="`proxy`" v-if="editingItem">
                      <proxy @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></proxy>
                    </v-tab-item>
                    <v-tab-item :id="`infiniband`" v-if="editingItem">
                      <infiniband @snackbar="setSnackbar" :key="component_key" :linked="editingItem"></infiniband>
                    </v-tab-item>
                  </v-tabs>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-idmap`">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <idmap @snackbar="setSnackbar" @initialize="initialize" :key="component_key" :linked="editingItem"></idmap>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
      
      <!-- Used by Dialog -->
      <v-dialog v-model="dialog.used_by" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.used_by = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Used By</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text style="padding:0px" v-if="used_by">
            <v-data-table :headers="usedByTableHeaders" :items="used_by" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.name }}</td>
                </tr>
              </template>
              <template slot="no-data">
                Profile is not being used by any containers.
              </template>
            </v-data-table>
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
  import helpers from '~/utils/helpers'
  
  // devices components
  import nic from '~/components/lxd/devices/nic.vue'
  import disk from '~/components/lxd/devices/disk.vue'
  import proxy from '~/components/lxd/devices/proxy.vue'
  import infiniband from '~/components/lxd/devices/infiniband.vue'
  import gpu from '~/components/lxd/devices/gpu.vue'
  import usb from '~/components/lxd/devices/usb.vue'
  import unixchar from '~/components/lxd/devices/unixchar.vue'
  import unixblock from '~/components/lxd/devices/unixblock.vue'
  import idmap from '~/components/lxd/devices/idmap.vue'

  const profile = require('~/components/lxd/profile')

  export default {
    mixins: [helpers],
    middleware: [
      'authenticated'
    ],
    components: {
      nic, disk, proxy, infiniband, gpu, usb, unixchar, unixblock, idmap
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      empty_profile: function () {
        return profile.empty()
      },
      max_memory: function () {
        return this.resources.memory.total / 1000 / 1000 || 512
      },
      max_cpu: function () {
        return Number(this.resources.cpu.total) || 1
      }
    },
    data: () => ({
      dialog: { editing: false, used_by: false },
      valid: true,
      component_key:'',

      // global error
      error: '',

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,
      
      // tab
      activeTab: 'tab-configuration',
      activeDeviceTab: 'nic',

      tableLoading: true,
      tableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Storage Pool', value: 'pool' },
        { text: 'Network', value: 'network' },
        { text: 'Used By', value: 'used_by' },
        { text: 'Actions', value: 'id', sortable: false, align: 'right' }
      ],
      usedByTableHeaders: [
        { text: 'Container', value: 'container' }
      ],
      
      // table & items
      items: [],
      pools: [],
      networks: [],
      used_by: [],
      resources: {
        cpu: {
          sockets: [{
            cores: 0,
            frequency: 0,
            frequency_turbo: 0,
            name: "",
            threads: 0,
            vendor: ""
          }],
          total: 0
        },
        memory: {
            total: 0,
            used: 0
        },
        pool: {
          inodes: {
            total: 0,
            used: 0
          },
          space: {
            total: 0
          }
        }
      },

      editingIndex: -1,
      editingItem: profile.empty(),
      defaultItem: profile.empty(),

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
      
      this.getResources()
      this.getStoragePools()
      this.getNetworks()
      
      this.$nextTick(() => {
        this.initialize()
      })
    },
    watch: {
      'dialog.editing': function (val) {
        val || this.close()
      }
    },
    methods: {
      async initialize () {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/profiles')
          this.items = response.data.data
        } catch (error) {
          this.items = [];
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },
      
      async getResources () {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/resources')
          
          this.resources = response.data.data

        } catch (error) {
          this.resources = {};
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
          this.pools = [];
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
          this.networks = [];
        }
      },
      
      // new item init
      newItem() {
        this.dialog.editing = true
      },

      // create or edit item
      editItem (item) {
        this.component_key = item.name;
        this.current_name = item.name
        this.editingIndex = this.items.indexOf(item)

        // convoluted - add each of the items props to editingItem
        this.editingItem = Object.assign({}, this.empty_profile, item)

        // check if network is none (then delete it after assigned)
        var removeNetwork = !item.devices.eth0
        this.editingItem.devices = Object.assign({}, this.empty_profile.devices, item.devices)
        if (removeNetwork) {
          this.editingItem.devices.eth0 = {
            nictype: 'bridged',
            parent: 'None',
            type: 'nic'
          }
        }
        this.editingItem.config = Object.assign({}, this.empty_profile.config, item.config)
        // set defaults if not set
        this.editingItem = profile.infix(this.editingItem)

        this.dialog.editing = true
      },

      // save
      async save () {
        if (this.$refs.form.validate()) {
          // local
          if (this.editingIndex > -1) {
            Object.assign(this.items[this.editingIndex], this.editingItem)
          } else {
            this.items.push(Object.assign({}, this.editingItem))
          }
          
          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }
            
            this.editingItem = profile.outfix(this.editingItem);
            
            var item = JSON.parse(JSON.stringify(this.editingItem));
            
            // remove network if nonoe
            var removeNetwork = false
            if (!item.devices.eth0 || item.devices.eth0.parent === 'None') {
              delete item.devices.eth0
              removeNetwork = true
            }

            // edit
            if (this.editingIndex > -1) {
              // rename
              if (item.name !== this.current_name) {
                var response = await axios.post(this.loggedUser.sub + '/api/lxd/profiles/' + this.current_name, {
                  name: item.name
                })
                // update name
                this.current_name = item.name
              }
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/profiles/'+item.name, {
                "config": item.config,
                "description": item.description,
                "devices": item.devices
              })
            } 
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/profiles', {
                "config": item.config,
                "description": item.description,
                "devices": item.devices,
                "name": item.name
              })
            }
            
            this.editingItem = profile.infix(item);
            
            // remove the network if none
            if (removeNetwork) {
              this.editingItem.devices.eth0 = {
                nictype: 'bridged',
                parent: 'None',
                type: 'nic'
              }
            }

            //
            this.snackbar = true;
            this.snackbarText = 'Profile successfully saved.';
          } catch (error) {
            this.error = 'Could not save profile to server.';
          }
  
          if (this.editingIndex === -1) {
            this.close()
          }
          
          this.initialize()
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
          title: 'Delete profile?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> profile?',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/profiles/'+item.name)

                  //
                  this.snackbar = true;
                  this.snackbarColor = 'green';
                  this.snackbarText = 'Profile deleted.';
                } catch (error) {
                  //
                  this.error = 'Failed to delete profile.';
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
      
      // show used by
      showUsedBy (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

        this.used_by = []
        if (this.editingItem.used_by.length > 0) {
          this.editingItem.used_by.forEach(value => {
            let tmp = value.split('/')
            this.used_by.push({
              name: tmp[3] ? tmp[3] : '-'
            })
          })
        }

        this.dialog.used_by = true
      },
      
      setSnackbar (msg) {
        this.snackbar = true;
        this.snackbarTimeout = 2500
        this.snackbarText = msg;
      },

      // close item dialog, and reset to default item
      close () {
        this.dialog.editing = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
          
          //
          this.activeTab = 'tab-configuration'
          this.activeDeviceTab = 'nic'
          this.tabInit = false
        }, 300)
      }
    }
  }
</script>

<style>

</style>
