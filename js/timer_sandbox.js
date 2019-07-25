// Nathan Altice
// Updated: 5/14/19
// Time
// One-shot, repeat, and loop events with a timer object

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
		game.load.image('football', 'football_small.png');
	},
	create: function() {
		// keep track of repetitions
		this.reps = 1;

		// create a Timer object - (autoDestroy) = kill timer after its events are dispatched
		this.timer = {};
		// add repeating event to timer (delay, repeatCount, callback, context, arguments)
  	    // add looping event to timer (delay, callback, context, arguments)
		// add one-shot event to timer (delay, callback, context, arguments)
		// don't forget to start the timer ⏲
	},
	update: function() {
		// no need for me :/
	},
	render: function() {
		game.debug.text('Timer Events Remaining: ' + this.timer.length, 32, 32, '#3d0');
	}
};

// init game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');