export default {

  name: 'EAC1: Sweeps',

  bus: {},

  config: {
    synth: {
      oscillator: { partials: [0.165, 0, 0.03, 0, 0.025, 0, 0.025, 0, 0.025, 0, 0.03, 0, 0.035, 0, 0, 0.085, 0.07] },
      envelope: {
        attack: 3.8, attackCurve: 'linear', decay: 0.1, release: 3.75, releaseCurve: 'linear', sustain: 0.2,
      },
    },
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
  },

  patch: {
    synth: {}, tremolo: {}, vibrato: {}, phaser: {}, feedbackDelay: {}, chorus: {}, EQ3: {}, reverb: {}, filter: {}, autoPanner: {}, out: {},
  },

  loop: {},

  // Pass AssembleSynth() a reference to ToneJS so it can do Tone stuff.

  assembleSynth(Tone) { 
    this.patch.synth = new Tone.PolySynth(10, Tone.Synth); 
    this.patch.synth.set(this.config.synth); 
    console.log(this.config)
    this.patch.tremolo = new Tone.Tremolo(this.config.tremolo); 
    this.patch.vibrato = new Tone.Vibrato(this.config.vibrato); 
    this.patch.phaser = new Tone.Phaser(this.config.phaser); 
    this.patch.feedbackDelay = new Tone.FeedbackDelay(this.config.feedbackDelay); 
    this.patch.chorus = new Tone.Chorus(this.config.chorus); 
    this.patch.EQ3 = new Tone.EQ3(this.config.EQ3); 
    this.patch.reverb = new Tone.Freeverb(this.config.reverb); 
    if (this.patch.filter.active) { 
      this.patch.filter = new Tone.Filter(this.config.filter); 
    } else { 
      this.patch.filter = new Tone.Gain(); 
    } 
    this.patch.out = new Tone.Gain(); 

    this.patch.synth.chain(this.patch.tremolo, this.patch.vibrato, this.patch.phaser, this.patch.feedbackDelay, this.patch.chorus, this.patch.EQ3, this.patch.reverb, this.patch.filter, this.patch.out); 

    return new Promise((resolve, reject) => { resolve(true); }); },

  start() {},

};
