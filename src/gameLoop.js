var frameRate = 1000 / 60, last = 0, sum = 0

function startGameLoop(now) {
	requestAnimationFrame(startGameLoop)
	let deltaTime = now - last
	last = now
	if (isNaN(deltaTime) || deltaTime > 1000) return
	sum += deltaTime
	while(sum >= frameRate) {
		gameUpdate(1 / 60)
		sum -= frameRate
	}
	gameRender()
}

function gameUpdate(dt) {
	if (nextScene) {
		scene = new nextScene()
		nextScene = null
	}
	if (scene) scene.update(dt)
}

function gameRender() {
	if (scene) {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		scene.render()
	}
}

function goTo(newScene) {
	nextScene = newScene
}