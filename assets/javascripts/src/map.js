class GameMap {
  constructor() {
    this.width          = null;
    this.height         = null;
    this.width_px       = null;
    this.height_px      = null;
    this.default_tile   = null;

    this.template       = null;
    this.terrain        = null;
    this.units          = null;
    this.start_position = null;
  }

  init(size, object_params) {
    this.width        = size.width;
    this.height       = size.height;
    this.default_tile = object_params.Default.tile_size;
    this.width_px     = this.width * this.default_tile.width;
    this.height_px    = this.height * this.default_tile.height;
    this.terrain      = new Map(this.width, this.height);
    this.units        = new Map(this.width, this.height);
  }

  isPointOnMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width_px && coords.y < this.height_px) {
      return  true;
    }
    return false;
  }

  isObjectOnMap(pivot, size) {
    if (pivot.x >= 0 && pivot.y >= 0 && pivot.x + size.width < this.width_px && pivot.y + size.height < this.height_px) {
      return  true;
    }
    return false;
  }

  startPosition() {
    return this.start_position;
  }

  createMap(factory, texture, params) {
    this.createTemplate();
    for (let y = 0; y < this.template.height; y++) {
      for (let x = 0; x < this.template.width; x++) {
        let object_name = this.template.self[y][x];
        this.terrain.self[y][x] = factory.create( 
                                                  object_name, 
                                                  params[object_name],
                                                  new Point(x, y),
                                                  texture
                                                );
      }
    }
    this.units.self[this.start_position.y][this.start_position.x] = factory.create( 
                                                                                    "Player", 
                                                                                    params["Player"],
                                                                                    this.start_position,
                                                                                    texture
                                                                                  );
    return this.units.self[this.start_position.y][this.start_position.x];
  }

  createTemplate() {
    let data = new MapGenerator().generateGameFieldTemplate(this.width, this.height);
    for (let y = 0; y < data[0].height; y++) {
      for (let x = 0; x < data[0].width; x++) {
        switch (data[0].self[y][x]) {
          case 0: data[0].self[y][x] = "Floor"; break;
          case 1: data[0].self[y][x] = "Wall";  break;
        }
      }
    }
    this.template       = data[0];
    this.start_position = data[1];
  }
} 