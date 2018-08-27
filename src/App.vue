<template>
	<div>
		<div id="controlButtons">
			<button @click="lightsOff">Lights Off</button>
			<button @click="workLights">Work Lights</button>
			<button @click="testInColor">Test In Color</button>
			<button @click="testOutColor">Test Out Color</button>
		</div>
		<h2>Universals</h2>
		<div id="universalConfig">
			<h4>Light Config</h4>
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
			:key='light'
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
// Pull in external dependencies
import Tone from 'tone';
import NodeHueApi from 'node-hue-api';

// Import needed components
// // `section` is the launcher & controller for each light system
import section from '@/components/section.vue';

// Timbre configs pulled in from external files for easier editing
import roomConfig from '@/configs/room';
import sectionConfig from '@/configs/section';

export default {
	// Register the `section` components with Vue so it can be used 
  components: {
    'section-controls': section,
  },
  // Do this as soon as the page is created
  created() {
    // Tone.js and timbre configs
    this.Tone = Tone;
    this.roomConfig = roomConfig;
    this.sectionConfig = sectionConfig;

    // Philips Hue Api
    this.hue = NodeHueApi;
    this.bridgeUsername = '7KTtUV6M1xoDAAyHCFaFOep8H43GlgPM22TfWMPo';
    this.bridgeIp = '10.0.1.2';
    this.hueApi = new this.hue.HueApi(this.bridgeIp, this.bridgeUsername);
    this.lightState = this.hue.lightState;
  },
  // Reactive data that to let us change things during play
  data() {
    return {
    	// Controls
      roomBuilt: false,
      useLights: false,
      lightIds: [2],
      // Hue Config
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
      // Tone Config
      // // Set up objects to serve as nodes in patch chain
      lineIn: {},
      tremoloNode: {},
      vibratoNode: {},
      phaserNode: {},
      feedbackDelayNode: {},
      reverbNode: {},
      EQ3Node: {},
    };
  },
  methods: {
  	///////////////////
  	// ADMIN METHODS //
  	///////////////////
    lightsOff() {
      this.lightIds.forEach((id) => {
        this.hueApi.setLightState(id, this.lightState.create().off());
      });
    },
    workLights() {
      this.lightIds.forEach((id) => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(40, 65, 85));
      });
    },
    testInColor() {
      this.lightIds.forEach((id) => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(this.h.in, this.s.in, this.b.in));
      });
    },
    testOutColor() {
      this.lightIds.forEach((id) => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
      });
    },
  	///////////////////
    // SETUP METHODS //
  	///////////////////
    // Builds Tone.JS chain starting at lineIn (what the section connects to)
    // and going all the way to the speakers (`Tone.Master`). These params 
    // control the `room` or the effect chain that all sections share.
    // initial parameters come from `room.js` but can be changed on page
    createRoomLine() {
      this.lineIn = new this.Tone.Gain();
      this.tremoloNode = new this.Tone.Tremolo(this.roomConfig.tremolo);
      this.vibratoNode = new this.Tone.Vibrato(this.roomConfig.vibrato);
      this.phaserNode = new this.Tone.Phaser(this.roomConfig.phaser);
      this.feedbackDelayNode = new this.Tone.FeedbackDelay(this.roomConfig.feedbackDelay);
      this.reverbNode = new this.Tone.Freeverb(this.roomConfig.reverb);
      this.eq3Node = new this.Tone.EQ3(this.roomConfig.EQ3);

      this.lineIn.chain(this.tremoloNode, this.vibratoNode, this.phaserNode, this.feedbackDelayNode, this.reverbNode, this.eq3Node, this.Tone.Master);
      this.roomBuilt = true;
    },
  	//////////////////
    // INIT METHODS //
  	//////////////////
    resetHue() {
      this.lightIds.forEach((id) => {
        this.hueApi.setLightState(id, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
      });
    },
  },
  // Do this as soon as the component mounts
  mounted() {
    if (this.useLights) {
      this.resetHue();
    }
    this.createRoomLine();
    // `Tone.Transport.start()` must be started before events can be scheduled
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

	input {
		display: block;
	}

	input[type="range"] {
		width: 250px;
	}

	#universalConfig {
		display: flex;
		flex-direction: row;

		.universalConfigSetting {
			margin-right: 20px;
		}
	}
</style>
