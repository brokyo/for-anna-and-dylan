export default {
  name: 'base synth',
  partials: [0.5, 0.2, 0.03, 0, 0.2, 0.075, 0.065, 0, 0, 0, 0, 0],
  chorus: {
    wet: 0.3,
    frequency: 1.5,
    delayTime: 3.5,
    depth: 0.7,
    feedback: 0.15,
    type: 'sine',
    spread: 180,
  },
  EQ3: {
    high: 0,
    low: 0,
    mid: 0,
  },
  filter: {
    Q: 0,
    active: false,
    frequency: 536,
    rolloff: -12,
    type: 'lowpass',
  },
};
