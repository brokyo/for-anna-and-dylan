<template>
    <div id="feedbackDelay" class="patchConfig">
        <div class="config-label">
            <label>feedback delay</label>
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
            <label>Delay Time</label>
            <input
                v-model="config.delayTime"
                type="range"
                min="0"
                max="2"
                step="0.005"
            />
            <label>Feedback</label>
            <input
                v-model="config.feedback"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
        </div>
        <p class="code">
            {
                wet: {{config.wet}},
                delayTime: {{config.delayTime}},
                maxDelay: {{config.maxDelay}},
                feedback: {{config.feedback}}                
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
    this.node = new this.Tone.FeedbackDelay(this.config);
  }
};
</script>
<style>
</style>
