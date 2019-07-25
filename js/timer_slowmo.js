// Nathan Altice
// Updated: 5/14/19
// Time
// Button pausing, keyboard pausing, and sloooooooow mooooooootion (w/ music test)

'use strict';

import Phaser.js

var game;

// bind pause key to browser window event
window.onkeydown = function(event) {
	// capture keycode (event.which for Firefox compatibility)
	var keycode = event.keyCode || event.which;	
	if(keycode === Phaser.Keyboard.P) {
		pauseGame();
	}
}

function pauseGame() {
	// toggle game pause
	game.paused ? game.paused = false : game.paused = true;
}

var Play = function(game){};
Play.prototype = {
	preload: function() {
		// load assets
		game.load.path = 'assets/';
		game.load.image('star', 'star.png');
		game.load.image('diamond', 'diamond.png');
		game.load.image('red_pause', 'red_pause.png');
		game.load.image('up', 'up_arrow.png');
		game.load.image('down', 'down_arrow.png');
		// load audio
		game.load.path = '../assets/music/';
		game.load.audio('track01', ['dino.mp3']);
	},
	create: function() {
		game.stage.backgroundColor = '#333';
		game.physics.arcade.gravity.y = -100;

		// add/play audio
		this.song = game.add.audio('track01');
		this.song.play('', 0, 0.5, false);

		// setup emitter so we have something reacting to slo-mo
		var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
		emitter.makeParticles(['star', 'diamond']);
		emitter.start(false, 5000, 50); // (explode, lifespan, freq)

		// game pause button
		game.add.button(32, 32, 'red_pause', pauseGame);
		// up/down slo-mo speed buttons
		game.add.button(106, 32, 'up', this.slowDown);
		game.add.button(106, 64, 'down', this.speedUp);
	},
	update: function() {

	},
	render: function() {
		game.debug.text('game.time.slowMotion: ' + game.time.slowMotion, 32, game.height -64, '#fff');
		game.debug.text('Press P (or button) to Pause | Up/Down buttons change slo-mo speed', 32, game.height -32, '#fff');
	},
	slowDown: function() {
		game.time.slowMotion += 0.25;
	},
	speedUp: function() {
		game.time.slowMotion -= 0.25;
	}
};

// init game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');