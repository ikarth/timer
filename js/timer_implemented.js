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
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// keep track of repetitions
		this.reps = 1;

		// create a Timer object - (autoDestroy) = kill timer after its events are dispatched
		this.timer = game.time.create();

		// add looping event to timer (delay, callback, context, arguments)
		this.timer.loop(125, function() {
			//console.log('Firing loop event at (diamond) ' + this.timer.ms + 'ms');
			var collectable = game.add.sprite(game.world.randomX, game.world.randomY, 'diamond');
			game.physics.enable(collectable, Phaser.Physics.ARCADE);
			collectable.body.drag.set(50);
			collectable.body.maxVelocity.set(500);
			//collectable.body.acceleration.y = 100;
			collectable.update = function() {
				this.body.gravity = new Phaser.Point(game.input.mousePointer.x - this.body.x, game.input.mousePointer.y - this.body.y);
			}
			this.timer.add(499, function() {
				this.kill();
				}, collectable);
		
		}, this);

		// don't forget to start the timer ⏲
		this.timer.start();
	},
	update: function() {
		// no need for me :/
	},
	render: function() {
		//game.debug.text('Timer Events Remaining: ' + this.timer.length, 32, 32, '#3d0');
	}
};

// init game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');