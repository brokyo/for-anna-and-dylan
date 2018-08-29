<template>
    <div id="feedbackDelay" class="patchConfig">
        <div class="title">
            <label>feedback delay</label>
        </div>
        <div class="config">
            <label>Audibility</label>
            <input type="range" v-model.number="wet" min="0" max="1" step="0.05"></input>
            <label>Delay Time</label>
            <input type="range" v-model.number="delayTime" min="0" max="1" step="0.005"></input>
            <label>Feedback</label>
            <input type="range" v-model.number="feedback" min="0" max="1" step="0.05"></input>
        </div>
        <div class="code">
            <pre>
            	wet: {{wet}}
            	delayTime: {{delayTime}}
            	feedback: {{feedback}}
            </pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['wet', 'delayTime', 'feedback']
}
</script>
<style>
</style>