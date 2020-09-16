class Animation {
	constructor(face) {
		let z = this
		z.face = face
		z.frameRate = 4
		z.frame = 0
		z.sum = 0
	}
	play(name) {
		let z = this
		if (z.name != name) {
			z.frame = 0
			z.sum = 0
		}
		z.name = name
	}
	update(dt) {
		let z = this
		z.sum += dt
		while (z.sum * z.frameRate >= 1) {
			z.frame = (z.frame + 1) % ANIMATION[z.name].length
			z.sum -= 1 / z.frameRate
		}
	}
	render(x, y, inverted = false) {
		drawCharacter(this.face, ANIMATION[this.name][this.frame], x, y, inverted)
	}
}