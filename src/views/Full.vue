<template>
  <div>
    <div id="control-buttons">
      <button @click="startWaves">Start Waves</button>
      <button @click="stopWaves">Stop Waves</button>
      <button @click="workLights">Work Lights</button>
      <button @click="lightsOff">Lights Off</button>
      <button v-if="useHue" @click="deactivateHue">Deactive Hue</button>
      <button v-else @click="activateHue">Activate Hue</button>
    </div>

    <!-- LIGHTS -->
    <div class="config-section">
      <div class="config-header">
        <button class="collapse-button" @click="lightCollapsed = !lightCollapsed">
          <span v-if="lightCollapsed">+</span>
          <span v-else>-</span>
        </button>
        <h2>Light</h2>
      </div>
      <div v-if="!lightCollapsed" class="config-component-container">
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

    <!-- SCALE -->
    <div class="config-section">
      <div class="config-header">
        <button class="collapse-button" @click="scaleCollapsed = !scaleCollapsed">
          <span v-if="scaleCollapsed">+</span>
          <span v-else>-</span>
        </button>
        <h2>Scale</h2>
      </div>
      <div v-if="!scaleCollapsed" class="config-component-container">
        <select v-model="scale">
            <option v-for="scale in possibleScales" :value="scale.notes">{{scale.name}}</option>
        </select>
      </div>
    </div>

    <!-- SYNTH TIMBRE -->
    <div class="config-section">
      <div class="config-header">
        <button class="collapse-button" @click="synthTimbreCollapsed = !synthTimbreCollapsed">
          <span v-if="synthTimbreCollapsed">+</span>
          <span v-else>-</span>
        </button>
        <h2>Synth Timbre</h2>
      </div>
      <div v-if="!synthTimbreCollapsed">
        <div>
          <label>Presets</label>
          <select v-model="activeSectionConfig">
            <option :value="timbre" v-for="(timbre, index) in sectionTimbres">{{timbre.name}}</option>
          </select>
        </div>
        <div class="config-component-container">
          <partials-config-component
            v-bind:partials.sync="activeSectionConfig.partials"
          ></partials-config-component>
          <chorus-config-component
            v-bind.sync="activeSectionConfig.chorus"
            :oscillatorArray="oscillatorArray"
          ></chorus-config-component>
          <eq3-config-component
            ref="synth_eq3"
            :Tone="Tone"
            :config="activeSectionConfig.eq3"
          ></eq3-config-component>
          <filter-config-component
            v-bind.sync="activeSectionConfig.filter"
          ></filter-config-component>
        </div>
      </div>
    </div>

    <!-- EQ -->
    <full-eq 
      ref="fullEq"
      :Tone="Tone"
    ></full-eq>


    <!-- ROOM TIMBRE -->
    <div class="config-section">
      <div class="config-header">
        <button class="collapse-button" @click="roomTimbreCollapsed = !roomTimbreCollapsed">
          <span v-if="roomTimbreCollapsed">+</span>
          <span v-else>-</span>
        </button>
        <h2>Room Timbre</h2>
      </div>
      <div v-show="!roomTimbreCollapsed">
        <div>
          <label>Presets</label>
          <select v-model="activeRoomConfig">
            <option :value="timbre" v-for="(timbre, index) in roomTimbres">{{timbre.name}}</option>
          </select>
        </div>

        <div class="config-component-container">


          <tremolo-config-component
            ref="tremolo"
            :Tone="Tone"
            :config="activeRoomConfig.tremolo"
          ></tremolo-config-component>
          <vibrato-config-component
            ref="vibrato"
            :Tone="Tone"
            :config="activeRoomConfig.vibrato"
          ></vibrato-config-component>
          <phaser-config-component
            ref="phaser"
            :Tone="Tone"
            :config="activeRoomConfig.phaser"
          ></phaser-config-component>
          <feedback-delay-config-component
            ref="feedbackDelay"
            :Tone="Tone"
            :config="activeRoomConfig.feedbackDelay"
          ></feedback-delay-config-component>
          <reverb-config-component
            ref="reverb"
            :Tone="Tone"
            :config="activeRoomConfig.reverb"
          ></reverb-config-component>
          <eq3-config-component
            ref="eq3"
            :Tone="Tone"
            :config="activeRoomConfig.EQ3"
          ></eq3-config-component>
        </div>
      </div>
    </div>



    <!-- SYNTH CONFIG -->
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

// EQ
import fullEQ from '@/components/effectControllers/fulleq.vue'
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
    'full-eq': fullEQ
  },
  // Do this as soon as the page is created
  created() {
    // Tone.js and timbre configs
    this.Tone = Tone;
    this.sectionConfig = sectionConfig;

    // Philips Hue Api
    this.hue = NodeHueApi;
    // this.sections = JSON.parse(localStorage.getItem('waves_lights'))
    this.sections = [
      {id: 2, name: 'test light 1'},
      {id: 4, name: 'test light 2'},
      {id: 6, name: 'test light 3'}
    ]
  },
  // Reactive data that to let us change things during play
  data() {
    return {
      // UI
      lightCollapsed: true,
      scaleCollapsed: true,
      roomTimbreCollapsed: true,
      synthTimbreCollapsed: true,
      // System Config
      bridgeIp: localStorage.getItem('waves_ip'),
      bridgeUsername: localStorage.getItem('waves_username'),
      sections: [],
      // Controls
      roomBuilt: false,
      useHue: true,
      activeSection: 2,
      sectionTimbres: [sectionConfig, sectionConfig2],
      activeSectionConfig: sectionConfig,
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
      // Tone Synth Config
      partialsConfig: {},
      chorusConfig: {},
      filterConfig: {},
    };
  },
  watch: {
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
    configureHueApi() {
      this.hueApi = new this.hue.HueApi(this.bridgeIp, this.bridgeUsername);
      this.lightState = this.hue.lightState;
    },
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
    deactivateHue() {
      this.useHue = false
      eventBus.$emit('deactivate-hue');
    },
    activateHue() {
      this.useHue = true
      eventBus.$emit('activate-hue');
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
      this.$refs.fullEq.lineOut.chain(
        this.$refs.tremolo.node,
        this.$refs.vibrato.node,
        this.$refs.phaser.node,
        this.$refs.feedbackDelay.node,
        this.$refs.reverb.node,
        this.$refs.eq3.node,
        this.Tone.Master,
      );

      this.roomBuilt = true;
    },
    // ////////////////
    // INIT METHODS //
    // ////////////////
    resetHue() {
      this.sections.forEach((section) => {
        this.hueApi.setLightState(section.id, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
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
  },
  // Do this as soon as the component mounts
  mounted() {
    this.configureHueApi();
    this.resetHue();
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

  #control-buttons {
    margin-bottom: 20px;
  }

  button {
    height: 40px;
    width: 120px;
    margin-right: 10px;
  }

  button:hover {
    background-color: #dff6ff
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
    border-bottom: 1px solid black;
  }

  .config-section {
    margin-bottom: 40px;

    .config-header {
      margin-bottom: 20px;
    }

    h2 {
      font-style: italic;
      font-weight: 100;
      text-transform: uppercase;
      display: inline;
    }

    .collapse-button {
      height: 20px;
      width: 20px;
    }
  }

  .array-button {
    height: 20px;
    width: 30px;
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
