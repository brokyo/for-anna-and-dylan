<template>
	<div>
		<div id="controlButtons">
			<button @click="lightsOff">Lights Off</button>
			<button @click="workLights">Work Lights</button>
		</div>

    <div class="config-section">
  		<h2>Light</h2>
  		<div id="light-config-container">
  			<div>
          <label class="config-label">Light In</label>
          <div class="single-light-config">
            <div class="lightPreview light-config-meta" :style="{'background-color': 'rgb('+ hueInRgb[0] + ',' + hueInRgb[1] + ',' + hueInRgb[2] + ')' }"></div>
            <div class="light-config-params">
      				<label>Hue</label>
      				<input type="range" min="0" max="360" v-model.number="h.in">
              <label>Saturation</label>
              <input type="range" min="0" max="100" v-model.number="s.in">
              <label>Brightness</label>
              <input type="range" min="0" max="100" v-model.number="b.in">
            </div>
          </div>
          <button @click="testInColor">Test In Color</button>
  			</div>
        <div>
          <label class="config-label">Light Out</label>
          <div class="single-light-config">
            <div class="lightPreview light-config-meta" :style="{'background-color': 'rgb('+ hueOutRgb[0] + ',' + hueOutRgb[1] + ',' + hueOutRgb[2] + ')' }"></div>
            <div class="light-config-params">
              <label>Hue</label>
              <input type="range" min="0" max="360" v-model.number="h.out">
              <label>Saturation</label>
              <input type="range" min="0" max="100" v-model.number="s.out">
              <label>Brightness</label>
              <input type="range" min="0" max="100" v-model.number="b.out">
            </div>
          </div>
          <button @click="testOutColor">Test Out Color</button>
        </div>
		  </div>
    </div>

    <div class="config-section">
      <h2>Select Section</h2>
      <div id="sectionButtons">
        <button 
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id"
        > {{section.id}} </button>
      </div>
  		<section-controls
  			v-if="roomBuilt"
  			v-for="section in sections"
        v-show="activeSection == section.id"
  			:key='section.id'
  			:lightId="section.id"
  			:Tone="Tone"
  			:lightState="lightState"
  			:hueApi="hueApi"
  			:h="h"
  			:s="s"
  			:b="b"
  			:config="section.config"
  			>
  		</section-controls>
  	</div>

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
      activeSection: 2,
      sections: [
        {
          id: 2,
          config: sectionConfig
        },
        {
          id: 5,
          config: sectionConfig
        },
        {
          id: 6,
          config: sectionConfig
        }
      ],
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
  computed: {
    hueInRgb() {
      var h = this.h.in / 360
      var s = this.s.in / 100
      var b = this.b.in / 100 
      return this.hsvToRgb(h, s, b)
    },
    hueOutRgb() {
      var h = this.h.out / 360
      var s = this.s.out/ 100
      var b = this.b.out / 100 
      return this.hsvToRgb(h, s, b)
    }
  },
  methods: {
  	// /////////////////
  	// ADMIN METHODS //
  	// /////////////////
    lightsOff() {
      this.sections.forEach((section) => {
        this.hueApi.setLightState(section.id, this.lightState.create().off());
      });
    },
    workLights() {
      this.sections.forEach((section) => {
        this.hueApi.setLightState(section.id, this.lightState.create().on().hsb(40, 65, 45));
      });
    },
    testInColor() {
      this.sections.forEach((section) => {
        this.hueApi.setLightState(section.id, this.lightState.create().on().hsb(this.h.in, this.s.in, this.b.in));
      });
    },
    testOutColor() {
      this.sections.forEach((section) => {
        this.hueApi.setLightState(section.id, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
      });
    },
    // //////////////////
    // UTILITY METHODS //
    // /////////////////
    hsvToRgb(h, s, v) {
      var r, g, b;

      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
      }

      return [ r * 255, g * 255, b * 255 ];
    },
  	// /////////////////
    // SETUP METHODS //
  	// /////////////////
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

      this.lineIn.chain(
        this.tremoloNode, 
        this.vibratoNode, 
        this.phaserNode, 
        this.feedbackDelayNode, 
        this.reverbNode, 
        this.eq3Node, 
        this.Tone.Master
      );
      this.roomBuilt = true;
    },
  	// ////////////////
    // INIT METHODS //
  	// ////////////////
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
  body {
    font-family: monospace;
  }

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

  .lightPreview {
    display: block;
    height: 100px;
    width: 100px;
    margin-right: 20px;
  }

  #light-config-container {
    display: flex;
  }

  .single-light-config {
    display: flex;
    margin-right: 60px; 
  }

  .config-label {
    font-size: 18px;
    font-weight: 900;
  }

  .config-section {
    margin-bottom: 60px;
  }

</style>
