<template>
    <div id="vibrato" class="patchConfig">
        <div class="title">
            <label>vibrato</label>
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
            <label>Max Delay</label>
            <input type="range" v-model.number="maxDelay" min="0" max="1" step="0.005"></input>
        </div>
        <div class="code">
            <pre>
            	wet: {{wet}}
            	frequency: {{frequency}}
            	depth: {{depth}}
            	type: {{type}}
            	maxDelay: {{maxDelay}}
        	</pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['wet', 'frequency', 'depth', 'type', 'maxDelay', 'oscillatorArray']
}
</script>
<style>
</style>