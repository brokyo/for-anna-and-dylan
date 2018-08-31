<template>
    <div id="vibrato" class="patchConfig">
        <div class="config-label">
            <label>vibrato</label>
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
            <label>Frequency</label>
            <input
                :value.number="frequency"
                @change="$emit('update:frequency', $event.target.value)"
                type="range"
                min="0.1"
                max="10"
                step="0.25"
            />
            <label>Depth</label>
            <input
                :value.number="depth"
                @change="$emit('update:depth', $event.target.value)"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Oscillator</label>
            <select
                :value="type"
                @change="$emit('update:type', $event.target.value)">
                <option v-for="oscillator in oscillatorArray">{{oscillator}}</option>
            </select>
            <label>Max Delay</label>
            <input
                :value.number="maxDelay"
                @change="$emit('update:maxDelay', $event.target.value)"
                type="range"
                min="0"
                max="1"
                step="0.005"
            />
        </div>
        <p class="code">
            {
                wet: {{wet}},
                frequency: {{frequency}},
                depth: {{depth}},
                type: {{type}},
                maxDelay: {{maxDelay}}                
            }
        </p>
    </div>
</template>
<script>
export default {
  props: ['wet', 'frequency', 'depth', 'type', 'maxDelay', 'oscillatorArray'],
};
</script>
<style>
</style>
