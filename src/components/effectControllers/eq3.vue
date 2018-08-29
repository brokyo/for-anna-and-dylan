<template>
    <div id="eq3" class="patchConfig">
        <div class="title">
            <label>EQ</label>
        </div>
        <div class="config">
            <label>Low</label>
            <input type="range" max="0" min="-30" v-model="low"></input>
            <label>Medium</label>
            <input type="range" max="0" min="-30" v-model="mid"></input>
            <label>High</label>
            <input type="range" max="0" min="-30" v-model="high"></input>
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