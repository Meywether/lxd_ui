<template>
  <v-app>
    <!-- Snackbar Alert -->
    <v-snackbar top :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar">
      {{ snackbarText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-content>
      <!-- Main Content -->
      <v-container fluid tag="section" id="grid">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="display mb-2">
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    Web Proxy
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small color="success" @click="dialog = true" style="float:right">New Proxy</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <p>The web proxy allow you to route HTTP/S traffic to containers or external upstreams.</p>
                <v-data-table :headers="tableHeaders" :items="items" hide-actions class="elevation-1" :loading="tableLoading">
                  <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <td><a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.label }}</a></td>
                    <td><ul><li style="list-style-type: none;" v-for="domain in props.item.ownDomain" :key="domain.name">{{ domain.name }}</li></ul></td>
                    <td>
                      <span v-for="upstream in props.item.ownUpstream" :key="upstream.id">{{ upstream.ip }}:{{ upstream.port }}<br></span>
                    </td>
                    <td>
                      <span v-if="props.item.ssl_type === 'letsencrypt'">
                        <v-icon color="amber darken-3">https</v-icon> 
                        <span v-if="props.item.certificate_expiry">Renewed On: {{ new Date(props.item.certificate_expiry*1000).toLocaleDateString() }}</span>
                        <span v-else>Acquiring certificate.</span>
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <v-btn icon class="mx-0" style="float:right" @click="deleteItem(props.item)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <template slot="no-data">
                    {{ tableLoading ? 'Fetching data, please wait...' : tableNoData }}
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      
      <!-- Fullscreen Dialog -->
      <v-dialog v-model="dialog" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ editingIndex === -1 ? 'New' : 'Edit' }} Web Proxy</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding: 0px;">
            <v-card flat>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field v-model="editingItem.label" :rules="labelRule" label="Label:" placeholder="" required hint="Enter a label for the web proxy."></v-text-field>
                  <h3 style="margin-top:15px">Domain/s</h3>
                  <v-layout row wrap>
                    <v-flex xs11>
                      <v-text-field v-model="newDomain" label="Domain:" hint="Enter a domain name to forward to upstream/s."></v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="success" @click.native="addDomain">
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-for="domain in editingItem.ownDomain" :key="domain.id">
                    <v-flex xs11>
                      <v-text-field v-model="domain.name" label="Domain:" hint="Empty or invalid domains are removed."></v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="error" @click.native="removeDomain(domain)">
                        <v-icon>remove</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <h3 style="margin-top:15px">Upstream/s</h3>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-text-field v-model="newUpstream.ip" label="IP Address:" hint="Enter upstream IP address."></v-text-field>
                    </v-flex>
                    <v-flex xs5>
                      <v-text-field v-model="newUpstream.port" label="Port:" hint="Enter upstream port."></v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="success" @click.native="addUpstream">
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap v-for="upstream in editingItem.ownUpstream" :key="upstream.id">
                   <v-flex xs6>
                      <v-text-field v-model="upstream.ip" label="IP Address:" hint="Empty or invalid ips are removed."></v-text-field>
                    </v-flex>
                    <v-flex xs5>
                      <v-text-field v-model="upstream.port" label="Port:" hint="Empty or invalid ports are removed."></v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-btn flat icon color="error" @click.native="removeUpstream(upstream)">
                        <v-icon>remove</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <h3 style="margin-top:15px">SSL</h3>
                  <v-checkbox v-model="editingItem.letsencrypt" label="Let's Encrypt"></v-checkbox>
                </v-form>
              </v-card-text>
            </v-card>
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

  export default {
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
      tableNoData: 'You have not added any web proxys.',
      tableHeaders: [
        { text: 'Label', value: 'label' },
        { text: 'Domain/s', value: 'ownDomain' },
        { text: 'Upstream/s', value: 'ownUpstream' },
        { text: 'SSL', value: 'ssl_type' },
        { text: 'Actions', value: 'name', sortable: false, align: 'right' }
      ],

      // dialog
      dialog: false,
      
      // item
      editingIndex: -1,
      editingItem: {
        id: -1,
        label: "",
        name: "",
        ssl_type: "",
        letsencrypt: false,
        added: "",
        updated: "",
        has_change: 1,
        has_error: 0,
        delete: 0,
        enabled: 1,
        update_ip: 0,
        ip: "",
        port: "",
        error: "",
        ownDomain: [],
        ownUpstream: []
      },
      defaultItem: {
        id: -1,
        label: "",
        name: "",
        ssl_type: "",
        letsencrypt: false,
        added: "",
        updated: "",
        has_change: 1,
        has_error: 0,
        delete: 0,
        enabled: 1,
        update_ip: 0,
        ip: "",
        port: "",
        error: "",
        ownDomain: [],
        ownUpstream: []
      },
      
      // new domain item
      newDomain: '',
      newUpstream: {
        ip: '',
        port: ''
      },
      
      // item form & validation
      valid: true,
      labelRule: [
        v => !!v || 'Label is required',
        v => (v && v.length <= 100) || 'Label must be less than 100 characters'
      ]
    }),
    mounted: function () {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.loggedToken
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
        // fetch remote
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/routes/web-proxy')
          this.items = response.data.data
        } catch (error) {
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
        this.tableLoading = false
      },
      
      //
      addDomain () {
        if (!this.editingItem.ownDomain) {
          this.editingItem.ownDomain = [];
        }
        this.editingItem.ownDomain.unshift({name:this.newDomain})
        this.newDomain = '';
      }, 
      //
      removeDomain (item) {
        const index = this.editingItem.ownDomain.indexOf(item)
        this.editingItem.ownDomain.splice(index, 1)
      },
      
      //
      addUpstream () {
        if (!this.editingItem.ownUpstream) {
          this.editingItem.ownUpstream = [];
        }
        this.editingItem.ownUpstream.unshift({ip: this.newUpstream.ip, port: this.newUpstream.port})
        this.newUpstream = {
          ip: '',
          port: ''
        };
      }, 
      //
      removeUpstream (item) {
        const index = this.editingItem.ownUpstream.indexOf(item)
        this.editingItem.ownUpstream.splice(index, 1)
      },

      // create or edit item
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        
        // ssl_type
        if (item.ssl_type === 'letsencrypt') {
          item.letsencrypt = true;
        }
        
        this.editingItem = Object.assign({}, item)
        this.dialog = true
      },

      // delete item
      deleteItem (item) {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete web proxy?',
          text: 'Are you sure you want to delete the <b>'+item.label+'</b> web proxy?',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => { 
                const index = this.items.indexOf(item)
        
                // local
                this.items.splice(index, 1)
        
                // remote
                try {
                  if (!this.loggedUser) {
                    this.$router.replace('/servers')
                  }

                  //
                  const response = await axios.delete(this.loggedUser.sub + '/api/routes/web-proxy', { data: item })
                  //
                  this.snackbar = true;
                  this.snackbarText = 'Web proxy successfully deleted.';
                  
                } catch (error) {
                  this.error = 'Could not delete web proxy from server.';
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

      // save item
      async save () {
        if (this.$refs.form.validate()) {
          
          if (this.newDomain.length > 0){
            this.addDomain()
          }
          if (this.newUpstream.ip){
            this.addUpstream()
          }

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

            //
            const response = await axios.post(this.loggedUser.sub + '/api/routes/web-proxy', this.editingItem)
            //
            this.snackbar = true;
            this.snackbarText = 'Web proxy successfully saved.';
          } catch (error) {
            this.error = 'Could not save web proxy to server.';
          }
          
          // reload data
          this.initialize()
          
          this.close()
        }
      },
      
      // close item dialog, and reset to default item
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
        }, 300)
      }

    }
  }
</script>

<style>

</style>
