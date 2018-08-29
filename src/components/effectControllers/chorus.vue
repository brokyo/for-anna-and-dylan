<template>
    <div id="chorus" class="patchConfig">
        <div class="config-label">
            <label>chorus</label>
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
            <label>Delay Time</label>
            <input
                :value.number="delayTime"
                @change="$emit('update:delayTime', $event.target.value)"
                type="range"
                min="0"
                max="5"
                step="0.1"
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
            <label>Feedback</label>
            <input
                :value.number="feedback"
                @change="$emit('update:feedback', $event.target.value)"
                type="range"
                min="0"
                max="1"
                step="0.05"
            />
            <label>Oscillator</label>
            <select :value="type" @change="$emit('update:type', $event.target.value)">
                <option v-for="oscillator in oscillatorArray">{{oscillator}}</option>
            </select>
            <label>Spread</label>
            <input
                :value.number="spread"
                @change="$emit('update:spread', $event.target.value)"
                type="range"
                min="0"
                max="180"
                step="1"
            />
        </div>
        <p class="code">
            {        
                wet: {{wet}},
                frequency: {{frequency}},
                delayTime: {{delayTime}},
                depth: {{depth}},
                feedback: {{feedback}},
                type: {{type}},
                spread: {{spread}}
            }   
        </p>
    </div>
</template>
<script>
export default {
  props: ['wet', 'frequency', 'delayTime', 'depth', 'feedback', 'type', 'spread', 'oscillatorArray'],
};
</script>
