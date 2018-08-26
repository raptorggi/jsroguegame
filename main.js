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

  isEqual(point) {
    if (this.y == point.y && this.x == point.x) {
      return true;
    }
    return false;
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
    this.canvas_width = this.cells_width_count * this.cell_width + 5 + this.cells_width_count * 3;
    this.canvas_height = this.cells_height_count * this.cell_height;
    this.map_width = this.cells_width_count * this.cell_width;
    this.map_height = this.canvas_height;
    this.loadCanvas();

    this.canvas = document.getElementById(this.canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.started = 1;
    this.map = new GameMap(60, 60);
    this.player;  // player coordinates (Point)
    this.player_new; //player coordinates after pressing move button
    this.keys = document.getElementById(containerId);

    this.keys.addEventListener('keyup', function (event) {
      let key = event.key || event.keyCode;
      if (key === 'ArrowUp' || key === 'ArrowUp' || key === 38) {
          game.player_new.y -= 1;
      }
      if (key === 'ArrowDown' || key === 'ArrowDown' || key === 40) {
          game.player_new.y += 1;
      }
      if (key === 'ArrowLeft' || key === 'ArrowLeft' || key === 37) {
          game.player_new.x -= 1;
      }
      if (key === 'ArrowRight' || key === 'ArrowRight' || key === 39) {
          game.player_new.x += 1;
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

  drawAll() {
    this.clearScreen(this.map_width, this.map_height);
    this.drawMainScreen();
    this.ctx.fillStyle = "#dd99ff";
    this.ctx.fillRect(this.map_width, 0, 5, this.canvas_height);
  }

  drawMainScreen() {
    let start = this.getCameraStartCoordinates();
    for (let y = start.y, j = 0; y < start.y + this.cells_height_count; y++, j++) {
      for (let x = start.x, i = 0; x < start.x + this.cells_width_count; x++, i++) {
        if (this.map.game_field[y][x] != null) {
          this.map.game_field[y][x].drawOnMain(i * this.cell_width, j * this.cell_height, this.ctx);
        }
      }
    }  
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

  clearScreen(w, h) {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, w, h);
  }

  generateMap() {
    let template = this.map.generateGameFieldTemplate();
    // console.log(template);
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (template[y][x] == 1) {
          this.map.game_field[y][x] = new Wall(this.cell_width, this.cell_height);
        }
      }
    }
    this.map.game_field[this.map.start_position.y][this.map.start_position.x] = new Player(this.cell_width, this.cell_height);
    this.player = this.map.start_position.copy();
    this.player_new = this.player.copy();
  }

  getCameraStartCoordinates() {
    let point = this.player.copy();
    let w = (this.cells_width_count - 1) / 2;
    let h = (this.cells_height_count - 1) / 2;
    point.set(point.x - w, point.y - h);
    if (point.y < 0) {
      point.y = 0;
    }
    if (point.x < 0) {
      point.x = 0;
    }

    if (point.y + this.cells_height_count > 60 - 1) {
      point.y = 60 - this.cells_height_count - 1;
    }
    if (point.x + this.cells_height_count > 60 - 1) {
      point.x = 60 - this.cells_width_count - 1;
    }
    return point;
  }

  playerMove() {
    if (!this.player.isEqual(this.player_new)) {
      if (this.map.game_field[this.player_new.y][this.player_new.x] == null) {
        this.map.game_field[this.player_new.y][this.player_new.x] = this.map.game_field[this.player.y][this.player.x]; 
        this.map.game_field[this.player_new.y][this.player_new.x] = null;
        this.player = this.player_new.copy();
      }
      else {
        this.player_new = this.player.copy();
      }
    }
  }

  stop() {
    this.started = 0;
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
}

class GameMap {
  constructor(h, w) {
    this.width = w;
    this.height = h;
    this.game_field = Array(this.height).fill(null).map(()=>Array(this.width).fill(null)); // map W x H
    this.start_position = new Point(Math.abs(randomInteger(0, this.height - 1)), Math.abs(randomInteger(0, this.width - 1)));
  }

  isInMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
    }
    return false;
  }

  generateGameFieldTemplate() {
    let template = Array(this.height).fill(1).map(()=>Array(this.width).fill(1)); // map W x H
    let dig_position = this.start_position.copy();
    let dig_position_new = dig_position.copy();
    let cells_to_open = Math.round(this.height * this.width * 0.1);
    while (cells_to_open > 0) {
      switch (Math.abs(randomInteger(0, 3))) {
        case 1: dig_position_new.y += 1;
        case 2: dig_position_new.y -= 1;
        case 3: dig_position_new.x += 1;
        case 0: dig_position_new.x -= 1;
      }
      if (this.isInMap(dig_position_new)){ 
        if (template[dig_position_new.y][dig_position_new.x] != 0 ) {
          dig_position = dig_position_new.copy();
          template[dig_position.y][dig_position.x] = 0;
          cells_to_open -= 1;
        }
        else {
          dig_position = dig_position_new.copy();
        }
      }
      else {
        dig_position = this.start_position.copy();
      }
      dig_position_new = dig_position.copy();
    }
  return template;
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
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, this.width - 1, this.height - 1);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 3, 2);
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
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, this.width - 6, this.height - 6);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 3, 2);
  }
}

function move() {
  idTimer = setInterval('mainLoop();', tick_interval);
}

function mainLoop() {
  if (game.isStarted()) {
    game.playerMove();
    game.drawAll();
  }
  else {
    clearInterval(idTimer);
  }
}

function init() {
  window.game = new Game(31, 31, 15, 15, 'canvas', 'game');
  window.tick_interval = 100;
  game.generateMap();
  game.clearScreen(game.canvas_width, game.canvas_height);
  game.drawMinimap();
}
