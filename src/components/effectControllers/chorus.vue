<template>
    <div id="chorus" class="patchConfig">
        <div class="config-label">
            <label>chorus</label>
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
            <label>Delay Time</label>
            <input
                v-model="config.delayTime"
                type="range"
                min="0"
                max="5"
                step="0.1"
            />
            <label>Depth</label>
            <input
                v-model="config.depth"
                type="range"
                 min="0"
                 max="1"
                 step="0.05"
             />
            <label>Feedback</label>
            <input
                v-model="config.feedback"
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
                v-model="config.spread"
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
                delayTime: {{config.delayTime}},
                depth: {{config.depth}},
                feedback: {{config.feedback}},
                type: {{config.type}},
                spread: {{config.spread}}
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
  watch:{
    config: {
        handler() {
            this.node.set(this.config)
        },
        deep: true
    }
  },
  mounted() {
    this.node = new this.Tone.Chorus(this.config);
  }
};
</script>
