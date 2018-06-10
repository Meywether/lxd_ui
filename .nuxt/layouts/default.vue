<template>
  <v-app>
    <main-nav/>
    <nuxt/>
    <prompt/>
    <nag/>
  </v-app>
</template>

<script>
  import MainNav from '~/components/MainNav.vue'
  
  export default {
    components: {
      MainNav
    }
  }
</script>

<style>
  
</style>
