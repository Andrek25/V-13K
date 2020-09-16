class Zombie extends Entity {
	constructor(setup) {
		super()
		let a = this
		a.x = setup[0] * 16 + 8
		a.y = setup[1] * 16 + 8
		a.speed = 0.85
		a.animation = new Animation(2)
		a.delay = 0 // Delay to avoid update the behavior in any frame, improving perfomance.
		a.delayFrame = rand(0, 30)
	}
	touching(entity) {
		if (entity instanceof Player) goTo(SceneMap)
	}
	touched(entity) {
		if (entity instanceof Player) goTo(SceneMap)
	}
	behavior() {
		let a = this
		M.doNoise(a, a.moving() ? 128 : 48)
		if (a.delay == a.delayFrame) {
			if (a.follow) {
				if (distance(a, a.follow) > 128) {
					a.moveTo = null
					a.pathTo(a.follow)
					a.follow = null
				}
			} else {
				if (distance(a, M.player) <= 160 && M.inLight(M.player) && a.seeing(M.player)) {
					a.follow = M.player
					a.path.length = 0
					a.moveTo = null
				}
			}
		}
		a.delay = (a.delay + 1) % 30
	}
}