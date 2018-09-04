<template>
    <div id="reverb" class="patchConfig">
        <div class="config-label">
            <label>reverb</label>
        </div>
        <div class="config">
            <label>Room Size</label>
            <input
                v-model="config.roomSize"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Dampening</label>
            <input
                v-model="config.dampening"
                type="range"
                min="0"
                max="2000"
            />
        </div>
        <p class="code">
            {
                roomSize: {{config.roomSize}},
                dampening: {{config.dampening}}                
            }
        </p>
    </div>
</template>
<script>
export default {
  props: ['Tone', 'config'],
  data() {
    return {
        node: {}
    }
  },
  watch:{
    config: {
        handler() {
            this.node.set(this.config)
        },
        deep: true
    }
  },
  mounted() {
    this.node = new this.Tone.Freeverb(this.config);
  }
};
</script>
<style>
</style>
