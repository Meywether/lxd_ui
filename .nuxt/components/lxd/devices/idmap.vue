<template>
  <div>
    <v-alert type="error" :value="error">
      {{ error }}
    </v-alert>
    <v-card-text v-if="(selectedItems.length >= 5 && idmap_limit) || alreadyRunning" style="margin-bottom:-15px">
      <v-alert type="info" outline :value="selectedItems.length >= 5 && idmap_limit">
        {{ lxd && lxd.environment && lxd.environment.kernel_version ? 'Linux kernel '+lxd.environment.kernel_version+' allows you to map up to 5 ids' : 'Could not detect kernel version, you can map up to 5 ids' }}.
      </v-alert>
      <v-alert :value="true" outline color="info" icon="info" v-if="alreadyRunning">
        <v-layout row>
          <v-flex xs11>
            <p style="padding-top:10px;margin-bottom:10px" v-if="linkedItem.status !== 'Stopped'">Container must be stopped before mapping ids.</p>
            <p style="padding-top:10px;margin-bottom:10px" v-if="linkedItem.status === 'Stopped'">You can now map ids, if the container fails to start undo your changes.</p>
          </v-flex>
          <v-flex xs1>
            <v-btn depressed small color="error" style="float:right" v-if="linkedItem.status !== 'Stopped'" @click="stopContainer(linkedItem)" :loading="statusChange" :disabled="statusChange">Stop</v-btn>
            <v-btn depressed small color="success" style="float:right" v-if="linkedItem.status === 'Stopped'" @click="startContainer(linkedItem)" :loading="statusChange" :disabled="statusChange">Start</v-btn>
          </v-flex>
        </v-layout>
      </v-alert>
    </v-card-text>
    <v-card-title>
      <v-layout row wrap style="margin-top:-15px">
        <v-flex xs8>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="search" append-icon="search" label="Filter..." single-line hide-details></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-data-table :headers="tableHeaders" :items="items" hide-actions :loading="tableLoading" :search="search" style="margin-top:-10px">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.user }}</td>
          <td>{{ props.item.id }}</td>
          <td>
            <v-btn depressed small @click="attachItem(props.item)" v-if="!selectedItems.includes('both '+props.item.id+' '+props.item.id)" :disabled="linkedItem.status !== 'Stopped' || (selectedItems.length >= 5 && idmap_limit)">Map</v-btn>
            <v-btn :dark="linkedItem.status === 'Stopped'" depressed small color="red" @click="detachItem(props.item)" v-if="selectedItems.includes('both '+props.item.id+' '+props.item.id)" :disabled="linkedItem.status !== 'Stopped'">Unmap</v-btn>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'Could not obtain host user list.' }}
      </template>
      <template slot="no-results" :value="true" color="error" icon="warning">
        No user or id found matching "{{ search }}".
      </template>
    </v-data-table>
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
      },
      idmap_limit: function () {
        if (!this.lxd || !this.lxd.environment || !this.lxd.environment.kernel_version) {
          return true;
        }

        // check >= 4.15 kernel
        // https://github.com/lxc/lxd/issues/3933#issuecomment-336191492
        let kernel = this.lxd.environment.kernel_version.split('.', 2)

        kernel[0] = Number(kernel[0])
        kernel[1] = Number(kernel[1])

        return (kernel[0] < 4 || (kernel[0] >= 4 && kernel[1] < 15))
      }
    },
    data: () => ({
      search: '',
      error: false,
      tableLoading: true,
      alreadyRunning: false,
      statusChange: false,
      attachType: '',
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
          this.$storage.set('lxd', response.data.data)
          this.lxd = response.data
        } catch (error) {
          this.$storage.remove('lxd')
        }
      } else {
        this.lxd = this.$storage.get('lxd')
      }

      this.linkedItem = Object.assign({}, this.linked)
      
      //
      this.attachType = this.linkedItem.status ? 'containers' : 'profiles'

      // check if profile else running wont be true
      if (this.linked) {
        if (this.attachType === 'profiles') {
          this.alreadyRunning = false
          this.linkedItem.status = 'Stopped'
          // parse out current idmap
          if (this.linkedItem.config && this.linkedItem.config['raw.idmap']) {
            var tmp = this.linkedItem.config["raw.idmap"] = this.linkedItem.config['raw.idmap'].trim()
            this.selectedItems = tmp.split("\n")
          } else {
            this.selectedItems = []
          }
        } else {
          this.alreadyRunning = this.linked.status === 'Running'
          // parse out current idmap
          if (this.linkedItem.expanded_config && this.linkedItem.expanded_config['raw.idmap']) {
            var tmp = this.linkedItem.config["raw.idmap"] = this.linkedItem.expanded_config['raw.idmap'].trim()
            this.selectedItems = tmp.split("\n")
          } else {
            this.selectedItems = []
          }
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
          const response = await axios.get(this.loggedUser.sub + '/api/server/idmap')
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
        
        this.linkedItem.devices = Object.assign({}, this.linkedItem.devices)
        
        this.selectedItems.push('both '+item.id+' '+item.id)

        this.$set(this.linkedItem.config, "raw.idmap", this.selectedItems.join("\n"))

        //
        const response = await axios.patch(this.loggedUser.sub + '/api/lxd/'+this.attachType+'/' + this.linkedItem.name, {
          config: this.linkedItem.config
        })

        if (response.data.error) {
          this.attachError = response.data.error
        }
      },

      async detachItem(item) {
        this.attachError = false;
        
        if (this.attachType === 'containers') {
          this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
        }
        
        const index = this.selectedItems.indexOf('both '+item.id+' '+item.id)
        this.selectedItems.splice(index, 1)

        // remove from linked item
        var replace = "both "+item.id+" "+item.id
        
        var reg = new RegExp(replace, "g");
        this.linkedItem.config["raw.idmap"] = this.linkedItem.config["raw.idmap"].replace(reg, '')
        
        // clear if empty
        if (this.linkedItem.config["raw.idmap"] === '') {
          delete this.linkedItem.config["raw.idmap"]
        }
        
        // profile outfix
        if (this.attachType === 'profiles') {
          this.linkedItem = Object.assign({}, profile.outfix(this.linkedItem))
          delete this.linkedItem.config['image.architecture']
          delete this.linkedItem.config['image.description']
          delete this.linkedItem.config['image.label']
          delete this.linkedItem.config['image.os']
          delete this.linkedItem.config['image.release']
          delete this.linkedItem.config['image.serial']
          delete this.linkedItem.config['image.version']
          // fix multis
          this.linkedItem.config['limits.cpu.allowance'] = this.linkedItem.config['limits.cpu.allowance'].replace('%%', '%')
          this.linkedItem.config['limits.memory'] = this.linkedItem.config['limits.memory'].replace('MBMB', 'MB')
        } else {
          this.linkedItem = Object.assign({}, container.outfix(this.linkedItem))
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
          item.status = 'Stopped';
        }, 2500);
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
          item.status = 'Running';
        }, 2500);
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
.btn--disabled .red {
  background-color: #f44336 !important;
}
</style>
