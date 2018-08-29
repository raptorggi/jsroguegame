class GameMap {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.game_field;
    this.start_position;
  }

  isOnMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
    }
    return false;
  }

  setStartPosition() {
    this.start_position = new Point(Math.abs(randomInteger(0, this.height - 1)), Math.abs(randomInteger(0, this.width - 1)));
  }

  createTemplate() {
    return new MapGenerator().generateGameFieldTemplate(this.width, this.height);
  }
} 