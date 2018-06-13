<template>
  <div>
    <v-alert type="error" :value="error">
      {{ error }}
    </v-alert>
    <v-data-table :headers="headers" :items="items" hide-actions :loading="tableLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <v-form ref="form" v-model="valid">
              <v-edit-dialog :return-value.sync="props.item.oldNameNoContainer" lazy lazy-validation>
                {{ props.item.oldNameNoContainer }}
                <v-text-field
                  slot="input"
                  v-model="props.item.oldNameNoContainer"
                  label="Edit"
                  single-line
                  :rules="nameRule"
                  @keyup.enter="actionSnapshot('rename', props.item)"
                ></v-text-field>
              </v-edit-dialog>
            </v-form>
          </td>
          <td>{{ new Date(props.item.created_at).toLocaleString() }}</td>
          <td>
            <v-menu offset-y left style="float:right" class="mr-3">
              <v-btn icon class="mx-0" slot="activator">
                <v-icon color="blue-grey lighten-3">view_headline</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="item in snapshotActions" :key="item.title" @click="actionSnapshot(item.action, props.item)">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no snapshots for this container.' }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

  export default {
    components: {},
    props: ['item'],
    computed: {
      ...mapGetters({
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      })
    },
    data: () => ({
      // global error
      valid:true,
      error: '',
      container: {},
      dialog: false,
      tableLoading: true,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Created', value: 'created' },
        { text: 'Actions', value: 'name', sortable: false, align: 'right' }
      ],
      //
      items: [],
      snapshotActions: [
        { title: 'Image',  action: 'image', msg: 'Imaging', state: '' },
        { title: 'Restore',  action: 'restore', msg: 'Restoring', state: '' },
        { title: 'Delete',  action: 'delete', msg: 'Deleting', state: '' }
      ],
      nameRule: [
        v => !!v || 'Name is required.',
        //v => (v && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(v)) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.',
        //v => (v && isNaN(v.charAt(0))) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.'
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
      
      this.container = Object.assign({info:{name:''}}, this.item)
      
      this.$nextTick(() => {
        this.initialize()
      })
    },
    methods: {
      async initialize () {
        if (!this.container.info || !this.container.info.name) {
          return
        }
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/snapshots')
          this.items = response.data.data
          
          this.items.forEach((item, key) => {
            this.$set(this.items[key].config, 'user.snapshot_description', (
              !this.items[key].config['user.snapshot_description'] || this.items[key].config['user.snapshot_description'] === '' ? '-' : this.items[key].config['user.snapshot_description'].trim()
            ))
            this.$set(this.items[key], 'oldNameNoContainer', item.name.substr(item.name.lastIndexOf('/') + 1))
            this.$set(this.items[key], 'oldName', item.name)
          })
          
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },
      
      actionSnapshot(action, item) {
        //
        if (action === 'image') {
          this.imageSnapshot(item)
          return
        }
        //
        if (action === 'restore') {
          this.restoreSnapshot(item)
          return
        }
        //
        if (action === 'delete') {
          this.deleteSnapshot(item)
          return
        }
        //
        if (action === 'rename') {
          this.renameSnapshot(item)
          return
        }
        //
        if (action === 'updateDescription') {
          this.updateSnapshotDescription(item)
          return
        }
      },
      
      deleteSnapshot (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete snapshot?',
          text: 'Are you sure you want to delete snapshot:<br><b>'+item.name.substr(item.name.lastIndexOf('/') + 1)+'</b>',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => { 
                try {
                  if (!this.loggedUser) {
                    this.$router.replace('/servers')
                  }
                  
                  // delete local
                  const index = this.items.indexOf(item)
                  this.items.splice(index, 1)
        
                  // remote
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/snapshots/'+item.name.substr(item.name.lastIndexOf('/') + 1))
                  this.$emit('snackbar', 'Snapshot deleted.')
                } catch (error) {
                  this.$emit('snackbar', 'Failed to delete snapshot.')
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

      restoreSnapshot (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'orange darken-3',
            closable: false,
          },
          title: 'Restore snapshot?',
          text: 'Are you sure you want to restore container from snapshot:<br><b>'+item.name.substr(item.name.lastIndexOf('/') + 1)+'</b><p class="text-md-center red--text"><br><b>Current container state will be overwritten!</b></p>',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => { 
                try {
                  if (!this.loggedUser) {
                    this.$router.replace('/servers')
                  }

                  //
                  const response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/snapshots', {
                    name: item.name.substr(item.name.lastIndexOf('/') + 1)
                  })
                  this.$emit('snackbar', 'Snapshot restored.')
                } catch (error) {
                  this.$emit('snackbar', 'Failed to restore snapshot.')
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
      
      async imageSnapshot (item) {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.post(this.loggedUser.sub + '/api/lxd/images', {
            source: {
              type: 'snapshot',
              name: item.name
            },
            public: false,
            properties: {
              // image name: `container-name (01/01/2018, 01:23:45)`
              description: item.name.split('/')[0] + ' (' + new Date().toLocaleString() + ')',
              label: (item.config['image.label'] ? item.config['image.label'] : ''),
              architecture: (item.config['image.architecture'] ? item.config['image.architecture'] : ''),
              build: new Date(),
              distribution: (item.config['image.distribution'] ? item.config['image.distribution'] : ''),
              os: (item.config['image.os'] ? item.config['image.os'] : ''),
              release: (item.config['image.release'] ? item.config['image.release'] : ''),
              version: (item.config['image.version'] ? item.config['image.version'] : '')
            },
            auto_update: false
          })
          
          this.$emit('snackbar', 'Imaging snapshot.')

        } catch (error) {
          this.$emit('snackbar', 'Failed to imaging snapshot.')
        }
      },   
      
      async renameSnapshot (item) {
        if (this.$refs.form.validate() && item.oldName !== this.container.info.name+'/'+item.oldNameNoContainer) {
          //
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }
  
            //
            const response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/snapshots/' + item.oldName.substr(item.oldName.lastIndexOf('/') + 1), {
              name: item.oldNameNoContainer,
            })
            
            item.name = this.container.info.name+'/'+item.oldNameNoContainer
            item.oldName = this.container.info.name+'/'+item.oldNameNoContainer
            
            this.$emit('snackbar', 'Snapshot renamed.')
  
          } catch (error) {
            this.$emit('snackbar', 'Failed to rename snapshot.')
          }
        } else {
          item.oldNameNoContainer = item.oldName.substr(item.oldName.lastIndexOf('/') + 1)
        }
      },   

      safe_name(name) {
        return name.replace(".", "-");
      }

    }
  }
</script>

<style>

</style>
