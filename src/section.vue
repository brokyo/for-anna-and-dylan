<template>
	<div>
		<pre>Section {{lightId}}</pre>
		<pre>{{activeEvent}}</pre>
	</div>
</template>

<script>
export default {
  props: ['lightId', 'Tone', 'hueApi', 'lightState'],
  data() {
    return {
      // Section data
      active: true,
      activeEvent: {},
      names: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      nameHueShiftOptions: [-2, -2, -1, 0, 1, 2, 2],
      partials: [0.15, 0, 0.03, 0, 0.025, 0.01, 0.025, 0, 0.025, 0, 0.03, 0, 0.035, 0, 0, 0.085, 0.07],
      octaves: ['2', '3', '4', '5'],
      octaveBrightnessShiftOptions: [-2, 0, 2],
      h: {
        in: 20,
        out: 0,
      },
      s: {
        in: 100,
        out: 70,
      },
      l: {
        in: 40,
        out: 0,
      },
      attack: {
        max: 3,
        min: 1,
      },
      release: {
        max: 8,
        min: 3,
      },
      // Tonejs Patch
      tremolo: {},
      vibrato: {},
      phaser: {},
      reverb: {},
      feedbackDelay: {},
      chorus: {},
      eq3: {},
      filter: {},
    };
  },
  methods: {
    // UTILITIES
    randomBetween(min, max) {
      return (Math.random() * max) + min;
    },
    currentTime() {
      return this.Tone.Transport.toSeconds(`${this.Tone.Transport.ticks}i`);
    },
    normalizeRange(val, max, min) {
      return (val - min) / (max - min);
    },
    turnOffLights() {
      this.hueApi.setLightState(this.lightId, this.lightState.create().off());
    },
    mapRange(num, inMin, inMax, outMin, outMax) {
      return (num - inMin) * (moutMax - outMin) / (inMax - inMin) + outMin;
    },
    // INIT METHODS
    resetHue() {
      this.hueApi.setLightState(this.lightId, this.lightState.create().on().hsb(25, 0, 0));
    },
    createToneChain() {
      this.tremolo = new this.Tone.Tremolo({
        depth: 0.5,
        frequency: 3,
        spread: 180,
        type: 'sine',
        wet: 0.05,
      });

      this.vibrato = new this.Tone.Vibrato({
        depth: 0.1,
        frequency: 3,
        maxDelay: 0.005,
        type: 'sine',
        wet: 0.1,
      });

      this.phaser = new this.Tone.Phaser({
        Q: 10,
        baseFrequency: 300,
        frequency: 0.5,
        octaves: 3,
        stages: 10,
        wet: 0,
      });

      this.feedbackDelay = new this.Tone.FeedbackDelay({
        delayTime: 0.2,
        feedback: 0.5,
        wet: 0.05,
      });

      this.chorus = new this.Tone.Chorus({
        delayTime: 3.5,
        depth: 0.4,
        feedback: 0.15,
        frequency: 1.5,
        spread: 180,
        type: 'sine',
        wet: 0.6,
      });

      this.eq3 = new this.Tone.EQ3({
        high: '-10',
        low: '-14',
        mid: '-5',
      });

      this.filter = new this.Tone.Filter({
        Q: 0,
        active: true,
        frequency: 536,
        rolloff: -12,
        type: 'lowpass',
      });

      this.reverb = new this.Tone.Freeverb({
        roomSize: 0.2,
        dampening: 3000,
      });

      this.tremolo.chain(this.vibrato, this.phaser, this.feedbackDelay, this.chorus, this.eq3, this.filter, this.reverb, this.Tone.Master);
      // this.reverb = new this.Tone.Freeverb()
    },
    // CONTROL METHODS
    startSection() {
      this.generateEvent();
    },
    generateEvent(previousEventStart = 0, previousEventDuration = 0, previousEventRelease = 0) {
      this.Tone.Transport.schedule((time) => {
        // generated oscillator parameters
        const nameNumber = Math.floor(Math.random() * this.names.length);
        const name = this.names[nameNumber];
        const hueShift = this.nameHueShiftOptions[nameNumber];

        const octaveNumber = Math.floor(Math.random() * this.octaves.length);
        const octave = this.octaves[octaveNumber];
        const octaveShift = this.octaveBrightnessShiftOptions[octaveNumber];

        const lightShift = {
          h: hueShift,
          l: octaveShift,
        };


        const note = name + octave;
        const attackTime = this.randomBetween(this.attack.min, this.attack.max);
        const releaseTime = this.randomBetween(this.release.min, this.release.max);

        // Build oscillator
        const osc = this.createOsc(note, attackTime, releaseTime);

        // Generate event parameters
        const previousEventEnd = previousEventStart + previousEventRelease + previousEventDuration;
        const eventGap = (Math.random() * 19) + 2;
        const eventStart = previousEventEnd + eventGap;
        const eventDuration = (Math.random() * 9) + 3;


        this.activeEvent = {
          note,
          duration: eventDuration,
          attack: attackTime,
          release: releaseTime,
          hShift: lightShift.h,
          lShift: lightShift.l,
        };
        // Schedule event
        this.scheduleEvent(osc, eventStart, eventDuration, lightShift);
      }, this.currentTime() + previousEventDuration + previousEventRelease);
    },
    // Returns an oscillator connected to an amplitude envelope (think of it like
    // a single key on a piano) that's built to play a certain sound for a certain
    // duration
    createOsc(note, attackTime, releaseTime) {
      const osc = new this.Tone.OmniOscillator({
        frequency: note,
        volume: -5,
      });

      const ampEnv = new this.Tone.AmplitudeEnvelope({
        attack: attackTime,
        attackCurve: 'linear',
        release: releaseTime,
        releaseCurve: 'linear',
      });

      osc.partials = this.partials;
      osc.connect(ampEnv).start();
      ampEnv.chain(this.tremolo);

      // Dispose of ampenv
      ampEnv.collection = osc;
      return ampEnv;
    },
    // Schedules a play event (oscillator firing and light changing)
    scheduleEvent(osc, eventStart, eventDuration, lightShift) {
      this.Tone.Transport.schedule((time) => {
        this.scheduleOsc(osc, eventDuration);
        this.scheduleHueAttack(osc.attack, lightShift);
        this.scheduleHueRelease(eventDuration, osc.release, time, lightShift);
        this.schedulePostEvent(osc, eventDuration, time);

        if (this.active) {
          this.generateEvent(eventStart, eventDuration, osc.release);
        }
      }, eventStart);
    },
    scheduleOsc(osc, eventDuration) {
      this.Tone.Transport.schedule((time) => {
        osc.triggerAttackRelease(eventDuration);
      });
    },
    scheduleHueAttack(attackLength, lightShift) {
      this.Tone.Transport.schedule((time) => {
        const shiftedH = this.h.in + lightShift.h;
        const shiftedL = this.l.in + lightShift.l;
        const lightIn = this.lightState.create().on().hsl(shiftedH, this.s.in, shiftedL).transition(attackLength * 1000);
        this.hueApi.setLightState(this.lightId, lightIn);
      });
    },
    scheduleHueRelease(releaseStart, releaseTime, transportTime, lightShift) {
      this.Tone.Transport.schedule((time) => {
        const lightOut = this.lightState.create().off().transition(releaseTime * 1000);
        this.hueApi.setLightState(this.lightId, lightOut);
      }, transportTime + releaseStart);
    },
    schedulePostEvent(osc, eventDuration, transportTime) {
      this.Tone.Transport.schedule((time) => {
        osc.dispose();
        osc.collection.dispose();
      }, transportTime + eventDuration + osc.release);
    },
  },
  mounted() {
    // this.hueApi.lights().then(data => console.log(data))
    // this.resetHue();
    // this.createToneChain();
    // this.startSection();
    this.turnOffLights();
  },
};

</script>

<style lang="scss">

</style>
