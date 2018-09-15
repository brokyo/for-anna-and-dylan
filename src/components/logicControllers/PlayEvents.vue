<template>
  <div>
    <h3>Play Events</h3>
    <label>Octave Possibilities</label>
<!--     <span v-for="(octave, index) in octaveSelector.octave">
      <input
        v-model.number="octave"
      />
      <input
        v-model.numer="octaveSelector.probability[index]"
      />
 -->    </span>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        volume: {
          min: -10,
          max: 0
        },
        octaveSelector: {
          octave: [2],
          probability: [1]
        }
      }
    }
  }
</script>
<style>
</style>