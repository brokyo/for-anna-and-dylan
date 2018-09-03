export default {
  name: 'room 2',
  tremolo: { wet: 0.05, frequency: 1.6, depth: 0.4, type: 'sine', spread: 180 },
  vibrato: { wet: 0.1, frequency: 0.85, depth: 0.1, type: 'sine', maxDelay: 0.005 },
  phaser: { wet: 0.25, baseFrequency: 350, frequency: 1.3, octaves: 3, stages: 10, Q: 10 },
  feedbackDelay: { wet: 0.65, delayTime: 0.39, feedback: 0.65, maxDelay: 10 },
  reverb: { roomSize: 0.9, dampening: 1572 },
  EQ3: { low: -12, mid: -18, high: -10 }
};
