<template>
	<div>
    <button @click="lightsOff">Lights Off</button>
    <button @click="workLights">Work Lights</button>
    <button @click="testInColor">Test In Color</button>
    <button @click="testOutColor">Test Out Color</button>
    <h2>Universals</h2>
    <div id="universalConfig">
      <div class="universalConfigSetting">
        <label>Hue</label>
        <input type="range" min="0" max="360" v-model.number="h.in">
        <input type="range" min="0" max="360" v-model.number="h.out">
      </div>
      <div class="universalConfigSetting">
        <label>Saturation</label>
        <input type="range" min="0" max="100" v-model.number="s.in">
        <input type="range" min="0" max="100" v-model.number="s.out">
      </div>
      <div class="universalConfigSetting">
        <label>Brightness</label>
        <input type="range" min="0" max="100" v-model.number="b.in">
        <input type="range" min="0" max="100" v-model.number="b.out">
      </div>
    </div>
		<section-controls
      v-if="roomBuilt"
      v-for="light in lightIds" 
      :lightId="light" 
      :Tone="Tone" 
      :lightState="lightState" 
      :hueApi="hueApi" 
      :h="h" 
      :s="s" 
      :b="b"
      :config="sectionConfig"
      >
    </section-controls>

	</div>
</template>
<script>
// room timbre config stored externally for easier editin
import room from '@/configs/room.js'
import sectionConfig from '@/configs/section.js'
import section from '@/section.vue';

export default {
  components: {
    'section-controls': section,
  },
  created() {
    // Tone Setup
    this.Tone = require('tone');
    this.roomConfig = room
    this.sectionConfig = sectionConfig

    // Hue Setup
    this.hue = require('node-hue-api');
    this.bridgeUsername = '7KTtUV6M1xoDAAyHCFaFOep8H43GlgPM22TfWMPo';
    this.bridgeIp = '10.0.1.2';
    this.hueApi = new this.hue.HueApi(this.bridgeIp, this.bridgeUsername);
    this.lightState = this.hue.lightState;
  },
  data() {
    return {
      roomBuilt: false,
      useLights: false,
      lightIds: [2],
      h: {
        in: 310,
        out: 293,
      },
      s: {
        in: 100,
        out: 100,
      },
      b: {
        in: 25,
        out: 1,
      },
      lineIn: {},
      tremoloNode: {},
      vibratoNode: {},
      phaserNode: {},
      feedbackDelayNode: {},
      reverbNode: {},
      EQ3Node: {}
    }
  },
  methods: {
    lightsOff () {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(id, this.lightState.create().off());      
      })
    },
    workLights () {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(40, 65, 85));      
      })
    },
    testInColor () {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(this.h.in, this.s.in, this.b.in));      
      })
    },
    testOutColor () {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));      
      })
    },
    setRoomConfig () {
      this.lineIn = new this.Tone.Gain()
      this.tremoloNode = new this.Tone.Tremolo(this.roomConfig.tremolo);
      this.vibratoNode = new this.Tone.Vibrato(this.roomConfig.vibrato);
      this.phaserNode = new this.Tone.Phaser(this.roomConfig.phaser);
      this.feedbackDelayNode = new this.Tone.FeedbackDelay(this.roomConfig.feedbackDelay);
      this.reverbNode = new this.Tone.Freeverb(this.roomConfig.reverb);
      this.eq3Node = new this.Tone.EQ3(this.roomConfig.EQ3);

      this.lineIn.chain(this.tremoloNode, this.vibratoNode, this.phaserNode, this.feedbackDelayNode, this.reverbNode, this.eq3Node, this.Tone.Master)
      this.roomBuilt = true
    },
    resetHue() {
      this.lightIds.forEach(id => {
        this.hueApi.setLightState(this.lightId, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
      })
    },
  },
  mounted() {
    if(this.useLights) {
      this.resetHue()
    }
    this.setRoomConfig()
    this.Tone.Transport.start();
  },
};
</script>
<style lang="scss">
button {
  height: 40px;
  width: 120px;
  margin-right: 10px;
}

button:hover {
  background-color: #FED8F6
}

input[type="range"] {
  width: 250px;
}

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
