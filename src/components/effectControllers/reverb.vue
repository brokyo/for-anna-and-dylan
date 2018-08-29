<template>
    <div id="reverb" class="patchConfig">
        <div class="title">
            <label>Reverb</label>
        </div>
        <div class="config">
            <label>Room Size</label>
            <input 
                :value.number="roomSize"
                @change="$emit('update:roomSize', $event.target.value)"
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
            />
            <label>Dampening</label>
            <input 
                :value.numer="dampening"
                @change="$emit('update:dampening', $event.target.value)"
                type="range" 
                min="0" 
                max="2000" 
            />
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