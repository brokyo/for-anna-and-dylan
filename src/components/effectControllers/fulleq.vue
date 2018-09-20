<template>
    <div class="config-section">
      <div class="config-header">
        <button class="collapse-button" @click="EQCollapsed = !EQCollapsed">
          <span v-if="EQCollapsed">+</span>
          <span v-else>-</span>
        </button>
        <h2>Full EQ</h2>
      </div>
      <div class="config-component-container" v-show="!EQCollapsed">
      	<span class="sliderContainer"
			v-for="(filter, index) in filterChain" 
			:key="index"
		>
			<input 
				:value="filter.gain.value"
				@change="changeFilterGain(index, $event.target.value)"
				type="range"
				min="-50"
				max="12"
				orient="vertical"
				class="vertical-slider"
			/>
			<span>{{equalizerFrequencies[index]}}</span>
		</span>
      </div>
    </div>
</template>

<script>
	export default {
		props: ['Tone'],
		data() {
			return {
				lineIn: {},
				lineOut: {},
				EQCollapsed: false,
				equalizerFrequencies: [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000],
				filterChain: []
			}
		},
		methods: {
			createIO() {
				this.lineIn = new this.Tone.Gain()
				this.lineOut = new this.Tone.Gain()
			},
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
			this.createIO()
			this.createEqualizer()
		}
	}	
</script>

<style lang="scss" scoped>
.sliderContainer {
	width: 2.5%;
}

.vertical-slider {
    display: inline-block;
    margin-bottom: 5px;
    -webkit-appearance: slider-vertical;
}
</style>