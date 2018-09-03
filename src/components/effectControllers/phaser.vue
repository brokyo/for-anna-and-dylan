<template>
	<div id="phaser" class="patchConfig">
	    <div class="config-label">
	        <label>phaser</label>
	    </div>
	    <div class="config">
	        <label>Audibility</label>
	        <input
	        	v-model="config.wet"
	        	type="range"
	        	min="0"
	        	max="1"
	        	step="0.05"
        	/>
	        <label>Base Frequency</label>
	        <input
	        	v-model="config.baseFrequency"
	        	type="range"
	        	min="0"
	        	max="1500"
	        	step="1"
        	/>
	        <label>Frequency</label>
	        <input
	        	v-model="config.frequency"
	        	type="range"
	        	min="0.1"
	        	max="10"
	        	step="0.1"
        	/>
	        <label>Octaves</label>
	        <input
	        	v-model="config.octaves"
	        	type="range"
	        	min="0"
	        	max="8"
	        	step="1"
        	/>
	        <label>Stages</label>
	        <input
	        	v-model="config.stages"
	        	type="range"
	        	 min="0" 
	        	 max="8" 
	        	 step="1"
      	  />
	        <label>Q</label>
	        <input
	        	v-model="config.Q"
	        	type="range"
	        	min="0"
	        	max="20"
	        	step="1"
        	/>
	    </div>
	    <div class="code">
	    	<p>
	    		{
		    		wet: {{config.wet}},
		    		baseFrequency: {{config.baseFrequency}},
		    		frequency: {{config.frequency}},
		    		octaves: {{config.octaves}},
		    		stages: {{config.stages}},
		    		Q: {{config.Q}}
		    	}
	    	</p>
	    </div>
	</div>
</template>
<script>
export default {
  props: ['config', 'Tone'],
  data() {
  	return {
  		node: {}
  	}
  },
  watch:{
    config: {
        handler() {
            this.node.set(this.config)
        },
        deep: true
    }
  },
  mounted() {
    this.node = new this.Tone.Phaser(this.config);
  }
};
</script>
<style>
</style>
