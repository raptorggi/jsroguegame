//-----Additional classes and functions ------------

function move() {
  idTimer = setInterval('mainLoop();', tick_interval);
}

function mainLoop() {
  if (game.isStarted()) {
    game.playerMove();
    game.actions();
    game.draw();
  }
  else {
    clearInterval(idTimer);
  }
}

function init() {
  window.game = new Game('canvas', 'game');
  window.tick_interval = 50;
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

class Action {
  constructor(cooldown_time) {
    this.cooldown_time = cooldown_time;
    this.counter = cooldown_time;
  }

  isReady() {
    if (this.counter >= this.cooldown_time) {
      return true;
    }
    return false;
  }

  perform() {
    this.counter = 0;
  }

  reduce() {
    if (this.counter < this.cooldown_time) {
      this.counter++;
    }
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
    this.non_static_objects = []; // array of references non static objects

    this.addKeyEventListeners(this.container_id);
  }

  addKeyEventListeners(container_id) {
    let keys = document.getElementById(container_id);
    keys.addEventListener("keydown", function (event) {
      let key = event.key || event.keyCode;
      if (key === 'ArrowUp' || key === 'ArrowUp' || key === 38) {
          console.log(1);
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
          this.map.game_field[y][x] = new Wall(this.renderer.tile.width, this.renderer.tile.height);
        }
      }
    }
    this.map.game_field[this.map.start_position.y][this.map.start_position.x] = new Player(this.renderer.tile.width, this.renderer.tile.height, 2);
    this.player = this.map.start_position.copy();
    this.player_new = this.player.copy();
    this.non_static_objects.push(this.map.game_field[this.player.y][this.player.x]);
  }

  draw() {
    this.renderer.drawAll(this.map, this.player);
  }

  playerMove() {
    if (this.non_static_objects[0].movement.isReady()) {
      if (!this.map.isOnMap(this.player_new)) {
        this.player_new = this.player.copy();
      }
      if (!this.player.isEqual(this.player_new)) {
        if (this.map.game_field[this.player_new.y][this.player_new.x] == null) {
          this.map.game_field[this.player_new.y][this.player_new.x] = this.map.game_field[this.player.y][this.player.x]; 
          this.map.game_field[this.player.y][this.player.x] = null;
          this.player = this.player_new.copy();
          this.non_static_objects[0].movement.perform();
        }
        else {
          this.player_new = this.player.copy();
        }
      }
    }
    else {
      this.player_new = this.player.copy();
    }
  }

  actions() {
    for (let object of this.non_static_objects) {
      object.movement.reduce();
    }
  }

  stop() {
    this.started = 0;
  }

  isStarted() {
    return this.started;
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