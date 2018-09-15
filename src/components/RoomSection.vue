<template>
  <div>
    <h2>Section</h2>
      <!-- Timbre Controls -->
      <div>
        <h3>Timbre Control</h3>
        <!-- Synth -->
        <div>
          <label>Synth</label>
        </div>
        <!-- 3D Panner -->
        <div>
          <label>3D Panner</label>
          <label>X Position</label>
          <input 
            type="range"
            v-model.number="timbreConfig.pannerConfig.positionX"
            min="-5"
            max="5"
            step="0.05"
          />
          <label>Y Position</label>
          <input 
            type="range"
            v-model.number="timbreConfig.pannerConfig.positionY"
            min="-5"
            max="5"
            step="0.05"
          />
          <label>Z Position</label>
          <input 
            type="range"
            v-model.number="timbreConfig.pannerConfig.positionZ"
            min="-5"
            max="5"
            step="0.05"
          />
        </div>
      </div>

      <!-- Event Controls -->
      <div>
        <h3>Event Controls</h3>
        <!-- Volume -->
        <div>
          <label>Volume</label>
          <label>Min</label>
          <input
            v-model.number="eventConfig.volume.min"
          />
          <label>Max</label>
          <input
            v-model.number="eventConfig.volume.max"
          />
        </div>
        <!-- Octaves -->
        <div>
          <label>Octave Possibilities</label>
          <button @click="addOctave">+</button>
          <button @click="removeOctave">-</button>
          <span v-for="(octave, index) in eventConfig.octaveSelector.octave">
            <input
              v-model.number="eventConfig.octaveSelector.octave[index]"
            />
            <input
              v-model.numer="eventConfig.octaveSelector.probability[index]"
            />
          </span>
        </div>
        <!-- Attack -->
        <div>
          <label>Attack Range</label>
          <label>Min</label>
          <input
            v-model.number="eventConfig.attack.min"
          />
          <label>Max</label>
          <input
            v-model.numer="eventConfig.attack.max"
          />
        </div>
        <!-- Release -->
        <div>
          <label>Min</label>
          <input
            v-model="eventConfig.release.min"
          />
          <label>Max</label>
          <input
            v-model="eventConfig.release.max"
          />
        </div>
        <!-- Duration -->
        <div>
          <label>Duration</label>
          <label>Min</label>
          <input
            v-model="eventConfig.duration.min"
          />
          <label>Max</label>
          <input
            v-model="eventConfig.duration.max"
          />
        </div>
      </div>

      <!-- Wave Controls -->
      <div>
        <h3>Wave Controls</h3>
        <div>
          <label>Wave Rest</label>
          <label>Min</label>
          <input
            v-model.number="waveConfig.rest.min"
          />
          <label>Max</label>
          <input
            v-model.number="waveConfig.rest.max"
          />
        </div>
      </div>

      <!-- Config Export -->
      <div>
        <p>
          timbreConfig: {{timbreConfig}},
          eventConfig: {{eventConfig}},
          waveConfig: {{waveConfig}}
        </p>
      </div>
  </div>
</template>
<script>
  export default {
    props: ['Tone'],
    data() {
      return {
        toneChain: {
          synth: {},
          panner: {}
        },
        timbreConfig: {
          synthConfig: {

          },
          pannerConfig: {
            positionX: 0,
            positionY: 0,
            positionZ: 0
          }
        },
        eventConfig: {
          volume: {
            min: -10,
            max: 0
          },
          octaveSelector: {
            octave: [2],
            probability: [1]
          },
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
        handler() {
          console.log(timbreConfig.pannerConfig)
        },
        deep: true
      }
    },
    methods: {
      addOctave() {
        this.octaveSelector.octave.push(2),
        this.octaveSelector.probability.push(0)
      },
      removeOctave() {
        this.octaveSelector.octave.pop()
        this.octaveSelector.probability.pop()
      },
      setConfig() {

      }
    },
    mounted() {
      this.toneChain.synth = new this.Tone.PolySynth(this.timbreConfig.synthConfig)
      this.toneChain.panner = new this.Tone.Panner3D(this.timbreConfig.pannerConfig)

      this.toneChain.synth.chain(
        this.toneChain.panner,
        this.Tone.Master
      )
    }
  }
</script>
<style>
</style>