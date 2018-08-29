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
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
  }
}

class Floor extends Terrain {
  constructor(texture, size, position) {
    super();
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
  }
}

class Player extends Character {
  constructor(texture, size, position) {
    super();
    this.position = position.copy();
    this.size = size.copy();
    this.texture = texture;
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
  }
}
