<template>
    <div id="chorus" class="patchConfig">
        <div class="title">
            <label>chorus</label>
        </div>
        <div class="config">
            <label>Audibility</label>
            <input type="range" v-model.number="wet" min="0" max="1" step="0.05"></input>
            <label>Frequency</label>
            <input type="range" v-model.number="frequency" min="0.1" max="10" step="0.25"></input>
            <label>Delay Time</label>
            <input type="range" v-model.number="delayTime" min="0" max="5" step="0.1"></input>
            <label>Depth</label>
            <input type="range" v-model.number="depth" min="0" max="1" step="0.05"></input>
            <label>Feedback</label>
            <input type="range" v-model.number="feedback" min="0" max="1" step="0.05"></input>
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
                delayTime: {{delayTime}}
                depth: {{depth}}
                feedback: {{feedback}}
                type: {{type}}
                spread: {{spread}}
            </pre>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['wet', 'frequency', 'delayTime', 'depth', 'feedback', 'type', 'spread', 'oscillatorArray']
    }
</script>