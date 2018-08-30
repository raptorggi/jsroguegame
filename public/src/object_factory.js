class ObjectFactory {
  constructor() {}

  create(name, params, position, texture) {
    let object = null;
    switch(name) {
      case "Floor":  object = new Floor();  break;
      case "Wall":   object = new Wall();   break;
      case "Player": object = new Player(); break;
    }

    object.texture = texture;
    object.sprite  = new PIXI.Sprite(this.texture);
    object.sprite.position.set(position.x, position.y);

    if (params.move) {
      object.speed = new Point(0, 0);
      object.move = () => {
        this.sprite.x += this.speed.x; 
        this.sprite.y += this.speed.y;
      }
    }
    
    return object;
  }
}