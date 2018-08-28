class Renderer {
  constructor(canvas_id, container_id, map_size, screen_size) {
    this.tile = new Size(15, 15);
    this.map_size = map_size;
    this.screen_size = screen_size;
    this.map = new Size(this.screen_size.width * this.tile.width, this.screen_size.height * this.tile.height);
    this.minimap = new Size(this.map_size.width * 2, this.map_size.height * 2);
    this.canvas = new Size(this.map.width + 5 + this.minimap.width, this.map.height);
    
    //Create a Pixi Application
    this.app = new PIXI.Application({ width: this.canvas.width, height: this.canvas.height});
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this.app.view);
  }

  // loadCanvas(canvas_id, container_id, width, height) {
  //   let canvas = document.createElement('canvas'),
  //   div = document.getElementById(container_id);
  //   canvas.id = canvas_id;
  //   canvas.width = width;
  //   canvas.height = height;
  //   canvas.style.position = "absolute";
  //   canvas.style.border = "1px solid";
  //   div.appendChild(canvas);
  //   return canvas;
  // }

  drawAll(map, player_position) {
    let position = this.getCameraStartCoordinates(player_position);
    this.clearScreen(this.canvas.width, this.canvas.height);
    // this.interface.drawDelimiters(this.canvas_px.width, this.canvas_px.height, this.map_px.width, this.map_px.height, this.minimap.width, this.minimap.height);
    this.drawMainScreen(map, position);
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
}