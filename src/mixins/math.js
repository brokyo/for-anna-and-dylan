import weightedRandom from 'weighted-random'

export default {
	methods: {
      randomBetween(min, max) {
        return (Math.random() * Number(max)) + Number(min);
      },
      randomIndex(length) {
        return Math.floor(Math.random() * length)
      },
      mapRange(num, inMin, inMax, outMin, outMax) {
        return ((Number(num) - Number(inMin)) * (Number(outMax) - Number(outMin))) / ((Number(inMax) - Number(inMin)) + Number(outMin));
      },
      pickWeightedRandom(options){
        let weights = options.map(option => option.weight)
        let selectedIndex = weightedRandom(weights)
        return options[selectedIndex].option
      }
	}
}