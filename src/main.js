// GLOBAL VARIABLES
var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')
var scene
var nextScene
var keys = {}
var binds = {}
var images = {}
var mouse = {x: 0, y: 0}
var checkPoint = [STARTPOINT[0], STARTPOINT[1], true, true, true, false, [], true]

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height
const TILEMAP_WIDTH = 40
const TILEMAP_HEIGHT = 72
const ENTER = 13
const ESCAPE = 27
const SHIFT = 16
const W = 87
const A = 65
const S = 83
const D = 68
const F = 70
const Q = 81
const HTB = 200

// CHARACTERS ANIMATION
const ANIMATION = {
	idledown: [0],
	idleleft: [1],
	idleup: [2],
	walkdown: [3, 0, 6, 0],
	walkleft: [4, 1, 7, 1],
	walkup: [5, 2, 8, 2]
}

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame

let promises = [], folder = ['tileset', 'tileset8x8', 'character', 'elliot', 'mary', 'zombie']
folder.map(i => {
	promises.push(
			new Promise((resolve, reject) => {
			images[i] = new Image()
			images[i].src = 'img/' + i + '.png'
			images[i].addEventListener('load', () => resolve(true))
		})
	)
})


Promise.all(promises).then( result => {
	images.tileset = images['tileset']
	images.tileset8x8 = images['tileset8x8']
	images.elliot = mergeFace(images['character'], images['elliot'])
	images.mary = mergeFace(images['character'], images['mary'])
	images.zombie = mergeFace(images['character'], images['zombie'])
	startGameLoop()
	goTo(SceneTitle)
})