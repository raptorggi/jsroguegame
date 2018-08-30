class Renderer { 
  constructor() {
    this.tile    = new Size(20, 20);
    this.texture = {};

    this.window_resolution = null;

    this.app               = null;

    this.window            = null;
    this.stage             = null;
    this.terrain_container = null;
    this.objects_container = null;
    this.camera            = null;
  }

  init(window_resolution) {
    this.window_resolution = window_resolution;

    this.app = PIXI.autoDetectRenderer({ 
      width:  this.window_resolution.width, 
      height: this.window_resolution.height
    });

    document.body.appendChild(this.app.view);

    this.window            = new PIXI.Container();
    this.stage             = new PIXI.Container();
    this.terrain_container = new PIXI.Container();
    this.objects_container = new PIXI.Container();
    this.camera            = new PIXI.Container();

    this.window.addChild(this.stage);
    this.stage.addChild(this.terrain_container);
    this.stage.addChild(this.objects_container);
  }

  initCamera() {
    
    this.window.AddChild(this.camera);
    this.camera.width  = 800;
    this.camera.height = 760;
    this.camera.position.set(0,0);
  }

  render() {
    //this.window.width = 800;
    //this.window.height = 760;
    this.app.render(this.window);
  }

  initMap(template, map) {
    //let map = new Map(template.width, template.height);
    for (let y = 0; y < template.height; y++) {
      for (let x = 0; x < template.width; x++) {
        //map.terrain.self[y][x] = new 
        switch (template.self[y][x]) {
          case 0: objects.push(new Floor(this.texture[Floor.name], this.tile, new Point(x * 20, y * 20))); break;
          case 1: objects.push(new Wall(this.texture[Wall.name], this.tile, new Point(x * 20, y * 20))); break;
          case 2: objects.push(new Player(this.texture[Player.name], this.tile, new Point(x * 20, y * 20))); break;
        }
      }
    }
    for (let i = 0; i < objects.static.length; i++) {
      this.window.addChild(objects.static[i].sprite);
    }
    for (let i = 0; i < objects.nonStatic.length; i++) {
      this.window.addChild(objects.nonStatic[i].sprite);
    }
    return map;
    this.window.width = 800;
    this.window.height = 760;
    //this.initCamera();
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