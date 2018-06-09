<template>
  <div></div>
</template>

<script>
  import { unsetToken } from '~/utils/auth'
  export default {
    mounted () {
      unsetToken()
      
      // remove lxd info from storage
      if (this.$storage.isset('lxd')) {
        this.$storage.remove('lxd')
      }

      this.$router.replace('/')
    }
  }
</script>

<style>
  html {
    background: #dddddd;
    height: 100%
  }
</style>