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
                LXD - Devices
                <v-btn color="success" @click="openDialog()" style="float:right">New {{ activeTab }}</v-btn>
              </v-flex>
              <v-flex>
                <p v-if="activeTab === 'none'">A none device type doesn't create anything inside the container. It's purpose it to stop inheritance of devices coming from profiles.</p>
                <p v-if="activeTab === 'nic'">LXD supports different kind of network devices. From straight physical device passthroughs from the host to virtual device pairs and bridges.</p>
                <p v-if="activeTab === 'disk'">Disk entries are mountpoints inside the container. They can either be a bind-mount of an existing file or directory on the host, or if the source is a block device, a regular mount.</p>
                <p v-if="activeTab === 'unix-char'">Unix character device entries allow character devices to appear in container's /dev and allow read/write operations to it.</p>
                <p v-if="activeTab === 'unix-block'">Unix block device entries allow block devices to appear in the container's /dev and allow read/write operations to it.</p>
                <p v-if="activeTab === 'usb'">USB device entries allow USB devices to appear in the container.</p>
                <p v-if="activeTab === 'gpu'">GPU device allow GPU devices to appear in the container.</p>
                <p v-if="activeTab === 'proxy'">Proxy devices allow forwarding network connections between host and container. This makes it possible to forward traffic hitting one of the host's addresses to an address inside the container or to do the reverse and have an address in the container connect through the host.</p>
                <p v-if="activeTab === 'infiniband'">LXD supports two different kind of network types for infiniband devices, Straight physical device passthrough from the host and virtual function of an SR-IOV.</p>
                
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>

                <v-tabs v-model="activeTab" show-arrows class="elevation-1">
                  <v-tab ripple :href="`#none`">None</v-tab>
                  <v-tab ripple :href="`#nic`">Nic</v-tab>
                  <v-tab ripple :href="`#disk`">Disk</v-tab>
                  <!--<v-tab ripple :href="`#unix-char`">Unix-char</v-tab>-->
                  <!--<v-tab ripple :href="`#unix-block`">Unix-block</v-tab>-->
                  <!--<v-tab ripple :href="`#usb`">USB</v-tab>-->
                  <v-tab ripple :href="`#gpu`">GPU</v-tab>
                  
                  <v-tab ripple :href="`#proxy`">Proxy</v-tab>
                  <v-tab ripple :href="`#infiniband`">InfiniBand</v-tab>
                  
                  <!--<v-tab-item :id="`blocker`">blocker</v-tab-item>-->
                  <v-tab-item :id="`none`">
                    <none @snackbar="setSnackbar" ref="none"></none>
                  </v-tab-item>
                  <v-tab-item :id="`nic`">
                    <nic @snackbar="setSnackbar" ref="nic"></nic>
                  </v-tab-item>
                  <v-tab-item :id="`disk`">
                    <disk @snackbar="setSnackbar" ref="disk"></disk>
                  </v-tab-item>
                  <v-tab-item :id="`gpu`">
                    <gpu @snackbar="setSnackbar" ref="gpu"></gpu>
                  </v-tab-item>
                  <!--<v-tab-item :id="`unix-char`">unix-char</v-tab-item>-->
                  <!--<v-tab-item :id="`unix-block`">unix-block</v-tab-item>-->
                  <!--<v-tab-item :id="`usb`">usb</v-tab-item>-->
                  <!--<v-tab-item :id="`gpu`">gpu</v-tab-item>-->
                  <!--<v-tab-item :id="`infiniband`">infiniband</v-tab-item>-->
                  <v-tab-item :id="`proxy`">
                    <proxy @snackbar="setSnackbar" ref="proxy"></proxy>
                  </v-tab-item>
                  <v-tab-item :id="`infiniband`">
                    <infiniband @snackbar="setSnackbar" ref="infiniband"></infiniband>
                  </v-tab-item>
                  <!--<v-tab-item :id="`proxy`">proxy</v-tab-item>-->
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
  // components
  import none from '~/components/lxd/devices/none.vue'
  import nic from '~/components/lxd/devices/nic.vue'
  import disk from '~/components/lxd/devices/disk.vue'
  import proxy from '~/components/lxd/devices/proxy.vue'
  import infiniband from '~/components/lxd/devices/infiniband.vue'
  import gpu from '~/components/lxd/devices/gpu.vue'

  export default {
    components: {
      none, nic, disk, proxy, infiniband, gpu
    },
    data: () => ({
      error: '',
      activeTab: 'none',
      snackbar: false,
      snackbarColor: 'green',
      snackbarText: '',
      snackbarTimeout: 5000
    }),
    methods: {
      // set snackbar (invoked from components)
      setSnackbar (msg) {
        this.snackbar = true
        this.snackbarTimeout = 2500
        this.snackbarText = msg
      },
      
      // set error (invoked from components)
      setError (msg) {
        this.error = msg
      },
      
      openDialog () {
        this.$refs[this.activeTab].openDialog()
      }
    }
  }
</script>

<style>

</style>
