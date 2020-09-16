class Pc extends Tile {
	constructor(setup, access) {
		super([setup[0], setup[1], 16, 16, 2, 0])
		let a = this
		a.access = access
		a.watched = false
		a.text = '> localhost:3000/'
		a.intervalId = null
		a.wait = 0
		a.fast = false
		let w = 'white', g = 'green', r = 'red', b = 'blue', y = 'yellow'
		a.colors = a.access ? [[0, w], [35, y], [42, w], [87, b], [93, w], [97, g], [99, w], [121, b], [131, w], [135, g], [141, w], [189, r], [206, w], [210, g], [220, w]] : [[0, w], [39, r], [55, w]]
	}
	touched(entity) {
		let a = this
		if (entity instanceof Player && !M.energy && entity.dir == 'up') {
			if (!a.watched) {
				let init = '\tsuperuser/cli\n\t.\t.\t.\t\n'
				if (a.access) {
					a.Type(init + 'Welcome.\n> \trestart energy\n\tAre you sure? (Y/N)\n\ty\t\n.\t.\t.\t\n', () => {
						a.Type('Energy is ON.\n', () => {
							M.energy = true
							unbind(Q)
							a.Type('> \topen maingate\t\n\t.\t.\t.\t\nMain Gate was opened.\t\n> \t\tselfdestruction on\t\t\nAre you sure? (Y/N)\n\ty\t\t\n\t.\t.\t.\t\n', () => {
								a.Type('Self-Destruction was activated, 4:04 minutes left.\n\nPress Esc to exit.')
								M.timer = 244 * 60
								a.watched = true
							})
						})
					})
				} else {
					a.Type(init + '404 Page not found.\n\nPress Esc to exit.', () => a.watched = true)
				}
			}
			unbind(ESCAPE)
			M.topMost = {
				update: () => {
					console.log()
					if (a.watched && keyPressed(ESCAPE)) {
						let i = M.pcs.indexOf(a)
						if (!checkPoint[6].includes(i)) {
							checkPoint[0] = a.tX() * 16 + 8
							checkPoint[1] = a.tY() * 16 + 32 + 8
							checkPoint[2] = M.ghost
							checkPoint[3] = M.devil
							checkPoint[4] = M.ritual
							checkPoint[5] = a.access
							checkPoint[6].push(i)
						}
						clearInterval(a.intervalId)
						M.topMost = null
						bind(ESCAPE, () => M.pause = !M.pause)
						if (a.access) M.player.say("I'll go back to Mary.", 3000)
					}
				},
				render: () => {
					pack(() => {
						ctx.globalCompositeOperation = 'source-over'
						fr(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100, 'white')
						fr(55, 55, CANVAS_WIDTH - 110, CANVAS_HEIGHT - 110, 'black')
						drawText(a.text, 60, 60, {
							font: font(12, true),
							colors: a.colors
						})
					})
				}
			}
		}
	}
	Type(string, callback = null) {
		let z = this
		z.intervalId = setInterval(() => {
			if (string != '') {
				if (string.charAt(0) == '\t') {
					if (z.wait >= (z.fast ? 0 : 10)) {
						z.wait = 0
						string = string.substring(1)
					}
					z.wait++
				} else {
					z.text += string.charAt(0)
					string = string.substring(1)
				}
			} else {
				clearInterval(z.intervalId)
				if (callback) callback()
			}
		}, z.fast ? 1 : 100)
	}
	box(x = this.x, y = this.y) {
		return [x, y + 10, this.width, this.height]
	}
}