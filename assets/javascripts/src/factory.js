class Factory {
  constructor(config, texture) {
    this.default_texture   = texture;
    this.default_tile_size = config.objects.Default.tile_size;
    this.default_role      = config.objects.Default.role;
    this.minimap_tile_size = {width: 3, height: 3};//// TODO!!!!!!
  }

  create(name, params, position, texture) {
    let object = null;
    switch(name) {
      case "Floor":  object = new Floor();  break;
      case "Wall":   object = new Wall();   break;
      case "Player": object = new Player(); break;
    }

    object.role       = params.role || this.default_role;
    object.canCollide = params.canCollide || false;
    object.texture    = texture[name] || this.default_texture;
    object.size       = params.tile_size || this.default_tile_size;
    object.position   = position.copy();

    if (object.role == "ally" || object.role == "enemy") {
      object.minimap_texture = texture["minimap"][object.role || this.default_role];
    }
    else {
      object.minimap_texture = texture["minimap"][name || this.default_role];
    }

    object.sprite     = new PIXI.Sprite(object.texture);
    object.sprite.position.set(position.x * this.default_tile_size.width, position.y * this.default_tile_size.height);
    
    object.minimap_sprite = new PIXI.Sprite(object.minimap_texture);
    object.minimap_sprite.position.set(position.x * this.minimap_tile_size.width, position.y * this.minimap_tile_size.height);

    if (params.move) { // add move function to the object
      object.speed  = new Point(0, 0);
      object.static = false;

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