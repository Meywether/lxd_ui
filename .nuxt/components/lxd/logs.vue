<template>
  <div>
    <v-data-table :headers="tableHeaders" :items="items" item-key="name" hide-actions :loading="tableLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click.stop="tableExpand(props)">
          <td>{{ props.item.name }}</td>
          <td>
            <v-tooltip left>
              <v-btn slot="activator" icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)" :disabled="['lxc.conf','lxc.log'].includes(props.item.name)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
              <span>Delete</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no logs for this container.' }}
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text v-html="props.item.data ? '<pre style=\'font-size:10px\'>' + props.item.data + '</pre>' : 'Log is empty.'"></v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

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
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        } else {
          return [
            { text: 'Name', value: 'name' },
            { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'100px' }
          ]
        }
      }
    },
    data: () => ({
      error: false,
      dialog: false,

      tableLoading: true,
      items: [],

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

      if (this.linked) {
        this.linkedItem = Object.assign({}, this.linked)
      }

      this.$nextTick(() => {
        this.initialize()
      })
    },
    watch: {},
    methods: {
      async initialize () {
        try {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/'+this.linkedItem.name+'/logs')
          this.items = response.data.data
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },
      
      async tableExpand(prop) {
        // update item on open
        if (!prop.expanded) {
          const index = this.items.indexOf(prop.item)
          try {
            //
            const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/'+this.linkedItem.name+'/logs/'+prop.item.name)
            this.$set(this.items[index], 'data', response.data.data)
          } catch (error) {
            this.error = 'Could not fetch data from server.';
          }
        }
        prop.expanded = !prop.expanded
      },

      async deleteItem (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete log?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> log?',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/containers/'+item.name+'/logs/'+item.name)

                  //
                  this.$emit('snackbar', 'Log successfully deleted.')
                } catch (error) {
                  //
                  this.error = 'Failed to delete log.';
                }
              }
            },
            {
              title: 'No',
              color: 'error'
            }
          ]
        })
      }
    }
  }
</script>

<style>

</style>
