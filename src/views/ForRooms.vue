<template>
  <div>
    <room-section
      :Tone='Tone'
    ></room-section>
  </div>
</template>
<script>
  // Pull in external dependencies
  import Tone from 'tone';
  import NodeHueApi from 'node-hue-api';

  import RoomSection from '@/components/RoomSection.vue'

  export default {
    components: {
      'room-section': RoomSection
    },
    data() {
      return {

      }
    },
    created() {
      this.Tone = Tone;
    }
  }
</script>
<style>
</style>