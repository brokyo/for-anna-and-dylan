var randomBetween = {
	created() {
		console.log('random between is here baby')
	},
	methods: {
		randomBetween(min, max) {
			return (Math.random() * max) + min;
		},
	}
}