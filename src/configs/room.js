export default {
  name: 'room',
  tremolo: {
    wet: 0.05,
    frequency: 10,
    depth: 0.5,
    spread: 180,
    type: 'sine',
  },
  vibrato: {
    wet: 0.1,
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
    wet: 0.65,
    delayTime: 0.15,
    feedback: 0.5,
  },
  reverb: {
    roomSize: 0.7,
    dampening: 1285,
  },
  EQ3: {
    low: -18,
    mid: -18,
    high: 0,
  },
};
