<template>
  <div>
    <div v-if="connected">
        <div>
          <p>Waves will use these lights:</p>
          <div class="inluded_light_container">
            <div v-for="(light, index) in sections" class="individual_light">
              <span class="remove_light" @click="removeLight(index)">X</span>
              <div class="light_data">
                <h4>ID: {{light.id}}</h4> 
                <span>{{light.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <button @click="newLights">Find New Lights</button>
        <h2><router-link to="/full">Go Listen</router-link></h2>
    </div>
    <div v-else>
      <p>Hit the button on your hue bridge then click the button below</p>
      <p>You should only need to do this once</p>
      <button @click="getIp">Get Ip</button>
      <button @click="registerUser">Register User</button>
      <button @click="newLights">New Lights</button>
      <button @click="getHueConfig">Connect Hue</button>
      <pre>IP: {{ip}}</pre>
      <pre>USERNAME: {{username}}</pre>
      <pre>LIGHTS: {{lights}}</pre>
    </div>
  </div>
</template>

<script>
  import hue from 'node-hue-api';
  var hueApi = hue.HueApi
  var api =  new hueApi()

  export default {
    created() {
      this.sections = JSON.parse(localStorage.getItem('waves_lights'))
    },
    data() {
      return {
        ip: '',
        username: '',
        sections: [],
        lights: [],
        hueApi: {}
      }
    },
    computed: {
      connected() {
        if(localStorage.getItem('waves_lights')) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getIp() {
        hue.nupnpSearch()
        .then(data => {
          this.ip = data[0].ipaddress
          localStorage.setItem('waves_ip', this.ip)
        })        
      },
      registerUser() {
        api.registerUser(this.ip, "waves")
        .then(username => {
          this.username = username
          localStorage.setItem('waves_username', this.username)
        })
      },
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
            let registeredApi = new hueApi(this.ip, this.username)
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
      },
      removeLight(index) {
        this.sections.splice(index, 1)
        localStorage.setItem('waves_lights', JSON.stringify(this.sections))
      },
      newLights(){
        let ip = localStorage.getItem('waves_ip')
        let username = localStorage.getItem('waves_username')
        let registeredApi = new hueApi(ip, username)
        let lightsArray = []

        registeredApi.lights()
        .then(lightArray => {
          lightArray.lights.forEach(light => {
            let lightMetadata = {
              id: light.id,
              name: light.name
            }
            lightsArray.push(lightMetadata)
          })

          console.log(lightsArray)

          this.sections = lightsArray
          localStorage.setItem('waves_lights', JSON.stringify(lightsArray))
         })
      }
    }
  }
</script>

<stlye lang="scss">
  .inluded_light_container {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;

    .individual_light {
      width: 100px;
      height: 100px;
      border: 1px solid black;
      margin-right: 20px;

      .light_data {
        text-align: center;
      }

      h4 {
        margin-top: 0px;
      }
    }
  }

  .remove_light {
    cursor: pointer;
    font-weight: 900;
    position: relative;
    top: 8px;
    left: 90px;
    top: -10px;
    border: 1px solid black;
    background-color: white;
    padding: 3px;
    font-size: 14px;
  }

  .remove_light:hover {
    background-color: #dff6ff
  }
</stlye>