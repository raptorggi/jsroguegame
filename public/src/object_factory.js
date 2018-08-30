class ObjectFactory {
  constructor() {}

  create(name, params, position, texture) {
    let object = null:
    switch(name) {
      case "Floor":  object = new Floor();  break;
      case "Wall":   object = new Wall();   break;
      case "Player": object = new Player(); break;
    }

    object.texture = texture;
    object.sprite  = new PIXI.Sprite(this.texture);
    
    object.sprite.position.set(position.x, position.y);
    return object;
  }
}