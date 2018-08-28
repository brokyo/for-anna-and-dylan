<!-- This component exists once for each section [light on network]  The values
in it are section-specific once on page so changing attack.min for section 2,
for example, does not change it for section 3 -->
<template>
	<div class="sectionContainer">
		<h2>Section {{lightId}}</h2>
		<button @click="startSynth" v-if="!synthTest">Test Synth</button>
    <button @click="stopSynth" v-else>Stop Synth</button>
		<button v-if="active" @click="stopSection">Stop</button>
		<button v-else @click="startSection">Make Waves</button>
		<div>
			<h3>Timing</h3>
			<div class="configContainer">
				<div class="timingItem">
					<label>Wave Rest</label>
					<input v-model.number="waveRest">
				</div>
				<div class="timingItem">
					<label>Max Duration</label>
					<input v-model.number="duration.max">
					<label>Min Duration</label>
					<input v-model.number="duration.min">
				</div>
				<div class="timingItem">
					<label>Start Shift</label>
					<input v-model.number="startShift">
				</div>
			</div>
		</div>
		<div id="timbreConfig">
			<h3>Timbre</h3>
			<div class="configContainer">
				<div class="timbreItem">
					<h4>Partials</h4>
					<input
						type="range"
						min="0"
						max="1"
						step="0.005"
            v-for="(partial, index) in partialsConfig"
						v-model.number="partialsConfig[index]"
						:key="index"
					>
				</div>
				<div class="timbreItem">
					<h4>EQ3</h4>
					<label>Low</label>
					<input type="range" max="0" min="-30" v-model="EQ3Config.low">
					<label>Medium</label>
					<input type="range" max="0" min="-30" v-model="EQ3Config.mid">
					<label>High</label>
					<input type="range" max="0" min="-30" v-model="EQ3Config.high">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  // Values shared from `app.vue`. Any changes that happen there will end up here
  props: ['lightId', 'Tone', 'hueApi', 'lightState', 'h', 's', 'b', 'config'],
  // Reactive data we'll want the ability to change while the program is running
  data() {
    return {
    	// Controls
      active: false,
      useHue: true,
      synthTest: false,
      // Possibilities for light & sound. These values are selected or derived
      // / in `generateWave()` and `mungeHueData()`
      names: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      octaves: ['3', '4', '5'],
      numEvents: ['1', '1', '3'],
      hueShiftOptions: [-2, -2, -1, 0, 1, 2, 2],
      brightnessShiftOptions: [0, 2, 4, 6, 8, 10],
      saturationShiftOptions: [-10, -5, 0],
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
        max: -5,
      },
      waveRest: 3,
      duration: {
        max: 9,
        min: 2,
      },
      startShift: 5,
      // Tonejs Config
      partialsConfig: {},
      chorusConfig: {},
      EQ3Config: {},
      filterConfig: {},
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
    EQ3Config: {
      handler() {
        this.eq3Node.set(this.EQ3Config);
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
        this.$parent.lineIn
      );
    },
    // ///////////////////
    // CONTROL METHODS //
    // ///////////////////
    startSynth() {
      this.synth.triggerAttackRelease(220);
    },
    stopSynth() {
      this.synth.triggerRelease(220)
    },
    stopSection() {
      this.active = false;
    },
    startSection() {
      this.active = true;
      this.generateWave();
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
        const nameIndex = Math.floor(Math.random() * this.names.length);
        const octaveIndex = Math.floor(Math.random() * this.octaves.length);

        // Play params
        const name = this.names[nameIndex];
        const octave = this.octaves[octaveIndex];
        const note = name + octave;

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
      const volumeIndex = Math.floor(this.mapRange(synth.volume, this.volume.min, this.volume.max + this.volume.mind, 0, this.brightnessShiftOptions.length));

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
        console.log('IN')
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
    // As soon as the component is mounted assign the config values so they can
    /// be used by the synth patch
    /// TODO: `Object.assign()` used to create a new object so sections can independently
    /// change values. Rethink this later 
    var configDeepCopy = Object.assign({}, this.config)
    this.partialsConfig = configDeepCopy.partials;
    this.chorusConfig = configDeepCopy.chorus;
    this.EQ3Config = configDeepCopy.EQ3;
    this.filterConfig = configDeepCopy.filter;
    this.createToneChain();
    // this.startSection();
  },
};

</script>

<style lang="scss">
.sectionContainer {
	margin-top: 80px;
}
input {
	display: block;
}
label {
	display: block;
}
.configContainer {
	display: flex;
}
.timbreItem {
	margin-right: 60px;
}
</style>
