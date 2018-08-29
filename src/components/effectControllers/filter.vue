<template>
    <div id="filter" class="patchConfig">
        <div class="title">
            <label>filter</label>
        </div>
        <div class="config">
            <label>Frequency</label>
            <input 
                :value.number="frequency" 
                @change="$emit('update:frequency', $event.target.value)"
                type="range" 
                min="0" 
                max="2000"
            />
            <label>Filter Type</label>
            <select :value="type" @change="$emit('update:type', $event.target.value)">
                <option v-for="filterType in filterArray">{{filterType}}</option>
            </select>
            <label>Filter Rolloff</label>
            <select :value.number="rolloff" @change="$emit('update:rolloff', $event.target.value)">
                <option v-for="rolloff in rolloffArray">
                    <select>{{rolloff}}</select>
                </option>
            </select>
            <label>Q</label>
            <input 
                :value.numer="Q" 
                @change="$emit('update:Q', $event.target.value)"
                type="range" 
                min="0" 
                max="50"
            />
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