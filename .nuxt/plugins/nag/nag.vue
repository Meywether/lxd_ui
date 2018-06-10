<template>
  <v-dialog v-model="dialog" max-width="510px" persistent>
    <v-card tile>
      <v-toolbar card dark color="blue darken-4">
        <v-toolbar-title>Help support this project!</v-toolbar-title>
      </v-toolbar>
      <v-card-text style="padding: 0px;">
        <v-card flat>
          <v-card-text v-if="!thanks">
            If you enjoy using this full featured LXD control panel and would like to see it continuously developed, please consider making a small donation.<br>
            <p class="text-md-center red--text"><br><b>You wont be asked again if you choose no.</b></p>
          </v-card-text>
          <v-card-text v-else>
            <h3 class="text-md-center green--text"><b>Thank you!</b></h3>
            <p class="text-md-center">Your support will help continue the development of this project.</p>
            <p class="text-md-center">Please wait one moment whilst you're redirected to paypal.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="donate()" :disabled="thanks">Donate</v-btn>
            <v-btn color="red darken-1" flat @click.native="close()" :disabled="thanks">No thanks</v-btn>
        </v-card-actions>
        </v-card>
      </v-card-text>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>
  import prompt from '~/plugins/nag/nag.js'

  export default {
    computed: {},
    data: () => ({
      dialog: false,
      thanks: false,
      nagPoll: 0,
      nagTrigger: 1000*60*10
    }),
    mounted () {
      if (!this.$storage.isset('support')) {
        this.startTimer()
        window.onmousemove = event => {
          this.restartTimer()
        }
      }
    },
    beforeDestroy: function() {
      this.stopTimer()
    },
    methods: {
      startTimer() {
        this.nagPoll = setInterval(() => {
          this.dialog = true;
          this.stopTimer()
        }, this.nagTrigger);
      },
      stopTimer() {
        clearInterval(this.nagPoll)
      },
      restartTimer() {
        this.stopTimer()
        this.startTimer()
      },
      close() {
        this.nagTrigger = this.nagTrigger * 2
        this.setSupport(false)
        setTimeout(() => {
          window.location.reload();
        }, 0)
      },
      donate() {
        this.thanks = true
        setTimeout(() => {
          window.location = 'https://www.paypal.me/lcherone'
        }, 3500)
        this.setSupport(true)
      },
      setSupport(v) {
        this.$storage.set('support', v)
      }
    }
  }
</script>

<style>

</style>
