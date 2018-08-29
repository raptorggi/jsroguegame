class Renderer {
  constructor(window_size, map_size, screen_size) {
    this.tile = new Size(20, 20);
    this.map_size = map_size;
    this.screen_size = screen_size;
    this.window = window_size;
    this.texture = {};

    this.initPIXI();
    this.stage = new PIXI.Container();
  }

  initPIXI() {
    this.app = PIXI.autoDetectRenderer({ width: this.window.width, height: this.window.height});
    document.body.appendChild(this.app.view);
  }

  render() {
    this.app.render(this.stage);
  }

  initMap(template) {
    let map = new Map(template.width, template.height);
    for (let y = 0; y < template.height; y++) {
      for (let x = 0; x < template.width; x++) {
        switch (template.self[y][x]) {
          case 0: map.self[y][x] = new Floor(this.texture[Floor.name], this.tile, new Point(x * 20, y * 20)); break;
          case 1: map.self[y][x] = new Wall(this.texture[Wall.name], this.tile, new Point(x * 20, y * 20)); break;
          case 2: map.self[y][x] = new Player(this.texture[Player.name], this.tile, new Point(x * 20, y * 20)); console.log(map.self[y][x]); break;
        }
      this.stage.addChild(map.self[y][x].sprite);
      }
    }
    return map;
  }

  draw(map, player_position) {
    let position = this.getCameraStartCoordinates(player_position);
    // this.clearScreen(this.canvas.width, this.canvas.height);
    // this.drawMainScreen(map, position);
    this.drawMinimap(map);
  }

  drawMainScreen(map, position) {
    for (let y = position.y, j = 0; y < position.y + this.screen_size.height; y++, j++) {
      for (let x = position.x, i = 0; x < position.x + this.screen_size.width; x++, i++) {
        if (map.game_field[y][x] != null) {
          map.game_field[y][x].drawOnMain(i * this.tile.width, j * this.tile.height, this.ctx);
        }
      }
    }  
  }

  drawMinimap(map) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.game_field[y][x] != null) {
          map.game_field[y][x].drawOnMinimap(this.map.width + 5 + x * 2, y * 2, this.ctx);
        }
      }
    }
  }

  clearScreen(w, h) {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, w, h);
  }

  getCameraStartCoordinates(player_position) {
    let point = player_position.copy();
    let w = (this.screen_size.width - 1) / 2;
    let h = (this.screen_size.height - 1) / 2;
    point.set(point.x - w, point.y - h);
    if (point.y < 0) {
      point.y = 0;
    }
    if (point.x < 0) {
      point.x = 0;
    }
    if (point.y + this.screen_size.height > this.map_size.height - 1) {
      point.y = this.map_size.height - this.screen_size.height;
    }
    if (point.x + this.screen_size.width > this.map_size.width - 1) {
      point.x = this.map_size.width - this.screen_size.width;
    }
    return point;
  }

  loadTextures(objects) {
    for (let object in objects) {
      this.texture[object] = PIXI.Texture.fromImage(objects[object].texture_path) 
    }
  }
}