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
                    LXD - Containers
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small :dark="items.length > 0 && !all_stopped" color="orange" @click="restartAll()" style="float:right" :disabled="items.length === 0 || all_stopped">Restart All</v-btn>
                    <v-btn small :dark="!all_stopped" color="red" @click="stopAll()" style="float:right" :disabled="all_stopped">Stop All</v-btn>
                    <v-btn small :dark="!all_running" color="green" @click="startAll()" style="float:right" :disabled="all_running">Start All</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert v-if="alert.msg" :value="alert.msg" :outline="alert.outline" :color="alert.color" :icon="alert.icon" dismissible>
                  {{ alert.msg }}
                </v-alert>
                <v-data-table :headers="tableHeaders" :items="items" hide-actions class="elevation-1" :loading="tableLoading">
                  <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td><a href="javascript:void(0)" @click.stop="editContainer(props.item)">{{ props.item.name }}</a></td>
                      <td>
                        <span v-if="check_started_with_ip(props.item)">{{ props.item.state && props.item.state.network && props.item.state.network.eth0.addresses[0].address ? props.item.state.network.eth0.addresses[0].address : '-' }}</span>
                        <span v-if="props.item.state && props.item.state.network && props.item.state.status === 'Running' && (!props.item.state.network.eth0 || props.item.state.network.eth0.addresses.length === 0 || isIP4(props.item.state.network.eth0.addresses[0].address) === false)">
                          <v-icon size="15" @click="initialize()" color="orange darken-2">fa fa-refresh</v-icon>
                        </span>
                        <span v-if="props.item.status === 'Stopped'">-</span>
                      </td>
                      <td>{{ props.item.state && props.item.state.cpu && props.item.state.cpu.usage ? Number(props.item.state.cpu.usage/1000000000).toFixed(2) + 's' : '-' }}</td>
                      <td>{{ props.item.state && props.item.state.processes ? props.item.state.processes : '-' }} / {{ props.item.config['limits.processes'] ? props.item.config['limits.processes'] : '-'}}</td>
                      <td>{{ props.item.state && props.item.state.memory && props.item.state.memory.usage ? formatBytes(props.item.state.memory.usage) : '-' }} / {{ props.item.config['limits.memory'] ? props.item.config['limits.memory'] : '-'}}</td>
                      <td>
                        {{ props.item.state && props.item.state.network && props.item.state.network.eth0 && props.item.state.network.eth0.counters ? formatBytes(props.item.state.network.eth0.counters.bytes_received) : '-' }} /
                        {{ props.item.state && props.item.state.network && props.item.state.network.eth0 && props.item.state.network.eth0.counters ? formatBytes(props.item.state.network.eth0.counters.bytes_sent) : '-' }}
                      </td>
                      <td>{{ props.item.status }}</td>
                      <td>
                        <div class="field is-grouped is-grouped-multiline" style="display:flex">
                          <div class="control">
                            <div class="tags has-addons">
                              <v-tooltip left>
                                <span slot="activator" :class="[props.item.config['boot.autostart'] === '1' ? 'is-on' : 'is-off', 'tag']">A</span>
                                <span>Auto Start</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div class="control">
                            <div class="tags has-addons">
                              <v-tooltip left>
                                <span slot="activator" :class="[props.item.ephemeral ? 'is-on' : 'is-off', 'tag']">E</span>
                                <span>Ephemeral</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div class="control">
                            <div class="tags has-addons">
                              <v-tooltip left>
                                <span slot="activator" :class="[props.item.config['security.privileged'] === '1' ? 'is-on' : 'is-off', 'tag']">P</span>
                                <span>Privileged</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div class="control">
                            <div class="tags has-addons">
                              <v-tooltip left>
                                <span slot="activator" :class="[props.item.config['security.nesting'] === '1' ? 'is-on' : 'is-off', 'tag']">N</span>
                                <span>Nesting</span>
                              </v-tooltip>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-0">
                        <v-menu offset-y left style="float:right" class="mr-3">
                          <v-btn icon class="mx-0" slot="activator">
                            <v-icon color="blue-grey lighten-3">view_headline</v-icon>
                          </v-btn>
                          <v-list>
                            <v-list-tile v-for="item in containerActions" :key="item.title" @click="stateContainer(item, props.item)" v-if="!item.state || item.state === props.item.status">
                              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
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

      <!-- Copy Dialog -->
      <v-dialog v-model="copyDialog" max-width="600px" scrollable>
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="copyDialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Copy Container</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="copyContainer(newItem, true)">Copy</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-alert :value="true" outline color="info" icon="info">
              Copying containers may take a while, be patient.
            </v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-select :items="[copy.name]" v-model="copy.name" label="Container:" required disabled></v-select>
              <v-text-field v-model="copy.name_alt" label="Name:" :rules="nameRule" @input="copy.name_alt = safe_name(copy.name_alt)" hint="Enter name for new container." required></v-text-field>
              <v-select :items="private_remotes" v-model="copy.remote" :rules="remoteRule" label="To Remote:" required></v-select>
            </v-form>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>

      <v-dialog v-model="consoleDialog"  fullscreen hide-overlay transition="dialog-bottom-transition" color="black" style="overflow-y:hidden;">
        <v-toolbar card dark color="black">
          <v-btn icon @click.native="consoleDialog = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Console: {{ container.info && container.info.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="consoleDialog = false">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-btn color="green" @click="stateContainer({action:'console'}, container.info)" v-if="reconnect">Reconnect</v-btn>
        <div id="terminal"></div>
      </v-dialog>

      <v-dialog v-model="containerDialog" max-width="750px" scrollable v-if="container.info">
        <v-card tile>
          <v-toolbar card dark color="light-blue darken-3">
            <v-btn icon @click.native="containerDialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Container: {{ container.state && container.state.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="activeTab !== 'tab-snapshots' && activeTab !== 'tab-devices' && activeTab !== 'tab-idmap' && activeTab !== 'tab-sshkeys'">
              <v-btn dark flat @click.native="saveContainer()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="padding: 0px;">
            <v-tabs v-model="activeTab" show-arrows>
              <v-tab ripple :href="`#tab-configuration`">Configuration</v-tab>
              <v-tab ripple :href="`#tab-devices`">Devices</v-tab>
              <v-tab ripple :href="`#tab-idmap`">ID Map</v-tab>
              <v-tab ripple :href="`#tab-sshkeys`">SSH Keys</v-tab>
              <v-tab ripple :href="`#tab-snapshots`">Snapshots</v-tab>
              <v-tab-item :id="`tab-configuration`" v-if="container.info">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy v-if="container.info.config">
                      <v-alert type="error" :value="error.editing">
                        {{ error.editing }}
                      </v-alert>
                      <h2>General</h2>
                      <v-layout row wrap style="margin-top:-20px">
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <v-text-field v-model="container.info.name" label="Name" :rules="nameRule" @input="container.info.name = safe_name(container.info.name)" required :disabled="container.state.status !== 'Stopped'" :persistent-hint="container.state.status !== 'Stopped'" :hint="`${container.state.status !== 'Stopped' ? 'Container must be stopped to rename.' : 'Enter name for container.'}`"></v-text-field>
                            <v-select :items="profiles" :rules="profilesRule" v-model="container.info.profiles" label="Profiles" multiple chips required></v-select>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-4">
                            <v-layout row wrap>
                              <v-flex xs6>
                                <h4>Auto Start</h4>
                                <v-switch :label="`${container.info.config['boot.autostart'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="container.info.config['boot.autostart']"></v-switch>
                              </v-flex>
                              <v-flex xs6>
                                <h4>Ephemeral</h4>
                                <v-switch :label="`${container.info.ephemeral ? 'Yes' : 'No'}`" color="success" v-model="container.info.ephemeral"></v-switch>
                              </v-flex>
                           </v-layout>
                           <v-layout row wrap>
                              <v-flex xs6>
                                <h4>Privileged</h4>
                                <v-switch :label="`${container.info.config['security.privileged'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="container.info.config['security.privileged']"></v-switch>
                              </v-flex>
                              <v-flex xs6>
                                <h4>Nesting</h4>
                                <v-switch :label="`${container.info.config['security.nesting'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="container.info.config['security.nesting']"></v-switch>
                              </v-flex>
                           </v-layout>
                         </v-card-text>
                        </v-flex>
                      </v-layout>
                      <h2 style="margin-top:-15px">CPU</h2>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">CPU Cores ({{ container.info.config['limits.cpu'] }})</h4>
                            <v-slider v-model="container.info.config['limits.cpu']" thumb-label :max="max_cpu" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">Max Processes ({{ container.info.config['limits.processes'] }})</h4>
                            <v-slider v-model="container.info.config['limits.processes']" thumb-label max="20000" step="100" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">CPU Allowance ({{ container.info.config['limits.cpu.allowance'] }}%)</h4>
                            <v-slider v-model="container.info.config['limits.cpu.allowance']" thumb-label max="100" step="1" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">CPU Priority ({{ container.info.config['limits.cpu.priority'] }}/10)</h4>
                            <v-slider v-model="container.info.config['limits.cpu.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                      <h2 style="margin-top:-15px">Memory</h2>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Memory ({{ container.info.config['limits.memory'] }}MB)</h4>
                            <v-slider v-model="container.info.config['limits.memory']" :max="max_memory" thumb-label step="64" ticks></v-slider>
                            <h4 style="margin-bottom:-20px">Swap Priority ({{ container.info.config['limits.memory.swap.priority'] }}/10)</h4>
                            <v-slider v-model="container.info.config['limits.memory.swap.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4>Enforce</h4>
                            <v-switch :label="`${container.info.config['limits.memory.enforce'] === 'hard' ? 'Hard' : 'Soft'}`" true-value="hard" false-value="soft" color="success" v-model="container.info.config['limits.memory.enforce']"></v-switch>
                            <h4>Swap</h4>
                            <v-switch :label="`${container.info.config['limits.memory.swap'] === '1' ? 'Yes' : 'No'}`" true-value="1" false-value="0" color="success" v-model="container.info.config['limits.memory.swap']"></v-switch>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <h2>Disk</h2>
                        </v-flex>
                        <v-flex xs6>
                          <h2>Network</h2>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Priority ({{ container.info.config['limits.disk.priority'] }}/10)</h4>
                            <v-slider v-model="container.info.config['limits.disk.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                        <v-flex xs6>
                          <v-card-text class="px-1">
                            <h4 style="margin-bottom:-20px">Priority ({{ container.info.config['limits.network.priority'] }}/10)</h4>
                            <v-slider v-model="container.info.config['limits.network.priority']" thumb-label max="10" step="1" ticks></v-slider>
                          </v-card-text>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-devices`">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <v-tabs v-model="activeDeviceTab" show-arrows>
                    <v-tab ripple :href="`#none`">None</v-tab>
                    <v-tab ripple :href="`#nic`">Nic</v-tab>
                    <v-tab ripple :href="`#disk`">Disk</v-tab>
                    <v-tab ripple :href="`#unixchar`">Unix-char</v-tab>
                    <v-tab ripple :href="`#unixblock`">Unix-block</v-tab>
                    <v-tab ripple :href="`#usb`">USB</v-tab>
                    <v-tab ripple :href="`#gpu`">GPU</v-tab>
                    <v-tab ripple :href="`#proxy`">Proxy</v-tab>
                    <v-tab ripple :href="`#infiniband`">InfiniBand</v-tab>
                    <v-tab-item :id="`none`" v-if="container.info">
                      <none @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></none>
                    </v-tab-item>
                    <v-tab-item :id="`nic`" v-if="container.info">
                      <nic @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></nic>
                    </v-tab-item>
                    <v-tab-item :id="`disk`" v-if="container.info">
                      <disk @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></disk>
                    </v-tab-item>
                    <v-tab-item :id="`unixchar`" v-if="container.info">
                      <unixchar @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></unixchar>
                    </v-tab-item>
                    <v-tab-item :id="`unixblock`" v-if="container.info">
                      <unixblock @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></unixblock>
                    </v-tab-item>
                    <v-tab-item :id="`usb`" v-if="container.info">
                      <usb @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></usb>
                    </v-tab-item>
                    <v-tab-item :id="`gpu`" v-if="container.info">
                      <gpu @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></gpu>
                    </v-tab-item>
                    <v-tab-item :id="`proxy`" v-if="container.info">
                      <proxy @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></proxy>
                    </v-tab-item>
                    <v-tab-item :id="`infiniband`" v-if="container.info">
                      <infiniband @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></infiniband>
                    </v-tab-item>
                  </v-tabs>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-idmap`">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <idmap @snackbar="setSnackbar" @initialize="initialize" :key="container.info.name" :linked="container.info"></idmap>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-sshkeys`">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <ssh-keys @snackbar="setSnackbar" :key="container.info.name" :linked="container.info"></ssh-keys>
                </v-card>
              </v-tab-item>
              <v-tab-item :id="`tab-snapshots`">
                <v-card flat style="overflow-x:hidden; overflow-y: auto; height:calc(100vh - 215px);">
                  <snapshots :item="container" :key="container.info.name" @snackbar="setSnackbar"></snapshots>
                </v-card>
              </v-tab-item>
            </v-tabs>
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
  // components
  import snapshots from '~/components/lxd/snapshots.vue'
  // devices components
  import none from '~/components/lxd/devices/none.vue'
  import nic from '~/components/lxd/devices/nic.vue'
  import disk from '~/components/lxd/devices/disk.vue'
  import proxy from '~/components/lxd/devices/proxy.vue'
  import infiniband from '~/components/lxd/devices/infiniband.vue'
  import gpu from '~/components/lxd/devices/gpu.vue'
  import usb from '~/components/lxd/devices/usb.vue'
  import unixchar from '~/components/lxd/devices/unixchar.vue'
  import unixblock from '~/components/lxd/devices/unixblock.vue'
  import idmap from '~/components/lxd/devices/idmap.vue'
  import sshKeys from '~/components/lxd/ssh-keys.vue'

  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'
  import helpers from '~/utils/helpers'

  const container = require('~/components/lxd/container')

  var xterm;

  export default {
    mixins: [helpers],
    middleware: [
      'authenticated'
    ],
    components: {
      snapshots, none, nic, disk, proxy, infiniband, gpu, usb, unixchar, unixblock, idmap, sshKeys
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'New Container' : 'Edit Container'
      },
      max_memory: function () {
        return this.resources.memory.total / 1000 / 1000
      },
      max_cpu: function () {
        return Number(this.resources.cpu.total)
      },
      all_stopped: function (){
        var state = this.items.filter(item => {
          return item.status === 'Stopped';
        })
        return state.length === this.items.length
      },
      all_running: function (){
        var state = this.items.filter(item => {
          return item.status === 'Running';
        })
        return state.length === this.items.length
      },
      private_remotes: function () {
        return this.remotes.filter(row => {
          if (this.publicServers.includes(row) || row === this.activeRemote) {
            return false
          }
          return row
        })
      }
    },
    data: () => ({
      valid: true,

      //
      alert: { msg: '', outline: false, color: 'info', icon: 'info' },
      error: { editing: false },

      // snackbar (notification)
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000,

      publicServers: ['images', 'ubuntu', 'ubuntu-daily'],

      // table & items
      items: [],
      profiles: [],
      remotes: [],
      resources: {
        cpu: {
          total: 0
        },
        memory: {
          total: 0
        }
      },
      editingIndex: -1,

      tableLoading: true,
      tableNoData: 'You have not added any containers.',
      tableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'IP', value: 'ip' },
        { text: 'CPU', value: 'cpu.usage' },
        { text: 'Processes', value: 'processes' },
        { text: 'Memory', value: 'memory.usage' },
        { text: 'Network (In/Out)', value: 'network' },
        { text: 'Status', value: 'status' },
        { text: 'Attributes', value: 'attributes', sortable: false },
        { text: 'Actions', value: 'name', sortable: false, align: 'center', width:'50px' }
      ],

      // new container item
      newItem: {
        name: '',
        image: '',
        profile: ['default'],
        ephemeral: false
      },
      defaultItem: {
        name: '',
        image: '',
        profile: ['default'],
        ephemeral: false
      },
      copy: {
        remote: '',
        name: '',
        name_alt: ''
      },

      // tab
      activeTab: 'tab-configuration',
      activeDeviceTab: 'none',

      dialog: false,
      copyDialog: false,
      consoleDialog: false,
      containerDialog: false,
      newContainerDialog: false,
      containerActions: [
        { title: 'Console',  action: 'console', msg: '', state: 'Running' },
        { title: 'Start',  action: 'start', msg: 'Starting', state: 'Stopped' },
        { title: 'Stop',   action: 'stop', msg: 'Stopping', state: 'Running' },
        { title: 'Delete', action: 'delete', msg: 'Deleting', state: 'Stopped' },
        { title: 'Freeze', action: 'freeze', msg: 'Freezing', state: 'Running' },
        { title: 'Thaw', action: 'unfreeze', msg: 'Thawing', state: 'Frozen' },
        { title: 'Restart', action: 'restart', msg: 'Restarting', state: 'Running' },
        { title: 'Snapshot', action: 'snapshot', msg: 'Snapshotting' },
        { title: 'Copy', action: 'copy', msg: 'Copying', state: 'Stopped' },
        { title: 'Image', action: 'image', msg: 'Imaging', state: 'Stopped' }
      ],

      websocket: null,
      reconnect: false,

      container: container.empty(),
      nameRule: [
        v => !!v || 'Name is required.',
        v => (v && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(v)) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.',
        v => (v && isNaN(v.charAt(0))) || 'Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.'
      ],
      profilesRule: [
        v => v.length >= 1 || 'At least one profile is required.'
      ],
      remoteRule: [
        v => !!v || 'Remote is required.'
      ],
      pollItem: 0
    }),
    beforeDestroy: function() {
      this.stopPolling()
    },
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

      this.$nextTick(() => {
        this.initialize()
        this.getResources()
        this.getRemotes()
      })
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      containerDialog (val) {
        val || this.close()
      },
      consoleDialog (val) {
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
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers')
          this.items = response.data.data

          // if no containers dont poll
          if (this.items.length === 0) {
            this.stopPolling()
          } else {
            this.startPolling()
          }
        } catch (error) {
          this.items = [];
          this.tableNoData = 'No data.';
          this.alert = { msg: 'Could not fetch data from server.', outline: false, color: 'error', icon: 'error' };
        }
        this.tableLoading = false
      },

      stopPolling() {
        clearInterval(this.pollId);
      },

      startPolling() {
        this.stopPolling()
        this.pollId = setInterval(function () {
          this.initialize()
        }.bind(this), 10000);
      },

      async getRemotes () {
        // fetch remote
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          var response = await axios.get(this.loggedUser.sub + '/api/lxd/images/remotes')
          this.remotes = response.data.data

          //
        } catch (error) {
          this.tableNoData = 'No data.';
          this.error = 'Could not fetch data from server.';
        }
      },

      async getResources () {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/resources')

          this.resources = response.data.data

        } catch (error) {
          this.resources = {};
        }
      },

      async getProfiles () {
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/profiles')

          this.profiles = []
          response.data.data.forEach(item => {
            this.profiles.push(item.name);
          });

        } catch (error) {
          this.profiles = [];
        }
      },

      startAll() {
        this.stopPolling()
        var timer = 0;
        this.items.forEach((item) => {
          if (item.status === 'Stopped') {
            setTimeout(() => {
              item.status = 'Starting';
              axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
                "action": 'start',
                "timeout": 30,
                "force": true,
                "stateful": false
              })
            }, timer)
            timer = timer+500
          }
        })

        setTimeout(() => {
          this.startPolling()
        }, timer);
      },

      stopAll() {
        this.stopPolling()
        var timer = 0;
        this.items.forEach((item) => {
          if (item.status === 'Running') {
            setTimeout(() => {
              item.status = 'Stopping';
              axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
                "action": 'stop',
                "timeout": 30,
                "force": true,
                "stateful": false
              })
            }, timer)
            timer = timer+500
          }
        })
        setTimeout(() => {
          this.startPolling()
        }, timer);
      },

      restartAll() {
        this.stopPolling()
        var timer = 0;
        this.items.forEach((item) => {
          if (item.status === 'Running') {
            setTimeout(() => {
              item.status = 'Restarting';
              axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
                "action": 'restart',
                "timeout": 30,
                "force": true,
                "stateful": false
              })
            }, timer)
            timer = timer+500
          }
        })
        setTimeout(() => {
          this.startPolling()
        }, timer);
      },

      async stateContainer (action, item) {
        this.stopPolling()
        // intercept console
        if (action.action === 'console') {
          this.reconnect = false
          this.consoleDialog = true;
          setTimeout(() => {
            this.console(item)
          }, 500)
          return
        }
        // intercept snapshot
        if (action.action === 'snapshot') {
          this.container = {
            state: item,
            info: {name: item.name}
          }
          this.snapshotContainer(item, false)
          return
        }
        // intercept copy
        if (action.action === 'copy') {
          this.copyContainer(item, false)
          return
        }
        // intercept image
        if (action.action === 'image') {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/' + item.name)

          this.container = {
            state: item,
            info: container.infix(response.data.data),
          }

          this.imageContainer(this.container, false)
          return
        }
        // intercept delete
        if (action.action === 'delete') {
          this.deleteContainer(item)
          return
        }
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/state', {
              "action": action.action,
              "timeout": 30,
              "force": true,
              "stateful": false
          })

          //
          this.snackbar = true;
          this.snackbarTimeout = 2500
          this.snackbarText = action.msg + ' container.';

          setTimeout(() => this.initialize(), 2500)
        } catch (error) {
          this.alert = { msg: 'Could not fetch data from server.', outline: false, color: 'error', icon: 'error' };
        }
      },

      check_started_with_ip (container) {
        return (
          container.state &&
          container.state.network &&
          container.state.network.eth0 &&
          container.state.network.eth0.addresses.length > 0 &&
          container.status === 'Running' &&
          this.isIP4(container.state.network.eth0.addresses[0].address)
        )
      },

      safe_name(name) {
        return name.replace(".", "-");
      },

      setSnackbar (msg) {
        //
        this.snackbar = true;
        this.snackbarTimeout = 2500
        this.snackbarText = msg;
      },

      console (item) {
        //
        if (xterm) {
          xterm.destroy()
        }
        if (this.websocket !== null) {
          this.websocket.close()
        }

        var width = 100
        var height = 80

        // bash in everything except Alpine which uses Ash
        let command
        if (item.config['image.os'] && item.config['image.os'] === 'Alpine') {
          command = 'ash'
        } else {
          command = 'bash'
        }

        var tmp = document.createElement ('a')
        tmp.href = this.loggedUser.sub

        //
        const response = axios.post(this.loggedUser.sub + '/api/lxd/containers/' + item.name + '/exec', {
          'command': [command],
          'environment': {
            'HOME': '/root',
            'TERM': 'xterm',
            'USER': 'root'
          },
          'wait-for-websocket': true,
          'interactive': true,
          'width': width,
          'height': height
        }).then(response => {

          response = response.data.data
          //
          Terminal.applyAddon(fit)
          xterm = new Terminal({
            useStyle: true,
            screenKeys: false,
            cursorBlink: true
          })

          //
          var operationId = response.id
          var secret = response.metadata.fds[0]
          var wssurl = 'wss://'+tmp.hostname+':8443/1.0/operations/' + operationId + '/websocket?secret=' +secret

          //
          this.websocket = new WebSocket(wssurl)
          this.websocket.binaryType = 'blob'
          this.websocket.rejectUnauthorized = false

          this.websocket.onopen = e => {
            //
            var previousResponse = null
            //
            xterm.open(document.getElementById('terminal'))

            window.addEventListener('resize', function (e) {
              var height = Math.max(Math.round(window.innerHeight / 19.50), 15)
              xterm.resize(0, height)
              xterm.fit()
            })

            height = Math.max(Math.round(window.innerHeight / 19.50), 15)
            xterm.resize(0, height)
            xterm.fit()

            //
            xterm.on('data', data => {
              this.websocket.send(new Blob([data]))
            })

            //
            this.websocket.onmessage = function (msg) {
              var reader = new FileReader();
              reader.addEventListener("loadend", () => {
                msg = reader.result
                if (previousResponse !== null && previousResponse.trim() === 'exit' && msg.trim() === '') {
                  xterm.destroy()
                  this.websocket.close()
                }
                previousResponse = msg
                xterm.write(msg)
              })
              if (msg.data) {
                reader.readAsText(msg.data)
              }
              xterm.fit()
            }

            //
            this.websocket.onclose = msg => {
              xterm.destroy()
              //
              this.snackbar = true
              this.snackbarTimeout = 5000
              this.snackbarColor = 'green'
              this.snackbarText = 'Websocket connection closed.'
              this.reconnect = true
              this.startPolling()
            }
          }

          this.websocket.onerror = e => {
            //
            this.snackbar = true
            this.snackbarTimeout = 10000
            this.snackbarColor = 'red'
            this.snackbarText = 'Websocket connection failed, you must visit https://'+tmp.hostname+':8443 to accept the SSL certificate.'
            setTimeout(() => {
              this.snackbarColor = 'green'
              this.startPolling()
            }, 11000)
          }
        }).catch(error => {
          //
          this.snackbar = true
          this.snackbarTimeout = 5000
          this.snackbarColor = 'red'
          this.snackbarText = 'Websocket connection failed.'
          setTimeout(() => {
            this.snackbarColor = 'green'
            this.startPolling()
          }, 6000)
        })
      },

      editContainer (item, openDialog = true) {
        this.stopPolling()
        this.$nextTick(async () => {
          this.getProfiles()
          this.editingIndex = this.items.indexOf(item)
          //
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            //
            const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/' + item.name)

            this.$set(this.container, 'state', item)
            this.$set(this.container, 'info', container.infix(response.data.data))

          } catch (error) {
            this.alert = { msg: 'Could not fetch data from server.', outline: false, color: 'error', icon: 'error' };
          }
        })
        this.containerDialog = openDialog
      },

      async saveContainer () {
        this.stopPolling()
        if (this.$refs.form.validate()) {

          // remote
          try {
            if (!this.loggedUser) {
              this.$router.replace('/servers')
            }

            // rename
            if (this.container.info.name !== this.container.state.name) {
              var response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/' + this.container.state.name, {
                name: this.container.info.name
              })
              // update name
              this.$set(this.container.state, 'name', this.container.info.name)
            }

            this.container.info = container.outfix(this.container.info)

            //
            var response = await axios.put(this.loggedUser.sub + '/api/lxd/containers/' + this.container.info.name, {
              config: JSON.parse(JSON.stringify(this.container.info.config)),
              devices: JSON.parse(JSON.stringify(this.container.info.devices)),
              ephemeral: this.container.info.ephemeral,
              stateful: this.container.info.stateful,
              profiles: this.container.info.profiles
            })

            // check errors
            if (response.data.code === 422) {
              this.error.editing = response.data.error
            } else {
              //
              this.snackbar = true;
              this.snackbarText = 'Container '+this.container.info.name+' configuration saved.'
              this.startPolling()
            }
          } catch (error) {
            this.error.editing = 'Could not save container configuration.'
          }
        }
      },

      // create or edit item
      copyContainer (item, execute) {
        this.stopPolling()
         if (!execute) {
          this.copyIndex = this.items.indexOf(item)
          this.copy = Object.assign({}, this.copy, item)
          this.copy.name_alt = this.copy.name
          this.copyDialog = true
        } else {
          if (this.$refs.form.validate() && this.valid) {
            axios.post(this.loggedUser.sub + '/api/lxd/containers/'+this.copy.name+'/copy', this.copy).then(response => {
              if (response.data.code === 200) {
                //
                this.snackbar = true
                this.snackbarText = 'Container copied from local to '+this.copy.remote+'.'
              } else {
                //
                this.snackbar = true
                this.snackbarColor = 'red'
                this.snackbarText = response.data.error
                setTimeout(() => {
                  this.snackbarColor = 'green';
                }, 5000)
              }
            }).catch(error => {
              this.error = 'Could not copy container.'
            })

            //
            this.snackbar = true;
            this.snackbarText = 'Container queued for copy.';
            this.copyDialog = false
            setTimeout(() => {
              this.startPolling()
            }, 1000)
          }
        }
      },

      newContainer() {
        this.newContainerDialog = true
      },

      async snapshotContainer (item) {
        this.stopPolling()
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          let response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/'+ item.name +'/snapshots', {
              name: new Date().toISOString(),
              stateful: false
          })

          this.setSnackbar('Snapshotting container.')

          setTimeout(() => {
            this.startPolling()
          }, 1000)

        } catch (error) {
          this.alert = { msg: 'Could not snapshot container.', outline: false, color: 'error', icon: 'error' }
        }
      },

      async imageContainer (item) {
        this.stopPolling()
        //
        try {
          if (!this.loggedUser) {
            this.$router.replace('/servers')
          }

          //
          const response = await axios.post(this.loggedUser.sub + '/api/lxd/images', {
            source: {
              type: 'container',
              name: item.info.name
            },
            public: false,
            properties: {
              description: item.info.name,
              label: (item.info.config['image.label'] ? item.info.config['image.label'] : ''),
              architecture: (item.info.config['image.architecture'] ? item.info.config['image.architecture'] : ''),
              build: new Date(),
              distribution: (item.info.config['image.distribution'] ? item.info.config['image.distribution'] : ''),
              os: (item.info.config['image.os'] ? item.info.config['image.os'] : ''),
              release: (item.info.config['image.release'] ? item.info.config['image.release'] : ''),
              version: (item.info.config['image.version'] ? item.info.config['image.version'] : '')
            },
            auto_update: false
          })

          this.setSnackbar('Imaging container.')

          setTimeout(() => {
            this.startPolling()
          }, 1000)

        } catch (error) {
          this.alert = { msg: 'Could not image container.', outline: false, color: 'error', icon: 'error' }
        }
      },

      deleteContainer (item) {
        this.stopPolling()
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete container?',
          text: 'Are you sure you want to delete the <b>'+item.name+'</b> container?<p class="text-md-center red--text"><br><b>This action cannot be undone!</b></p>',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => {
                const index = this.items.indexOf(item)
                this.items.splice(index, 1)

                try {
                  if (!this.loggedUser) {
                    this.$router.replace('/servers')
                  }

                  //
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/containers/' + item.name)

                  this.setSnackbar('Container deleted.')

                  setTimeout(() => {
                    this.startPolling()
                  }, 1000)
                } catch (error) {
                  this.alert = { msg: 'Could not delete container.', outline: false, color: 'error', icon: 'error' }
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

      close () {
        if (xterm) {
          xterm.destroy()
        }
        if (this.websocket !== null) {
          this.websocket.close()
        }
        setTimeout(() => {
          this.newItem = Object.assign({}, this.defaultItem)
          this.container = container.empty();
          this.snackbarColor = 'green'
        }, 300)
        this.startPolling()
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
  .dialog--fullscreen {
    background-color: #000!important;
    overflow:hidden;
  }
  .terminal {
      background-color: #000!important;
      color: #fff;
      font-family: courier-new, courier, monospace !important;
      font-feature-settings: "liga" 0;
      font-size: 15px !important;
  }
  #terminal {
    background-color: #000 !important;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 65px);
    padding-left: 5px;
  }

  .tags:last-child {
    margin-bottom: -.5rem;
  }

  .tags {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .tags.has-addons .tag:not(:last-child) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .tags.has-addons .tag {
    margin-right: 0;
  }

  .tags .tag:not(:last-child) {
    margin-right: .5rem;
  }

  .tag:not(body).is-off {
    background-color: #f5f5f5;
    color: #363636;
  }

  .tag:not(body).is-on {
    background-color: #DCEDC8;
    color: #363636;
  }


  .tags .tag {
    margin-bottom: .5rem;
  }

  .tags.has-addons .tag:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .tags.has-addons .tag {
    margin-right: 3px;
  }

  .tag:not(body) {
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #4a4a4a;
    display: inline-flex;
    font-size: .75rem;
    height: 2em;
    justify-content: center;
    line-height: 1.5;
    padding-left: .75em;
    padding-right: .75em;
    white-space: nowrap;
  }
</style>
