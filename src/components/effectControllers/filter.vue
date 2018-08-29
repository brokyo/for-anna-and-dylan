<template>
    <div id="filter" class="patchConfig">
        <div class="title">
            <label>filter</label>
        </div>
        <div class="config">
            <label>Frequency</label>
            <input type="range" v-model.number="frequency" min="0" max="2000"></input>
            <label>Filter Type</label>
            <select v-model="type">
                <option v-for="filterType in filterArray">{{filterType}}</option>
            </select>
            <label>Filter Rolloff</label>
            <select v-model.number="rolloff">
                <option v-for="rolloff in rolloffArray">
                    <select>{{rolloff}}</select>
                </option>
            </select>
            <label>Q</label>
            <input type="range" v-model.numer="Q" min="0" max="50"></input>
        </div>
        <div class="code">
            <pre>
            	frequency: {{frequency}}
            	type: {{type}}
            	rolloff: {{rolloff}}
            	Q: {{Q}}
            </pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['frequency', 'type', 'rolloff', 'Q'],
	data() {
		return {
            filterArray: ['bandpass', 'lowpass', 'highpass', 'lowshelf', 'highshelf'],
            rolloffArray: [-12, -24, -48]
		}
	}

}
</script>