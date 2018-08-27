export default {
  tremolo: {
    depth: 0.5, 
    frequency: 10,
    spread: 180, 
    type: 'sine', 
    wet: 0.05,
  },
  vibrato: {
    depth: 0.1, 
    frequency: 5, 
    maxDelay: 0.005, 
    type: 'sine', 
    wet: 0.1,
  },
  phaser: {
    Q: 10, 
    baseFrequency: 350, 
    frequency: 0.5, 
    octaves: 3, 
    stages: 10, 
    wet: 0,
  },
  feedbackDelay: { 
    delayTime: 0.15, 
    feedback: 0.5, 
    wet: 0.65 },
  reverbConfig: { 
    dampening: 3000, 
    roomSize: 0.5 
  },
  EQ3: { 
    high: '-10', 
    low: '-11', 
    mid: '-4' 
  }
}