keyDown = (event) => {
	let code = event.which || event.keyCode
	if (binds[code] && !keys[code]) {
		binds[code]()
	}
	keys[code] = true
}

keyUp = (event) => {
	keys[event.which || event.keyCode] = false
}

keyBlur = () => {
	keys = {}
}

keyPressed = (key) => {
	return keys[key]
}

bind = (key, callback) => {
	binds[key] = callback
}

unbind = (key) => {
	binds[key] = null
}

canvas.onmousemove = (event) => {
	let ratio = canvas.height / canvas.offsetHeight
	let rect = canvas.getBoundingClientRect()
	mouse.x = (event.clientX - rect.left) * ratio
	mouse.y = (event.clientY - rect.top) * ratio
}

window.addEventListener('keydown', keyDown, false)
window.addEventListener('keyup', keyUp, false)
window.addEventListener('blur', keyBlur, false)