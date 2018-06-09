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
                LXD - Storage
                <v-btn color="success" @click="dialog.editing = true" style="float:right">New Storage Pool</v-btn>
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
                      <td>{{ props.item.info.driver }}</td>
                      <td><v-progress-linear :value="disk_used(props.item.resources)" height="20" color="error" background-color="success">{{ props.item.resources.space.used }} / {{ formatBytes(props.item.resources.space.total) }}</v-progress-linear></td>
                      <td>{{ props.item.volumes.length }}</td>
                      <td>{{ props.item.info.status }}</td>
                      <td>
                        <v-btn icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)">
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
              <v-text-field v-model="editingItem.info.name" :rules="nameRule" label="Name:" placeholder="" required hint="Enter a name for the storage pool."></v-text-field>
              <v-text-field v-model="editingItem.info.description" label="Description:" placeholder="" hint="Enter a description for the storage pool."></v-text-field>
              <v-select :items="['dir','btrfs','lvm','zfs','ceph']" v-model="editingItem.info.driver" label="Driver:" :disabled="editingIndex !== -1"></v-select>

              <h3>Configuration</h3>

              <div v-if="editingItem.info.driver == 'dir'">
                <!--<h4>DIR</h4>-->
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry." :disabled="editingIndex !== -1"></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'btrfs'">
                <!--<h4>BTRFS</h4>-->
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>

                <v-text-field v-model="editingItem.info.config['btrfs.mount_options']" label="Mount options:" placeholder="" hint="Mount options for block devices."></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'lvm'">
                <!--<h4>LVM</h4>-->
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>

                <v-text-field v-model="editingItem.info.config['lvm.thinpool_name']" label="Thinpool Name:" placeholder="" hint="Thin pool where images and containers are created."></v-text-field>
                
                <h4>Use thinpool</h4>
                <v-switch :label="`${editingItem.info.config['lvm.use_thinpool'] ? 'Yes' : 'No'}`" color="success" v-model="editingItem.info.config['lvm.use_thinpool']" persistent-hint hint="Whether the storage pool uses a thinpool for logical volumes."></v-switch>
                
                <v-text-field v-model="editingItem.info.config['lvm.vg_name']" label="VG Name:" placeholder="" hint="Name of the volume group to create."></v-text-field>
              </div>
              <div v-if="editingItem.info.driver == 'zfs'">
                <!--<h4>ZFS</h4>-->
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
                <!--<h4>CEPH</h4>-->
                <v-text-field v-model="editingItem.info.config.source" label="Source:" placeholder="" hint="Path to block device or loop file or filesystem entry."></v-text-field>
                <v-text-field v-model="editingItem.info.config.size" label="Size:" placeholder="" hint="Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."></v-text-field>

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
      dialog: {editing: false},
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
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'id', sortable: false, align: 'right' }
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
    mounted: function () {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.loggedToken
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
              types: ['name', 'info', 'resources', 'volumes', /*'volume_info'*/]
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
        this.editingItem = Object.assign({}, this.defaultItem, item)

        this.dialog.editing = true
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
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/storage/'+this.editingItem.name, {
                "name": this.editingItem.info.name,
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
            this.error.global = 'Could not save storage pool to server.';
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
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> storage pool?',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/storage/'+item.name)

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

      // close item dialog, and reset to default item
      close () {
        this.dialog.editing = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
        }, 300)
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
