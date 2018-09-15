function swap(a, b) {
  let c = a;
  a = b;
  b = c;
}

function max(a, b) {
  return (a > b) ? a : b;
}

function min(a, b) {
  return (a < b) ? a : b;
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

function loadConfig(request_url) {
  let request = new XMLHttpRequest();
  request.open('GET', request_url);
  request.send();
  request.onload = function() {
    game.config = JSON.parse(request.response);
    game.start();
  }
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
       key.isUp = false;
    }
    event.preventDefault();
  };

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  window.addEventListener("keydown", key.downHandler.bind(key), false);

  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
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

  copy() {
    return new Size(this.width, this.height);
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

class Map {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.self = Array(this.height).fill(null).map(()=>Array(this.width).fill(null));
  }

  copy() {
    let copy = new Map(0, 0);
    copy.width = this.width;
    copy.height = this.height;
    for (let i = 0; i < this.height; i++) {
      copy.self[i] = this.self[i].slice();
    }
    return copy;
  }
}