class SceneTitle {
	constructor() {
		this.press = false
	}
	update() {
		if (keyPressed(ENTER)) goTo(SceneMap)
	}
	render() {
		for (let y = 0; y < Math.floor(CANVAS_HEIGHT / 4); y++) {
			for (let x = 0; x < Math.floor(CANVAS_WIDTH / 4); x++) {
				fr(x * 4, y * 4, 4, 4, rnd() >= .50 ? '#fff' : '#000')
			}
		}
		if (this.press) {
			fr(0, 320, CANVAS_WIDTH, 70, 'rgba(0, 0, 0, .5)')
			pack(() => {
				drawCenterText('Press Enter', CANVAS_WIDTH / 2, 320 + 70 / 2, {font: {size: 32, font: '32px Arial Black'}, colors: '#F23A52'})
			})
		} else {
			if (rnd() >= .95) {
				this.press = true
				setTimeout(() => {this.press = false}, 1000)
			}
		}
		for (let i = 0; i < 10; i++) {
			if (rnd() >= .90) fr(0, rnd() * CANVAS_HEIGHT, CANVAS_WIDTH, rnd() * 70, 'rgba(0, 0, 0, ' + rnd() + ')')
		}
	}
}