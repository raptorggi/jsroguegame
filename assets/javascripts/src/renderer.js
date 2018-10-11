class Renderer { 
  constructor() {
    this.tile    = new Size(20, 20);
    this.texture = {};

    this.screen_resolution = null;
    this.window_resolution = null;

    this.app               = null;

    this.window            = null;
    this.stage             = null;
    this.terrain = null;
    this.objects = null;

    this.right_bar         = null;
    this.minimap           = null;
  }

  init(params) {
    this.screen_resolution = params.game.screen;
    this.window_resolution = params.game.window;

    this.app = PIXI.autoDetectRenderer({ 
      width:  this.screen_resolution.width, 
      height: this.screen_resolution.height
    });

    document.body.appendChild(this.app.view);

    this.window    = new PIXI.Container();
    this.stage     = new PIXI.Container();
    this.terrain   = new PIXI.Container();
    this.objects   = new PIXI.Container();

    this.right_bar = new PIXI.Container();
    this.minimap   = new MiniMap();

    this.window.addChild(this.stage);
    this.stage.addChild(this.terrain);
    this.stage.addChild(this.objects);

    this.initRigthBar();
    
    this.minimap.init(params.minimap.tile_size);
    this.right_bar.addChild(this.minimap.ctx());
  }

  render(object) {
    let position = this.getWindowPosition(object);
    this.stage.x = position.x;
    this.stage.y = position.y;
    this.app.render(this.window);
  }

  initRigthBar() {
    this.rectangle = new PIXI.Graphics();
    this.rectangle.beginFill(0x000000);
    this.rectangle.drawRect(0, 0, this.screen_resolution.width - this.window_resolution.width, this.screen_resolution.height);
    this.right_bar.addChild(this.rectangle);
    this.window.addChild(this.right_bar);
    this.right_bar.x = this.window_resolution.width;
    this.right_bar.y = 0;
  }

  renderMap(map) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        this.terrain.addChild(map.terrain.self[y][x].sprite);
      }
    }
    this.objects.addChild(map.units.self[map.startPosition().y][map.startPosition().x].sprite);
  }

  renderMinimap(map) {
    this.minimap.render(map);
  }

  loadTextures(objects, minimap) {
    this.texture["minimap"] = {};
    for (let object in objects) {
      this.texture[object] = PIXI.Texture.fromImage(objects[object].texture_path);
    }
    for (let object in minimap.textures) {
      this.texture["minimap"][object] = PIXI.Texture.fromImage(minimap.textures[object]);
    }
  }

  getWindowPosition(player) {
    let mid_x = this.window_resolution.width / 2;
    let mid_y = this.window_resolution.height / 2;
    let point = {
      x: mid_x - player.sprite.x,
      y: mid_y - player.sprite.y 
    }
    if (player.sprite.x < mid_x ) {
      point.x = 0;
    }
    if (player.sprite.y < mid_y) {
      point.y = 0;
    }
    if (player.sprite.x > this.stage.width - mid_x) {
      point.x = -(this.stage.width - this.window_resolution.width);
    }
    if (player.sprite.y > this.stage.height - mid_y) {
      point.y = -(this.stage.height - this.window_resolution.height);
    }
    return point;
  }
}

