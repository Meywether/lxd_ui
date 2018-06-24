<template>
  <v-app>
    <navigation/>
    <nuxt/>
    <prompt/>
    <nag/>
  </v-app>
</template>

<script>
  import navigation from '~/components/navigation.vue'
  
  export default {
    components: {
      navigation
    }
  }
</script>
