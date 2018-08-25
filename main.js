//-----Additional classes and functions ------------

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Point(this.x, this.y);
  }
}

//------- END ---------------------------------

class Game {
  constructor(w, h, canvas, containerId){
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.width = w;
    this.height = h;
    this.started = 1;
    this.map = new GameMap(40, 40);
    this.player_coords = Array(2).fill(0);
    this.player_coords_new = Array(2).fill(0);
    this.keys = document.getElementById(containerId);

    this.keys.addEventListener('keyup', function (event) {
      let key = event.key || event.keyCode;
      if (key === 'ArrowUp' || key === 'ArrowUp' || key === 38) {
          game.player_coords_new[0] -= 1;
      }
      if (key === 'ArrowDown' || key === 'ArrowDown' || key === 40) {
          game.player_coords_new[0] += 1;
      }
      if (key === 'ArrowLeft' || key === 'ArrowLeft' || key === 37) {
          game.player_coords_new[1] -= 1;
      }
      if (key === 'ArrowRight' || key === 'ArrowRight' || key === 39) {
          game.player_coords_new[1] += 1;
      }
    });
  }

  stop() {
    this.started = 0;
  }

  drawMainScreen() {
    this.clearMainScreen();
    let x = this.map.player_coords[0];
    let y = this.map.player;
    for (let i = this.map.player_coords[0] - 20; i < 30; i++) {
      for (let j = 0; j < 40; j++) {
        if (this.game_field[i][j] != null) {
          this.game_field[i][j].draw(j, i, this.ctx);
        }
      }
    }

    this.ctx.fillStyle = "#dd99ff";
    this.ctx.fillRect(this.width, this.height, 5, this.height);
    this.drawMinimap();
  }

  drawMinimap() {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        this.map.game_field[y][x].drawOnMinimap(this.width + 5 + x, y);
      }
    }
  }

  clearMainScreen() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  isStarted() {
    return this.started;
  }

  context() {
    return this.ctx;
  }

  canvas() {
    return this.canvas;
  }

  generateMap() {
    this.map.generateGameField();
  }

  positionChanged(coord, coord_new) {
    if (coord[0] != coord_new[0] || coord[1] != coord_new[1]) {
      return true;
    }
    return false;
  }

  playerMove() {
    if (this.positionChanged(this.player_coords, this.player_coords_new)) {
      if (this.game_field[this.player_coords_new[0]][this.player_coords_new[1]] == null) {
        this.game_field[this.player_coords_new[0]][this.player_coords_new[1]] = this.game_field[this.player_coords[0]][this.player_coords[1]]; 
        this.game_field[this.player_coords[0]][this.player_coords[1]] = null;
        this.player_coords = this.player_coords_new.slice();
      }
      else {
        this.player_coords_new = this.player_coords.slice();
      }
    }
  }
}

class GameMap {
  constructor(h, w) {
    this.width = w;
    this.height = h;
    this.game_field = Array(this.height).fill(null).map(()=>Array(this.width).fill(null)); // map W x H
    this.player_coords = new Point(randomInteger(0, this.height - 1), randomInteger(0, this.width - 1));
  }

  isInMap(coords) {
    if (coords.x > 0 && coords.y > 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
     console.log(true)
    }
    return false;
    console.log(false)
  }

  generateGameField() {
    console.log(1);
    let map = Array(this.height).fill(1).map(()=>Array(this.width).fill(1)); // map W x H
    let dig_position = this.player_coords.copy();
    let dig_position_new = dig_position.copy();
    console.log(2);
    let cells_to_open = Math.round(this.height * this.width * 0.01);
    console.log(cells_to_open);
    while (cells_to_open > 0) {
      switch (randomInteger(0, 3)) {
        case 1: dig_position_new[0] += 1;
        case 2: dig_position_new[0] -= 1;
        case 3: dig_position_new[1] += 1;
        case 0: dig_position_new[1] -= 1;
      }
      if (this.isInMap(dig_position_new)){ 
        if (map[dig_position_new.y][dig_position_new.x] != 0 ) {
          dig_position = dig_position_new.copy();
          map[dig_position.y][dig_position.x] = 0;
          cells_to_open -= 1;
        }
      }
      else {
        dig_position = this.player_coords.copy();
      }
      dig_position_new = dig_position.copy();
    }
  }
} 

class Object {
  constructor() {
    this.width = 20;
    this.height = 20;
  }

}

class Wall extends Object {
  constructor() {
    super();
  }

  drawOnMain(posX, posY, ctx) {
    let x = posX * this.width;
    let y = posY * this.height;
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(x, y, this.width - 1, this.height - 1);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(posX, posY, 1, 1);
  }
}

class Player extends Object {
  constructor() {
    super();
  }

  drawOnMain(posX, posY, ctx) {
    let x = posX * this.width + 3;
    let y = posY * this.height + 3;
    ctx.fillStyle = '#0080ff';
    ctx.fillRect(x, y, this.width - 6, this.height - 6);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = '#0080ff';
    ctx.fillRect(posX, posY, 1, 1);
  }
}

let game = new Game(820, 620, 'canvas', 'game');
let tick_interval = 100;

function move() {
  idTimer = setInterval('mainLoop();', tick_interval);
}

function mainLoop() {
  if (game.isStarted()) {
    game.playerMove();
    game.draw();
  }
  else {
    clearInterval(idTimer);
  }
}

function init() {
  game.generateMap();
}
