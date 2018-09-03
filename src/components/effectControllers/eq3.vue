<template>
    <div id="eq3" class="patchConfig">
        <div class="config-label">
            <label>eq</label>
        </div>
        <div class="config">
            <label>Low</label>
            <input
                v-model="config.low"
                type="range"
                max="0"
                min="-30"
            />
            <label>Medium</label>
            <input
                v-model="config.mid"
                type="range"
                max="0"
                min="-30"
            />
            <label>High</label>
            <input
                v-model="config.high"
                type="range"
                max="0"
                min="-30"
            />
        </div>
        <p class="code">
            {
            	low: {{config.low}},
            	mid: {{config.mid}},
            	high: {{config.high}}
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
    this.node = new this.Tone.EQ3(this.config);
  }
};
</script>
<style>
</style>
