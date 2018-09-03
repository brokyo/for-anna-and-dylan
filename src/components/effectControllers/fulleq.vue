<template>
	<div>
		<input 
			v-for="(filter, index) in filterChain" 
			:value="filter.gain.value"
			:key="index"
			@change="changeFilterGain(index, $event.target.value)"
			type="range"
			min="-12"
			max="12"
		/>
	</div>
</template>

<script>
	export default {
		props: ['Tone', 'lineIn', 'lineOut'],
		data() {
			return {
				equalizerFrequencies: [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000],
				filterChain: []
			}
		},
		methods: {
			createEqualizer() {
				this.equalizerFrequencies.forEach(frequency => {
					let filterConfig = {
						frequency: frequency,
						type: 'peaking',
						Q: 4.31,
						gain: 0
					}

					let filter = new this.Tone.Filter(filterConfig)

					this.filterChain.push(filter)
				})

				this.filterChain.forEach((filter, index) => {
					if (index == 0) {
						this.lineIn.connect(filter)
						filter.connect(this.filterChain[index + 1])
					} else if (index < this.filterChain.length - 1) {
						filter.connect(this.filterChain[index + 1])
					} else {
						filter.connect(this.lineOut)
					}
				})
			},
			changeFilterGain(index, value){
				this.filterChain[index].set({gain: value})
			}
		},
		mounted() {
			this.createEqualizer()
		}
	}	
</script>

<style lang="scss" scoped>
</style>