<template>
	<div class="patchConfig">
		<div class="config-label">
			<label>Auto Panner</label>
		</div>
		<div class="config">
			<label>Depth</label>
			<input
				:value.number="depth"
				@change="$emit('update:depth', $event.target.value)"
				type="range"
				min="0"
				max="1"
				step="0.05"
			/>
			<label>Frequency</label>
			<input
				:value.number="frequency"
				@change="$emit('update:frequency', $event.target.value)"
				type="range"
				min="0"
				max="10"
				step="0.05"
			/>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['Tone', 'depth', 'frequency'],
		data() {
			return {
				node: {}
			}
		},
		watch: {
			depth(newDepth) {
				this.node.set({depth: newDepth})
				console.log(this.node.depth.value)
			},
			frequency(newFrequency) {
				this.node.set({frequency: newFrequency})
			}
		},
		mounted () {
			this.node = new this.Tone.AutoPanner(this.config).start()
		}
	}
</script>
<style>
</style>