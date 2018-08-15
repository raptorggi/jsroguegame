class Game {
  constructor(w, h, canvas){
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.width = w;
    this.height = h;
    this.started = 1;
  }

  stop() {
    this.started = 0;
  }

  draw() {
    this.clear_screen();
    this.ctx.fillStyle = "#120021";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  clear_screen() {
    this.ctx.fillStyle = "#000021";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  is_started() {
    return this.started;
  }
}

var game = new Game(800, 600, 'canvas');

function init() {
  // while (game.started) {
  //   game.clear_screen();
  // }
  //game.clear_screen();
}

function move() {
  idTimer = setInterval('main_loop();', 50);
}

function main_loop() {
  if (game.is_started()) {
    game.draw();
  }
  else {
    clearInterval(idTimer);
  }
  // }
}

