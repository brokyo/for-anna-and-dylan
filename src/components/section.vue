<!-- This component exists once for each section [light on network]  The values
in it are section-specific once on page so changing attack.min for section 2,
for example, does not change it for section 3 -->
<template>
	<div class="config-section">
		<h2>Section: {{lightId}} | Synth: {{sectionName}}</h2>
    <div class="config-component-container">
      <div class="patchConfig">
        <div class="config-label">
          <label>wave config</label>
        </div>
        <div class="config">
          <label class="label-break">Possible Octaves</label>
          <input
            class="input-array"
            v-for="(octave, index) in octaves"
            v-model="octaves[index]"
          />
          <label class="label-break">Possible Number Of Events</label>
          <input
            class="input-array"
            v-for="(event, index) in numEvents"
            v-model="numEvents[index]"
          />
          <label class="label-break">Max Wave Rest</label>
          <input 
            v-model.number="waveRest"
            type="number"
          />
          <label>Max Start Delay</label>
          <input 
            type="number"
            v-model.number="startShift"
          />
        </div>
      </div>

      <div class="patchConfig">
        <div class="config-label">
          <label>note</label>
        </div>
        <div class="config">
          <label>Attack Max</label>
          <input 
            v-model.number="attack.max"
            type="number"
          />
          <label>Attack Min</label>
          <input 
            v-model.number="attack.min"
            type="number"
          />
          <label>Release Max</label>
          <input 
            v-model.number="release.max"
            type="number"
          />
          <label>Release Min</label>
          <input 
            v-model.number="release.min"
            type="number"
          />
          <label>Duration Max</label>
          <input
            v-model.number="duration.max"
            type="number"
          />
          <label>Duration Min</label>
          <input
            v-model.number="duration.min"
            type="number"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/main.js';
export default {
  // Values shared from `app.vue`. Any changes that happen there will end up here
  props: ['lightId', 'Tone', 'hueApi', 'lightState', 'h', 's', 'b', 'partialsConfig', 'chorusConfig', 'EQ3Config', 'filterConfig', 'sectionName', 'scale'],
  // Reactive data we'll want the ability to change while the program is running
  data() {
    return {
    	// Controls
      active: false,
      useHue: true,
      synthTest: false,
      // Possibilities for light & sound. These values are selected or derived
      // / in `generateWave()` and `mungeHueData()`
      octaves: ['3', '4', '5'],
      numEvents: ['1', '3', '5'],
      hueShiftOptions: [-2, -2, -1, 0, 1, 2, 2],
      brightnessShiftOptions: [0, 2, 4, 6, 8, 10],
      saturationShiftOptions: [-10, -5, 0, 5, 10],
      attack: {
        max: 3,
        min: 1,
      },
      release: {
        max: 3,
        min: 1,
      },
      volume: {
        min: -25,
        max: 0,
      },
      waveRest: 3,
      duration: {
        max: 9,
        min: 4,
      },
      startShift: 5,
      // Tonejs Patch
      synth: {},
      chorusNode: {},
      filterNode: {},
      eq3Node: {},
      lineOut: {},
    };
  },
  // Do something when these values change
  // / Largely used to allow the live updating of the timbre by making changes
  // / to the partials on page - for example - propagate to the synth
  watch: {
    partialsConfig: {
      handler() {
        const setArray = [];
        this.partialsConfig.forEach(partial => setArray.push(partial));
        this.synth.set({
          oscillator: {
            partials: setArray,
          },
        });
      },
      deep: true,
    },
    chorusConfig: {
      handler() {
        this.chorusNode.set(this.chorusConfig);
      },
      deep: true,
    },
    EQ3Config: {
      handler() {
        this.eq3Node.set(this.EQ3Config);
      },
      deep: true,
    },
    filterConfig: {
      handler() {
        this.filterNode.set(this.filterConfig);
      },
      deep: true,
    },
  },
  methods: {
  	// /////////////
    // UTILITIES //
    // ////////////
    randomBetween(min, max) {
      return (Math.random() * max) + min;
    },
    mapRange(num, inMin, inMax, outMin, outMax) {
      return ((num - inMin) * (outMax - outMin)) / ((inMax - inMin) + outMin);
    },
    // ////////////////
    // INIT METHODS //
    // ///////////////
    createToneChain() {
      this.synth = new this.Tone.PolySynth();
      this.synth.set({ oscillator: { partials: this.partialsConfig } });
      this.chorusNode = new this.Tone.Chorus(this.chorusConfig);
      this.eq3Node = new this.Tone.EQ3(this.EQ3Config);
      this.filterNode = new this.Tone.Filter(this.filterConfig);
      this.lineOut = new this.Tone.Volume(-5);

      this.synth.chain(
        this.chorusNode,
        this.eq3Node,
        this.filterNode,
        this.lineOut,
        this.$parent.lineIn,
      );
    },
    // ///////////////////
    // CONTROL METHODS //
    // ///////////////////
    startSection() {
      this.active = true;
      this.generateWave();
    },
    stopSection() {
      this.active = false;
    },
    // Generates all the values needed to create a wave. Runs once per wave.
    // / This is the "source" of the randomness
    generateWave() {
      // Generate wave vars from options in `data`
      const eventCount = this.numEvents[Math.floor(Math.random() * this.numEvents.length)];
      const waveRest = (Math.random() * this.waveRest);
      const eventArray = [];
      let maxDuration = 0;

      const attack = this.randomBetween(this.attack.min, this.attack.max);
      const release = this.randomBetween(this.release.min, this.release.max);
      const volume = Math.floor(this.randomBetween(this.volume.max, this.volume.min));

      // Now that synth params for this wave have been set save them to be used elswhere
      const synthParams = {
        attack,
        release,
        volume,
      };

      // Set the synth to use the generated values
      this.synth.set({
        envelope: {
          attack: synthParams.attack,
          release: synthParams.release,
        },
        volume: synthParams.volume,
      });

      // Generate notes played and schedule them
      for (let i = 0; i < eventCount; i++) {
        const scaleIndex = Math.floor(Math.random() * this.scale.length);
        const octaveIndex = Math.floor(Math.random() * this.octaves.length);

        // Play params
        const scale = this.scale[scaleIndex];
        const octave = this.octaves[octaveIndex];
        const note = scale + octave;

        // Timing params
        const duration = (Math.random() * this.duration.max) + this.duration.min;
        const start = (Math.random() * this.startShift);
        const eventDuration = start + duration + release;
        if (eventDuration > maxDuration) { maxDuration = eventDuration; }

        // Now that event params have been generated store them to be used elsewhere
        const event = {
          note,
          duration,
          start,
        };

        // Schedule event
        this.scheduleToneEvent(event);
        eventArray.push(event);
      }

      // Schedule Hue Events
      if (this.useHue) {
        const hueEvent = this.mungeHueData(eventArray, synthParams);
        this.scheduleHueEvent(hueEvent);
      }

      // Schedule next wave
      if (this.active) {
        this.Tone.Transport.scheduleOnce((time) => {
          this.generateWave();
        }, `+${String(maxDuration + waveRest)}`);
        // ^ plus string starting with + means 'this many seconds after when I was called'
      }
    },
    // Take wave timing and timbre values and convert them into hue actions so that
    // / light timing and colors match the sounds
    mungeHueData(events, synth) {
      // Set defaults

      // / Hue In = how long it takes for the light to light up and what colors
      // / it lights up to.
      // / hueIn starts as soon as the first note is played and goes to the end of
      // / its attack
      const hueIn = {
        begin: 0, duration: 0, h: this.h.in, s: this.s.in, b: this.b.in,
      };

      // / Hue Out = how long it takes for the light to dim and what colors
      // / it dims to.
      // / hueOut starts as soon as the last note is played and goes to the end of
      // / its release
      const hueOut = {
        begin: 0, duration: 0, h: this.h.out, s: this.s.out, b: this.b.out,
      };

      let eventEnd;
      // Find the first and last event so that the timing of `hueIn` and `hueOut`
      // / is correct
      events.forEach((event) => {
        if (event.start < hueIn.begin || hueIn.begin === 0) {
          hueIn.begin = event.start;
          hueIn.duration = synth.attack;
        }

        eventEnd = event.start + event.duration;
        if (eventEnd > hueOut.begin) {
          hueOut.begin = eventEnd;
          hueOut.duration = synth.release;
        }
      });

      // map the volume generated to the proper brightness
      // / e.g. make quieter volumes result in less bright lights
      const volumeIndex = Math.floor(this.mapRange(synth.volume, this.volume.min, this.volume.max, 0, this.brightnessShiftOptions.length));

      hueIn.s = this.s.in + this.saturationShiftOptions[events.length - 1];
      hueIn.l = this.b.in + this.brightnessShiftOptions[volumeIndex];

      // TODO: Print this to the screen
      console.log('======');
      console.log(`System: ${this.lightId}`);
      events.forEach(event => console.log(event));
      console.log('in', hueIn);
      console.log('out', hueOut);
      console.log('======');


      return {
        hueIn,
        hueOut,
      };
    },
    // //////////////////////
    // SCHEDULING METHODS //
    // //////////////////////
    // All these events use Tone's `scheduleOnce` method which just places
    // / them at the appropriate point in the future. It's sample accurate but
    // / that doesn't matter on something like this
    scheduleToneEvent(event) {
      this.Tone.Transport.scheduleOnce((time) => {
        this.synth.triggerAttackRelease(event.note, event.duration);
      }, `+${String(event.start)}`);
    },
    scheduleHueEvent(event) {
      this.scheduleHueAttack(event.hueIn);
      this.scheduleHueRelease(event.hueOut);
    },
    scheduleHueAttack(hueIn) {
      this.Tone.Transport.scheduleOnce((time) => {
        const lightInState = this.lightState.create().on().hsb(hueIn.h, hueIn.s, hueIn.b).transition(hueIn.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightInState);
      }, (`+${String(hueIn.begin)}`));
    },
    scheduleHueRelease(hueOut) {
      this.Tone.Transport.scheduleOnce((time) => {
        const lightOutState = this.lightState.create().hsb(hueOut.h, hueOut.s, hueOut.b).transition(hueOut.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightOutState);
      }, (`+${String(hueOut.begin)}`));
    },
  },
  mounted() {
    this.createToneChain();

    eventBus.$on('start-waves', response => this.startSection())
    eventBus.$on('stop-waves', response => this.active = false)

  },
};

</script>

<style lang="scss">
.section-config {
	margin-right: 60px;
}

input[type="number"]{
  width: 40px;
}

.label-break {
  display: block;
  margin-bottom: 5px;
  margin-top: 5px;
}


</style>
