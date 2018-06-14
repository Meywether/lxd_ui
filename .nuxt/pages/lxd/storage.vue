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
                    LXD - Storage
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small color="success" @click="dialog.editing = true" style="float:right">New Storage Pool</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert type="error" :value="error.global">
                  {{ error.global }}
                </v-alert>
                <v-data-table :headers="tableHeaders" :items="items" hide-actions class="elevation-1" :loading="tableLoading">
                  <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.info.name }}</a></td>
                      <td>{{ props.item.info.description ? props.item.info.description : '-' }}</td>
                      <td>{{ props.item.info.driver.toUpperCase() }}</td>
                      <td><v-progress-linear :value="disk_used(props.item.resources)" height="20" color="error" background-color="success">{{ props.item.resources.space.used }} / {{ formatBytes(props.item.resources.space.total) }}</v-progress-linear></td>
                      <td><a href="javascript:void(0)" @click.stop="editVolumes(props.item)">{{ props.item.volumes.length }}</a></td>
                      <td><a href="javascript:void(0)" @click.stop="showUsedBy(props.item)">{{ props.item.info.used_by.length }}</a></td>
                      <td>{{ props.item.info.status }}</td>
                      <td>
                        <v-btn icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)" :disabled="!canDelete(props.item)">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                  <template slot="no-data">
                    {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no storage pools.' }}
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog.editing" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.editing = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} Storage Pool</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-alert type="error" :value="error.editing">
              {{ error.editing }}
            </v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
              <h3>General</h3>
              <v-text-field v-model="editingItem.info.name" :rules="nameRule" label="Name:" placeholder="" required hint="Enter a name for the storage pool." :disabled="editingIndex !== -1"></v-text-field>
              <v-text-field v-model="editingItem.info.description" label="Description:" placeholder="" hint="Enter a description for the storage pool."></v-text-field>
              <v-select :items="['dir','btrfs','lvm','zfs','ceph']" v-model="editingItem.info.driver" label="Driver:" :disabled="editingIndex !== -1"></v-select>
              <h3>Configuration</h3>
              <div v-if="editingItem.info.driver == 'dir'">
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry." :disabled="editingIndex !== -1"></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'btrfs'">
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>
                <v-text-field v-model="editingItem.info.config['btrfs.mount_options']" label="Mount options:" placeholder="" hint="Mount options for block devices."></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'lvm'">
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>
                <v-text-field v-model="editingItem.info.config['lvm.thinpool_name']" label="Thinpool Name:" placeholder="" hint="Thin pool where images and containers are created."></v-text-field>
                <h4>Use thinpool</h4>
                <v-switch :label="`${editingItem.info.config['lvm.use_thinpool'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['lvm.use_thinpool']" persistent-hint hint="Whether the storage pool uses a thinpool for logical volumes."></v-switch>
                <v-text-field v-model="editingItem.info.config['lvm.vg_name']" label="VG Name:" placeholder="" hint="Name of the volume group to create."></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'zfs'">
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>
                <v-text-field v-model="editingItem.info.config['zfs.pool_name']" label="Pool name:" placeholder="" hint="Name of the zpool."></v-text-field>
                <v-layout row wrap style="margin-top:10px">
                  <v-flex xs4>
                    <h4>Clone Copy:</h4>
                    <v-switch :label="`${editingItem.info.config['zfs.clone_copy'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['zfs.clone_copy']" persistent-hint hint="Whether to use ZFS lightweight clones rather than full dataset copies."></v-switch>
                  </v-flex>
                  <v-flex xs4>
                    <h4>Use refquota:</h4>
                    <v-switch :label="`${editingItem.info.config['volume.zfs.use_refquota'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['volume.zfs.use_refquota']" persistent-hint hint="Use refquota instead of quota for space."></v-switch>
                  </v-flex>
                  <v-flex xs4>
                    <h4>Remove snapshots:</h4>
                    <v-switch :label="`${editingItem.info.config['volume.zfs.remove_snapshots'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['volume.zfs.remove_snapshots']" persistent-hint hint="Remove snapshots as needed."></v-switch>
                  </v-flex>
                </v-layout> 
              </div>
              <div v-if="editingItem.info.driver == 'ceph'">
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config['ceph.cluster_name']" label="Cluster name:" placeholder="" hint="Name of the ceph cluster in which to create new storage pools."></v-text-field>
                <h4>OSD force reuse:</h4>
                <v-switch :label="`${editingItem.info.config['ceph.osd.force_reuse'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['ceph.osd.force_reuse']" persistent-hint hint="Force using an osd storage pool that is already in use by another LXD instance."></v-switch>
                <v-text-field v-model="editingItem.info.config['ceph.osd.pg_num']" label="OSD placement group num:" placeholder="" hint="Number of placement groups for the osd storage pool."></v-text-field>
                <v-text-field v-model="editingItem.info.config['ceph.osd.pool_name']" label="OSD pool name:" placeholder="" hint="Name of the osd storage pool."></v-text-field>
                <v-text-field v-model="editingItem.info.config['ceph.rbd.clone_copy']" label="RBD clone copy:" placeholder="" hint="Whether to use RBD lightweight clones rather than full dataset copies."></v-text-field>
                <v-text-field v-model="editingItem.info.config['ceph.user.name']" label="User name:" placeholder="" hint="The ceph user to use when creating storage pools and volumes."></v-text-field>
              </div>
              <!--<v-text-field v-model="editingItem.info.config['rsync.bwlimit']" label="Rsync bandwidth limit:" placeholder="" hint="Specifies the upper limit to be placed on the socket I/O whenever rsync has to be used to transfer storage entities."></v-text-field>-->
            </v-form>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
      
      <!-- Volumes Dialog -->
      <v-dialog v-model="dialog.volumes" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.volumes = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Storage Volumes</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text style="padding:0px">
            <v-data-table :headers="volumeTableHeaders" :items="editingItem.volumes" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ ucfirst(props.item.name) }}</td>
                  <td>{{ ucfirst(props.item.type) }}</td>
                </tr>
              </template>
              <template slot="no-data">
                Storage pool has no volumes.
              </template>
            </v-data-table>
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
          <v-card-text style="padding:0px" v-if="editingItem.info.used_by_structured">
            <v-data-table :headers="usedByTableHeaders" :items="editingItem.info.used_by_structured" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ ucfirst(props.item.name) }}</td>
                  <td>{{ ucfirst(props.item.type) }}</td>
                  <td>{{ ucfirst(props.item.sub_type) }}</td>
                  <td>{{ ucfirst(props.item.sub_name) }}</td>
                </tr>
              </template>
              <template slot="no-data">
                Storage pool is not being used.
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

  export default {
    mixins: [helpers],
    middleware: [
      'authenticated'
    ],
    components: {},
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      })
    },
    data: () => ({
      dialog: {editing: false, volumes: false, used_by: false},
      valid: true,

      // global error
      error: {global: false, editing: false},

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,

      // table & items
      items: [],

      tableLoading: true,
      tableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Driver', value: 'driver' },
        { text: 'Usage', value: 'space' },
        { text: 'Volumes', value: 'volumes' },
        { text: 'Used By', value: 'used_by' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'id', sortable: false, align: 'right' }
      ],
      volumeTableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' }
      ],
      usedByTableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Sub Type', value: 'sub_type' },
        { text: 'Sub Name', value: 'sub_name' }
      ],

      editingIndex: -1,
      editingItem: {
        info: {
          config: {},
          description: "",
          driver: "dir",
          locations: [],
          name: "",
          status: "",
          used_by: []
        },
        resources: {
          inodes: {
            total: 0,
            used: 0
          },
          space: {
            total: 0,
            used: 0
          }
        },
        volumes: []
      },
      defaultItem: {
        info: {
          config: {},
          description: "",
          driver: "dir",
          locations: [],
          name: "",
          status: "",
          used_by: []
        },
        resources: {
          inodes: {
            total: 0,
            used: 0
          },
          space: {
            total: 0,
            used: 0
          }
        },
        volumes: []
      },

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
          this.$storage.set('lxd', response.data)
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
      'editingItem.info.config': {
        handler: function (val) {
          for (var prop in val) { 
            if (val[prop] === '' || val[prop] === null) {
              delete val[prop];
            }
          }
        },
        deep: true
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
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/storage', {
            params: {
              types: [/*'name', */'info', 'resources', 'volumes', /*'volume_info'*/]
            }
          })

          this.items = response.data.data
        } catch (error) {
          this.items = [];
          this.tableNoData = 'No data.';
          this.error.global = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      // create or edit item
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

        this.dialog.editing = true
      },
      
      // create or volumes 
      editVolumes (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

        this.dialog.volumes = true
      },  
      
      // show used by
      showUsedBy (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

        this.editingItem.info.used_by_structured = []
        if (this.editingItem.info.used_by.length > 0) {
          this.editingItem.info.used_by.forEach(value => {
            let tmp = value.split('/')
            this.editingItem.info.used_by_structured.push({
              type: tmp[2] ? tmp[2] : '-',
              name: tmp[3] ? tmp[3] : '-',
              sub_type: tmp[4] ? tmp[4] + (tmp[5] ? '/' + tmp[5] : '') : '-',
              sub_name: tmp[6] ? tmp[6] : '-'
            })
          })
        }

        this.dialog.used_by = true
      },

      // save
      async save () {
        if (this.$refs.form.validate()) {

          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            // edit
            if (this.editingIndex > -1) {
              // update
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/storage/'+this.editingItem.info.name, {
                "description": this.editingItem.info.description,
                "driver": this.editingItem.info.driver,
                "config": this.editingItem.info.config
              })
            } 
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/storage', {
                "name": this.editingItem.info.name,
                "description": this.editingItem.info.description,
                "driver": this.editingItem.info.driver,
                "config": this.editingItem.info.config
              })
            }

            // check errors
            if (response.data.code === 422) {
              this.error.editing = response.data.error
            } else {
              // local
              if (this.editingIndex > -1) {
                Object.assign(this.items[this.editingIndex], this.editingItem)
              } else {
                this.items.push(Object.assign({}, this.editingItem))
              }
              //
              this.snackbar = true;
              this.snackbarText = 'Storage pool successfully saved.';
            }
          } catch (error) {
            this.error.global = 'Could not save storage pool to server.'+error;
          }

          if (!this.error.editing && this.editingIndex === -1) {
            this.close()
          }

          if (!this.error.editing) {
            this.initialize()
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
          title: 'Delete storage pool?',
          text: 'Are you sure you want to delete the <b>'+item.info.name+'</b> storage pool?',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/storage/'+item.info.name)

                  //
                  this.snackbar = true;
                  this.snackbarColor = 'green';
                  this.snackbarText = 'Storage pool deleted.';
                } catch (error) {
                  //
                  this.error.global = 'Failed to delete storage pool.';
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
      
      canDelete (item) {
        return item.info.used_by.length === 0
      },

      // close item dialog, and reset to default item
      close () {
        this.dialog.editing = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
        }, 300)
      },
      
      ucfirst(str) {
          return String(str).charAt(0).toUpperCase() + String(str).slice(1);
      },

      disk_used (item) {
        return (item.space.used / item.space.total) * 100
      },

      formatBytes (bytes, decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
    }
  }
</script>

<style>

</style>
