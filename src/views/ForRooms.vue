<template>
  <div>
    <button @click="lightsOff">Off</button>
    <button @click="workLights">Work Lights</button>
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
                v-model.number="hueConfig.h.in"
                type="range" 
                min="0" 
                max="360" 
              />
              <label>Saturation</label>
              <input 
                v-model.number="hueConfig.s.in"
                type="range" 
                min="0" 
                max="100" 
              />
              <label>Brightness</label>
              <input 
                v-model.number="hueConfig.b.in"
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
                v-model.number="hueConfig.h.out"
                type="range" 
                min="0" 
                max="360" 
              />
              <label>Saturation</label>
              <input 
                v-model.number="hueConfig.s.out"
                type="range" 
                min="0" 
                max="100" 
              />
              <label>Brightness</label>
              <input 
                v-model.number="hueConfig.b.out"
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
    <div id="section_container">
      <room-section
        v-for='section in sections'
        :key='section.id'
        :ref='`section` + section.id'
        :lightId='section.id'
        :Tone='Tone'
        :scale='scale'
        :hueConfig='hueConfig'
      ></room-section>
    </div>
    <reverb-config-component
      ref="reverb"
      :Tone="Tone"
      :config="roomConfig.reverb"
    ></reverb-config-component>
    <full-eq 
      ref="fullEq"
      :Tone="Tone"
    ></full-eq>
  </div>
</template>
<script>
  // Pull in external dependencies
  import Tone from 'tone';
  import NodeHueApi from 'node-hue-api';

  // Tone Nodes
  import RoomSection from '@/components/RoomSection'
  import reverbConfigComponent from '@/components/effectControllers/reverb';
  import fullEQ from '@/components/effectControllers/fulleq'

  export default {
    components: {
      'room-section': RoomSection,
      'reverb-config-component': reverbConfigComponent,
      'full-eq': fullEQ
    },
    data() {
      return {
        lightCollapsed: false,
        bridgeIp: localStorage.getItem('waves_ip'),
        bridgeUsername: localStorage.getItem('waves_username'),
        sections: [
          { id: 2 }
        ],
        scale: [ 'D', 'E', 'G', 'A', 'B' ],
        hueConfig: {
          api: {},
          lightState: {},
          hueShiftArray: [-2, -2, -1, 0, 1, 2, 2],
          brightnessShiftArray: [0, 2, 4, 6, 8, 10],
          saturationShiftArray: [-10, -5, 0, 5, 10],
          h: {
            in: 310,
            out: 29,
          },
          s: {
            in: 100,
            out: 100,
          },
          b: {
            in: 25,
            out: 1,
          },
        },
        roomConfig: {
          in: {},
          reverb: {
            roomSize: 0.9, 
            dampening: 1572 
          }
        }
      }
    },
    computed: {
      hueInRgb() {
        const h = this.hueConfig.h.in / 360;
        const s = this.hueConfig.s.in / 100;
        const b = this.hueConfig.b.in / 100;
        return this.hsvToRgb(h, s, b);
      },
      hueOutRgb() {
        const h = this.hueConfig.h.out / 360;
        const s = this.hueConfig.s.out / 100;
        const b = this.hueConfig.b.out / 100;
        return this.hsvToRgb(h, s, b);
      },
    },
    methods: {
      configureRoom() {
        this.roomConfig.in = new Tone.Gain()
        this.roomConfig.in.chain(
          this.$refs.reverb.node,
          this.$refs.fullEq.lineIn,
        )

        this.$refs.fullEq.lineOut.connect(this.Tone.Master)
      },
      configureHueApi() {
        this.hueConfig.api = new NodeHueApi.HueApi(this.bridgeIp, this.bridgeUsername);
        this.hueConfig.lightState = NodeHueApi.lightState;
      },
      resetHue() {
        this.sections.forEach((section) => {
          this.hueConfig.api.setLightState(section.id, this.hueConfig.lightState.create().on().hsb(this.hueConfig.h.out, this.hueConfig.s.out, this.hueConfig.b.out));
        });
      },
      lightsOff() {
        this.sections.forEach((section) => {
          this.hueConfig.api.setLightState(section.id, this.hueConfig.lightState.create().off());
        });
      },
      workLights() {
        this.sections.forEach((section) => {
          this.hueConfig.api.setLightState(section.id, this.hueConfig.lightState.create().on().hsb(40, 65, 45));
        });
      },
      testInColor() {
        this.sections.forEach((section) => {
          this.hueConfig.api.setLightState(section.id, this.hueConfig.lightState.create().on().hsb(this.hueConfig.h.in, this.hueConfig.s.in, this.hueConfig.b.in));
        });
      },
      testOutColor() {
        this.sections.forEach((section) => {
          this.hueConfig.api.setLightState(section.id, this.hueConfig.lightState.create().on().hsb(this.hueConfig.h.out, this.hueConfig.s.out, this.hueConfig.b.out));
        });
      },
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
    },
    created() {
      this.Tone = Tone;
      this.configureHueApi()

      // this.sections = JSON.parse(localStorage.getItem('waves_lights'))
      this.sections = [{id: 1}, {id: 2}, {id: 3}]
      this.Tone.Transport.start();
    },
    mounted() {
      this.configureRoom()
      this.sections.forEach(section => {
        let sectionRef = String('section' + section.id)
        this.$refs[sectionRef][0].toneChain.out.connect(this.roomConfig.in)
      })
      this.resetHue()
      }
  }
</script>
<style lang="scss">
  #section_container {
    display: flex;
  }

  button {
    display: inline-block;
  }
</style>