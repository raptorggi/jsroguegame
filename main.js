//-----Additional classes and functions ------------

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
  window.game = new Game('canvas', 'game');
  window.tick_interval = 100;
  game.generateMap();
  game.draw();
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

function arrayClone(array) {
  let copy = [];
  for (let i = 0; i < array.length; i++) {
    copy[i] = array[i].slice();
  }
  return copy;
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

class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

//------------------ END ------------------

class Game {
  constructor(canvas, containerId) {
    this.canvas_id = canvas;
    this.container_id = containerId;
    this.map_size = new Size(100, 100);
    this.screen_size = new Size(41, 41);

    this.map = new GameMap(this.map_size.width, this.map_size.height);

    this.renderer = new Renderer(this.canvas_id, this.container_id, this.map_size, this.screen_size);
    this.interface = new UserInteface("#ffffff", this.ctx);
    this.player;  // player coordinates (Point)
    this.player_new; //player coordinates after pressing move button
    this.started = 1;
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

  generateMap() {
    let template = this.map.generateGameFieldTemplate();
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (template[y][x] == 1) {
          this.map.game_field[y][x] = new Wall(this.renderer.object.width, this.renderer.object.height);
        }
      }
    }
    this.map.game_field[this.map.start_position.y][this.map.start_position.x] = new Player(this.renderer.object.width, this.renderer.object.height);
    this.player = this.map.start_position.copy();
    this.player_new = this.player.copy();
  }

  draw() {
    this.renderer.drawAll(this.map, this.getCameraStartCoordinates());
  }

  getCameraStartCoordinates() {
    let point = this.player.copy();
    let w = (this.screen_size.width - 1) / 2;
    let h = (this.screen_size.height - 1) / 2;
    point.set(point.x - w, point.y - h);
    if (point.y < 0) {
      point.y = 0;
    }
    if (point.x < 0) {
      point.x = 0;
    }
    if (point.y + this.screen_size.height > this.map_size.height - 1) {
      point.y = this.map_size.height - this.screen_size.height;
    }
    if (point.x + this.screen_size.width > this.map_size.width - 1) {
      point.x = this.map_size.width - this.screen_size.width;
    }
    return point;
  }

  playerMove() {
    if (!this.map.isInMap(this.player_new)) {
      this.player_new = this.player.copy();
    }
    if (!this.player.isEqual(this.player_new)) {
      if (this.map.game_field[this.player_new.y][this.player_new.x] == null) {
        this.map.game_field[this.player_new.y][this.player_new.x] = this.map.game_field[this.player.y][this.player.x]; 
        this.map.game_field[this.player.y][this.player.x] = null;
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
}

class Renderer {
  constructor(canvas_id, container_id, map_size, screen_size) {
    this.object = new Size(15, 15);
    this.screen_size = screen_size;
    this.map = new Size(this.screen_size.width * this.object.width, this.screen_size.height * this.object.height);
    this.minimap = new Size(map_size.width * 2, map_size.height * 2);
    this.canvas = new Size(this.map.width + 5 + this.minimap.width, this.map.height);

    this.canvas_obj = this.loadCanvas(canvas_id, container_id, this.canvas.width, this.canvas.height);
    this.ctx = this.canvas_obj.getContext("2d");
  }

  loadCanvas(canvas_id, container_id, width, height) {
    let canvas = document.createElement('canvas'),
    div = document.getElementById(container_id);
    canvas.id = canvas_id;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    div.appendChild(canvas);
    return canvas;
  }

  drawAll(map, position) {
    this.clearScreen(this.canvas.width, this.canvas.height);
    // this.interface.drawDelimiters(this.canvas_px.width, this.canvas_px.height, this.map_px.width, this.map_px.height, this.minimap.width, this.minimap.height);
    this.drawMainScreen(map, position);
    this.drawMinimap(map);
  }

  drawMainScreen(map, position) {
    for (let y = position.y, j = 0; y < position.y + this.screen_size.height; y++, j++) {
      for (let x = position.x, i = 0; x < position.x + this.screen_size.width; x++, i++) {
        if (map.game_field[y][x] != null) {
          map.game_field[y][x].drawOnMain(i * this.object.width, j * this.object.height, this.ctx);
        }
      }
    }  
  }

  drawMinimap(map) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.game_field[y][x] != null) {
          map.game_field[y][x].drawOnMinimap(this.map.width + 5 + x * 2, y * 2, this.ctx);
        }
      }
    }
  }

  clearScreen(w, h) {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, w, h);
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
    let template = this.initializeGameField();
    let simulate_steps = 5;
    for (let step = 0; step <= simulate_steps; step++) {
      let new_template = this.simulateStep(template);
      template = arrayClone(new_template);
    }
    return template;
  }

  initializeGameField() {
    let template = Array(this.height).fill(1).map(()=>Array(this.width).fill(1)); // map W x H
    let chance_to_set_wall = 37;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        template[y][x] = (randomInteger(0, 100) < chance_to_set_wall) ? 1 : 0;
      }
    }
    return template;
  }

  simulateStep(old_template) {
    let birth_limit = 4;
    let death_limit = 3;
    let template = arrayClone(old_template);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let count = this.countAliveNeighbours(template,x ,y);
        if (old_template[y][x]) {
          (count < death_limit) ? template[y][x] = 0 : template[y][x] = 1;
        }
        else {
          (count > birth_limit) ? template[y][x] = 1 : template[y][x] = 0;
        }
      }
    }
    return template;
  }

  countAliveNeighbours(template, x, y) {
    let count = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let neighbour_x = x + i;
        let neighbour_y = y + j;
        if (i == 0 && j == 0 ) {
          // nothing
        }
        else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= this.width || neighbour_y >= this.height) {
          count += 1;
        }
        else if (template[neighbour_y][neighbour_x] == 1) {
          count += 1;
        }
      }
    }
    return count;
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
    ctx.fillStyle = this.color;
    ctx.fillRect(posX + 2, posY + 2, this.width - 5, this.height - 5);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 2, 2);
  }
}

class UserInteface {
  constructor(color, ctx) {
    this.color = color;
    this.ctx = ctx;
    this.main_border = 2;
    this.minimap_border = 1;
  }

  drawDelimiters(main_w, main_h, map_w, map_h, minimap_w, minimap_h) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(map_w, 0, 5, main_w);
  }

  drawBorders() {
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = minimap_border;

  }
}