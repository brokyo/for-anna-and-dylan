<template>
	<div>
		<pre>Section {{lightId}}</pre>
	</div>
</template>

<script>
export default {
  props: ['lightId', 'Tone', 'hueApi', 'lightState', 'h', 's', 'b'],
  created() {
    this.waveRest = 3
    this.useHue = true
    this.duration = {
      max: 9,
      min: 2
    }
    this.startShift = 5
  },
  data() {
    return {
      // Section data
      active: true,
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
        max: 0
      },
      // ToneJS Config
      partials: [0.5, 0.2, 0.03, 0, 0.2],
      tremolo: {
        depth: 0.5, frequency: 10, spread: 180, type: 'sine', wet: 0.05,
      },
      vibrato: {
        depth: 0.1, frequency: 5, maxDelay: 0.005, type: 'sine', wet: 0.1,
      },
      phaser: {
        Q: 10, baseFrequency: 350, frequency: 0.5, octaves: 3, stages: 10, wet: 0,
      },
      feedbackDelay: { delayTime: 0.15, feedback: 0.5, wet: 0.65 },
      chorus: {
        delayTime: 3.5, depth: 0.7, feedback: 0.15, frequency: 1.5, spread: 180, type: 'sine', wet: 0.6,
      },
      EQ3: { high: '-10', low: '-11', mid: '-4' },
      reverb: { dampening: 3000, roomSize: 0.5 },
      filter: {
        Q: 0, active: true, frequency: 536, rolloff: -12, type: 'lowpass',
      },
      // Tonejs Patch
      synth: {},
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
      this.hueApi.setLightState(this.lightId, this.lightState.create().on().hsb(this.h.out, this.s.out, this.b.out));
    },
    createToneChain() {
      this.synth = new this.Tone.PolySynth()
      this.synth.set({ oscillator: { partials: this.partials }})
      this.oscInNode = new this.Tone.Volume()
      this.tremoloNode = new this.Tone.Tremolo(this.tremolo);
      this.vibratoNode = new this.Tone.Vibrato(this.vibrato);
      this.phaserNode = new this.Tone.Phaser(this.phaser);
      this.feedbackDelayNode = new this.Tone.FeedbackDelay(this.feedbackDelay);
      this.chorusNode = new this.Tone.Chorus(this.chorus);
      this.eq3Node = new this.Tone.EQ3(this.EQ3);
      this.filterNode = new this.Tone.Filter(this.filter);
      this.reverbNode = new this.Tone.Freeverb(this.reverb);

      this.synth.chain(this.tremoloNode, this.vibratoNode, this.phaserNode, this.feedbackDelayNode, this.chorusNode, this.eq3Node, this.reverbNode, this.filterNode, this.Tone.Master);
    },
    // CONTROL METHODS
    startSection() {
      this.generateWave();
    },
    generateWave(){
      // Set wave vars
      const eventCount = this.numEvents[Math.floor(Math.random() * this.numEvents.length)]
      const waveRest = (Math.random() * this.waveRest)
      let eventArray = []
      let maxDuration = 0

      // Set Tone Values
      // // Synth
      const attack = this.randomBetween(this.attack.min, this.attack.max);
      const release = this.randomBetween(this.release.min, this.release.max);
      const volume = Math.floor(this.randomBetween(this.volume.max, this.volume.min))

      var synthParams = {
        attack,
        release,
        volume
      }
      this.synth.set({ 
        envelope: { 
          attack: synthParams.attack, 
          release: synthParams.release
        }, 
        volume: synthParams.volume 
      })

      // // Plays
      for(let i = 0; i < eventCount; i++){
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
        var eventDuration = start + duration + release
        if(eventDuration > maxDuration) { maxDuration = eventDuration }


        var event = {
          note,
          duration,
          start
        }

        // Schedule event
        this.scheduleToneEvent(event)
        eventArray.push(event)
      }

      // Schedule Hue Events
      if(this.useHue){
        var hueEvent = this.mungeHueData(eventArray, synthParams)
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
    mungeHueData(events, synth) {
      // Munge wave data
      var hueIn = { begin: 0, duration: 0, h: this.h.in, s: this.s.in, b: this.b.in}
      var hueOut = { begin: 0, duration: 0, h: this.h.out, s: this.s.out, b: this.b.out }
      
      let eventEnd

      events.forEach(event => {
        if ( event.start < hueIn.begin || hueIn.begin == 0 ) { 
          hueIn.begin = event.start
          hueIn.duration = synth.attack
        }

        eventEnd = event.start + event.duration
        if ( eventEnd > hueOut.begin ) {
          hueOut.begin = eventEnd
          hueOut.duration = synth.release
        }
      })

      // map the volume range (total volume range * num events) to the possible brightness changes
      var volumeIndex = Math.floor(this.mapRange(synth.volume, this.volume.min, this.volume.max, 0, this.brightnessShiftOptions.length))

      hueIn.s = this.s.in + this.saturationShiftOptions[events.length - 1]
      hueIn.l = this.b.in + this.brightnessShiftOptions[volumeIndex]

      console.log('======')
      console.log(`System: ${this.lightId}`)
      events.forEach(event => console.log(event))
      console.log(`in`, hueIn)
      console.log(`out`, hueOut)
      console.log('======')


      return {
        hueIn,
        hueOut
      }
    },
    // scheduleToneEvent(event) {
    //   this.scheduleOsc(event.duration, event.start);
    //   // this.schedulePostEvent(event);
    // },
    scheduleToneEvent(event) {
      this.Tone.Transport.schedule((time) => {
        this.synth.triggerAttackRelease(event.note, event.duration);
      }, '+' + String(event.start));
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
    // schedulePostEvent(event) {
    //   this.Tone.Transport.schedule((time) => {
    //     event.osc.dispose();
    //     event.osc.collection.dispose();
    //   }, '+' + String(event.start + event.duration + event.release + 30));
    // },
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
