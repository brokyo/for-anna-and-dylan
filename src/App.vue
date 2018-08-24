<template>
	<div id="app">
		<pre>For Anna And Dylan</pre>
		<div>
			<h3>Panner</h3>
			<input 
				v-model="frequencyValue"
				type="range"
				min="0"
				max="10"
				step="0.1"
				>
				<pre>{{frequencyValue}}</pre>
			<h3>Volume</h3>
			<input 
				v-model="volumeDb"
				type="range"
				min="-50"
				max="0"
				step="0.1"
				>
				<pre>{{volumeDb}}</pre>
				<h3>oscFrequency</h3>
			<input 
				v-model="oscFrequency"
				type="range"
				min="0"
				max="880"
				>
				<pre>{{oscFrequency}}</pre>
				<pre>{{oscCount}}</pre>
				<button @click="createOscillator">Create Osc</button>

		</div>
	</div>
</template>

<script>

	// CONFIG //

	// Hue
	var hue = require('node-hue-api')
	var username = '7KTtUV6M1xoDAAyHCFaFOep8H43GlgPM22TfWMPo'
	var ip = '10.0.1.2'
	var api = new hue.HueApi(ip, username)
	var lightState = hue.lightState

	var displayResults = function(result) {
	    console.log(JSON.stringify(result, null, 2));
	};

	api.lights().then(displayResults)

	// Tone
	var Tone = require('tone')
	var chorus = new Tone.Chorus()
	var reverb = new Tone.Freeverb()


	// SETUP //

	// CONTROLS //
	var oscAttackStart = function(osc, eventDuration) {
		Tone.Transport.schedule(function(time) {
			console.log(`osc attack start ${time}`)
			osc.triggerAttackRelease(eventDuration)
		})
	}
	var hueAttackStart = function(osc, lightId) {
		Tone.Transport.schedule(function(time) {
			console.log(`hue attack start ${time}`)
			let lightIn = lightState.create().brightness(100).transition(osc.attack * 1000)
			api.setLightState(lightId, lightIn)
		})
	}
	var hueReleaseStart = function (osc, lightId, releaseStart, transportTime) {
		Tone.Transport.schedule(function(time) {
			console.log(`hue release start ${time}`)
			let lightOut = lightState.create().brightness(0).transition(osc.release * 1000)
			api.setLightState(lightId, lightOut)
		}, transportTime + releaseStart)
	}
	var oscReleaseEnd = function(osc, eventDuration, transportTime) {
		Tone.Transport.schedule(function(time) {
			console.log(`osc dispose ${time}`)
			osc.dispose()
		}, transportTime + eventDuration + osc.release)	
	}
	var scheduleEvent = function(osc, lightId, eventStart, eventDuration) {
		// Schedule Osc
		Tone.Transport.schedule(function(time) {
			oscAttackStart(osc, eventDuration)
			hueAttackStart(osc, lightId, osc.attack)
			hueReleaseStart(osc, lightId, eventDuration, time)
			oscReleaseEnd(osc, eventDuration, time)
			generateEvent(lightId, eventStart, eventDuration, osc.release, time)
		}, eventStart)
	}
	var createOsc = function(note, attackTime, releaseTime){
		var osc = new Tone.FMOscillator({
			frequency: note,
		})

		var ampEnv = new Tone.AmplitudeEnvelope({
			attack: attackTime,
			attackCurve: `linear`,
			release: releaseTime,
			releaseCurve: `linear`
		})

		osc.connect(ampEnv).start()
		ampEnv.chain(chorus, reverb, Tone.Master)

		// TODO: I probably need to export and dispose osc as well
		return ampEnv
	}
	var generateEvent = function(lightId, previousEventStart, previousEventDuration, previousEventRelease, transportTime) {
		if(true) {
			Tone.Transport.schedule(function(time) {
				// Configure Osc
				var allNotes = [`F2`, `G2`, `A2`, `Bb2`, `C2`, `D2`, `E2`]
				var note = allNotes[Math.floor(Math.random() * allNotes.length)]
				var attackTime = 2
				var releaseTime = 6

				var osc = createOsc(note, attackTime, releaseTime)

				// Build event
				let previousEventEnd = previousEventStart + previousEventRelease + previousEventDuration
				let eventGap = Math.floor(Math.random() * 10) + 2
				let eventStart = previousEventEnd + eventGap 
				let eventDuration  = Math.floor(Math.random() * 9) + 3
				console.log(`next event in section ${lightId} \n start: ${eventStart} \n duration: ${eventDuration} \n release: ${releaseTime} \n note: ${note}`)

				scheduleEvent(osc, lightId, eventStart, eventDuration)

			}, transportTime + previousEventDuration + previousEventRelease )
		}
	}
	var startSection = function(lightId, sectionStart) {
		generateEvent(lightId, 0, sectionStart, 0, 0)
	}

	// KickOff
	api.setLightState(2, lightState.create().on().hsb(25, 100, 100))
	api.setLightState(5, lightState.create().on().hsb(25, 100, 100))
	api.setLightState(6, lightState.create().on().hsb(25, 100, 100))
	Tone.Transport.start()
	startSection(2, 0)
	startSection(5, 2)
	startSection(6, 4)












































export default {
	data() {
		return {
			Tone: {},
			lfo: {},
			panner: {},
			unification: {},
			autoFilter: {},
			chorus: {},
			frequencyValue: 10,
			volume: {},
			volumeDb: -15,
			oscFrequency: 440,
			oscCount: 0
		}
	},
	methods: {
		createCoreChain() {
			this.unification = new this.Tone.Gain()
			this.panner = new this.Tone.AutoPanner({frequency: this.frequencyValue})
			this.autoFilter = new this.Tone.AutoFilter()
			this.chorus = new this.Tone.Chorus()
			this.volume = new this.Tone.Volume({volume: this.volumeDb})
		},
		connectCoreChain() {
			this.unification.chain(this.panner, this.autoFilter, this.chorus, this.volume, this.Tone.Master)
		},
		createOscillator() {
			var oscillator = new this.Tone.Oscillator({frequency: this.oscFrequency})
			oscillator.connect(this.unification)
			oscillator.start()

			setTimeout(() => oscillator.set(volume))
			this.oscCount++
		}
	},
	watch: {
		frequencyValue(value) {
			console.log(this.panner.frequency.value)
			this.panner.set({frequency: value})
		},
		volumeDb(value) {
			this.volume.set({volume: value})
		}
	},
	mounted() {
		// this.Tone = require('tone')

		// this.createUnification()
		// this.createCoreChain()
		// this.connectCoreChain()

		// var logData = function(data) {
		// 	console.log(data)
		// }





	}  
};
</script>

<style lang="scss">

</style>




















































