<template>
    <div id="tremolo" class="patchConfig">
        <div class="title">
            <label>tremolo</label>
        </div>
        <div class="config">
            <label>Audibility</label>
            <input type="range" v-model.number="wet" min="0" max="1" step="0.05"></input>
            <label>Frequency</label>
            <input type="range" v-model.number="frequency" min="0.1" max="10" step="0.25"></input>
            <label>Depth</label>
            <input type="range" v-model.number="depth" min="0" max="1" step="0.05"></input>
            <label>Oscillator</label>
            <select v-model="type">
                <option v-for="oscillator in oscillatorArray">{{oscillator}}</option>
            </select>
            <label>Spread</label>
            <input type="range" v-model.number="spread" min="0" max="180" step="1"></input>
        </div>
        <div class="code">
        	<pre>
        		wet: {{wet}}
        		frequency: {{frequency}}
        		depth: {{depth}}
        		spread: {{spread}}
        	</pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['wet', 'frequency', 'depth', 'spread', 'type', 'oscillatorArray']
}
</script>
<style>
</style>