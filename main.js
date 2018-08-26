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

//------------------ END ------------------

class Game {
  constructor(w, h, cell_w, cell_h, canvas, containerId) {
    this.canvas_id = canvas;
    this.container_id = containerId;
    this.cell_width = cell_w;
    this.cell_height = cell_h;
    this.cells_width_count = w;
    this.cells_height_count = h;
    this.canvas_width = this.cells_width_count * this.cell_width + 5 + this.cells_width_count * 2;
    this.canvas_height = this.cells_height_count * this.cell_height;
    this.map_width = this.cells_width_count * this.cell_width;
    this.map_height = this.canvas_height;
    this.loadCanvas();
    this.canvas = document.getElementById(this.canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.started = 1;
    this.map = new GameMap(40, 40);
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

  loadCanvas() {
    let canvas = document.createElement('canvas'),
    div = document.getElementById(this.container_id);
    canvas.id = this.canvas_id;
    canvas.width = this.canvas_width;
    canvas.height = this.canvas_height;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    div.appendChild(canvas);
  }

  stop() {
    this.started = 0;
  }

  drawMainScreen() {
    this.clearMainScreen();
    this.ctx.fillStyle = "#dd99ff";
    this.ctx.fillRect(this.map_width, 0, 5, this.canvas_height);
    this.drawMinimap();
  }

  drawMinimap() {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (this.map.game_field[y][x] != null) {
          this.map.game_field[y][x].drawOnMinimap(this.map_width + 5 + x * 2, y * 2, this.ctx);
        }
      }
    }
  }

  clearMainScreen() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);
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
    this.player_coords = new Point(Math.abs(randomInteger(0, this.height - 1)), Math.abs(randomInteger(0, this.width - 1)));
  }

  isInMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
    }
    return false;
  }

  generateGameField() {
    let map = Array(this.height).fill(1).map(()=>Array(this.width).fill(1)); // map W x H
    let dig_position = this.player_coords.copy();
    let dig_position_new = dig_position.copy();
    let cells_to_open = Math.round(this.height * this.width * 0.1);
    while (cells_to_open > 0) {
      let t = Math.abs(randomInteger(0, 3));
      switch (t) {
        case 1: dig_position_new.y += 1;
        case 2: dig_position_new.y -= 1;
        case 3: dig_position_new.x += 1;
        case 0: dig_position_new.x -= 1;
      }
      if (this.isInMap(dig_position_new)){ 
        if (map[dig_position_new.y][dig_position_new.x] != 0 ) {
          dig_position = dig_position_new.copy();
          map[dig_position.y][dig_position.x] = 0;
          cells_to_open -= 1;
        }
        else {
          dig_position = dig_position_new.copy();
        }
      }
      else {
        dig_position = this.player_coords.copy();
      }
      dig_position_new = dig_position.copy();
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (map[y][x] == 1) {
          this.game_field[y][x] = new Wall(game.cell_width, game.cell_height);
        }
      }
    }
    this.game_field[this.player_coords.y][this.player_coords.x] = new Player(game.cell_width, game.cell_height);
  }

} 

class Object {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.color = "#000000";
  }

}

class Wall extends Object {
  constructor(w, h) {
    super();
    this.width = w;
    this.height = h;
    this.color = "#d9d9d9";
  }

  drawOnMain(posX, posY, ctx) {
    let x = posX * this.width;
    let y = posY * this.height;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width - 1, this.height - 1);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 2, 2);
  }
}

class Player extends Object {
  constructor(w, h) {
    super();
    this.width = w;
    this.height = h;
    this.color = "#0080ff";
  }

  drawOnMain(posX, posY, ctx) {
    let x = posX * this.width + 3;
    let y = posY * this.height + 3;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width - 6, this.height - 6);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 2, 2);
  }
}

function move() {
  idTimer = setInterval('mainLoop();', tick_interval);
}

function mainLoop() {
  if (game.isStarted()) {
    // game.playerMove();
    game.drawMainScreen();
  }
  else {
    clearInterval(idTimer);
  }
}

function init() {
  window.game = new Game(31, 31, 15, 15, 'canvas', 'game');
  window.tick_interval = 100;
  game.generateMap();
}
