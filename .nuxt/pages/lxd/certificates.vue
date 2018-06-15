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
                    LXD - Certificates
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small color="success" @click="dialog.editing = true" style="float:right">Add Certificate</v-btn>
                    <v-btn small @click="dialog.generate = true" style="float:right">Generate Certificate</v-btn>
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
                      <td>
                        <a href="javascript:void(0)" @click.stop="editItem(props.item)">{{ props.item.name ? props.item.name : '-' }}</a>
                      </td>
                      <td>{{ props.item.type ? ucfirst(props.item.type) : '-' }}</td>
                      <td>{{ props.item.fingerprint ? props.item.fingerprint : '-' }}</td>
                      <td>
                        <v-btn icon class="mx-0" style="float:right" @click.stop="deleteItem(props.item)">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                  <template slot="no-data">
                    {{ tableLoading ? 'Fetching data, please wait...' : 'There are currently no certificates.' }}
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog.editing" max-width="510px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.editing = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ editingIndex === -1 ? 'Add' : 'Edit' }} Certificate</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding: 0px;">
            <v-card flat>
              <v-card-text>
                <v-alert type="error" :value="error.editing">
                  {{ error.editing }}
                </v-alert>
                <v-form ref="form_editing" v-model="valid.editing" lazy-validation>
                  <v-text-field v-model="editingItem.name" label="Common Name:" :rules="nameRule" placeholder="" required hint="Common Name (CN) for the certificate."></v-text-field>
                  <v-select :items="['client']" v-model="editingItem.type" label="Type:" hint="Certificate type (keyring), currently only client"></v-select>
                  <div v-if="editingIndex === -1">
                    <v-text-field v-model="editingItem.certificate" :rules="certificateRule" label="PEM Certificate:" placeholder="" hint="If provided, a valid x509 certificate. If not, the client certificate of the connection will be used." multi-line></v-text-field>
                  </div>
                  <div v-else>
                    <h3>Client Certificate</h3>
                    <pre style="font-size:12px">{{editingItem.certificate}}</pre>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
      
      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog.generate" max-width="510px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="dialog.generate = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Generate Certificate</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="generateCert()" :loading="generating" :disabled="generating">Generate</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding: 0px;">
            <v-card flat>
              <v-card-text>
                <v-alert type="error" :value="error.generate">
                  {{ error.generate }}
                </v-alert>
                <v-form ref="form_generate" v-model="valid.generate" lazy-validation>
                  <div v-if="cert.key !== ''">
                    <h2>Client Certificate <v-btn dark small color="success" @click="addCert()" style="float:right">Add To LXD</v-btn><v-btn dark small color="blue" @click="downloadCert('pem')" style="float:right">Download</v-btn></h2>
                    <pre style="font-size:12px">{{cert.pem}}</pre>
                    <h2 style="margin-top:15px">Private Key <v-btn dark small color="blue" @click="downloadCert('key')" style="float:right">Download</v-btn></h2>
                    <pre style="font-size:12px">{{cert.key}}</pre>
                  </div>
                  <div v-else>
                    <h3>General</h3>
                    <v-select :disabled="generating" :items="['2048','4096','8192']" v-model="cert.bits" label="Key Length:" hint="RSA key length. 8192 takes considerably longer to generate."></v-select>
                    <v-text-field :disabled="generating" v-model="cert.days" label="Days:" :rules="daysRule" placeholder="" required hint="Length in days the certificate is valid for."></v-text-field>
                    
                    <h3>CSR Subject</h3>
                    <v-text-field :disabled="generating" v-model="cert.subject.cn" label="Common Name:" :rules="commonNameRule" placeholder="" required hint="Common Name (CN) for the certificate."></v-text-field>
                    <v-text-field :disabled="generating" v-model="cert.subject.c" label="Country:" :rules="countryRule" placeholder="" required hint="Two-letter country code. e.g. GB"></v-text-field>
                    <v-text-field :disabled="generating" v-model="cert.subject.st" label="State:" :rules="stateRule" placeholder="" required hint="State, county or region. e.g: London"></v-text-field>
                    <v-text-field :disabled="generating" v-model="cert.subject.l" label="Locality:" :rules="localityRule" placeholder="" required hint="City or town. e.g: Wimbledon"></v-text-field>
                    <v-text-field :disabled="generating" v-model="cert.subject.o" label="Organization:" :rules="organizationRule" placeholder="" required hint="Registered name of the organization. e.g: Conext"></v-text-field>
                    <v-text-field :disabled="generating" v-model="cert.subject.ou" label="Organization Unit:" :rules="organizationUnitRule" placeholder="" required hint="Name of the department. e.g: IT Department"></v-text-field>
                  </div>
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
      dialog: {editing: false, generate: false},
      valid: {editing: true, generate: true},
      generating: false,

      // error alerts
      error: {global:false, editing: false, generate: false},

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,

      // table & items
      items: [],
      cert: {
        bits: "2048",
        days: 365,
        subject: {
          c: "",
          st: "",
          l: "",
          o: "",
          ou: "",
          cn: "",
        },
        key:"",
        pem: ""
      },

      tableLoading: true,
      tableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Fingerprint', value: 'fingerprint' },
        { text: 'Actions', value: 'action', sortable: false, align: 'right' }
      ],

      editingIndex: -1,
      editingItem: {
        name: "",
        type: "client",
        fingerprint: "",
        certificate: ""
      },
      defaultItem: {
        name: "",
        type: "client",
        fingerprint: "",
        certificate: ""
      },

      nameRule: [
        v => !!v || 'Name is required'
      ],
      certificateRule: [
        v => !!v || 'Certificate is required'
      ],
      daysRule: [
        v => !!v || 'Days is required',
        v => (v && !isNaN(v)) || 'Days is numeric',
      ],
      commonNameRule: [
        v => !!v || 'Common name is required'
      ],
      countryRule: [
        v => !!v || 'Country is required',
        v => (v && v.length == 2) || 'Country is a 2 letter code',
      ],
      stateRule: [
        v => !!v || 'State is required'
      ],
      localityRule: [
        v => !!v || 'Locality is required'
      ],
      organizationRule: [
        v => !!v || 'Organization is required'
      ],
      organizationUnitRule: [
        v => !!v || 'Organization Unit is required'
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
      
      this.$nextTick(() => {
        this.initialize()
        //
        this.cert = Object.assign(this.cert, this.$storage.get("cert_default"))
        console.log(this.cert);
      })
    },
    watch: {
      'dialog.editing': function (val) {
        val || this.close()
      },
      'dialog.generate': function (val) {
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
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/certificates')
          this.items = response.data.data
        } catch (error) {
          this.items = []
          this.tableNoData = 'No data.'
          this.error.global = 'Could not fetch data from server.'
        }
        this.tableLoading = false
      },
      
      async generateCert() {
        if (this.$refs.form_generate.validate()) {
          this.generating = true
          //
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }
            
            this.$storage.set("cert_default", {
              bits: String(this.cert.bits),
              days: String(this.cert.days),
              subject: {
                c: this.cert.subject.c,
                st: this.cert.subject.st,
                l: this.cert.subject.l,
                o: this.cert.subject.o,
                ou: this.cert.subject.ou,
                cn: this.cert.subject.cn,
              }
            })
  
            //
            const response = await axios.post(this.loggedUser.sub + '/api/lxd/certificates/generate', this.cert)
  
            this.cert = response.data.data
            
            this.generating = false
          } catch (error) {
  
          }
        }
      },
      
      downloadCert(type) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.cert[type]));
        element.setAttribute('download', 'cert.'+(type == 'pem' ? 'pem' : 'key'));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },  
      
      async addCert() {
        if (this.$refs.form_generate.validate()) {
          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }
            var response = await axios.post(this.loggedUser.sub + '/api/lxd/certificates', {
              name: this.cert.subject.cn,
              type: "client",
              certificate: this.cert.pem
            })
            
            if (response.data.code == 200) {
              //
              this.snackbar = true
              this.snackbarText = 'Certificate successfully added.'
              this.initialize()
            }
            
            if (response.data.error) {
              this.error.generate = response.data.error
            }
          } catch (error) {
            this.error.global = 'Could not save certificates to server.'
          }
        }
      },

      // create or edit item
      editItem (item) {
        this.editingIndex = this.items.indexOf(item)
        this.editingItem = Object.assign({}, this.defaultItem, item)
        
        this.dialog.editing = true
      },

      // save
      async save () {
        if (this.$refs.form_editing.validate()) {
          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            // edit
            if (this.editingIndex > -1) {
              var response = await axios.put(this.loggedUser.sub + '/api/lxd/certificates/'+this.editingItem.fingerprint, {
                name: this.editingItem.name,
                type: this.editingItem.type
              })
            } 
            // add
            else {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/certificates', {
                name: this.editingItem.name,
                type: this.editingItem.type,
                certificate: this.editingItem.certificate
              })
            }
            
            // check errors
            if (response.data.code === 422) {
              this.error.editing = response.data.error
            } else {
              this.error.editing = false
              // local
              if (this.editingIndex > -1) {
                Object.assign(this.items[this.editingIndex], this.editingItem)
              } else {
                this.items.push(Object.assign({}, this.editingItem))
              }
              //
              this.snackbar = true
              this.snackbarText = 'Certificates successfully saved.'
            }
          } catch (error) {
            this.error.global = 'Could not save certificates to server.'
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
          title: 'Delete certificate?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> certificate?',
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
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/certificates/'+item.fingerprint)

                  //
                  this.snackbar = true
                  this.snackbarColor = 'green'
                  this.snackbarText = 'Certificate deleted.'
                } catch (error) {
                  //
                  this.error.global = 'Failed to delete certificate.'
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
        this.dialog.generate = false
        setTimeout(() => {
          this.editingItem = Object.assign({}, this.defaultItem)
          this.editingIndex = -1
          this.error.editing = false
          //
          this.cert.pem = '';
          this.cert.key = '';
          this.error = {
            editing: false,
            generate: false
          }
        }, 300)
      },

      ucfirst(str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }
    }
  }
</script>

<style>

</style>
