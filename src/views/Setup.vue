<template>
  <div>
    <p>Hit the button on your hue bridge then click the button below</p>
    <p>Copy down these values then <router-link to="/full">full</router-link></p>
    <button @click="getHueConfig">Get Hue Config</button>
    <pre>IP: {{ip}}</pre>
    <pre>username: {{username}}</pre>
    <pre>Lights: {{lights}}</pre>
  </div>
</template>

<script>
  import hue from 'node-hue-api';
  var hueApi = hue.HueApi

  export default {
    data() {
      return {
        ip: '',
        username: '',
        lights: [],
        hueApi: {}
      }
    },
    methods: {
      getHueConfig() {
        hue.nupnpSearch()
        .then(data => {
          this.ip = data[0].ipaddress
          return this.ip
        })
        .then(data => {
          let api =  new hueApi()
          api.registerUser(this.ip, "waves")
        })
        .then(user => {
          console.log(user)
        })
        // .then(_ => {
        //   let api = new hue.hueApi(this.ip, this.username)
        //   lights()
        // })
        // .then(lightArray => {
        //   lightArray.forEach(light => {
        //     let lightMetadata = {
        //       id: light.id,
        //       name: light/name
        //     }
        //     this.lights.push(light)
        //   })
        // })
        .catch(error => console.log(error))
      }
    }
  }
</script>

<stlye>
</stlye>