class Object {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.color = "#000000";
  }
}

class Terrain extends Object {
  constructor() {
    super();
  }

}

class Wall extends Terrain {
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

class Character extends Object {
  constructor() {
    super();
  }
}

class Player extends Character {
  constructor(w, h, movement_cooldown) {
    super();
    this.width = w;
    this.height = h;
    this.color = "#0080ff";
    this.movement = new Action(movement_cooldown);
  }

  drawOnMain(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX + 2, posY + 2, this.width - 4, this.height - 4);
  }

  drawOnMinimap(posX, posY, ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(posX, posY, 2, 2);
  }
}
