class GameMap {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.template;
    this.start_position;
  }

  isOnMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
    }
    return false;
  }

  createTemplate() {
    let data = new MapGenerator().generateGameFieldTemplate(this.width, this.height);
    this.template = data[0];
    this.start_position = data[1].copy();

    return data[0];
  }
} 