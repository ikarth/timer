// Nathan Altice
// 4/28/19
// Time
// Self-modifying recursive timer events

// STRICC
"use strict";

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

var Play = function(game) {
    this.iteration = 0;
    this.timerLength = 2000; // starting length of timer (ms)
    this.TIME_SUBTRACTION = 100;
};
Play.prototype = {
    create: function() {
        // run for the first time, recursion will take care of the rest
        this.createTimer();
    },
    createTimer: function() {
        // prevent TIME PARADOX
        if(this.timerLength > 0) {
            game.time.events.add(this.timerLength, this.createTimer, this);
            this.iteration++;
            this.timerLength -= this.TIME_SUBTRACTION;
        }
    },
    render: function() {
        game.debug.text('Time remaining: ' + game.time.events.duration.toFixed(0), 32, 32);
        game.debug.text('Iteration: ' + this.iteration, 32, 64);
        game.debug.text('Next timer length: ' + this.timerLength, 32, 96);
    }
}

// game and state DEFINED
var game = new Phaser.Game();
game.state.add('Play', Play);
game.state.start('Play');