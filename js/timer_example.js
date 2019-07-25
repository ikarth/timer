// Nathan Altice
// Updated: 5/14/19
// Time
// Multiple timers w/ debug info and visuals (scaled time bars)

'use strict';

var game;

var Play = function(game){};
Play.prototype = {
	preload: function() {
		game.load.path = 'assets/';
		game.load.image('square', 'square.png');
		game.load.image('red_pause', 'red_pause.png');
		game.load.image('star', 'star.png');
	},
	create: function() {
		// create Timer objects 
		// .create(autoDestroy) = kill timer after its event is dispatched?
		this.timer01 = game.time.create(true);
		this.timer02 = game.time.create(true);
	    this.timer03 = game.time.create(false);
            

		// add events to our Timer objects (delay, callback, context)
		// timer01
	    this.timedEvent01 = this.timer01.add(Phaser.Timer.SECOND * 40, this.timerEnd01, this);
          
		// timer02
		this.timedEvent02 = this.timer02.add(Phaser.Timer.SECOND * 5, this.timerEnd02, this);
		// timer03 (holds multiple events which aren't assigned to vars)
		// note that no matter what order you add time events, 
		// Phaser willl arrange them internally from shortest to longest
		this.timer03.add(Phaser.Timer.MINUTE / 2, this.timerEnd03, this);
		this.timer03.add(Phaser.Timer.SECOND * 3, this.timerEnd03, this);
		this.timer03.add(Phaser.Timer.MINUTE, this.timerEnd03, this);
		this.timer03.add(Phaser.Timer.HALF, this.timerEnd03, this);

		// start the timers - .start(delay)
		this.timer01.start();
		this.timer02.start();
		this.timer03.start(3000);

		// some text style 💅
		this.textStyle = {
			font: 'Fira Sans',
			fontSize: 16,
			fill: '#FF4462'
		};

		// timebar objects
		// 01
		this.timebar01 = game.add.sprite(32, 320, 'square');
		this.timebar01.scale.y = 20;
		this.timebar01.max = this.timer01.duration;
		game.add.text(32, 350, 'Timer 01: duration (scaled to screen width)', this.textStyle);
		// 02
		this.timebar02 = game.add.sprite(32, 380, 'square');
		this.timebar02.scale.y = 20;
		this.timebar02.max = this.timer02.duration;
		game.add.text(32, 410, 'Timer 02: elapsed (scaled to screen width)', this.textStyle);
		this.timebar02.tint = 0xFACADE;
		// 03
		this.timebar03 = game.add.sprite(32, 440, 'square');
		this.timebar03.scale.y = 20;
		this.timebar03.max = this.timer03.duration;
		game.add.text(32, 470, 'Timer 03: elapsed (scaled to screen width)', this.textStyle);
		this.timebar03.tint = 0xF4EF4E;

		// game pause button
		game.add.button(300, 520, 'red_pause', this.pauseGame);

		// make star
		this.star = game.add.sprite(game.width - 32, 32, 'star');
		game.physics.enable(this.star);
		this.star.body.velocity.y = 500;
		this.star.body.collideWorldBounds = true;
		this.star.body.bounce.y = 1.0;
	},
	update: function() {
		// update timebar sizes (using sprite scale)
		this.timebar01.scale.x = this.scaleValue(this.timer01.duration, this.timebar01.max, 0, game.width-64);
		this.timebar02.scale.x = this.scaleValue(this.timer02.ms, this.timebar02.max, 0, game.width-64);
		// note that timer03 will scale its timebar off the right edge of the screen, because ms elapsed continues to count if the timer is not destroyed (even if it has no events left)
		if(this.timer03.ms > 0) { // checking >0 makes sure we don't draw a negative bar during the timer delay
			this.timebar03.scale.x = this.scaleValue(this.timer03.ms, this.timebar03.max, 0, game.width-64);
		}
	},
	render: function() {
		// timer01 debug text
		game.debug.text('ms: ' + this.timer01.ms, 32, 32, "#ff0");
		game.debug.text('s: ' + this.timer01.seconds.toFixed(2), 32, 64, "#ff0");
		game.debug.text('elapsed: ' + this.timer01.elapsed, 32, 96, '#facade');
		game.debug.text('duration: ' + this.timer01.duration, 32, 128, '#ff0');
		game.debug.text('running: ' + this.timer01.running, 32, 160, '#ff0');
		game.debug.text('autoDestroy: ' + this.timer01.autoDestroy, 32, 192, '#3d0');
		game.debug.text('expired: ' + this.timer01.expired, 32, 224, '#3d0');
		game.debug.text('TIMER01', 32, 256, '#FFF');

		// timer02 debug text
		game.debug.text('ms: ' + this.timer02.ms, 232, 32, "#ffff00");
		game.debug.text('s: ' + this.timer02.seconds.toFixed(2), 232, 64, "#ff0");
		game.debug.text('elapsed: ' + this.timer02.elapsed, 232, 96, '#facade');
		game.debug.text('duration: ' + this.timer02.duration, 232, 128, '#ff0');
		game.debug.text('running: ' + this.timer02.running, 232, 160, '#ff0');
		game.debug.text('autoDestroy: ' + this.timer02.autoDestroy, 232, 192, '#3d0');
		game.debug.text('expired: ' + this.timer02.expired, 232, 224, '#3d0');
		game.debug.text('TIMER02', 232, 256, '#FFF');

		// timer03 debug text
		game.debug.text('ms: ' + this.timer03.ms, 432, 32, "#ffff00");
		game.debug.text('s: ' + this.timer03.seconds.toFixed(2), 432, 64, "#ff0");
		game.debug.text('elapsed: ' + this.timer03.elapsed, 432, 96, '#facade');
		game.debug.text('duration: ' + this.timer03.duration, 432, 128, '#ff0');
		game.debug.text('running: ' + this.timer03.running, 432, 160, '#ff0');
		game.debug.text('autoDestroy: ' + this.timer03.autoDestroy, 432, 192, '#3d0');
		game.debug.text('expired: ' + this.timer03.expired, 432, 224, '#3d0');
		game.debug.text('TIMER03', 432, 256, '#FFF');

		// more debug
		game.debug.text('game.time.now: ' + game.time.now, 32, 552, '#4fe');
	},
	// this function scales a value from a given input range to a desired output range
	// we use this to scale the total length of the time bar proportional to the screen width
	scaleValue(value, inputMax, outputMin, outputMax) { 
		return ((value - 1) / (inputMax - 1)) * (outputMax-outputMin) + outputMin; 
	},
	pauseGame: function() {
		// toggle game pause
		game.paused ? game.paused = false : game.paused = true;
	},
	// some debug callback functions
	timerEnd01: function() {
		console.log('Timer01 event ended.');
	},
	timerEnd02: function() {
		console.log('Timer02 event ended.');
	},
	timerEnd03: function() {
		// this hacky-as-hell check rescales the timebar length to the current delay length when an event ends
		// here's the catch: the callback occurs *before* the event is removed from the timer
		// thus, the timer's length (# of events) will be 1 *before* its last event is removed
		// so we have to look ahead to element 1 instead of 0
		// sorry for the long comment and thank you for coming to my TED talk
		if(this.timer03.length > 1) this.timebar03.max = this.timer03.events[1].delay;
		console.log('Timer03 event ended.');		
	}
};

// game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');
