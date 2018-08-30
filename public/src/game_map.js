class GameMap {
  constructor(w, h) {
    this.width          = null;
    this.height         = null;
    this.template       = null;
    this.terrain        = null;
    this.start_position = null;
  }

  init(size) {
    this.width   = size.width;
    this.height  = size.height;
    this.terrain = new Map(this.width, this.height);
  }

  isOnMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
      return  true;
    }
    return false;
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
    this.start_position = data[1].copy();
  }
} 