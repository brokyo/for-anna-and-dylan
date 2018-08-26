<template>
	<div>
    <pre>{{h}}</pre>
    <label>h.in</label>
    <input type="range" min="0" max="360" v-model.number="h.in">
    <label>h.out</label>
    <input type="range" min="0" max="360" v-model.number="h.out">
    <pre>{{s}}</pre>
    <label>s.in</label>
    <input type="range" min="0" max="100" v-model.number="s.in">
    <label>s.out</label>
    <input type="range" min="0" max="100" v-model.number="s.out">
    <pre>{{l}}</pre>
    <label>l.in</label>
    <input type="range" min="0" max="100" v-model.number="l.in">
    <label>l.out</label>
    <input type="range" min="0" max="360" v-model.number="l.out">
		<section-controls :lightId="2" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :l="l"></section-controls>
		<!-- <section-controls :lightId="4" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls> -->
		<!-- <section-controls :lightId="5" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :l="l"></section-controls> -->
		<!-- <section-controls :lightId="6" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :l="l"></section-controls> -->
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

    // Hue Setup
    this.hue = require('node-hue-api');
    this.bridgeUsername = '7KTtUV6M1xoDAAyHCFaFOep8H43GlgPM22TfWMPo';
    this.bridgeIp = '10.0.1.2';
    this.hueApi = new this.hue.HueApi(this.bridgeIp, this.bridgeUsername);
    this.lightState = this.hue.lightState;
  },
  data() {
    return {
      // Hue Config
      h: {
        in: 310,
        out: 0,
      },
      s: {
        in: 100,
        out: 100,
      },
      l: {
        in: 25,
        out: 1,
      },
    }
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
