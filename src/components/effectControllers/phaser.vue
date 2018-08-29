<template>
	<div id="phaser" class="patchConfig">
	    <div class="title">
	        <label>phaser</label>
	    </div>
	    <div class="config">
	        <label>Audibility</label>
	        <input type="range" v-model.number="wet" min="0" max="1" step="0.05"></input>
	        <label>Base Frequency</label>
	        <input type="range" v-model.number="baseFrequency" min="0" max="20000" step="1"></input>
	        <label>Frequency</label>
	        <input type="range" v-model.number="frequency" min="0.1" max="10" step="0.1"></input>
	        <label>Octaves</label>
	        <input type="range" v-model.number="octaves" min="0" max="8" step="1"></input>
	        <label>Stages</label>
	        <input type="range" v-model.number="stages" min="0" max="8" step="1"></input>
	        <label>Q</label>
	        <input type="range" v-model.number="Q" min="0" max="20" step="1"></input>
	    </div>
	    <div class="code">
	    	<pre>
	    		wet: {{wet}}
	    		baseFrequency: {{baseFrequency}}
	    		frequency: {{frequency}}
	    		octaves: {{octaves}}
	    		stages: {{stages}}
	    		Q: {{Q}}
	    	</pre>
	    </div>
	</div>
</template>
<script>
export default {
	props: ['wet', 'baseFrequency', 'frequency', 'octaves', 'stages', 'Q']
}
</script>
<style>
</style>