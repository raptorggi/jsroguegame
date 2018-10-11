class Renderer { 
  constructor() {
    this.tile    = new Size(20, 20);
    this.texture = {};

    this.screen_resolution = null;
    this.window_resolution = null;

    this.app               = null;

    this.window            = null;
    this.stage             = null;
    this.terrain_container = null;
    this.objects_container = null;

    this.right_bar         = null;
    
  }

  init(screen_resolution, window) {
    this.screen_resolution = screen_resolution;
    this.window_resolution = window;

    this.app = PIXI.autoDetectRenderer({ 
      width:  this.screen_resolution.width, 
      height: this.screen_resolution.height
    });

    document.body.appendChild(this.app.view);

    this.window            = new PIXI.Container();
    this.stage             = new PIXI.Container();
    this.terrain_container = new PIXI.Container();
    this.objects_container = new PIXI.Container();

    this.right_bar         = new PIXI.Container();

    this.window.addChild(this.stage);
    this.stage.addChild(this.terrain_container);
    this.stage.addChild(this.objects_container);

    this.initRigthBar();
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
        this.terrain_container.addChild(map.terrain.self[y][x].sprite);
      }
    }
    this.objects_container.addChild(map.units.self[map.startPosition().y][map.startPosition().x].sprite);
  }

  renderMinimap() {

  }

  loadTextures(objects) {
    for (let object in objects) {
      this.texture[object] = PIXI.Texture.fromImage(objects[object].texture_path) 
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

