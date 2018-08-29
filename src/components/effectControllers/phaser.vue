<template>
	<div id="phaser" class="patchConfig">
	    <div class="config-label">
	        <label>phaser</label>
	    </div>
	    <div class="config">
	        <label>Audibility</label>
	        <input
	        	:value.number="wet"
	        	@change="$emit('update:wet', $event.target.value)"
	        	type="range"
	        	min="0"
	        	max="1"
	        	step="0.05"
        	/>
	        <label>Base Frequency</label>
	        <input
	        	:value.number="baseFrequency"
	        	@change="$emit('update:baseFrequency', $event.target.value)"
	        	type="range"
	        	min="0"
	        	max="20000"
	        	step="1"
        	/>
	        <label>Frequency</label>
	        <input
	        	:value.number="frequency"
	        	@change="$emit('update:frequency', $event.target.value)"
	        	type="range"
	        	min="0.1"
	        	max="10"
	        	step="0.1"
        	/>
	        <label>Octaves</label>
	        <input
	        	:value.number="octaves"
	        	@change="$emit('update:octaves', $event.target.value)"
	        	type="range"
	        	min="0"
	        	max="8"
	        	step="1"
        	/>
	        <label>Stages</label>
	        <input
	        	:value.number="stages"
	        	@change="$emit('update:stages', $event.target.value)"
	        	type="range"
	        	 min="0" max="8" step="1"></input>
	        <label>Q</label>
	        <input
	        	:value.number="Q"
	        	@change="$emit('update:Q', $event.target.value)"
	        	type="range"
	        	min="0"
	        	max="20"
	        	step="1"
        	/>
	    </div>
	    <div class="code">
	    	<p>
	    		{
		    		wet: {{wet}},
		    		baseFrequency: {{baseFrequency}},
		    		frequency: {{frequency}},
		    		octaves: {{octaves}},
		    		stages: {{stages}},
		    		Q: {{Q}}
		    	}
	    	</p>
	    </div>
	</div>
</template>
<script>
export default {
  props: ['wet', 'baseFrequency', 'frequency', 'octaves', 'stages', 'Q'],
};
</script>
<style>
</style>
