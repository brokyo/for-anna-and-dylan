<template>
	<div>
		<div id="controlButtons">
      <button @click="startWaves">Start Waves</button>
      <button @click="stopWaves">Stop Waves</button>
      <button @click="workLights">Work Lights</button>
			<button @click="lightsOff">Lights Off</button>
		</div>

    <config
      :


    <div class="config-section">
  		<h2>Light</h2>
  		<div class="config-component-container">
  			<div class="light-config">
          <label class="config-label">Light In</label>
          <div class="single-light-config">
            <div class="lightPreview light-config-meta" :style="{'background-color': 'rgb('+ hueInRgb[0] + ',' + hueInRgb[1] + ',' + hueInRgb[2] + ')' }"></div>
            <div class="light-config-params">
      				<label>Hue</label>
      				<input 
                v-model.number="h.in"
                type="range" 
                min="0" 
                max="360" 
              />
              <label>Saturation</label>
              <input 
                v-model.number="s.in"
                type="range" 
                min="0" 
                max="100" 
              />
              <label>Brightness</label>
              <input 
                v-model.number="b.in"
                type="range" 
                min="0" 
                max="100" 
              />
            </div>
          </div>
          <button @click="testInColor">Test In Color</button>
  			</div>
        <div class="light-config">
          <label class="config-label">Light Out</label>
          <div class="single-light-config">
            <div 
              class="lightPreview light-config-meta" 
              :style="{'background-color': 'rgb('+ hueOutRgb[0] + ',' + hueOutRgb[1] + ',' + hueOutRgb[2] + ')' }">
            </div>
            <div class="light-config-params">
              <label>Hue</label>
              <input 
                v-model.number="h.out"
                type="range" 
                min="0" 
                max="360" 
              />
              <label>Saturation</label>
              <input 
                v-model.number="s.out"
                type="range" 
                min="0" 
                max="100" 
              />
              <label>Brightness</label>
              <input 
                v-model.number="b.out"
                type="range" 
                min="0" 
                max="100" 
              />
            </div>
          </div>
          <button @click="testOutColor">Test Out Color</button>
        </div>
		  </div>
    </div>

    <div class="config-section">
      <h2>Scale</h2>
      <select v-model="scale">
          <option v-for="scale in possibleScales" :value="scale.notes">{{scale.name}}</option>
      </select>
    </div>

    <div class="config-section">
      <h2>Room Timbre</h2>
      <label>Presets</label>
      <select v-model="activeRoomConfig">
        <option :value="timbre" v-for="(timbre, index) in roomTimbres">{{timbre.name}}</option>
      </select>
      <div class="config-component-container">
        <tremolo-config-component
          v-bind.sync="tremoloConfig"
          :oscillatorArray="oscillatorArray"
        ></tremolo-config-component>
        <vibrato-config-component
          v-bind.sync="vibratoConfig"
          :oscillatorArray="oscillatorArray"
        ></vibrato-config-component>
        <phaser-config-component
          v-bind.sync="phaserConfig"
        ></phaser-config-component>
        <feedback-delay-config-component
          v-bind.sync="feedbackDelayConfig"
        ></feedback-delay-config-component>
        <reverb-config-component
          v-bind.sync="reverbConfig"
        ></reverb-config-component>
        <eq3-config-component
          v-bind.sync="EQ3Config"
        ></eq3-config-component>
      </div>
    </div>

    <div class="config-section">
      <h2>Synth Timbre</h2>
      <label>Presets</label>
      <select v-model="activeSectionConfig">
        <option :value="timbre" v-for="(timbre, index) in sectionTimbres">{{timbre.name}}</option>
      </select>
      <div class="config-component-container">
        <partials-config-component
          v-bind:partials.sync="activeSectionConfig.partials"
        ></partials-config-component>
        <chorus-config-component
          v-bind.sync="activeSectionConfig.chorus"
          :oscillatorArray="oscillatorArray"
        ></chorus-config-component>
        <eq3-config-component
          v-bind.sync="activeSectionConfig.EQ3"
        ></eq3-config-component>
        <filter-config-component
          v-bind.sync="activeSectionConfig.filter"
        ></filter-config-component>
      </div>
    </div>

    <!-- Prop spam is because these are built to be individually configurable but right now they're all being set on the top level -->
    <div class="config-section">
  		<section-controls
  			v-if="roomBuilt"
  			v-for="section in sections"
  			:key='section.id'
  			:lightId="section.id"
  			:Tone="Tone"
  			:lightState="lightState"
  			:hueApi="hueApi"
  			:h="h"
  			:s="s"
  			:b="b"
        :partialsConfig="activeSectionConfig.partials"
        :chorusConfig="activeSectionConfig.chorus"
        :EQ3Config="activeSectionConfig.EQ3"
        :filterConfig="activeSectionConfig.filter"
  			:sectionName="activeSectionConfig.name"
        :scale="scale"
  			>
  		</section-controls>
  	</div>

  </div>
</template>
<script>
// Pull in external dependencies
import Tone from 'tone';
import NodeHueApi from 'node-hue-api';

// Timbre configs pulled in from external files for easier editing
import roomTimbre from '@/configs/room';
import roomTimbre2 from '@/configs/room2';
import sectionConfig from '@/configs/section';
import sectionConfig2 from '@/configs/section2';

// Import needed components
// // Room Effects
import tremoloConfigComponent from '@/components/effectControllers/tremolo.vue';
import vibratoConfigComponent from '@/components/effectControllers/vibrato.vue';
import phaserConfigComponent from '@/components/effectControllers/phaser.vue';
import feedbackDelayConfigComponent from '@/components/effectControllers/feedbackDelay.vue';
import reverbConfigComponent from '@/components/effectControllers/reverb.vue';
import eq3ConfigComponent from '@/components/effectControllers/eq3.vue';

// Synth Patch
import section from '@/components/section.vue';
import partialsConfigComponent from '@/components/effectControllers/partials.vue';
import chorusConfigComponent from '@/components/effectControllers/chorus.vue';
import filterConfigComponent from '@/components/effectControllers/filter.vue';

import configData from '@/components/config.vue'

import { eventBus } from '@/main.js';
export default {
  // Register the `section` components with Vue so it can be used
  components: {
    'section-controls': section,
    'tremolo-config-component': tremoloConfigComponent,
    'vibrato-config-component': vibratoConfigComponent,
    'phaser-config-component': phaserConfigComponent,
    'feedback-delay-config-component': feedbackDelayConfigComponent,
    'reverb-config-component': reverbConfigComponent,
    'eq3-config-component': eq3ConfigComponent,
    'partials-config-component': partialsConfigComponent,
    'chorus-config-component': chorusConfigComponent,
    'filter-config-component': filterConfigComponent,
    'config-data': configData
  },
  // Do this as soon as the page is created
  created() {
    // Tone.js and timbre configs
    this.Tone = Tone;
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
          id: 2
        },
        {
          id: 5
        },
        {
          id: 6
        },
      ],
      sectionTimbres: [sectionConfig, sectionConfig2],
      activeSectionConfig: sectionConfig2,
      roomTimbres: [roomTimbre, roomTimbre2],
      activeRoomConfig: roomTimbre,
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
      // Tone Universals
      possibleScales: [
        { name: 'In Sen - C', notes: [ 'C', 'Db', 'F', 'G', 'Bb' ]},
        { name: 'In Sen - E', notes: [ 'E', 'F', 'A', 'B', 'D' ]},
        { name: 'Yo - D', notes: [ 'D', 'E', 'G', 'A', 'B' ]},
        { name: 'Yo - Bb', notes: [ 'Bb', 'C', 'Eb', 'D', 'G' ]},
        { name: 'Western - C Major', notes: [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ] },
        { name: 'Western - F Major', notes: [ 'F', 'G', 'A', 'Bb', 'C', 'D', 'E' ] },
        { name: 'Western - A Minor', notes: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ] },
        { name: 'Western - E Minor', notes: [ 'E', 'Gb', 'Ab', 'A', 'B', 'C', 'Eb' ]},
        { name: 'Pentatonic - D Major', notes: [ 'C', 'D', 'E', 'G', 'A' ] },
        { name: 'Pentatonic - F# Major', notes: [ 'Gb', 'Ab', 'Bb', 'Db', 'Eb' ]},
        { name: 'Hirajoshi - F', notes: [ 'F', 'Gb', 'Bb', 'B', 'Eb' ]},
        { name: 'Hirajoshi - A', notes: [ 'A', 'B', 'D', 'Eb', 'G' ]},
        { name: 'Byzantine - D', notes: [ 'D', 'Eb', 'Gb', 'G', 'A', 'Bb', 'Db' ]},
        { name: 'Byzantine - Ab', notes: [ 'Ab', 'A', 'C', 'Db', 'Eb', 'E', 'G' ]} 
      ],
      scale: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      oscillatorArray: ['sine', 'square', 'sawtooth', 'triangle'],
      // Tone Room Config
      tremoloConfig: {},
      vibratoConfig: {},
      phaserConfig: {},
      feedbackDelayConfig: {},
      reverbConfig: {},
      EQ3Config: {},
      // Tone Synth Config
      partialsConfig: {},
      chorusConfig: {},
      EQ3SynthConfig: {},
      filterConfig: {},
      // Set up objects to serve as nodes in patch chain
      lineIn: {},
      tremoloNode: {},
      vibratoNode: {},
      phaserNode: {},
      feedbackDelayNode: {},
      reverbNode: {},
      eq3Node: {},
    };
  },
  watch: {
    activeRoomConfig: {
      handler() {
        this.setRoomConfig()
      }, 
      deep: true
    },
    tremoloConfig: {
      handler() {
        this.tremoloNode.set(this.tremoloConfig);
      },
      deep: true,
    },
    vibratoConfig: {
      handler() {
        this.vibratoNode.set(this.vibratoConfig);
      },
      deep: true,
    },
    phaserConfig: {
      handler() {
        this.phaserNode.set(this.phaserConfig);
      },
      deep: true,
    },
    feedbackDelayConfig: {
      handler() {
        this.feedbackDelayNode.set(this.feedbackDelayConfig);
      },
      deep: true,
    },
    reverbConfig: {
      handler() {
        this.reverbNode.set(this.reverbConfig);
      },
      deep: true,
    },
    EQ3Config: {
      handler() {
        this.eq3Node.set(this.EQ3Config);
      },
      deep: true,
    },
    partialsConfig: {
      handler() {
        console.log('app set')
        eventBus.$emit('set-partials');
      },
      deep: true,
    },
  },
  computed: {
    hueInRgb() {
      const h = this.h.in / 360;
      const s = this.s.in / 100;
      const b = this.b.in / 100;
      return this.hsvToRgb(h, s, b);
    },
    hueOutRgb() {
      const h = this.h.out / 360;
      const s = this.s.out / 100;
      const b = this.b.out / 100;
      return this.hsvToRgb(h, s, b);
    },
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
      let r,
        g,
        b;

      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
      }

      return [r * 255, g * 255, b * 255];
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
      this.tremoloNode = new this.Tone.Tremolo(this.tremoloConfig);
      this.vibratoNode = new this.Tone.Vibrato(this.vibratoConfig);
      this.phaserNode = new this.Tone.Phaser(this.phaserConfig);
      this.feedbackDelayNode = new this.Tone.FeedbackDelay(this.feedbackDelayConfig);
      this.reverbNode = new this.Tone.Freeverb(this.reverbConfig);
      this.eq3Node = new this.Tone.EQ3(this.EQ3Config);

      this.lineIn.chain(
        this.tremoloNode,
        this.vibratoNode,
        this.phaserNode,
        this.feedbackDelayNode,
        this.reverbNode,
        this.eq3Node,
        this.Tone.Master,
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
    /////////////////////
    // CONTROL METHODS //
    /////////////////////
    startWaves() {
      eventBus.$emit('start-waves');
    },
    stopWaves() {
      eventBus.$emit('stop-waves');
    },
    setRoomConfig() {
      this.tremoloConfig = this.activeRoomConfig.tremolo;
      this.vibratoConfig = this.activeRoomConfig.vibrato;
      this.phaserConfig = this.activeRoomConfig.phaser;
      this.feedbackDelayConfig = this.activeRoomConfig.feedbackDelay;
      this.reverbConfig = this.activeRoomConfig.reverb;
      this.EQ3Config = this.activeRoomConfig.EQ3;
    }
  },
  // Do this as soon as the component mounts
  mounted() {
    if (this.useLights) {
      this.resetHue();
    }
    this.createRoomLine();
    this.setRoomConfig();
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
    margin-bottom: 5px;
    width: 100%;
	}

  select {
    display: block;
    margin-bottom: 5px;
  }


  .lightPreview {
    display: block;
    height: 120px;
    width: 120px;
    margin-right: 20px;
  }

  .light-config {
    flex-grow: 1
  }

  .light-config-params {
    flex-grow: 1
  }

  .config-component-container {
    display: flex;
    flex-wrap: wrap;
  }

  .single-light-config {
    display: flex;
    margin-right: 60px;
  }

  .config-label {
    font-size: 15px;
    font-weight: 100;
    font-style: italic;
    margin-bottom: 10px;
  }

  .config-section {
    margin-bottom: 60px;

    h2 {
      font-style: italic;
      font-weight: 100;
      text-transform: uppercase;
    }
  }

  .input-array {
    width: 20px;
    margin-right: 5px;
    display: inline;
  }

  .patchConfig {
    margin-right: 40px;
    width: 300px;
    margin-bottom: 20px;
    border: 1px solid black;
    flex-grow: 1;

    .config {
      padding: 8px;
    }
  
    .config-label {
      font-size: 15px;
      font-weight: 100;
      font-style: italic;
      margin-bottom: 10px;
      background-color: #d5d5ff;
      padding: 8px;
    }


    .code {
      padding: 8px
    }
  }

</style>
