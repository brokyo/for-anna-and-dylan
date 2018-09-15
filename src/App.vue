<template>
  <div id="app">
    <h1>Waves</h1>
    <router-view />
  </div>
</template>
<script>
  import wavesNav from '@/components/header.vue'

  export default {
    components: {
      'waves-nav': wavesNav
    }
  }
</script>
<style lang="scss">

</style>
