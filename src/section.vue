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
      octaves: ['2', '3', '4', '5'],
      numEvents: ['1', '1', '3'],
      octaveBrightnessShiftOptions: [-2, 0, 2],
      // Hue Config
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
      // ToneJS Config
      partials: [0.165, 0, 0.03, 0, 0.025, 0, 0.025, 0, 0.025, 0, 0.03, 0, 0.035, 0, 0, 0.085, 0.07],
      tremolo: {
        depth: 0.5, frequency: 10, spread: 180, type: 'sine', wet: 0.05,
      },
      vibrato: {
        depth: 0.1, frequency: 5, maxDelay: 0.005, type: 'sine', wet: 0.1,
      },
      phaser: {
        Q: 10, baseFrequency: 350, frequency: 0.5, octaves: 3, stages: 10, wet: 0,
      },
      feedbackDelay: { delayTime: 0.015, feedback: 0.5, wet: 0.05 },
      chorus: {
        delayTime: 3.5, depth: 0.7, feedback: 0.15, frequency: 1.5, spread: 180, type: 'sine', wet: 0.6,
      },
      EQ3: { high: 0, low: '-21', mid: '-12' },
      reverb: { dampening: 3000, roomSize: 0 },
      filter: {
        Q: 0, active: true, frequency: 536, rolloff: -12, type: 'lowpass',
      },
      // Tonejs Patch
      oscInNode: {},
      tremoloNode: {},
      vibratoNode: {},
      phaserNode: {},
      feedbackDelayNode: {},
      chorusNode: {},
      eq3Node: {},
      filterNode: {},
      reverbNode: {},
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

      this.oscInNode = new this.Tone.Volume()
      this.tremoloNode = new this.Tone.Tremolo(this.tremolo);
      this.vibratoNode = new this.Tone.Vibrato(this.vibrato);
      this.phaserNode = new this.Tone.Phaser(this.phaser);
      this.feedbackDelayNode = new this.Tone.FeedbackDelay(this.feedbackDelay);
      this.chorusNode = new this.Tone.Chorus(this.chorus);
      this.eq3Node = new this.Tone.EQ3(this.EQ3);
      this.filterNode = new this.Tone.Filter(this.filter);
      this.reverbNode = new this.Tone.Freeverb(this.reverb);

      this.oscInNode.chain(this.tremoloNode, this.vibratoNode, this.phaserNode, this.feedbackDelayNode, this.chorusNode, this.eq3Node, this.reverbNode, this.filterNode, this.Tone.Master);
    },
    // CONTROL METHODS
    startSection() {
      this.generateWave();
    },
    generateWave(){
      // Pick number of events in wave and create them
      const eventCount = this.numEvents[Math.floor(Math.random() * this.numEvents.length)]
      console.log(`system: ${this.lightId} wave events: ${eventCount}`)
      const waveRest = 2
      let maxDuration = 0

      for(let i = 0; i < eventCount; i++){
        const event = this.generateEvent()
        const eventLength = event.start + event.duration + event.release

        if(eventLength > maxDuration) { maxDuration = eventLength }

        // schedule event
        this.scheduleEvent(event)
      }

      // Weird stringing thing because a string starting with a + in tone means
      // this many seconds after the current time 
      if(this.active){
        this.Tone.Transport.schedule(time => {
          this.generateWave()
        }, '+' + String(maxDuration + waveRest))
      }

    },
    generateEvent() {
      // Event values
      const nameNumber = Math.floor(Math.random() * this.names.length);
      const octaveNumber = Math.floor(Math.random() * this.octaves.length);

      // Osc params
      const name = this.names[nameNumber];
      const octave = this.octaves[octaveNumber];
      const note = name + octave;
      const attack = this.randomBetween(this.attack.min, this.attack.max);
      const release = this.randomBetween(this.release.min, this.release.max);

      // Build oscillator
      const osc = this.createOsc(note, attack, release);

      // Light params
      const hueShift = this.nameHueShiftOptions[nameNumber];
      const octaveShift = this.octaveBrightnessShiftOptions[octaveNumber];
      const lightShift = { h: hueShift, l: octaveShift };

      // Timing parameters
      const duration = (Math.random() * 9) + 3;
      const start = (Math.random() * 3);

      return {
        osc,
        start,
        release,
        duration,
        lightShift
      }
    },
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
      ampEnv.connect(this.oscInNode);

      // Dispose of ampenv
      ampEnv.collection = osc;
      return ampEnv;
    },
    scheduleEvent(event) {
      this.scheduleOsc(event.osc, event.duration, event.start);
      this.scheduleHueAttack(event.osc.attack, event.lightShift);
      this.scheduleHueRelease(event.duration, event.release, event.lightShift);
      this.schedulePostEvent(event);
    },
    scheduleOsc(osc, eventDuration, eventStart) {
      this.Tone.Transport.schedule((time) => {
        osc.triggerAttackRelease(eventDuration);
      }, '+' + String(eventStart));
    },
    scheduleHueAttack(attackLength, lightShift) {
      this.Tone.Transport.schedule((time) => {
        const shiftedH = this.h.in + lightShift.h;
        const shiftedL = this.l.in + lightShift.l;
        const lightIn = this.lightState.create().on().hsl(shiftedH, this.s.in, shiftedL).transition(attackLength * 1000);
        this.hueApi.setLightState(this.lightId, lightIn);
      });
    },
    scheduleHueRelease(releaseStart, releaseTime, lightShift) {
      this.Tone.Transport.schedule((time) => {
        const lightOut = this.lightState.create().off().transition(releaseTime * 1000);
        this.hueApi.setLightState(this.lightId, lightOut);
      }, + + String(releaseStart));
    },
    schedulePostEvent(event) {
      this.Tone.Transport.schedule((time) => {
        event.osc.dispose();
        event.osc.collection.dispose();
      }, '+' + String(event.start + event.duration + event.release));
    },
  },
  mounted() {
    this.resetHue();
    this.createToneChain();
    this.startSection();
    // this.turnOffLights();
    // this.createOsc().triggerAttackRelease(2)
  },
};

</script>

<style lang="scss">

</style>
