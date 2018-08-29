<template>
    <div id="reverb" class="patchConfig">
        <div class="title">
            <label>Reverb</label>
        </div>
        <div class="config">
            <label>Room Size</label>
            <input type="range" min="0" max="1" step="0.05" v-model="roomSize"></input>
            <label>Dampening</label>
            <input type="range" min="0" max="2000" v-model="dampening"></input>
        </div>
        <div class="code">
            <pre>
            	roomSize: {{roomSize}}
            	dampening: {{dampening}}
            </pre>
        </div>
    </div>
</template>
<script>
export default {
	props: ['roomSize', 'dampening']
}
</script>
<style>
</style>