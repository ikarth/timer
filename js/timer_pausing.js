// Nathan Altice
// Updated: 5/14/19
// Time
// Enabling advancedTiming

'use strict';

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
	},
	create: function() {
		// enable advanced timing (comment out to see effect)
		game.time.advancedTiming = true;

		// setup emitter
		// particles have infinite lifespan, so fps will eventually bog down
		this.emitter = game.add.emitter(game.world.centerX, game.world.centerY/2, 2000);
		this.emitter.makeParticles(['star', 'diamond'], 0, 2000, true, true);
		this.emitter.start(false, 0, 1); // (explode, lifespan, freq)
	},
	update: function() {
		game.physics.arcade.collide(this.emitter);
	},
	render: function() {
		// see https://photonstorm.github.io/phaser-ce/Phaser.Time.html for definitions of these properties
		// bracketed values are read-only 
		game.debug.text('<fps>: ' + game.time.fps, 32, 32, '#3d0');
		game.debug.text('fpsMin: ' + game.time.fpsMin, 32, 64, '#3d0');
		game.debug.text('fpsMax: ' + game.time.fpsMax, 32, 96, '#3d0');
		game.debug.text('<frames>: ' + game.time.frames, 32, 128, '#3d0');
		game.debug.text('msMin: ' + game.time.msMin, 32, 160, '#3d0');
		game.debug.text('msMax: ' + game.time.msMax, 32, 192, '#3d0');
		game.debug.text('suggestedFps: ' + game.time.suggestedFps, 32, 224, '#3d0');
		game.debug.text('Press P to Pause', 300, 32, '#fff');
	}
};

// init game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');