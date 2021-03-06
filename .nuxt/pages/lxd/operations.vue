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
                    LXD - Operations
                  </v-flex>
                  <v-flex xs12 sm6>
                    
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-tabs v-model="activeTab" class="elevation-1">
                  <v-tab ripple :href="`#tab-running`">Running</v-tab>
                  <v-tab ripple :href="`#tab-success`">Success</v-tab>
                  <v-tab-item :id="`tab-running`">
                    <v-card>
                      <v-data-table :headers="tableHeaders" :items="items.running" hide-actions :loading="tableLoading">
                        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                        <template slot="items" slot-scope="props">
                          <tr @click.stop="tableExpand(props)">
                            <td>{{ props.item.id }}</td>
                            <td>{{ props.item.description }}</td>
                            <td>{{ ucfirst(props.item.class) }}</td>
                            <td>{{ ucfirst(props.item.may_cancel) }}</td>
                            <td>{{ new Date(props.item.created_at).toLocaleString() }}</td>
                            <td>{{ props.item.status }}</td>
                            <td>
                              <v-btn icon class="mx-0" style="float:right" @click.stop="cancelOperation(props.item)" :disabled="!props.item.may_cancel">
                                <v-icon color="pink">delete</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                        <template slot="no-data">
                          {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no running operations.' }}
                        </template>
                        <template slot="expand" slot-scope="props">
                          <table class="table">
                            <tbody>
                              <tr>
                                <td>Metadata</td>
                                <td><pre style="font-size:10px">{{props.item.metadata}}</pre></td>
                              </tr>
                              <tr>
                                <td>Resources</td>
                                <td><pre style="font-size:10px">{{props.item.resources}}</pre></td>
                              </tr>
                            </tbody>
                          </table>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item :id="`tab-success`">
                    <v-card>
                      <v-data-table :headers="tableHeaders" :items="items.success" hide-actions :loading="tableLoading">
                        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                        <template slot="items" slot-scope="props">
                          <tr @click.stop="tableExpand(props)">
                            <td>{{ props.item.id }}</td>
                            <td>{{ props.item.description }}</td>
                            <td>{{ ucfirst(props.item.class) }}</td>
                            <td>{{ ucfirst(props.item.may_cancel) }}</td>
                            <td>{{ new Date(props.item.created_at).toLocaleString() }}</td>
                            <td>{{ props.item.status }}</td>
                            <td>
                              <v-btn icon class="mx-0" style="float:right" @click.stop="cancelOperation(props.item)" :disabled="!props.item.may_cancel">
                                <v-icon color="pink">delete</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                        <template slot="no-data">
                          {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no success operations.' }}
                        </template>
                        <template slot="expand" slot-scope="props">
                          <table class="table">
                            <tbody>
                              <tr>
                                <td>Metadata</td>
                                <td><pre style="font-size:10px">{{props.item.metadata}}</pre></td>
                              </tr>
                              <tr>
                                <td>Resources</td>
                                <td><pre style="font-size:10px">{{props.item.resources}}</pre></td>
                              </tr>
                            </tbody>
                          </table>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
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
      valid: true,

      // global error
      error: '',

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,

      // table & items
      items: [],

      tableLoading: true,
      tableHeaders: [
        { text: 'Id', value: 'id' },
        { text: 'Description', value: 'description' },
        { text: 'Class', value: 'class' },
        { text: 'Cancelable', value: 'may_cancel' },
        { text: 'Created', value: 'created_at' },
        //{ text: 'Updated', value: 'updated_at' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'id', sortable: false, align: 'right' }
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},

      // tab
      activeTab: 'tab-running',

      // poller id
      pollItem: 0
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
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/operations')
          this.items = response.data.data
        } catch (error) {
          this.items = []
          this.tableNoData = 'No data.'
          this.error = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },
      
      async tableExpand(prop) {
        this.item = []
        prop.expanded = !prop.expanded
      },

      async cancelOperation (item) {
        //
        try {
          //
          const response = await axios.delete(this.loggedUser.sub + '/api/lxd/operations/' + item.id)
          
          //
          this.snackbar = true
          this.snackbarColor = 'green'
          this.snackbarText = 'Operation set to cancelling state.'
        } catch (error) {
          //
          this.error = 'Failed to set operation state.'
        }
      },

      ucfirst(str) {
          return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }
    }
  }
</script>

<style>

</style>
