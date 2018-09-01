class Factory {
  constructor(default_params, texture) {
    this.default_paramstexture   = texture;
    this.default_tile_size       = default_params.tile_size;
  }

  create(name, params, position, texture) {
    let object = null;
    switch(name) {
      case "Floor":  object = new Floor();  break;
      case "Wall":   object = new Wall();   break;
      case "Player": object = new Player(); break;
    }

    object.canCollide = params.canCollide || false;
    object.texture    = texture || this.default_texture;
    object.size       = params.tile_size || this.default_tile_size;
    object.sprite     = new PIXI.Sprite(object.texture);
    object.sprite.position.set(position.x * object.size.width, position.y * object.size.height);

    if (params.move) {
      object.speed  = new Point(0, 0);
      object.static = false;
      
      object.move = function(map) {
        if (map.isObjectOnMap(new Point(this.sprite.x + this.speed.x, this.sprite.y + this.speed.y), this.size)) {
          this.sprite.x += this.speed.x; 
          this.sprite.y += this.speed.y;
        }
      }
    }
    else {
      object.static = true;
    }

    return object;
  }
}