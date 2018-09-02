export default {
  name: 'synth ',
  octaves: [2, 3, 2],
  numEvents: [1, 1, 3],
  partials: [0.5, 0.2, 0.03, 0, 0.2, 0, 0.035, 0.12, 0.05, 0, 0, 0],
  chorus: {
    wet: 0.6,
    frequency: 1.5,
    delayTime: 3.5,
    depth: 0.7,
    feedback: 0.15,
    type: 'sine',
    spread: 180,
  },
  EQ3: {
    low: -10,
    mid: -11,
    high: -4,
  },
  filter: {
    Q: 0,
    active: false,
    frequency: 536,
    rolloff: -12,
    type: 'lowpass',
  },
};
