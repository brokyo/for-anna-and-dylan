<template>
  <div>
    <h3>Synth</h3>
  </div>
</template>
<script>
  export default {
    props: ['Tone', 'preset'],
    data() {
      return {
        node: {}
      }
    },
    created () {
      this.node = new this.Tone.PolySynth()
    }
  }
</script>
<style>
</style>