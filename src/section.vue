<template>
	<div>
		<pre>Section {{lightId}}</pre>
	</div>
</template>

<script>
export default {
  props: ['lightId', 'Tone', 'hueApi', 'lightState'],
  data() {
    return {
      // Section data
      active: true,
      useHue: true,
      names: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      octaves: ['2', '3', '4', '5'],
      numEvents: ['1', '1', '3'],
      hueShiftOptions: [-2, -2, -1, 0, 1, 2, 2],
      brightnessShiftOptions: [0, 2, 4, 6, 8, 10],
      saturationShiftOptions: [-10, -5, 0],
      // Hue Config
      h: {
        in: 260,
        out: 240,
      },
      s: {
        in: 80,
        out: 50,
      },
      l: {
        in: 15,
        out: 1,
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
      feedbackDelay: { delayTime: 0.15, feedback: 0.5, wet: 0.15 },
      chorus: {
        delayTime: 3.5, depth: 0.7, feedback: 0.15, frequency: 1.5, spread: 180, type: 'sine', wet: 0.6,
      },
      EQ3: { high: '-10', low: '-11', mid: '-4' },
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
    turnOffLights() {
      this.hueApi.setLightState(this.lightId, this.lightState.create().off());
    },
    mapRange(num, inMin, inMax, outMin, outMax) {
      return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    // INIT METHODS
    resetHue() {
      this.hueApi.setLightState(this.lightId, this.lightState.create().on().hsb(this.h.out, this.s.out, this.l.out));
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

      const waveRest = (Math.random() * 15)
      let maxDuration = 0
      let eventArray = []

      // Build Wave
      for(let i = 0; i < eventCount; i++){
        const event = this.createToneEvent()
        eventArray.push(event)

        var eventDuration = event.start + event.duration + event.osc.release
        if(eventDuration > maxDuration) { maxDuration = eventDuration}
      }

      // Schedule Tone Events
      eventArray.forEach(event => this.scheduleToneEvent(event))

      // Schedule Hue Events
      if(this.useHue){
        var hueEvent = this.mungeHueData(eventArray)
        this.scheduleHueEvent(hueEvent)        
      }

      // Schedule next wave 
      if(this.active){
        this.Tone.Transport.schedule(time => {
          this.generateWave()
        }, '+' + String(maxDuration + waveRest))
        // ^ plus string starting with + means 'this many seconds after when I was called'
      }
    },
    createToneEvent() {
      // Build oscillator
      const osc = this.createOsc();

      // Timing parameters
      const duration = (Math.random() * 9) + 3;
      const start = (Math.random() * 5);
      const hueShift = { 
        volume: osc.collection.volume.value,
        nameIndex: osc.hue.nameIndex,
        octaveIndex: osc.hue.octaveIndex
      }

      delete osc.hue

      return {
        osc,
        start,
        duration,
        hueShift,
      }
    },
    createOsc() {
      // Event values
      const nameIndex = Math.floor(Math.random() * this.names.length);
      const octaveIndex = Math.floor(Math.random() * this.octaves.length);

      // Osc params
      const name = this.names[nameIndex];
      const octave = this.octaves[octaveIndex];
      const note = name + octave;
      const attack = this.randomBetween(this.attack.min, this.attack.max);
      const release = this.randomBetween(this.release.min, this.release.max);
      const volume = Math.floor(this.randomBetween(-5, -20))

      const osc = new this.Tone.OmniOscillator({
        frequency: note,
        volume: volume,
      });

      const ampEnv = new this.Tone.AmplitudeEnvelope({
        attack: attack,
        attackCurve: 'linear',
        release: release,
        releaseCurve: 'linear',
      });

      osc.partials = this.partials;
      osc.connect(ampEnv).start();
      ampEnv.connect(this.oscInNode);

      // Passing it around so it can later be disposed
      // TODO: could I set a time and dispose it here?
      ampEnv.collection = osc;
      ampEnv.hue = {
        nameIndex: nameIndex,
        octaveIndex: octaveIndex
      }
      return ampEnv;
    },
    mungeHueData(events) {
      // Munge wave data
      var hueIn = { begin: 0, duration: 0, h: this.h.in, s: this.s.in, l: this.l.in}
      var hueOut = { begin: 0, duration: 0, h: this.h.out, s: this.s.out, l: this.l.out }
      
      let eventEnd
      let totalVolChange = 0
      let totalNoteChange

      events.forEach(event => {
        if ( event.start < hueIn.begin || hueIn.begin == 0 ) { 
          hueIn.begin = event.start
          hueIn.duration = event.osc.attack
        }

        eventEnd = event.start + event.duration
        if ( eventEnd > hueOut.begin ) {
          hueOut.begin = eventEnd
          hueOut.duration = event.osc.release
        }

        totalVolChange += event.hueShift.volume
      })

      // map the volume range (total volume range * num events) to the possible brightness changes
      let volumeRange = { min: -25 * events.length, max: -5 * events.length}
      var volumeIndex = Math.floor(this.mapRange(totalVolChange, volumeRange.min, volumeRange.max, 0, this.brightnessShiftOptions.length))

      hueIn.s = this.s.in + this.saturationShiftOptions[events.length - 1]
      hueIn.l = this.l.in + this.brightnessShiftOptions[volumeIndex]

      console.log(`System: ${this.lightId}`)
      console.log(`in`, hueIn)
      console.log(`out`, hueOut)


      return {
        hueIn,
        hueOut
      }
    },
    scheduleToneEvent(event) {
      this.scheduleOsc(event.osc, event.duration, event.start);
      this.schedulePostEvent(event);
    },
    scheduleOsc(osc, eventDuration, eventStart) {
      this.Tone.Transport.schedule((time) => {
        osc.triggerAttackRelease(eventDuration);
      }, '+' + String(eventStart));
    },
    scheduleHueEvent(event){
      this.scheduleHueAttack(event.hueIn);
      this.scheduleHueRelease(event.hueOut);
    },
    scheduleHueAttack(hueIn) {
      this.Tone.Transport.schedule((time) => {
        const lightInState = this.lightState.create().on().hsb(hueIn.h, hueIn.s, hueIn.l).transition(hueIn.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightInState);
      }, ('+' + String(hueIn.begin)));
    },
    scheduleHueRelease(hueOut) {
      this.Tone.Transport.schedule((time) => {
        const lightOutState = this.lightState.create().hsb(hueOut.h, hueOut.s, hueOut.l).transition(hueOut.duration * 1000);
        this.hueApi.setLightState(this.lightId, lightOutState);
      }, (`+` + String(hueOut.begin)));
    },
    schedulePostEvent(event) {
      this.Tone.Transport.schedule((time) => {
        event.osc.dispose();
        event.osc.collection.dispose();
      }, '+' + String(event.start + event.duration + event.release + 30));
    },
  },
  mounted() {
    this.resetHue();
    this.createToneChain();
    this.startSection();
    // this.turnOffLights();
  },
};

</script>

<style lang="scss">

</style>
