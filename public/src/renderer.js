class Renderer {
  constructor() {
    this.tile = new Size(20, 20);
    this.texture = {};
    this.stage = new PIXI.Container();
  }

  init(window_size, screen_size) {
    this.screen_size = screen_size;
    this.window = window_size;
    this.app = PIXI.autoDetectRenderer({ width: this.window.width, height: this.window.height});
    document.body.appendChild(this.app.view);
  }

  render() {
    this.app.render(this.stage);
    this.game_window = new PIXI.Container();
    let tex = new PIXI.RenderTexture.create(this.app, 800, 769);
    //console.log(tex)
    //tex.render(this.game_window);
    //this.sprite = new PIXI.Sprite(tex);
    //this.stage.addChild(this.sprite)
    //this.app.render()
  }

  initMap(template, objects) {
    let map = new Map(template.width, template.height);
    for (let y = 0; y < template.height; y++) {
      for (let x = 0; x < template.width; x++) {
        switch (template.self[y][x]) {
          case 0: objects.push(new Floor(this.texture[Floor.name], this.tile, new Point(x * 20, y * 20))); break;
          case 1: objects.push(new Wall(this.texture[Wall.name], this.tile, new Point(x * 20, y * 20))); break;
          case 2: objects.push(new Player(this.texture[Player.name], this.tile, new Point(x * 20, y * 20))); break;
        }
      }
    }
    for (let i = 0; i < objects.static.length; i++) {
      this.stage.addChild(objects.static[i].sprite);
    }
    for (let i = 0; i < objects.nonStatic.length; i++) {
      this.stage.addChild(objects.nonStatic[i].sprite);
    }
    return map;
  }

  loadTextures(objects) {
    for (let object in objects) {
      this.texture[object] = PIXI.Texture.fromImage(objects[object].texture_path) 
    }
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