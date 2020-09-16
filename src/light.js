class Light {
	constructor(setup) {
		let z = this
		z.x = setup[0]
		z.y = setup[1]
		z.size = setup[2]
		z.path2d = new Path2D()
		z.poly = []
		for(let i = 0; i < 360; i++) {
			let a = 0 + ((Math.PI * 2) / 360 * i)
			let r = M.raycast(z.x, z.y, a, M.lightCollision, z.size)
			if (i == 0) {
				z.path2d.moveTo(r.x, r.y)
			} else {
				z.path2d.lineTo(r.x, r.y)
			}
			z.poly.push([r.x, r.y])
		}
		z.path2d.closePath()
		z.on = true
		z.pattern = []
		for (let i = 0; i < rand(1, 5); i++) {
			z.pattern.push(rand(20, 120))
			z.pattern.push(rand(1, 120))
		}
		z.index = 0
		z.time = 0
		z.p = []
	}
	update() {
		let z = this
		if (z.pattern.length > 0) {
			z.time++
			if (z.time >= z.pattern[z.index]) {
				z.index = (z.index + 1) % z.pattern.length
				z.on = !z.on
				z.time = 0
				if (rnd() < .5) {
					for (let i = 0; i < 6; i++) {
						let x = i < 3 ? 13 : -11, y = i < 3 ? 1 : 13
						M.p.push([z.x + x, z.y + y, rnd() * 2 - 1, rnd() * 2 - 0.5, rand(30, 80), z.y + y + 5])
					}
				}
			}
		}
	}
	render() {
		let z = this
		drawLight(z.x, z.y, rand(z.size * 0.95, z.size), z.path2d)
	}
	reset() {
		this.on = true
		this.index = 0
		this.time = 0
	}
}