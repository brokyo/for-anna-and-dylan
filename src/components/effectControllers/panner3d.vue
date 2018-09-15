<template>
  <div>
    <h3>3D Panner</h3>
    <label>X Position</label>
    <input 
      type="range"
      v-model.number="config.positionX"
      min="-5"
      max="5"
      step="0.05"
    />
    <label>Y Position</label>
    <input 
      type="range"
      v-model.number="config.positionY"
      min="-5"
      max="5"
      step="0.05"
    />
    <label>Z Position</label>
    <input 
      type="range"
      v-model.number="config.positionZ"
      min="-5"
      max="5"
      step="0.05"
    />
  </div>
</template>
<script> 
export default {
  props: ['Tone', 'preset'],
  data() {
    return {
      node: {},
      config: {
        positionX: 0,
        positionY: 0,
        positionZ: 0
      }
    }
  },
  watch: {
    config: {
      handler() {
        this.node.set(this.config)
      },
      deep: true
    }
  },
  mounted() {
    this.node = new this.Tone.Panner3D
  }
}
</script>
<style>
</style>