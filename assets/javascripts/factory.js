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
    object.sprite.position.set(position.x * this.default_tile_size.width, position.y * this.default_tile_size.height);

    if (params.move) {
      object.speed  = new Point(0, 0);
      object.static = false;
      object.position = position.copy();

      object.move = function(map, collider) {
        if (map.isObjectOnMap(new Point(this.sprite.x + this.speed.x, this.sprite.y + this.speed.y), this.size)) {
          let state = {   // save state before move
            on_map: this.position.copy(),
            sprite: { x: this.sprite.x, y: this.sprite.y }
          }

          if (this.speed.x != 0) { // movement on x axis
            this.sprite.x   += this.speed.x;
            let tile_mid    = this.size.width / 2 - 0.5;
            let remain      = this.sprite.x % map.default_tile.width;
            let x           = Math.trunc(this.sprite.x / map.default_tile.width);
            this.position.x = (remain >= map.default_tile.width - tile_mid) ? x + 1 : x;
          }
          if (this.speed.y != 0) { // movement on y axis
            this.sprite.y   += this.speed.y;
            let tile_mid    = this.size.height / 2 - 0.5;
            let remain      = this.sprite.y % map.default_tile.height;
            let y           = Math.trunc(this.sprite.y / map.default_tile.height);
            this.position.y = (remain >= map.default_tile.height - tile_mid) ? y + 1 : y;
          }

          if (!(this.position.x == state.on_map.x && this.position.y == state.on_map.y)) { // swap on unit array
            [map.units.self[state.on_map.y][state.on_map.x], map.units.self[this.position.y][this.position.x]] = [map.units.self[this.position.y][this.position.x], [state.on_map.y][state.on_map.x]]
          }

          let collisions = collider.collide(map, this); // check collisions
          if (collisions.length != 0) { // rollback if collisions
            [map.units.self[state.on_map.y][state.on_map.x], map.units.self[this.position.y][this.position.x]] = [map.units.self[this.position.y][this.position.x], [state.on_map.y][state.on_map.x]]
            this.position = state.on_map.copy();
            this.sprite.x = state.sprite.x;
            this.sprite.y = state.sprite.y;
          }
        }
      }
    }
    else {
      object.static = true;
    }

    return object;
  }
}