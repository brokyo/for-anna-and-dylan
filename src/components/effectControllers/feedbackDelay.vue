<template>
    <div id="feedbackDelay" class="patchConfig">
        <div class="title">
            <label>feedback delay</label>
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
            <label>Delay Time</label>
            <input 
                :value.number="delayTime" 
                @change="$emit('update:delayTime', $event.target.value)"
                type="range" 
                min="0" 
                max="1" 
                step="0.005"
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