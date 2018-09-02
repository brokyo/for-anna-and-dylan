<template>
  <div>
    <div v-if="connected">
      <h2>Done. Head to <router-link to="/full">full</router-link></h2>
    </div>
    <div v-else>
      <p>Hit the button on your hue bridge then click the button below</p>
      <button @click="getHueConfig">Get Hue Config</button>
      <pre>IP: {{ip}}</pre>
      <pre>username: {{username}}</pre>
      <pre>Lights: {{lights}}</pre>
    </div>
  </div>
</template>

<script>
  import hue from 'node-hue-api';
  var hueApi = hue.HueApi
  var api =  new hueApi()

  export default {
    data() {
      return {
        connected: false,
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
          localStorage.setItem('waves_ip', this.ip)
          return this.ip
        })
        .then(data => {
          api.registerUser(this.ip, "waves")
          .then(username => {
            this.username = username
            localStorage.setItem('waves_username', username)
            return username
          })
          .fail(error => console.log(error))
          .then(user => {
            console.log('getting here?')
            let registeredApi = new hueApi(this.ip, this.username)
            console.log(registeredApi)
            registeredApi.lights()
            .then(lightArray => {
              lightArray.lights.forEach(light => {
                let lightMetadata = {
                  id: light.id,
                  name: light.name
                }
                this.lights.push(lightMetadata)
              })

              localStorage.setItem('waves_lights', JSON.stringify(this.lights))
              this.connected = true
             })
            })
        })
        .catch(error => console.log(error))
      }
    }
  }
</script>

<stlye>
</stlye>