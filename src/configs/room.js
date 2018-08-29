export default {
  tremolo: {
    wet: 0.35,
    frequency: 10,
    depth: 0.6,
    spread: 180,
    type: 'sine',
  },
  vibrato: {
    wet: 0.35,
    frequency: 5,
    depth: 0.1,
    maxDelay: 0.005,
    type: 'sine',
  },
  phaser: {
    wet: 0,
    baseFrequency: 350,
    frequency: 0.5,
    octaves: 3,
    stages: 10,    
    Q: 10,
  },
  feedbackDelay: {
    wet: 0.25,
    delayTime: 0.15,
    feedback: 0.5,
  },
  reverb: {
    roomSize: 0.7,
    dampening: 1285,
  },
  EQ3: {
    high: 0,
    low: -18,
    mid: -18,
  },
};
