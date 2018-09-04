<template>
    <div id="filter" class="patchConfig">
        <div class="config-label">
            <label>filter</label>
        </div>
        <div class="config">
            <label>Frequency</label>
            <input
                v-model="config.frequency"
                type="range"
                min="0"
                max="2000"
            />
            <label>Filter Type</label>
            <select v-model="config.type">
                <option v-for="filterType in filterArray">{{filterType}}</option>
            </select>
            <label>Filter Rolloff</label>
            <select v-model="config.rolloff">
                <option v-for="rolloff in rolloffArray">
                    <select>{{rolloff}}</select>
                </option>
            </select>
            <label>Q</label>
            <input
                v-model="config.Q"
                type="range"
                min="0"
                max="50"
            />
        </div>
        <p class="code">
        {
            frequency: {{config.frequency}},
            type: {{config.type}},
            rolloff: {{config.rolloff}},
            Q: {{config.Q}},   
        }
        </p>
    </div>
</template>
<script>
export default {
  props: ['config', 'Tone'],
  data() {
    return {
        node: {},
        filterArray: ['bandpass', 'lowpass', 'highpass', 'lowshelf', 'highshelf'],
        rolloffArray: [-12, -24, -48],
    };
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
    this.node = new this.Tone.Filter(this.config);
  }

};
</script>
