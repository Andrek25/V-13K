var P
class Player extends Entity {
	constructor(x, y, face) {
		super()
		P = this
		P.best = false
		P.x = x
		P.y = y
		P.lantern = false
		P.animation = new Animation(face)
		P.htb = false
		P.htbC = HTB
		bind(F, () => {if (!M.ritualStop) P.lantern = !P.lantern})
		bind(Q, () => {if (!M.energy && P.htbC == HTB) P.htb = true})
	}
	touching(entity) {
		if (entity.type == 2) {
			entity.push(P)
		}
	}
	behavior() {
		if (!M.intro) {
			let moveTo = [P.x, P.y]
			moveTo[1] += keyPressed(S) ? 4 : keyPressed(W) ? -4 : 0
			moveTo[0] += keyPressed(D) ? 4 : keyPressed(A) ? -4 : 0
			if (P.htb) {
				P.htbC -= 1
				if (P.htbC == 0) P.htb = false
			} else {
				P.htbC = Math.min(P.htbC + 1, HTB)
			}
			if (keyPressed(SHIFT) && !P.htb) {
				P.speed = P.best ? 1.3 : 1.12
				P.animation.frameRate = 8
				M.doNoise(P, 128)
			} else {
				P.speed = 0.6
				P.animation.frameRate = 4
				if (!P.htb) M.doNoise(P, 32)
			}
			P.moveTo = moveTo
		}
	}
}