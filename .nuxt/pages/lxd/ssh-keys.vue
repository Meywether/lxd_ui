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
                    LXD - SSH Keys
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn small color="success" @click="openDialog()" style="float:right">New SSH Key</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <p>SSH keys allow you to login to the containers using a standard SSH client.</p>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-card>
                  <v-card-text style="padding:0">
                    <ssh-keys @snackbar="setSnackbar" ref="none"></ssh-keys>
                  </v-card-text>
                </v-card>
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
  import sshKeys from '~/components/lxd/ssh-keys.vue'

  export default {
    components: {
      sshKeys
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
