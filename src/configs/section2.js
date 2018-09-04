export default {
  name: 'synth 2',
  partials: [ 0.085, 0.2, 0.155, 0.23, 0.105, 0.235, 0.16, 0.185, 0.1, 0, 0, 0 ],
  chorus: { wet: 0.4, frequency: 1.5, delayTime: 2.4, depth: 0.75, feedback: 0.35, type: 'sine', spread: 82 },
  eq3: { low: -3, mid: -12, high: -5 },
  filter: { frequency: 1312, type: 'bandpass', rolloff: -12, Q: 4, },
  possibleOctaves: [3, 4, 5],
  possibleEvents: [1, 1, 3],
  maxWaveRest: 3,
  maxStartDelay: 8,
  attack: {
    min: 1,
    max: 3
  },
  release: {
    min: 1,
    max: 3
  },
  duration: {
    min: 4,
    max: 9
  },
  scale: ['in sen c']
};
