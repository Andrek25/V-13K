drawText = (string, x, y, options = {}) => {
	options.font = options.font || font(16, true)
	options.colors = options.colors || 'black'
	if (typeof(options.colors) == 'string') options.colors = [[0, options.colors]]
	let ox = 0, oy = 0, color
	for (let i = 0; i < string.length; i++) {
		options.colors.map(a => {
			if (a[0] == i) {
				color = a[1]
			}
		})
		let char = string[i]
		if (char == '\n') {
			ox = 0
			oy += options.font.size
			continue
		}
		drawChar(char, x + ox, y + oy, options.font, color)
		ox += ctx.measureText(char).width
	}
}

drawChar = (char, x, y, font, color) => {
	ctx.textBaseline = 'top'
	ctx.fillStyle = color
	ctx.font = font.font
	ctx.fillText(char, x, y)
}

drawCenterText = (string, x, y, options = {}) => {
	options.font = options.font || font(16, true)
	let r = textSize(string, options.font)
	drawText(string, x - r.width / 2, y - r.height / 2, options)
}

fr = (x, y, width, height, color) => {
	ctx.fillStyle = color
	ctx.fillRect(x, y, width, height)
}

drawTile = (id, x, y, width, height) => {
	ctx['imageSmoothingEnabled'] = false
	if (id == 13) {
		// Desk
		fr(x, y, width, height, '#607d8b')
		if (width >= height) {
			fr(x, y + 10, width, 1, '#263238')
			fr(x, y + 11, width, 5, '#e0e0e0')
		}
	} else if (id == 15) {
		// Window
		fr(x, y + 3, width, 10, '#283593')
		fr(x + 1, y + 4, width - 2, 8, '#81d4fa')
	} else {
		if (id > 8) {
			ctx.drawImage(images.tileset8x8, (id - 9) * 8, 0, 8, 8, x, y, width, height)
		} else {
			ctx.drawImage(images.tileset, (id - 1) * 16, 0, 16, 16, x, y, width, height)
		}
	}
}

drawCharacter = (face, frame, x, y, inverted = false) => {
	ctx['imageSmoothingEnabled'] = false
	let c = face == 0 ? images.elliot : face == 1 ? images.mary : images.zombie
	if (inverted) {
		ctx.translate(x, y)
		ctx.scale(-1, 1)
		ctx.drawImage(c, frame * 16, 0, 16, 32, -8, -24, 16, 32)
		ctx.setTransform(1, 0, 0, 1, 0, 0)
	} else {
		ctx.drawImage(c, frame * 16, 0, 16, 32, x - 8, y - 24, 16, 32)
	}
}

drawLight = (x, y, size, path2d) => {
	ctx.translate(0, -M.oy)
	let gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
	gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
	gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
	ctx.fillStyle = gradient
	ctx.fill(path2d)
	ctx.translate(0, M.oy)
}

drawNoise = (x, y, step) => {
	ctx.strokeStyle = 'gray'
	ctx.beginPath()
	ctx.arc(x, y, step * 2, 0, Math.PI * 2)
	ctx.closePath()
	ctx.stroke()
}

// Speech Bubble
drawSB = (string, x, y, color = 'black') => {
	let f = font(12, true)
	let ts = textSize(string, f)
	let padx = 10, pady = 4
	let w = padx * 2 + ts.width, h = pady * 2 + ts.height
	pack(() => {
		ctx.fillStyle = 'white'
		ctx.shadowBlur = 20
		ctx.shadowColor = 'black'
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.quadraticCurveTo(x + padx + 10, y, x + padx + 10, y - 10)
		ctx.lineTo(x + w - padx, y - 10)
		ctx.quadraticCurveTo(x + w, y - 10, x + w, y - 10 - h / 2)
		ctx.quadraticCurveTo(x + w, y - 10 - h, x + w - padx, y - 10 - h)
		ctx.lineTo(x + padx, y - 10 - h)
		ctx.quadraticCurveTo(x, y - 10 - h, x, y - 10 - h / 2)
		ctx.quadraticCurveTo(x, y - 10, x + padx, y - 10)
		ctx.lineTo(x + padx, y - 10)
		ctx.quadraticCurveTo(x + 10, y, x, y)
		ctx.fill()
	})
	drawText(string, x + padx, y - 10 - pady - ts.height, {font: f, colors: color})
}

drawDevil = (x, y) => {
	fr(x - 1, y - 3, 2, 2, 'red')
	fr(x - 1, y + 1, 2, 2, 'red')
}