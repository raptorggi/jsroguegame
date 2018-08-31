class Factory {
  constructor() {}

  create(name, params, position, texture) {
    let object = null;
    switch(name) {
      case "Floor":  object = new Floor();  break;
      case "Wall":   object = new Wall();   break;
      case "Player": object = new Player(); break;
    }

    object.texture = texture;
    object.sprite  = new PIXI.Sprite(object.texture);
    object.sprite.position.set(position.x * 20 , position.y * 20);

    if (params.move) {    
      object.speed  = new Point(0, 0);
      object.static = false;
      object.move = function() {
        this.sprite.x += this.speed.x; 
        this.sprite.y += this.speed.y;
      }
    }
    else {
      object.static = true;
    }

    return object;
  }
}