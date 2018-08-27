<template>
	<div class="sectionContainer">
		<h2>Section {{lightId}}</h2>
		<button @click="testSynth">Test Synth</button>
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
						v-model.number="partialsConfig[index]"
						v-for="(partial, index) in partialsConfig"
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
  props: ['lightId', 'Tone', 'hueApi', 'lightState', 'h', 's', 'b', 'config'],
  created() {
    this.partialsConfig = this.config.partials;
    this.chorusConfig = this.config.chorus;
    this.EQ3Config = this.config.EQ3;
    this.filterConfig = this.config.filter;
  },
  data() {
    return {
      active: true,
      useHue: false,
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
        max: 0,
      },
      waveRest: 3,
      duration: {
        max: 9,
        min: 2,
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
    // UTILITIES
    randomBetween(min, max) {
      return (Math.random() * max) + min;
    },
    mapRange(num, inMin, inMax, outMin, outMax) {
      return ((num - inMin) * (outMax - outMin)) / ((inMax - inMin) + outMin);
    },
    // INIT METHODS
    createToneChain() {
      this.synth = new this.Tone.PolySynth();
      this.synth.set({ oscillator: { partials: this.partialsConfig } });
      this.chorusNode = new this.Tone.Chorus(this.chorusConfig);
      this.eq3Node = new this.Tone.EQ3(this.EQ3Config);
      this.filterNode = new this.Tone.Filter(this.filterConfig);
      this.lineOut = new this.Tone.Volume();

      this.synth.chain(this.chorusNode, this.filterNode, this.eq3Node, this.filterNode, this.lineOut, this.$parent.lineIn);
    },
    // CONTROL METHODS
    testSynth() {
      this.synth.triggerAttackRelease(220, 2);
    },
    stopSection() {
      this.active = false;
    },
    startSection() {
      this.active = true;
      this.generateWave();
    },
    generateWave() {
      // Set wave vars
      const eventCount = this.numEvents[Math.floor(Math.random() * this.numEvents.length)];
      const waveRest = (Math.random() * this.waveRest);
      const eventArray = [];
      let maxDuration = 0;

      // Set Tone Values
      // // Synth
      const attack = this.randomBetween(this.attack.min, this.attack.max);
      const release = this.randomBetween(this.release.min, this.release.max);
      const volume = Math.floor(this.randomBetween(this.volume.max, this.volume.min));

      const synthParams = {
        attack,
        release,
        volume,
      };
      this.synth.set({
        envelope: {
          attack: synthParams.attack,
          release: synthParams.release,
        },
        volume: synthParams.volume,
      });

      // // Plays
      for (let i = 0; i < eventCount; i++) {
        const nameIndex = Math.floor(Math.random() * this.names.length);
        const octaveIndex = Math.floor(Math.random() * this.octaves.length);

        // Osc params
        const name = this.names[nameIndex];
        const octave = this.octaves[octaveIndex];
        const note = name + octave;

        // Timing parameters
        const duration = (Math.random() * this.duration.max) + this.duration.min;
        const start = (Math.random() * this.startShift);

        // Hue Parameters
        const eventDuration = start + duration + release;
        if (eventDuration > maxDuration) { maxDuration = eventDuration; }


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
        this.Tone.Transport.schedule((time) => {
          this.generateWave();
        }, `+${String(maxDuration + waveRest)}`);
        // ^ plus string starting with + means 'this many seconds after when I was called'
      }
    },
    mungeHueData(events, synth) {
      // Munge wave data
      const hueIn = {
        begin: 0, duration: 0, h: this.h.in, s: this.s.in, b: this.b.in,
      };
      const hueOut = {
        begin: 0, duration: 0, h: this.h.out, s: this.s.out, b: this.b.out,
      };

      let eventEnd;

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

      // map the volume range (total volume range * num events) to the possible brightness changes
      const volumeIndex = Math.floor(this.mapRange(synth.volume, this.volume.min, this.volume.max, 0, this.brightnessShiftOptions.length));

      hueIn.s = this.s.in + this.saturationShiftOptions[events.length - 1];
      hueIn.l = this.b.in + this.brightnessShiftOptions[volumeIndex];

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
    // scheduleToneEvent(event) {
    //   this.scheduleOsc(event.duration, event.start);
    //   // this.schedulePostEvent(event);
    // },
    scheduleToneEvent(event) {
      this.Tone.Transport.schedule((time) => {
        this.synth.triggerAttackRelease(event.note, event.duration);
      }, `+${String(event.start)}`);
    },
    scheduleHueEvent(event) {
      this.scheduleHueAttack(event.hueIn);
      this.scheduleHueRelease(event.hueOut);
    },
    scheduleHueAttack(hueIn) {
      this.Tone.Transport.schedule((time) => {
        const lightInState = this.lightState.create().on().hsb(hueIn.h, hueIn.s, hueIn.l).transition(hueIn.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightInState);
      }, (`+${String(hueIn.begin)}`));
    },
    scheduleHueRelease(hueOut) {
      this.Tone.Transport.schedule((time) => {
        const lightOutState = this.lightState.create().hsb(hueOut.h, hueOut.s, hueOut.l).transition(hueOut.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightOutState);
      }, (`+${String(hueOut.begin)}`));
    },
    // schedulePostEvent(event) {
    //   this.Tone.Transport.schedule((time) => {
    //     event.osc.dispose();
    //     event.osc.collection.dispose();
    //   }, '+' + String(event.start + event.duration + event.release + 30));
    // },
  },
  mounted() {
    // this.createToneChain();
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
