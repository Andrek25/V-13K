class Entity {
	constructor() {
		let a = this
		// Movements
		a.x = 0
		a.y = 0
		a.speed = 1
		a.lastPos = {x: 0, y: 0}

		a.dir = 'down'
		a.pushing = false // to avoid reset walk animation when pushing.

		a.path = []
		a.follow = null

		a.noising = false // animating noising.

		a.sayString = ''
	}
	touching(entity) {} // Overrider
	touched(entity) {} // Overrider
	behavior() {} // Overrider
	update(dt) {
		let a = this
		a.behavior()
		if (a.path.length > 0) {
			if (!a.moving()) {
				let pos = a.path.shift()
				if (pos !== undefined) {
					a.moveTo = [pos[0] * 16 + 8, pos[1] * 16 + 8]
				}
			}
		} else if (a.follow) {
			if (M.inLight(a.follow)) {
				if (a.seeing(a.follow)) {
					a.moveTo = [a.follow.x, a.follow.y]
				} else {
					a.pathTo(a.follow)
				}
			} else {
				a.pathTo(a.follow)
				a.follow = null
			}
		}
		if (a.moving()) {
			let rs = a.canMove(a.moveTo)
			if (rs.target) {
				a.touching(rs.target)
				rs.target.touched(a)
			}
			if (rs.move) {
				a.x += rs.x
				a.y += rs.y
				let xD = rs.x > 0 ? 'right' : rs.x < 0 ? 'left' : ''
				let yD = rs.y > 0 ? 'down' : rs.y < 0 ? 'up' : ''
				a.dir = Math.abs(rs.x) > Math.abs(rs.y) ? xD : yD
				a.playAnimation('walk')
			} else {
				a.playAnimation(a.pushing ? 'walk' : 'idle')
				a.moveTo = null
			}
			let lastPos = {x: a.x, y: a.y}
			setTimeout(() => {if (distance(lastPos, a) < 4) a.moveTo = null}, 1000)
			a.checkTiles()
		} else {
			a.playAnimation('idle')
		}
		a.pushing = false
		if (a.animation) a.animation.update(dt)
	}
	render() {
		let z = this
		if (z.animation) {
			z.animation.render(z.x, z.sY(), z.dir == 'right')
		}
	}
	playAnimation(name) {
		let z = this
		if (z.animation) {
			let d = (z.dir == 'right' ? 'left' : z.dir)
			z.animation.play(name + d)
		}
	}
	box(x = this.x, y = this.y) {
		return [x - 6, y - 6, 12, 12]
	}
	collision(entity) {
		return (rectCollision(this.box(), entity.box()))
	}
	moving() {
		let z = this
		return (z.moveTo && (z.moveTo[0] != z.x || z.moveTo[1] != z.y))
	}
	canMove(to) {
		let result = {}, a = this
		let angle = angleToTarget(a, {x: to[0], y: to[1]})
		let dx = offsetX(angle, a.speed)
		let dy = offsetY(angle, a.speed)
		if (a.x < to[0]) {
			if (a.x + dx > to[0]) dx = to[0] - a.x
		} else if (a.x > to[0]) {
			if (a.x + dx < to[0]) dx = to[0] - a.x
		} else {
			dx = 0
		}
		if (a.y < to[1]) {
			if (a.y + dy > to[1]) dy = to[1] - a.y
		} else if (a.y > to[1])  {
			if (a.y + dy < to[1]) dy = to[1] - a.y
		} else {
			dy = 0
		}
		let mx = scene.mapCollision(a.box(a.x + dx, a.y), a)
		let my = scene.mapCollision(a.box(a.x, a.y + dy), a)
		result.x = mx ? 0 : dx
		result.y = my ? 0 : dy
		result.move = result.x != 0 || result.y != 0
		result.target = mx instanceof Entity ? mx : (my instanceof Entity ? my : null)
		return result
	}
	checkTiles() {
		[...M.tiles].map(e => {
			if (e !== this && e.collision(this)) {
				this.touching(e)
				e.touched(this)
			}
		})
	}

	// Screen Y
	sY() {
		return sY(this.y)
	}

	// Tile X
	tX() {
		return tile(this.x)
	}

	// Tile Y
	tY() {
		return tile(this.y)
	}

	// Center X
	cX() {
		let z = this
		return (z instanceof Tile ? z.x + z.width / 2 : z.x)
	}

	// Center Y
	cY() {
		let z = this
		return (z instanceof Tile ? z.sY() + z.height / 2 : z.sY())
	}

	push(pusher) {
		let a = this
		let moveTo = [a.x, a.y]
		let b = a.box()
		let pb = pusher.box()
		let force = pusher.speed * 0.5
		if (pb[0] >= b[0] + b[2]) {
			moveTo[0] -= force
		} else if (pb[0] <= b[0] - pb[2]) {
			moveTo[0] += force
		}
		if (pb[1] >= b[1] + b[3]) {
			moveTo[1] -= force
		} else if (pb[1] <= b[1] - pb[3]) {
			moveTo[1] += force
		}
		let rs = a.canMove(moveTo)
		if (rs.target) {
			a.touching(rs.target)
			rs.target.touched(a)
		}
		if (rs.move) {
			pusher.pushing = true
			a.x += rs.x
			a.y += rs.y
		}
		a.checkTiles()
	}
	pathFinding(toX, toY) {
		let z = this
		let start = [z.tX(), z.tY()]
		let frontier = [start]
		let cameFrom = {}
		cameFrom[start] = null
		let impassable = false, mostClose = [100]
		if (M.pathCollision(z.box(toX * 16 + 8, toY * 16 + 8))) {
			impassable = true
		}
		while(frontier.length > 0 && frontier.length <= 100) {
			let current = frontier.shift()
			if (current[0] == toX && current[1] == toY || (impassable && mostClose[0] == 1)) { break }
			let aux = [[current[0], current[1] - 1], [current[0] - 1, current[1]], [current[0], current[1] + 1], [current[0] + 1, current[1]]]
			for (let i = 0; i < aux.length; i++) {
				if (M.pathCollision(z.box(aux[i][0] * 16 + 8, aux[i][1] * 16 + 8))) continue
				if (!(aux[i] in cameFrom)) {
					frontier.push(aux[i])
					cameFrom[aux[i]] = current
					let d = distance({x: toX, y: toY}, {x: aux[i][0], y: aux[i][1]})
					if (impassable && d < mostClose[0]) {
						mostClose = [d, aux[i]]
					}
				}
			}
		}
		if (impassable) {
			if (!mostClose[1]) return []
			toX = mostClose[1][0]
			toY = mostClose[1][1]
		}
		let current = [toX, toY]
		let path = []
		if (cameFrom[current] !== undefined) {
			while((current[0] != start[0] || current[1] != start[1])) {
				path.push(current)
				current = cameFrom[current]
			}
		}
		path.reverse()
		let rPath = []
		for (let i = 0; i < path.length; i++) {
			// Position from where it will start the raycasting.
			let pos = {x: z.x, y: z.y}
			if (rPath.length > 0) {
				// If we have already found a tile, start from it.
				pos.x = rPath[rPath.length - 1][0] * 16 + 8
				pos.y = rPath[rPath.length - 1][1] * 16 + 8
			}
			// Tile's position in pixels to check with raycasting.
			let tile = {x: path[i][0] * 16 + 8, y: path[i][1] * 16 + 8}
			let b = z.box()
			let r = M.raycast(pos.x, pos.y, angleToTarget(pos, tile), M.pathCollision, distance(pos, tile), [b[2], b[3]])
			if (r.col && path[i - 1] != undefined) {
				rPath.push(path[i - 1])
			}
		}
		if (path[path.length - 1]) rPath.push(path[path.length - 1])
		return rPath
	}
	pathTo(entity) {
		this.path = this.pathFinding(entity.tX(), entity.tY())
	}
	seeing(entity) {
		let z = this
		let a = angleToTarget(z, entity)
		let r = M.raycast(z.x, z.y, a, M.seeCollision, distance(z, entity))
		return (!r.col)
	}
	say(string, time = 2000) {
		this.sayString = string
		setTimeout(() => {this.sayString = ''}, time)
	}
}