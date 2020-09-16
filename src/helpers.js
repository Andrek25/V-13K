pack = (func) => {
	ctx.save()
	func()
	ctx.restore()
}

font = (size, bold = false) => {
	return {size: size, font: (bold ? 'bold' : '') + ' ' + size + 'px ' + 'Fixedsys, Lucida Console'}
}

rnd = () => Math.random()

textSize = (string, font) => {
	let result = {width: 0, height: 0}, last_font = ctx.font
	pack(() => {
		ctx.font = font.font
		result.height = string.split('\n').length * font.size
		string.split('\n').map(s => {
			if (ctx.measureText(s).width > result.width) result.width = ctx.measureText(s).width
		})
	})
	ctx.font = last_font
	return result
}

sY = (y) => y - (scene ? scene.oy : 0)

offsetX = (angle, distance) => Math.sin(angle) * distance

offsetY = (angle, distance) => -Math.cos(angle) * distance

distance = (source, target) => Math.hypot(source.x - target.x, source.y - target.y)

tile = (n) => Math.floor(n / 16)

angleToTarget = (source, target) => Math.atan2(target.y - source.y, target.x - source.x) + Math.PI / 2

toRad = (deg) => deg * Math.PI / 180

toDeg = (rad) => rad * 180 / Math.PI

rand = (min, max) => Math.round(rnd() * (max - min) + min)

rectCollision = (source, target) => {
	return (source[0] < target[0] + target[2] && source[0] + source[2] > target[0] &&
	source[1] < target[1] + target[3] &&
	source[3] + source[1] > target[1])
}

mergeFace = (base, face) => {
	let buffer = document.createElement('canvas')
	let buffer_context = buffer.getContext('2d')
	buffer_context.drawImage(base, 0, 0, 144, 32)
	buffer_context.drawImage(face, 0, 0, 48, face.height)
	buffer_context.drawImage(face, 48, 1, 48, face.height)
	buffer_context.drawImage(face, 96, 1, 48, face.height)
	return buffer
}

onScreen = (b) => {
	return rectCollision([b[0], sY(b[1]), b[2], b[3]], [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT])
}

renderParticles = (particles) => {
	let i = particles.length
	while (i--) {
		let p = particles[i]
		if (p[1] + 2 < p[5]) {
			p[0] += p[2]
			p[1] += p[3]
			p[3] += 0.1
		}
		p[4]++
		fr(p[0], sY(p[1]), 2, 2, '#ffeb3b')
		if (p[4] >= 80) particles.splice(i, 1)
	}
}