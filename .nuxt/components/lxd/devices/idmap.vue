<template>
  <div>
    <v-alert type="error" :value="error">
      {{ error }}
    </v-alert>
    <v-data-table :headers="tableHeaders" :items="items" hide-actions :loading="tableLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.user }}</td>
          <td>{{ props.item.id }}</td>
          <td>
            <v-btn depressed small @click="attachItem(props.item)" v-if="!selectedItems.includes('both '+props.item.id+' '+props.item.id)">Map</v-btn>
            <v-btn dark depressed small color="red" @click="detachItem(props.item)" v-if="selectedItems.includes('both '+props.item.id+' '+props.item.id)">Unmap</v-btn>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'Could not obtain host user list.' }}
      </template>
    </v-data-table>
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
            { text: 'User', value: 'user' },
            { text: 'UID', value: 'id' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'User', value: 'user' },
            { text: 'UID', value: 'id' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        }
      }
    },
    data: () => ({
      error: false,
      tableLoading: true,
      // user/id items
      items: [],
      // user selected mappings
      selectedItems: [],
      // container/profile
      linkedItem: {}
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
      
      // parse out current idmap
      if (this.linkedItem.expanded_config['raw.idmap']) {
        var tmp = this.linkedItem.config["raw.idmap"] = this.linkedItem.expanded_config['raw.idmap']
        this.selectedItems = tmp.split("\n")
      } else {
        this.selectedItems = []
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
          const response = await axios.get(this.loggedUser.sub + '/api/server/information/idmap')
          this.items = response.data.data
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },

      async attachItem(item) {
        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        this.linkedItem.devices = Object.assign({}, this.linkedItem.devices)
        
        this.selectedItems.push('both '+item.id+' '+item.id)

        this.$set(this.linkedItem.config, "raw.idmap", this.selectedItems.join("\n"))

        //
        const response = await axios.patch(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
          config: this.linkedItem.config
        })

        if (response.data.error) {
          this.attachError = response.data.error
        }
      },

      async detachItem(item) {
        this.attachError = false;
        
        this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        
        const index = this.selectedItems.indexOf(item)
        this.selectedItems.splice(index, 1)

        // remove from linked item
        var replace = "both "+item.id+" "+item.id
        
        var reg = new RegExp(replace, "g");
        this.linkedItem.config["raw.idmap"] = this.linkedItem.config["raw.idmap"].replace(reg, '')
        
        // clear if empty
        if (this.linkedItem.config["raw.idmap"] === '') {
          delete this.linkedItem.config["raw.idmap"]
        }

        //
        const response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.linkedItem.name, {
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
