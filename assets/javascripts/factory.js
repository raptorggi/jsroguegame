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
          let state = {
            x: { speed: this.speed.x, back: 0 },
            y: { speed: this.speed.y, back: 0 }
          }
          this.sprite.x += this.speed.x; 
          this.sprite.y += this.speed.y;
          if (this.speed.x != 0) {
            if (this.sprite.x - this.position.x * map.tile.width > (map.tile.width + (map.tile.width - this.size.width)) / 2 + 1) {
              [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y][this.position.x + 1]] = [map.units.self[this.position.y][this.position.x + 1], map.units.self[this.position.y][this.position.x]]
              this.position.x++;
              state.x.back--;
            }
            else if (this.sprite.x - this.position.x * map.tile.width < -(this.size.width / 2 - 1)) {
              [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y][this.position.x - 1]] = [map.units.self[this.position.y][this.position.x - 1], map.units.self[this.position.y][this.position.x]]
              this.position.x--;
              state.x.back++;
            }
          }
          if (this.speed.y != 0) {
            if (this.sprite.y - this.position.y * map.tile.height > (map.tile.height + (map.tile.height - this.size.height)) / 2 + 1) {
              [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y + 1][this.position.x]] = [map.units.self[this.position.y + 1][this.position.x], map.units.self[this.position.y][this.position.x]]
              this.position.y++;
              state.y.back--;
            }
            else if (this.sprite.y - this.position.y * map.tile.height < -(this.size.height / 2 - 1)) {
              [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y - 1][this.position.x]] = [map.units.self[this.position.y - 1][this.position.x], map.units.self[this.position.y][this.position.x]]
              this.position.y--;
              state.y.back++;
            }
          }
          let collisions = collider.collide(map, this);
          if (collisions.length != 0) {
            this.sprite.x -= state.x.speed;
            this.sprite.y -= state.y.speed;
            [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y][this.position.x + state.x.back]] = [map.units.self[this.position.y][this.position.x + state.x.back], map.units.self[this.position.y][this.position.x]]
            [map.units.self[this.position.y][this.position.x], map.units.self[this.position.y + state.y.back][this.position.x]] = [map.units.self[this.position.y + state.y.back][this.position.x], map.units.self[this.position.y][this.position.x]]
            this.position.x += state.x.back;
            this.position.y += state.y.back; 
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