<template>
    <div id="tremolo" class="patchConfig">
        <div class="config-label">
            <label>tremolo</label>
        </div>
        <div class="config">
            <label>Audibility</label>
            <input
                v-model.number="config.wet"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Frequency</label>
            <input
                v-model.number="config.frequency"
                type="range"
                min="0.1"
                max="10"
                step="0.25"
            />
            <label>Depth</label>
            <input
                v-model.number="config.depth"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Oscillator</label>
            <select v-model="config.type">
                <option v-for="oscillator in oscillatorArray">{{oscillator}}</option>
            </select>
            <label>Spread</label>
            <input
                v-model.number="config.spread"
                type="range"
                min="0"
                max="180"
                step="1"
            />
        </div>
        <p class="code">
            {
                wet: {{config.wet}},
                frequency: {{config.frequency}},
                depth: {{config.depth}},
                spread: {{config.spread}}                
            }
        </p>
    </div>
</template>
<script>
export default {
  props: ['config', 'Tone'],
  data() {
    return {
        oscillatorArray: ['sine', 'square', 'sawtooth', 'triangle'],
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
    this.node = new this.Tone.Tremolo(this.config);
  }
};
</script>
<style>
</style>
