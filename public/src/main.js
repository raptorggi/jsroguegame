//-----Additional classes and functions ------------

function move() {
  idTimer = setInterval('mainLoop();', tick_interval);
}

function mainLoop() {
  if (game.isStarted()) {
    // game.playerMove();
    //game.actions();
    //game.draw();
  }
  else {
    clearInterval(idTimer);
  }
}

function init() {
  window.game = new Game('canvas', 'game');
  window.tick_interval = 50;
  //game.generateMap();
  //game.draw();
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

//------------------ END -----------------