<template>
	<div>
    <button @click="lightsOff">Lights Off</button>
    <h2>Universals</h2>
    <div id="universalConfig">
      <div class="universalConfigSetting">
        <label>Hue</label>
        <input type="range" min="0" max="360" v-model.number="h.in"><span>h.in: {{h.in}}</span>
        <input type="range" min="0" max="360" v-model.number="h.out">h.out: {{h.out}}</span>
      </div>
      <div class="universalConfigSetting">
        <label>Saturation</label>
        <input type="range" min="0" max="100" v-model.number="s.in">
        <span>s.in {{s.in}}</span>
        <input type="range" min="0" max="100" v-model.number="s.out">
        <span>s.out {{s.out}}</span>
      </div>
      <div class="universalConfigSetting">
        <label>Brightness</label>
        <input type="range" min="0" max="100" v-model.number="b.in">
        <span>b.in {{b.in}}</span>
        <input type="range" min="0" max="100" v-model.number="b.out">
        <span>b.out {{b.out}}</span>
      </div>
    </div>
		<section-controls :lightId="2" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :b="b"></section-controls>
		<!-- <section-controls :lightId="4" :Tone="Tone" :lightState="lightState" :hueApi="hueApi"></section-controls> -->
		<!-- <section-controls :lightId="5" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :b="b"></section-controls> -->
		<!-- <section-controls :lightId="6" :Tone="Tone" :lightState="lightState" :hueApi="hueApi" :h="h" :s="s" :b="b"></section-controls> -->
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
      lightIds: [2, 5, 6],
      // Hue Config
      h: {
        in: 310,
        out: 0,
      },
      s: {
        in: 100,
        out: 100,
      },
      b: {
        in: 25,
        out: 1,
      },
    }
  },
  components: {
    'section-controls': section,
  },
  methods: {
    lightsOff () {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(id, this.lightState.create().off());      
      })
    }
  },
  mounted() {
    // Start Tone's timeline ["transport"]
    this.Tone.Transport.start();
    this.hueApi.setLightState(6, this.lightState.create().on().hsb(280, 100, 0))
    // this.hueApi.setLightState(6, this.lightState.create().on().transition(10000));
  },
};
</script>
<style lang="scss">
#universalConfig {
  display: flex;
  flex-direction: row;

  .universalConfigSetting {
    margin-right: 20px;
    input {
      display: block;
    }
  }
}
</style>
