<template>
    <div id="vibrato" class="patchConfig">
        <div class="config-label">
            <label>vibrato</label>
        </div>
        <div class="config">
            <label>Audibility</label>
            <input
                v-model="config.wet"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Frequency</label>
            <input
                v-model="config.frequency"
                type="range"
                min="0.1"
                max="10"
                step="0.25"
            />
            <label>Depth</label>
            <input
                v-model="config.depth"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Oscillator</label>
            <select
                v-model="config.type">
                <option v-for="oscillator in oscillatorArray">{{oscillator}}</option>
            </select>
            <label>Max Delay</label>
            <input
                v-model="config.maxDelay"
                type="range"
                min="0"
                max="1"
                step="0.005"
            />
        </div>
        <p class="code">
            {
                wet: {{config.wet}},
                frequency: {{config.frequency}},
                depth: {{config.depth}},
                type: {{config.type}},
                maxDelay: {{config.maxDelay}}                
            }
        </p>
    </div>
</template>
<script>
export default {
  props: ['Tone', 'config'],
  data() {
    return {
        oscillatorArray: ['sine', 'square', 'sawtooth', 'triangle'],
        node: {}
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
    this.node = new this.Tone.Vibrato(this.config)
  }

};
</script>
<style>
</style>
