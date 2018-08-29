class GameObjectsContainer {
  constructor() {
    this.static = [];
    this.nonStatic = [];
  }

  push(object) {
    (object.static) ? this.static.push(object) : this.nonStatic.push(object);
  }
}


class GameObject {
  constructor() {
  }
}

class Terrain extends GameObject {
  constructor() {
    super();
  }
}

class Character extends GameObject {
  constructor() {
    super();
  }
}

class Wall extends Terrain {
  constructor(texture, size, position) {
    super();
    this.static = true;
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.set(position.x, position.y);
  }
}

class Floor extends Terrain {
  constructor(texture, size, position) {
    super();
    this.static = true;
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.set(position.x, position.y);
  }
}

class Player extends Character {
  constructor(texture, size, position) {
    super();
    this.static = false;
    this.speed = new Point(0, 0);
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.set(position.x, position.y);
  }

  move() {
    this.sprite.x += this.speed.x; 
    this.sprite.y += this.speed.y;
  }
}
