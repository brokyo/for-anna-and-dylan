<template>
	<div>
		<pre>Section</pre>
		<div>
		</div>
	</div>
</template>

<script>
	export default {
		props: [`lightId`, `Tone`, `hueApi`, `lightState`],
		data() {
			return {
				// Section data
				active: true,
				names: [`F`, `G`, `A`, `Bb`, `C`, `D`, `E`],
				partials: [0.75, 0.93, 0.245, 0.15],
				attack: {
					max: 3,
					min: 1
				},
				release: {
					max: 8,
					min: 3
				},
				octaves: [`3`, `4`],
				// Tonejs Patch
				chorus: {},
				reverb: {}
			}
		},
		methods: {
			// UTILITIES
			randomBetween(min, max) {
				return (Math.random() * max) + min
			},
			currentTime(){
				return this.Tone.Transport.toSeconds(this.Tone.Transport.ticks + "i")
			},
			// INIT METHODS
			resetHue() {
				this.hueApi.setLightState(this.lightId, this.lightState.create().on().hsb(25, 0, 0))
			},
			createToneChain() {
				this.chorus = new this.Tone.Chorus()
				this.reverb = new this.Tone.Freeverb()
			},
			// CONTROL METHODS
			startSection() {
				this.generateEvent()
			},
			generateEvent(previousEventStart = 0, previousEventDuration = 0, previousEventRelease = 0) {
				this.Tone.Transport.schedule( time => {
					// generated oscillator parameters
					var name = this.names[Math.floor(Math.random() * this.names.length)]
					var octave = this.octaves[Math.floor(Math.random() * this.octaves.length)]
					var note = name + octave
					var attackTime = this.randomBetween(this.attack.min, this.attack.max)
					var releaseTime = this.randomBetween(this.release.min, this.release.max)

					// Build oscillator
					var osc = this.createOsc(note, attackTime, releaseTime)

					// Generate event parameters
					let previousEventEnd = previousEventStart + previousEventRelease + previousEventDuration
					let eventGap = Math.floor(Math.random() * 10) + 2
					let eventStart = previousEventEnd + eventGap 
					let eventDuration  = Math.floor(Math.random() * 9) + 3
					console.log(`next event in section ${this.lightId} \n start: ${eventStart} \n duration: ${eventDuration} \n release: ${releaseTime} \n note: ${note}`)

					// Schedule event
					this.scheduleEvent(osc, eventStart, eventDuration)

				}, this.currentTime() + previousEventDuration + previousEventRelease )
			},
			// Returns an oscillator connected to an amplitude envelope (think of it like
			// a single key on a piano) that's built to play a certain sound for a certain
			// duration
			createOsc(note, attackTime, releaseTime){
				var osc = new this.Tone.OmniOscillator({
					frequency: note,
					partials: this.partials,
				})

				var ampEnv = new this.Tone.AmplitudeEnvelope({
					attack: attackTime,
					attackCurve: `linear`,
					release: releaseTime,
					releaseCurve: `linear`
				})

				osc.connect(ampEnv).start()
				ampEnv.chain(this.chorus, this.reverb, this.Tone.Master)

				// TODO: I probably need to export and dispose osc as well
				return ampEnv
			},
			// Schedules a play event (oscillator firing and light changing)
			scheduleEvent(osc, eventStart, eventDuration) {
				console.log(eventStart)
				this.Tone.Transport.schedule(time => {
					this.scheduleOsc(osc, eventDuration)
					this.scheduleHueAttack(osc.attack)
					this.scheduleHueRelease(eventDuration, osc.release, time)
					this.schedulePostEvent(osc, eventDuration, time)

					if (this.active) {
						this.generateEvent(eventStart, eventDuration, osc.release, time)
					}

				}, eventStart)
			},
			scheduleOsc(osc, eventDuration) {
				this.Tone.Transport.schedule(time => {
					osc.triggerAttackRelease(eventDuration)
				})
			},
			scheduleHueAttack(attackLength) {
				this.Tone.Transport.schedule(time => {
					console.log(`Hue attack start. Section: ${this.lightId} Time: ${time}`)
					let lightIn = this.lightState.create().brightness(100).transition(attackLength * 1000)
					this.hueApi.setLightState(this.lightId, lightIn)
				})
			},
			scheduleHueRelease(releaseStart, releaseTime, transportTime) {
				this.Tone.Transport.schedule(time => {
					console.log(`Hue release start. Section: ${this.lightId} Time: ${time}`)
					let lightOut = this.lightState.create().brightness(0).transition(releaseTime * 1000)
					this.hueApi.setLightState(this.lightId, lightOut)
				}, transportTime + releaseStart)
			},
			schedulePostEvent(osc, eventDuration, transportTime) {
				this.Tone.Transport.schedule(time => {
					osc.dispose()
				}, transportTime + eventDuration + osc.release) 
			}
		},
		mounted() {
			this.resetHue()
			this.createToneChain()
			this.startSection()
		}
	}

</script>

<style lang="scss">

</style>