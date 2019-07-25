// Nathan Altice
// Updated: 5/14/19
// Time
// Demonstrating time.now vs. time.totalElapsedSeconds()

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

var Play = function(game){
	this.reloads = 0;
};
Play.prototype = {
	update: function() {
		this.timediff = game.time.now - game.time.totalElapsedSeconds().toFixed(2)*1000;
		// simple keyboard entry to test how different versions of state.start affect time
		if(game.input.keyboard.justPressed(Phaser.Keyboard.J)) {
			this.reloads++;
			game.state.start('Play', true, false);
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.K)) {
			this.reloads++;
			game.state.start('Play', false, false);
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.L)) {
			this.reloads++;
			game.state.start('Play', true, true);
		}
	},
	render: function() {
		// Note: these time vars will keep running when the game is paused...
		// ...they just won't be updated during render
		game.debug.text('time.now: ' + game.time.now + 'ms', 32, 32, '#3d0');
		game.debug.text('time.totalElapsedSeconds(): ' + game.time.totalElapsedSeconds().toFixed(2) + 's', 32, 64, '#3d0');
		game.debug.text('now - elapsed: ' + this.timediff.toFixed(2) + 'ms', 32, 96, '#3d0');
		game.debug.text('time.pauseDuration: ' + game.time.pauseDuration + 'ms', 32, 128, '#FCE');
		game.debug.text('reloads: ' + this.reloads, 32, 160, 'white');

		game.debug.text('Note: Losing browser focus also counts as \'pausing\'', 32, game.world.centerY);

		game.debug.text('== PRESS KEY TO RELOAD STATE ==', 32, game.world.centerY + 64, 'yellow');
		game.debug.text('J: clear world/ keep cache, K: keep world/cache, L: clear world/cache', 32, game.world.centerY + 96, 'yellow');
		game.debug.text('Press P to pause', 32, game.height -32);
	}
};

// init game and state
game = new Phaser.Game(650, 650);
game.state.add('Play', Play);
game.state.start('Play');