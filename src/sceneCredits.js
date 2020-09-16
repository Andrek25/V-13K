var C
class SceneCredits {
	constructor() {
		C = this
		C.oy = 0
		C.elliot = new Animation(0)
		C.elliot.play('walkdown')
		C.mary = new Animation(1)
		C.mary.play('idleup')
		C.elliotX = 320
		C.elliotY = 150
		C.elliotSay = ''
		C.inverted = false
		C.maryY = 250
		C.marySay = ''
		C.step = 1
		C.gate = 8
		C.opened = false
		C.colors = 'black'
		C.transition = 0
		C.p = []
		C.fog = 0
		C.fogText = ''
		C.texts = [
			'Thanks for playing',
			'Special thanks to Sophya Zamora (Sprites)',
			'In memory of Angel David (Pacheco)',
			"His body is still alive but his soul is not",
			'Created by',
			'Andres Costa'
		]
		setInterval(() => {
			if (Math.random() < 0.5) C.particle(288, 160, 50)
			if (Math.random() < 0.5) C.particle(352, 160, 50)
		}, 3000)
	}
	update(dt) {
		if (C.opened) {
			if (C.gate < 32) C.gate++
		} else {
			if (C.gate > 8) C.gate--
		}
		C.elliot.update(dt)
		C.mary.update(dt)
		switch (C.step) {
			case 1:
				C.elliotY++
				if (C.elliotY >= 200) {
					C.elliot.play('walkleft')
					C.step = 2
				}
				break
			case 2:
				C.elliotX--
				if (C.elliotX < 304) {
					C.elliot.play('idleleft')
					C.step = 0
					setTimeout(() => {C.step = 3}, 1000)
				}
				break
			case 3:
				C.elliot.play('idledown')
				C.eSay("The door is damaged.\nI can't close it.", 4)
				break
			case 4:
				C.mSay('What! how?\nare you sure dad?', 5)
				break
			case 5:
				C.eSay('Yes, we need to\nkeep it closed manually.', 6)
				break
			case 6:
				C.eSay('I will close it\nby quarantine protocol.', 7)
				break
			case 7:
				C.mSay('No dad, you need to be\non the other side for that', 8)
				break
			case 8:
				C.elliot.play('walkleft')
				C.inverted = true
				C.elliotX++
				if (C.elliotX >= 320) {
					C.elliot.play('idledown')
					C.step = 9
				}
				break
			case 9:
				C.eSay("I know.\nThey're coming, we don't\nhave time, just go!", 10)
				break
			case 10:
				C.elliot.play('walkup')
				setInterval(() => C.elliotY--, 16)
				C.mSay("Wait father!\ndon't go.", 11)
				break
			case 11:
				if (C.elliotY < 150) {
					C.step = 12
				}
				break
			case 12:
				C.colors = [[43, 'red'], [48, 'black']]
				C.mSay("Please come back.\nI haven't told you that\nI love you.", 13)
				break
			case 13:
				C.opened = true
				setTimeout(() => C.step = 14, 1000)
				break
			case 14:
				if (C.gate >= 32) {
					C.transition = 100
					C.step = 0
				}
				break
			case 15:
				C.fog++
				if (C.fog >= 300) {
					if (C.texts.length == 0) {
						checkPoint = [STARTPOINT[0], STARTPOINT[1], true, true, true, false, [], true]
						goTo(SceneTitle)
					} else {
						C.fog = 0
						C.fogText = C.texts.shift()
					}
				}
				break
		}
	}
	render() {
		if (C.step >= 15) {
			let c = 'rgba(255,255,255,' + C.fog / 100 + ')'
			let w = CANVAS_WIDTH / 2, h = CANVAS_HEIGHT / 2
			drawCenterText(C.fogText, w, h, {font: font(18), colors: c})
		} else {
			// Floor
			for (let y = 0; y < 39; y++) {
				for (let x = 18; x < 22; x++) {
					fr(x * 16, y * 16, 16, 16, '#e0e0e0')
					fr(x * 16, y * 16, 15, 15, '#eee')
				}
			}

			// Gate
			let color = C.opened ? 'green' : 'red'
			let x = 288, y = 160
			fr(x, y, C.gate, 32, '#9e9e9e')
			fr(x + 1, y + 1, C.gate - 2, 32 - 2, '#e0e0e0')
			fr(x + 1, y + 2, C.gate - 2, 4, '#bdbdbd')
			fr(x + 1, y + 26, C.gate - 2, 4, '#bdbdbd')
			fr(x + C.gate - 6, y + 14, 4, 6, '#616161')
			fr(x + C.gate - 5, y + 16, 2, 2, color)
			x = 320
			let ox = 32 - C.gate
			fr(x + ox, y, C.gate, 32, '#9e9e9e')
			fr(x + 1 + ox, y + 1, C.gate - 2, 32 - 2, '#e0e0e0')
			fr(x + 1 + ox, y + 2, C.gate - 2, 4, '#bdbdbd')
			fr(x + 1 + ox, y + 26, C.gate - 2, 4, '#bdbdbd')
			fr(x + ox + 2, y + 14, 4, 6, '#616161')
			fr(x + ox + 3, y + 16, 2, 2, color)

			// Particles
			renderParticles(C.p)

			// Entities
			C.elliot.render(C.elliotX, C.elliotY, C.inverted)
			C.mary.render(320, C.maryY)

			// Block
			fr(288, 0, 64, 160, '#000')
			fr(256, 144, 32, 80, '#000')
			fr(352, 144, 32, 80, '#000')

			// Speech Bubbles
			if (C.elliotSay != '') drawSB(C.elliotSay, C.elliotX, C.elliotY - 24)
			if (C.marySay != '') drawSB(C.marySay, 320, C.maryY - 24, C.colors)
			if (C.transition > 0) {
				C.transition--
				fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'rgba(0, 0, 0, ' + (1 - C.transition / 100) + ')')
				if (C.transition <= 0) {
					C.step = 15
					C.fogText = C.texts.shift()
				}
			}
		}
	}
	eSay(string, nextStep) {
		C.elliotSay = string
		C.step = 0
		setTimeout(() => {C.elliotSay = ''; if (nextStep) C.step = nextStep}, 5000)
	}
	mSay(string, nextStep) {
		C.marySay = string
		C.step = 0
		setTimeout(() => {C.marySay = ''; if (nextStep) C.step = nextStep}, 5000)
	}
	particle(x, y, count) {
		for (let i = 0; i < count; i++) {
			C.p.push([x, y, rnd() * 2 - 1, rnd() * 2 - 0.5, rand(30, 80), y + 32])
		}
	}
}