class Tile extends Entity {
	constructor(setup) {
		super()
		let z = this
		z.x = setup[0]
		z.y = setup[1]
		z.width = (setup[2] ? setup[2] : 16)
		z.height = (setup[3] ? setup[3] : 16)
		z.gid = setup[4]
		z.type = setup[5]
		z.angle = 0
		if (z.type == 2) {
			z.angle = rand(0, 3) * 90
		}
	}
	touched(entity) {
		if (this.type == 2 || [8, 10].includes(this.gid)) {
			M.doNoise(this, 208)
		}
	}
	render() {
		let z = this
		if (z.gid > 0) {
			ctx.setTransform(1, 0, 0, 1, z.x + z.width / 2, z.sY() + z.height / 2)
			ctx.rotate(toRad(z.angle))
			drawTile(z.gid, -(z.width / 2), -(z.height / 2), z.width, z.height)
			ctx.setTransform(1, 0, 0, 1, 0, 0)
		}
	}
	box(x = this.x, y = this.y) {
		let z = this
		if (z.gid == 1) {
			return [x, y + z.height / 2, z.width, z.height / 2]
		} else {
			return [x, y, z.width, z.height]
		}
	}
}