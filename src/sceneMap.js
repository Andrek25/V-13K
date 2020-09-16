var M
class SceneMap {
	constructor() {
		M = this
		M.oy = 0
		M.path2d = new Path2D
		M.p2dSize = 0
		M.lantern = []
		M.noises = []
		M.energy = checkPoint[5]
		M.timer = M.energy ? 244 * 60 : -1

		// BLOCKS, WALLS
		M.blocks = [[0, 8, 8, 1136], [632, 8, 8, 1136], [0, 0, 640, 8], [0, 1144, 640, 8]]
		M.walls = []
		for (let i = 0; i < BLOCKS.length; i += 4) {
			let b = BLOCKS.slice(i, i + 4)
			let x = b[0] * 16, y = b[1] * 16, w = b[2] ? b[2] * 16 : 8, h = b[3] ? b[3] * 16 + 8 : 8
			M.blocks.push([x, y, w, h])
			M.walls.push([x, y + h, w, 24])
		}

		// WINDOWS
		M.windows = []
		M.wW = []
		for (let i = 0; i < WINDOWS.length; i += 4) {
			let q = WINDOWS.slice(i, i + 4)
			let w = (q[2] ? q[2] * 16 : 8), h = (q[3] ? q[3] * 16 : 8)
			M.windows.push([q[0], q[1], w, h])
			M.wW.push([q[0], q[1] + h, w, 24])
		}

		// TILES
		M.tiles = []
		for (let i = 0; i < TILES.length; i += 6) {
			M.tiles.push(new Tile(TILES.slice(i, i + 6)))
		}

		// ENTITIES
		M.player = new Player(checkPoint[0], checkPoint[1], 0)
		M.entities = []
		M.entities.push(P)
		for (let i = 0; i < ZOMBIES.length; i += 2) {
			M.entities.push(new Zombie(ZOMBIES.slice(i, i + 2)))
		}
		if (document.monetization && document.monetization.state === 'started') {
			P.best = true
		}

		// LIGHTS
		M.lights = []
		M.inLights = []
		for (let i = 0; i < LIGHTS.length; i += 3) {
			M.lights.push(new Light(LIGHTS.slice(i, i + 3)))
		}

		// PC's
		M.pcs = []
		for (let i = 0; i < PCS.length; i += 2) {
			let x = PCS.slice(i, i + 2)
			let p = new Pc(x, x[0] == 32 && x[1] == 139)
			M.tiles.push(p)
			M.pcs.push(p)
			if (checkPoint[6].includes(M.pcs.indexOf(p))) p.fast = true
		}

		// FLOOR
		for (let i = 0; i < ROOMS.length; i += 4) {
			let r = ROOMS.slice(i, i + 4), tiles = [[3, 2], [5, 2], [6, 2], [8, 0], [10, 0], [11, 0], [12, 0]], tilesR = []
			for (let y = r[1]; y < r[1] + r[3]; y++) {
				for (let x = r[0]; x < r[0] + r[2]; x++) {
					let t = [x * 16, y * 16, 16, 16, 0, null]
					if (x == M.player.x && y == M.player.y) continue
					if (!M.pathCollision(t)) {
						if (rnd() < 0.1) {
							let ti = tiles[Math.floor(rnd() * tiles.length)]
							if (!tilesR.includes(ti[0])) {
								t[4] = ti[0]
								t[5] = ti[1]
								if (ti[0] < 10) {
									tilesR.push(ti[0])
								} else {
									t[3] = t[2] = rand(8, 16)
								}
								M.tiles.push(new Tile(t))
							}
						}
					}
				}
			}
		}

		// EVENTS
		M.ghost = checkPoint[2]
		M.devil = checkPoint[3]
		M.devilTime = Date.now()
		M.devilX = 0
		M.ritual = checkPoint[4]
		M.ritualLight = new Light(RITUAL.slice(0, 3))
		M.ritualLight.pattern = [120, 5, 5, 5, 60, 5, 5, 360, 5, 5]
		M.lights.push(M.ritualLight)
		M.ritualStop = false
		M.ritualC = 0

		// INTRO
		M.intro = checkPoint[7]
		M.mary = new Animation(1)
		M.mary.play('idleup')
		M.introL = new Light([448, 1136, 64])
		M.introL.on = false
		M.introC = 0

		M.p = []

		bind(ESCAPE, () => M.pause = !M.pause)
	}
	update(dt) {
		M.oy = Math.round(Math.min(Math.max(P.y - CANVAS_HEIGHT / 2, 0), 672))
		if (M.topMost) {
			// Top most, used for update interfaces over all, ie: PC's.
			M.topMost.update()
		} else {
			if (!M.pause && !M.ritualStop) {
				[...M.entities, ...M.tiles].map(e => e.update(dt))
				if (!M.energy) M.lights.map(l => l.update(dt))
			}
		}
		if (M.intro) {
			M.mary.update(dt)
		}
		if (M.energy && distance(P, {x: STARTPOINT[0], y: STARTPOINT[1]}) < 32) goTo(SceneCredits)
	}
	render() {
		pack(() => {
			if (!M.energy) {
				// Player Lantern
				if (P.lantern) {
					if (!M.pause) {
						let angle = angleToTarget({x: P.x, y: P.sY()}, mouse), ad = toRad(90), base = P.best ? 144 : 128
						M.p2dSize = rand(base - 6, base)
						M.path2d = new Path2D()
						M.path2d.moveTo(P.x, P.y)
						M.lantern.length = 0
						M.lantern.push([P.x, P.y])
						for(let i = 0; i < 40; i++) {
							let a = (angle - ad / 2) + (ad / 40 * i)
							let r = M.raycast(P.x, P.y, a, M.lightCollision, M.p2dSize)
							M.path2d.lineTo(r.x, r.y)
							M.lantern.push([r.x, r.y])
						}
						M.path2d.closePath()
					}
					drawLight(P.x, P.y, M.p2dSize, M.path2d)
				} else {
					M.lantern.length = 0
				}

				if (M.introL.on) {
					M.introL.render()
				}

				// Lights
				M.lights.map(l => {if (l.on) l.render()})

				ctx.globalCompositeOperation = 'source-atop'
			}
			// Floor
			let offY = Math.floor(M.oy / 16)
			for (let y = offY; y < offY + 31; y++) {
				for (let x = 0; x < TILEMAP_WIDTH; x++) {
					fr(x * 16, sY(y * 16), 16, 16, '#e0e0e0')
					fr(x * 16, sY(y * 16), 15, 15, '#eee')
				}
			}

			// Walls
			let walls = [...M.walls, ...M.wW]
			for (let i = 0; i < walls.length; i++) {
				let w = walls[i]
				if (onScreen(w)) {
					fr(w[0], sY(w[1]), w[2], w[3], '#bdbdbd')
					fr(w[0], sY(w[1]), w[2], w[3] - 3, '#fff')
				}
			}

			// Blocks
			M.blocks.map(b => { if (onScreen(b)) fr(b[0], sY(b[1]), b[2], b[3], '#000') })

			// Windows
			M.windows.map(w => fr(w[0], sY(w[1]), w[2], w[3], '#000'))

			// Tiles
			M.tiles.map(t => { if (onScreen(t.box())) t.render() })

			// Entities, Doors
			let entities = [...M.entities, ...M.pcs]
			entities.sort(function(a,b){return a.y - b.y})
			entities.map(e => {
				if (M.ritualStop && e instanceof Zombie) return
				e.render()
			})
		})

		// Particles
		renderParticles(M.p)

		if (M.intro) {
			M.introC++
			let x = 448, y = sY(1136)
			if (M.introL.on) M.mary.render(x, y)
			if (M.introC < 120) {
			} else if (M.introC < 150) {
				M.introL.on = true
			} else if (M.introC < 300) {
				drawSB('Dad, what are we\ngoing to do?', x, y - 24)
			} else if (M.introC < 600) {
				drawSB('The quarantine\nprotocol was\nactivated', P.x, P.sY() - 24)
			} else if (M.introC < 900) {
				drawSB('and the front door\nhas been locked.', P.x, P.sY() - 24)
			} else if (M.introC < 1350) {
				drawSB("I'm going to find\na computer that has\naccess to the central\nand open it again", P.x, P.sY() - 24)
			} else if (M.introC < 1600) {
				drawSB("Stay here and\nwait for me", P.x, P.sY() - 24)
			} else if (M.introC < 2000) {
				drawSB('dad be careful with\nthe infected.', x, y - 24)
			} else if (M.introC < 2300) {
				M.intro = false
				checkPoint[7] = false
				M.introL.on = false
			}
		}

		if (M.ritualStop) {
			M.ritualC++
			if (M.ritualC < 120) {
				if (M.ritualC % 10 == 0) {
					M.ritualLight.on = !M.ritualLight.on
				}
			} else if (M.ritualC < 180) {
				M.ritualLight.on = false
			} else if (M.ritualC < 270) {
				M.ritualLight.on = true
				drawTile(4, 300, sY(258), 16, 16)
				drawCharacter(2, 0, 290, sY(245))
				drawCharacter(2, 1, 280, sY(254), true)
				drawCharacter(2, 1, 273, sY(270), true)
				drawCharacter(2, 0, 340, sY(245))
				drawCharacter(2, 1, 350, sY(254))
				drawCharacter(2, 1, 370, sY(270))
			} else if (M.ritualC < 320) {
				M.ritualLight.on = false
			} else {
				M.ritualLight.reset()
				M.ritualStop = M.ritual = false
				setTimeout(() => P.say("I'm going crazy, I need\nto open the gate soon.", 5000), 1500)
			}
		}

		// Render the player over all.
		if (!M.energy && !M.intro) {
			P.render()
		}

		// Noises
		let i = M.noises.length
		while(i--) {
			let n = M.noises[i]
			let x = n.entity.cX(), y = n.entity.cY()
			let step = Math.floor((Date.now() - n.time) / 100)
			if (!M.energy) drawNoise(x, y, step)
			if (step >= 3) {
				n.entity.noising = false
				M.noises.splice(i, 1)
			}
		}

		// HTB
		if (P.htbC != HTB) {
			let x = 8, y = 24, w = 100, h = 12
			fr(x, y, w, h, 'white')
			fr(x + 2, y + 2, w - 4, h - 4, 'black')
			fr(x + 2, y + 2, (w - 4) * P.htbC / HTB, h - 4, 'blue')
		}

		// Self-Destruction timer.
		if (M.energy && M.timer >= 0) {
			let t = Math.floor(M.timer / 60) + 1
			let m = Math.floor(t / 60)
			let s = t - m * 60
			let string = '0' + m + ':' + ('0' + s).slice(-2)
			let color = t > 60 ? 'yellow' : 'red'
			pack(() => {
				ctx.shadowBlur = 20
				ctx.shadowColor = 'black'
				ctx.strokeStyle = 'black'
				drawText(string, 50, 8, {font: font(18, true), colors: color})
			})
			if (!M.pause) M.timer--
			if (M.timer == 0) goTo(SceneMap)
		}

		// Speech Bubbles
		M.entities.map(entity => {
			if (entity.sayString != '') {
				drawSB(entity.sayString, entity.cX(), entity.cY() - 24)
			}
		})

		// ** EVENTS **
		if (!M.energy) {
			// Ghost
			if (M.ghost) {
				let x = GHOST[0], y = GHOST[1], b = {x: x - 8, y: y - 8, width: 16, height: 16}
				let d = distance({x: x, y: y}, P)
				let s = d < 144 ? 'Dr. Elliot, please\nhelp me!' : 'HELP ME!'
				if (d < 220) drawSB(s, x, sY(y), 'red')
				if (M.inLight(b)) {
					M.ghost = false
					setTimeout(() => P.say('My god, Rachel...\nI would swear that\ni heard something.', 5000), 1500)
				}
			}

			// Devil
			if (M.devil && Math.abs(P.y - DEVIL[1]) < 32) {
				let x = DEVIL[0] + M.devilX, y = DEVIL[1], b = {x: x - 8, y: y - 8, width: 16, height: 16}
				let d = distance(P, {x: x, y: y})
				if (d < 480) {
					let step = Math.floor((Date.now() - M.devilTime) / 100) % 4
					drawDevil(x, sY(y))
					drawNoise(x, sY(y), step)
				}
				if (d < 225) M.devilX += 2
				if (M.devilX > 225 || M.inLight(b) || d < 32) {
					M.devil = false
					setTimeout(() => P.say("What?\ni'm sure that \ni saw someone.", 5000), 1000)
				}
			}

			// Ritual
			if (M.ritual && !M.ritualStop) {
				if (rectCollision(RITUAL.slice(3, 7), P.box())) {
					M.ritualStop = true
					M.ritualLight.on = true
					P.lantern = false
				}
			}
		}
		// ** EVENTS END **

		if (M.pause) {
			fr(0, CANVAS_HEIGHT / 2 - 18, CANVAS_WIDTH, 36, 'rgba(255,255,255,.7)')
			drawCenterText('Game Paused', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, {font: font(24, true)})
		}

		// Top most, used for render interfaces over all, ie: PC's.
		if (M.topMost) M.topMost.render()
	}
	raycast(x, y, angle, colFunc, maxSize = null, wh = [1, 1]) {
		let timeOut = Date.now(), size = 0
		while(true) {
			if (maxSize != null && size >= maxSize) return {x: x, y: y, col: false}
			if (Date.now() - timeOut >= 200) break
			x += offsetX(angle, 1)
			y += offsetY(angle, 1)
			size++
			if (colFunc([x - wh[0] / 2, y - wh[1] / 2, wh[0], wh[1]])) {
				return {x: x, y: y, col: true}
			}
		}
	}
	lightCollision(box) {
		for (let i = 0; i < M.blocks.length; i++) {
			if (rectCollision(box, M.blocks[i])) return true
		}
		return false
	}
	mapCollision(box, entity = null) {
		let pc = M.pathCollision(box, entity)
		if (pc) return pc
		for (let i = 0; i < M.entities.length; i++) {
			let e = M.entities[i]
			if (entity && e === entity) continue
			if (rectCollision(box, e.box())) return e
		}
		return false
	}
	pathCollision(box, entity = null) {
		let array = [...M.blocks, ...M.walls, ...M.wW, ...M.windows]
		for (let i = 0; i < array.length; i++) {
			if (rectCollision(box, array[i])) return true
		}
		for (let i = 0; i < M.tiles.length; i++) {
			let t = M.tiles[i]
			if (entity && t === entity) continue
			if (![1, 2].includes(t.type)) continue
			if (rectCollision(box, t.box())) return t
		}
		return false
	}
	seeCollision(box) {
		let array = [...M.blocks, ...M.walls]
		for (let i = 0; i < array.length; i++) {
			if (rectCollision(box, array[i])) return true
		}
		return false
	}
	inLight(entity) {
		if (M.energy) return true
		if (entity instanceof Player && entity.lantern) return true
		let x = entity.x, y = entity.y, allLights = [M.lantern]
		M.lights.map(l => {if (l.on) allLights.push(l.poly)})
		for (let l = 0; l < allLights.length; l++) {
			let inside = false
			for (let i = 0, j = allLights[l].length - 1; i < allLights[l].length; j = i++) {
				let xi = allLights[l][i][0], yi = allLights[l][i][1], xj = allLights[l][j][0], yj = allLights[l][j][1]
				let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
				if (intersect) inside = !inside
			}
			if (inside) return true
		}
		return false
	}
	doNoise(entity, radio) {
		if (entity.noising) return
		if (distance(entity, P) <= radio) {
			M.noises.push({entity: entity, time: Date.now()})
			entity.noising = true
		}
		if (entity instanceof Zombie) return
		for (let i = 0; i < M.entities.length; i++) {
			let e = M.entities[i]
			if (e instanceof Zombie) {
				if (distance(entity, e) <= radio) {
					if (!e.follow) {
						e.pathTo(entity)
					}
				}
			}
		}
	}
}