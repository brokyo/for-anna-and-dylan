<!-- TODO 
- Config Presets
- Note Spacing


-->
<template>
  <div id="section">
    <h2>Section</h2>
      <label>Preset</label>
      <select v-model="presets.active" @change="newPreset">
        <option v-for="preset in presets.options" :value="preset">{{preset.name}}</option>
      </select>
      <pre id="currentEvent">
        {{waveMeta.activeEvent}}
      </pre>
      <!-- Timbre Controls -->
      <div>
        <h3>Timbre Control</h3>
        <button @click="testSynth">Test Synth</button>
        <button @click="endTest">End</button>
        <!-- Synth -->
        <div class="patchConfig">
          <div class="config-label">
            <label>partials</label>
          </div>
          <div class="config">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.005" 
                v-model.number="timbreConfig.synthConfig.oscillator.partials[index]" v-for="(partial, index) in timbreConfig.synthConfig.oscillator.partials"
              />
          </div>
        </div>        
        <!-- 3D Panner -->
        <div class="patchConfig">
          <div class="config-label">
            <label>3D Panner</label>
          </div>
          <div class="config">
            <label>X Position</label>
            <input 
              type="range"
              v-model.number.lazy="timbreConfig.pannerConfig.positionX"
              min="-5"
              max="5"
              step="0.05"
            />
            <label>Y Position</label>
            <input 
              type="range"
              v-model.number.lazy="timbreConfig.pannerConfig.positionY"
              min="-5"
              max="5"
              step="0.05"
            />
            <label>Z Position</label>
            <input 
              type="range"
              v-model.number.lazy="timbreConfig.pannerConfig.positionZ"
              min="-5"
              max="5"
              step="0.05"
            />
          </div>
        </div>
        <!-- Auto Panner --> 
        <div class="patchConfig">
          <div class="config-label">
            <label>Auto Panner</label>
          </div>
          <div class="config">
            <label>Depth</label>
            <input
              v-model.lazy="timbreConfig.autoPannerConfig.depth"
              type="range"
              min="0"
              max="1"
              step="0.05"
            />
            <label>Frequency</label>
            <input
              v-model.lazy="timbreConfig.autoPannerConfig.frequency"
              type="range"
              min="0"
              max="10"
              step="0.05"
            />
          </div>
        </div>
      </div>

      <!-- Event Controls -->
      <div>
        <h3>Event Controls</h3>
        <!-- Events -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Note Probability</label>
          </div>
          <div class="config">
            <div class="array-buttons">
              <button @click="eventConfig.eventOptions.push({option: 1, weight: 0})">+</button>
              <button @click="eventConfig.eventOptions.pop()">-</button>
            </div>
            <div class="weighted-array--header">
              <label># Notes</label>
            </div>
            <div class="weighted-array--header">
              <label>% Chance</label>
            </div>
            <div class="weighted-array" v-for="event in eventConfig.eventOptions">
              <div class="options">
                <input v-model.number.lazy="event.option">
                <input v-model.number.lazy="event.weight">
              </div>
            </div>
          </div>
        </div>
        <!-- Octaves -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Octave Probability</label>
          </div>
          <div class="config">
            <div class="array-buttons">
              <button @click="eventConfig.octaveOptions.push({option: 1, weight: 0})">+</button>
              <button @click="eventConfig.octaveOptions.pop()">-</button>
            </div>
            <div class="weighted-array--header">
              <label>Octave</label>
            </div>
            <div class="weighted-array--header">
              <label>% Chance</label>
            </div>
            <div class="weighted-array" v-for="octave in eventConfig.octaveOptions">
              <div class="options">
                <input v-model.number.lazy="octave.option">
                <input v-model.number.lazy="octave.weight">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3>Sound Controls</h3>
        <!-- Volume -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Volume</label>
          </div>
          <div class="config">
            <label>Min</label>
            <input
              v-model.number.lazy="eventConfig.volume.min"
            />
            <label>Max</label>
            <input
              v-model.number.lazy="eventConfig.volume.max"
            />
          </div>
        </div>
        <!-- Attack -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Attack Range</label>
          </div>
          <div class="config">
            <label>Min</label>
            <input
              v-model.number.lazy="eventConfig.attack.min"
            />
            <label>Max</label>
            <input
              v-model.number.lazy="eventConfig.attack.max"
            />
          </div>
        </div>
        <!-- Duration -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Duration</label>
          </div>
          <div class="config">
            <label>Min</label>
            <input
              v-model.lazy="eventConfig.duration.min"
            />
            <label>Max</label>
            <input
              v-model.lazy="eventConfig.duration.max"
            />
          </div>
        </div>
        <!-- Release -->
        <div class="patchConfig">
          <div class="config-label">
            <label>Release</label>
          </div>
          <div class="config">
            <label>Min</label>
            <input
              v-model.lazy="eventConfig.release.min"
            />
            <label>Max</label>
            <input
              v-model.lazy="eventConfig.release.max"
            />
          </div>
        </div>
      </div>

      <!-- Wave Controls -->
      <div>
        <h3>Wave Controls</h3>
        <div class="patchConfig">
          <div class="config-label">
            <label>Wave Rest</label>
          </div>
          <div class="config">
            <label>Min</label>
            <input
              v-model.number.lazy="waveConfig.rest.min"
            />
            <label>Max</label>
            <input
              v-model.number.lazy="waveConfig.rest.max"
            />
          </div>
        </div>
      </div>

      <!-- Config Export -->
      <div 
        id="exportConfigButton"
        @click="copyCode">
        <span>Copy Config</span>
      </div>
      <!-- Controls -->
      <div 
        id="playButton"
        @click="generateWave()"
      >
        <span>start</span>
      </div>
        
      </div>
  </div>
</template>
<script>
  // Useful number generation methods
  import math from '@/mixins/math.js'

  // Presets
  import lead from '@/configs/forrooms/lead.js'
  import left from '@/configs/forrooms/left.js'
  import right from '@/configs/forrooms/right.js'


  export default {    
    props: ['Tone', 'scale', 'hueConfig', 'lightId'],
    mixins: [math],
    data() {
      return {
        presets: {
          options: [lead, left, right],
          active: {}
        },
        waveMeta: {
          audioActive: true,
          activeEvent: {}
        },
        toneChain: {
          synth: {},
          panner: {},
          autoPanner: {},
          out: {}
        },
        timbreConfig: {
          synthConfig: {
            oscillator: {
              partials: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          pannerConfig: {
            positionX: 0,
            positionY: 0,
            positionZ: 0
          },
          autoPannerConfig: {
            depth: 1,
            frequency: 12
          }
        },
        eventConfig: {
          volume: {
            min: -10,
            max: 0
          },
          eventOptions: [
            { weight: 1, option: 1 }
          ],
          octaveOptions: [
            { weight: 0.75, option: 1 },
            { weight: 0.25, option: 2 }
          ],
          attack: {
            min: 1,
            max: 5
          },
          release: {
            min: 1,
            max: 5
          },
          duration: {
            min: 1,
            max: 5
          }
        },
        waveConfig: {
          rest: {
            min: 1,
            max: 5
          }
        }
      }
    },
    watch: {
      'timbreConfig.pannerConfig': {
        handler(newPannerConfig) {
          this.toneChain.panner.set(newPannerConfig)
        },
        deep: true
      },
      'timbreConfig.autoPannerConfig': {
        handler(newAutoPannerConfig) {
          this.toneChain.autoPanner.set(newAutoPannerConfig)
        },
        deep: true
      },
      'timbreConfig.synthConfig.oscillator.partials': {
        handler(newConfig) {
          this.toneChain.synth.set({oscillator: {partials: newConfig}})
        },
        deep: true
      }
    },
    methods: {
      // Generate
      generateWave() {
        const eventParams = this.generateAudioValues()
        this.setSynthConfig(eventParams)
        this.scheduleAudioEvent(eventParams)

        const hueParams = this.generateHueValues(eventParams)
        this.scheduleHueEvents(hueParams)        

        this.scheduleCleanup(eventParams)

        if ( this.waveMeta.audioActive ) {
          this.Tone.Transport.scheduleOnce((time) => {
            this.generateWave()
          }, `+${String(eventParams.eventDuration + eventParams.waveRest)}`)
        }
      },
      generateAudioValues() {
        const volume = this.randomBetween(this.eventConfig.volume.max, this.eventConfig.volume.min);

        const attack = this.randomBetween(this.eventConfig.attack.min, this.eventConfig.attack.max);
        const duration = this.randomBetween(this.eventConfig.duration.min, this.eventConfig.duration.max)
        const release = this.randomBetween(this.eventConfig.release.min, this.eventConfig.release.max);
        const eventDuration = attack + duration + release

        const noteCount = this.pickWeightedRandom(this.eventConfig.eventOptions)
        const noteArray = []
        for( let i = 0; i < noteCount; i++ ) {
          const pitch = this.scale[this.randomIndex(this.scale.length)]
          const octave = this.pickWeightedRandom(this.eventConfig.octaveOptions)
          const note = String(pitch) + String(octave)

          noteArray.push(note)
        }

        const waveRest = this.randomBetween(this.waveConfig.rest.min, this.waveConfig.rest.max)

        const audioValues = {
          volume,
          attack,
          duration,
          release,
          eventDuration,
          noteArray,
          waveRest
        }


        return audioValues
      },
      generateHueValues(eventParams) {
        let hueIn = {
          begin: 0, 
          duration: eventParams.attack, 
          h: this.hueConfig.h.in, 
          s: this.hueConfig.s.in, 
          b: this.hueConfig.b.in,
        };

        let hueOut = {
          begin: eventParams.attack + eventParams.duration, 
          duration: eventParams.release, 
          h: this.hueConfig.h.out, 
          s: this.hueConfig.s.out, 
          b: this.hueConfig.b.out,
        };

        // map the volume generated to the proper brightness
        // / e.g. make quieter volumes result in less bright lights
        const volumeIndex = Math.floor(this.mapRange(eventParams.volume, this.eventConfig.volume.min, this.eventConfig.volume.max, 0, this.hueConfig.brightnessShiftArray.length));

        // hueIn.s = this.hueConfig.s.in + this.hueConfig.saturationShiftArray[events.length - 1];
        hueIn.l = this.hueConfig.b.in + this.hueConfig.brightnessShiftArray[volumeIndex];

        return {
          in: hueIn,
          out: hueOut,
        };
      },
      // Schedule
      setSynthConfig(eventParams) {
        this.toneChain.synth.set({
          envelope: {
            attack: eventParams.attack,
            release: eventParams.release,
          },
          volume: eventParams.volume,
        });
      },
      scheduleAudioEvent(eventParams) {
        this.Tone.Transport.scheduleOnce((time) => {
          this.toneChain.synth.triggerAttackRelease(eventParams.noteArray, eventParams.duration);

          this.waveMeta.activeEvent = eventParams
        });
      },
      scheduleHueEvents(hueParams) {
        this.scheduleHueAttack(hueParams.in)
        this.scheduleHueRelease(hueParams.out)
      },
      scheduleHueAttack(hueIn) {
        this.Tone.Transport.scheduleOnce((time) => {
          const lightInState = this.hueConfig.lightState.create().on().hsb(hueIn.h, hueIn.s, hueIn.b).transition(hueIn.duration * 1000);

          this.hueConfig.api.setLightState(this.lightId, lightInState);
        }, (`+${String(hueIn.begin)}`));
      },
      scheduleHueRelease(hueOut) {
        this.Tone.Transport.scheduleOnce((time) => {
          const lightOutState = this.hueConfig.lightState.create().hsb(hueOut.h, hueOut.s, hueOut.b).transition(hueOut.duration * 1000);

          this.hueConfig.api.setLightState(this.lightId, lightOutState);
        }, (`+${String(hueOut.begin)}`));
      },
      scheduleCleanup(eventParams) {
        this.Tone.Transport.scheduleOnce(time => {
          this.waveMeta.activeEvent = {}
        }, `+${String(eventParams.eventDuration)}`)
      },
      // Config
      newPreset() {
        this.timbreConfig = this.presets.active.timbreConfig
        this.eventConfig = this.presets.active.eventConfig
        this.waveConfig = this.presets.active.waveConfig
      },
      // Utilities
      copyCode() {
        let config = {
          timbreConfig: this.timbreConfig,
          eventConfig: this.eventConfig,
          waveConfig: this.waveConfig
        }
        let configAsString = JSON.stringify(config)

        this.$copyText(configAsString)
      },
      testSynth() {
        const pitch = this.scale[this.randomIndex(this.scale.length)]
        const octave = this.pickWeightedRandom(this.eventConfig.octaveOptions)
        const note = String(pitch) + String(octave)

        this.toneChain.synth.triggerAttack(note)
      },
      endTest() {
        this.toneChain.synth.releaseAll()
      }
    },
    mounted() {
      this.toneChain.synth = new this.Tone.PolySynth(this.timbreConfig.synthConfig)
      this.toneChain.synth.set({envelope: {attackCurve: 'linear', releaseCurve: 'linear'}});

      this.toneChain.panner = new this.Tone.Panner3D(this.timbreConfig.pannerConfig)
      this.toneChain.autoPanner = new this.Tone.AutoPanner(this.timbreConfig.autoPannerConfig).start()
      this.toneChain.out = new this.Tone.Volume({volume: -5})

      this.hueConfig.api.setLightState(this.lightId, this.hueConfig.lightState.create().off());
      this.toneChain.synth.chain(
        this.toneChain.panner,
        this.toneChain.autoPanner,
        this.toneChain.out
      )
    }
  }
</script>
<style lang="scss">
  #currentEvent {
    height: 200px;
    display: block;
  }

  button {
    display: block
  }

  label {
    display: block
  }

  #exportConfigButton {
    text-align: center;
    border: 1px solid black;      
    padding: 10px 2px;
  }

  #exportConfigButton:hover {
    background-color: #cccccc;
  }

  #playButton {
    margin-top: 20px;
    text-align: center;
    padding: 80px 10px;
    text-transform: uppercase;
    border: 1px solid black;
  }

  #playButton:hover {
    background-color: #cccccc;
  }

  .array-buttons {
    margin-bottom: 20px;
    button {
      display: inline-block;
      height: 30px;
    }
  }

  .weighted-array--header {
    display: inline-block;
    width: 70px;
    margin-right: 10px;
  }

  .weighted-array {
    .options {
      input {
        width: 60px;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
</style>