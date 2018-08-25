<template>
	<div>
		<section-controls :lightId="2" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls>
		<section-controls :lightId="4" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls>
		<section-controls :lightId="5" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls>
		<section-controls :lightId="6" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls>
	</div>
</template>
<script>
import section from '@/section.vue';

export default {
  // Incorporate JS libraries so the can be passed to components
  // Doing it this way means they're only loaded once rather than once
  // per component
  created() {
    // Tone Setup
    this.Tone = require('tone');

    // // Hue Setup
    this.hue = require('node-hue-api');
    this.bridgeUsername = '7KTtUV6M1xoDAAyHCFaFOep8H43GlgPM22TfWMPo';
    this.bridgeIp = '10.0.1.2';
    this.hueApi = new this.hue.HueApi(this.bridgeIp, this.bridgeUsername);
    this.lightState = this.hue.lightState;
  },
  components: {
    'section-controls': section,
  },
  mounted() {
    // Start Tone's timeline ["transport"]
    this.Tone.Transport.start();

  },
};
</script>
<style>
</style>
