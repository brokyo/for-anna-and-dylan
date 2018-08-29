<template>
    <div class="patchConfig">
    	<div class="config-label">
    		<label>partials</label>
    	</div>
	    <div class="config">
	        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.005" 
            v-model.number="partials[index]" v-for="(partial, index) in partials"
          />
	    </div>
	    <div class="code">
	        <p>{{partials}}</p>
	    </div>
	</div>
</template>
<script>
export default {
  props: ['partials'],
};
</script>
