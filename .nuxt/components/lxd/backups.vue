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
              <v-edit-dialog :return-value.sync="props.item.nameNoContainer" lazy lazy-validation>
                {{ props.item.nameNoContainer }}
                <v-text-field
                  slot="input"
                  v-model="props.item.nameNoContainer"
                  label="Edit"
                  single-line
                  :rules="nameRule"
                  @keyup.enter="actionBackup('rename', props.item)"
                ></v-text-field>
              </v-edit-dialog>
            </v-form>
          </td>
          <td>{{ new Date(props.item.creation_date).toLocaleString() }}</td>
          <td>{{ new Date(props.item.expiry_date).toLocaleString() }}</td>
          <td>
            <div class="field is-grouped is-grouped-multiline" style="display:flex">
              <div class="control">
                <div class="tags has-addons">
                  <v-tooltip left>
                    <span slot="activator" :class="[props.item.container_only ? 'is-on' : 'is-off', 'tag']">C</span>
                    <span>Container Only</span>
                  </v-tooltip>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <v-tooltip left>
                    <span slot="activator" :class="[props.item.optimized_storage ? 'is-on' : 'is-off', 'tag']">O</span>
                    <span>Optimized Storage</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </td>
          <td>
            <v-menu offset-y left style="float:right" class="mr-3">
              <v-btn icon class="mx-0" slot="activator">
                <v-icon color="blue-grey lighten-3">view_headline</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="item in backupActions" :key="item.title" @click="actionBackup(item.action, props.item)">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no backups for this container.' }}
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
        { text: 'Created', value: 'creation_date' },
        { text: 'Expiry', value: 'expiry_date' },
        { text: 'Attributes', value: 'attributes', sortable: false },
        { text: 'Actions', value: 'name', sortable: false, align: 'right' }
      ],
      //
      items: [],
      backupActions: [
        { title: 'Export',  action: 'export', msg: 'Exporting', state: '' },
        { title: 'Delete',  action: 'delete', msg: 'Deleting', state: '' }
      ],
      nameRule: [
        v => !!v || 'Name is required.'
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
      
      this.container = Object.assign({}, this.item)

      this.$nextTick(() => {
        this.initialize()
      })
    },
    methods: {
      async initialize () {
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/backups')
          this.items = response.data.data

          this.items.forEach((item, key) => {
            this.$set(this.items[key], 'nameNoContainer', item.name.substr(item.name.lastIndexOf('/') + 1))
          })
 
        } catch (error) {
          this.error = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },
      
      actionBackup(action, item) {
        //
        if (action === 'export') {
          this.exportBackup(item)
          return
        }
        //
        if (action === 'delete') {
          this.deleteBackup(item)
          return
        }
        //
        if (action === 'rename') {
          this.renameBackup(item)
          return
        }
      },
      
      deleteBackup (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete backup?',
          text: 'Are you sure you want to delete backup:<br><b>'+item.name.substr(item.name.lastIndexOf('/') + 1)+'</b>',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/backups/'+item.name.substr(item.name.lastIndexOf('/') + 1))
                  this.$emit('snackbar', 'Backup deleted.')
                } catch (error) {
                  this.$emit('snackbar', 'Failed to delete backup.')
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

      async exportBackup (item) {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          axios({
            url: this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/backups/'+item.name.substr(item.name.lastIndexOf('/') + 1)+'/export',
            method: 'GET'
          }).then(response => {
            if (response.data.data.exists) {
              window.open(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name + '/backups/'+item.name.substr(item.name.lastIndexOf('/') + 1)+'/export?hash='+response.data.data.hash, '_blank')
            } else {
              this.$emit('snackbar', 'Exporting backup to accessable location.')
            }
            /*
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', item.name.substr(item.name.lastIndexOf('/') + 1)+'.tar.gz')
            document.body.appendChild(link)
            link.click()
            */
          })
          
          /*
          const response = await axios.get()
          this.items = response.data.data
          
          var element = document.createElement('iframe')
          element.style.display = 'none'
          element.setAttribute('src', response.data.data)
          element.setAttribute('download', 'servers.json')
          document.body.appendChild(element)
          */

          this.$emit('snackbar', 'Exporting backup.')

        } catch (error) {
          this.$emit('snackbar', 'Failed to export backup.')
        }
      },   
      
      async renameBackup (item) {
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
        return name.replace(".", "-")
      }

    }
  }
</script>

<style>

</style>
