<template>
    <div id="eq3" class="patchConfig">
        <div class="title">
            <label>EQ</label>
        </div>
        <div class="config">
            <label>Low</label>
            <input 
                :value.number="low"
                @change="$emit('update:low', $event.target.value)"
                type="range" 
                max="0" 
                min="-30" 
            />
            <label>Medium</label>
            <input 
                :value.number="mid"
                @change="$emit('update:mid', $event.target.value)"
                type="range" 
                max="0" 
                min="-30" 
            />
            <label>High</label>
            <input 
                :value.number="high"
                @change="$emit('update:high', $event.target.value)"
                type="range" 
                max="0" 
                min="-30" 
            />
        </div>
        <div class="code">
            <pre>
            	low: {{low}}
            	mid: {{mid}}
            	high: {{high}}
            </pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['low', 'mid', 'high']
}
</script>
<style>
</style>