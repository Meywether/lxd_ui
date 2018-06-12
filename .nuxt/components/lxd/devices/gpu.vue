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
          <td>{{ props.item.dict.vendorid ? props.item.dict.vendorid : '-' }}</td>
          <td>{{ props.item.dict.productid ? props.item.dict.productid : '-' }}</td>
          <td>{{ props.item.dict.id ? props.item.dict.id : '-' }}</td>
          <td>{{ props.item.dict.pci ? props.item.dict.pci : '-' }}</td>
          <td v-if="!linkedItem.devices">{{ props.item.dict.uid ? props.item.dict.uid : '-' }}</td>
          <td v-if="!linkedItem.devices">{{ props.item.dict.gid ? props.item.dict.gid : '-' }}</td>
          <td v-if="!linkedItem.devices">{{ props.item.dict.mode ? props.item.dict.mode : '-' }}</td>
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
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no GPU devices.' }}
      </template>
    </v-data-table>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="700px" scrollable :hide-overlay="linkedItem !== null">
      <v-card flat>
        <v-toolbar card dark color="light-blue darken-3">
          <v-btn icon @click.native="close()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} GPU Device</v-toolbar-title>
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

            <v-text-field v-model="editingItem.name" :rules="nameRule" label="Name:" placeholder="" required hint="Enter a name for the GPU device."></v-text-field>
            
            <h3>Device Settings</h3>
            <v-text-field v-model="editingItem.dict.vendorid" label="Vendor ID:" placeholder="" hint="The vendor id of the GPU device."></v-text-field>
            <v-text-field v-model="editingItem.dict.productid" label="Product ID:" placeholder="" hint="The product id of the GPU device."></v-text-field>
            <v-text-field v-model="editingItem.dict.id" label="Card ID:" placeholder="" hint="The card id of the GPU device."></v-text-field>
            <v-text-field v-model="editingItem.dict.pci" label="PCI:" placeholder="" hint="The PCI address of the GPU device."></v-text-field>
            <v-text-field v-model="editingItem.dict.uid" label="UID:" :rules="uidRule" placeholder="" hint="UID of the device owner in the container."></v-text-field>
            <v-text-field v-model="editingItem.dict.gid" label="GID:" :rules="gidRule" placeholder="" hint="GID of the device owner in the container."></v-text-field>
            <v-text-field v-model="editingItem.dict.mode" label="Mode:" :rules="modeRule" placeholder="" hint="Mode of the device in the container."></v-text-field>
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
  const profile = require('~/components/lxd/profile')

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
            { text: 'Vendor ID', value: 'vendorid' },
            { text: 'Product ID', value: 'productid' },
            { text: 'Card ID', value: 'id' },
            { text: 'PCI', value: 'pci' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'Name', value: 'name' },
            { text: 'Vendor ID', value: 'vendorid' },
            { text: 'Product ID', value: 'productid' },
            { text: 'Card ID', value: 'id' },
            { text: 'PCI', value: 'pci' },
            { text: 'UID', value: 'uid' },
            { text: 'GUI', value: 'gid' },
            { text: 'Mode', value: 'mode' },
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

      attachType: '',
      items: [],
      editingIndex: -1,
      editingItem: {
        id: -1,
        type: "gpu",
        name: "",
        dict: {
          vendorid: "",
          productid: "",
          id: "",
          pci: "",
          uid: "0",
          gid: "0",
          mode: "0660"
        }
      },
      defaultItem: {
        id: -1,
        type: "gpu",
        name: "",
        dict: {
          vendorid: "",
          productid: "",
          id: "",
          pci: "",
          uid: "0",
          gid: "0",
          mode: "0660"
        }
      },

      // container/profile
      linkedItem: {},

      // rules
      nameRule: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters'
      ],
      uidRule: [
        v => (!v || !isNaN(v)) || 'UID must be numeric'
      ],
      gidRule: [
        v => (!v || !isNaN(v)) || 'GID must be numeric'
      ],
      modeRule: [
        v => (!v || !isNaN(v)) || 'Most must be numeric'
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
      
      // container or profile
      if (this.linked) {
        this.attachType = this.linkedItem.status ? 'containers' : 'profiles'
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
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/devices/gpu')
          this.items = response.data.data
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      async attachItem(item) {
        // infix
        if (this.attachType === 'profiles') {
          this.linkedItem = Object.assign({}, profile.outfix(this.linkedItem))
        } else {
          this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        }
        
        this.linkedItem.devices  = Object.assign({}, this.linkedItem.devices)

        this.$set(this.linkedItem.devices, item.name, {
          "type": item.type,
          ...item.dict
        })

        //
        const response = await axios.patch(this.loggedUser.sub + '/api/lxd/'+this.attachType+'/' + this.linkedItem.name, {
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

        // profile outfix
        if (this.attachType === 'profiles') {
          this.linkedItem = Object.assign({}, profile.outfix(this.linkedItem))
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

      // create or edit item
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = JSON.parse(JSON.stringify(item));

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
                vendorid: this.editingItem.dict.vendorid,
                productid: this.editingItem.dict.productid,
                id: this.editingItem.dict.id,
                pci: this.editingItem.dict.pci,
                uid: this.editingItem.dict.uid,
                gid: this.editingItem.dict.gid,
                mode: this.editingItem.dict.mode
              }
            };

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/devices/gpu/'+this.editingItem.id, body)
            }
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/devices/gpu', body)
            }

            if (response.data.error) {
              if (response.data.error.name) {
                this.error = response.data.error.name
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/devices/gpu/'+item.id)

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
