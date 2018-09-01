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
    this.static  = null;
    this.texture = null;
    this.sprite  = null;
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
  constructor() {
    super();    
  }
}

class Floor extends Terrain {
  constructor() {
    super();
  }
}

class Player extends Character {
  constructor() {
    super();
  }
}
