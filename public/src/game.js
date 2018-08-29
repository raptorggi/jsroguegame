class Game {
  constructor() {
    this.config = loadConfig("assets/json/config.json");
    this.map_size = new Size(40, 38);
    this.screen_size = new Size(40, 38);

    this.map = new GameMap(this.map_size.width, this.map_size.height);   
    this.objects = new GameObjectsContainer();
    this.ticker = new PIXI.ticker.Ticker();
  }

  gameLoop(delta) {
    this.actions();
    this.renderer.render();
  }

  init() {
    this.screen_resolution = new Size(this.config.game.window.width, this.config.game.window.height);
    this.renderer = new Renderer();

    this.renderer.init(this.screen_resolution, this.screen_size);
    this.renderer.loadTextures(this.config.objects);
    this.generateMap();
    this.keySetup();
    this.ticker.add(delta => this.gameLoop(delta));
    this.ticker.start();
  }

  start() {
    this.init();
  }

  actions() {
    this.player.move();
  }

  generateMap() {
    let template = this.map.createTemplate();
    template.self[this.map.start_position.y][this.map.start_position.x] = 2;
    this.renderer.initMap(template, this.objects);
    this.player = this.objects.nonStatic[0];
  }

  keySetup() {
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = () => {
      this.player.speed.x = -2;
    };
    
    left.release = () => {
      if (!right.isDown) {
        this.player.speed.x = 0;
      }
    };

    right.press = () => {
      this.player.speed.x = 2;
    };

    right.release = () => {
      if (!left.isDown) {
        this.player.speed.x = 0;
      }
    };

    up.press = () => {
      this.player.speed.y = -2;
    };

    up.release = () => {
      if (!down.isDown) {
        this.player.speed.y = 0;
      }
    };
    
    down.press = () => {
      this.player.speed.y = 2;
    };

    down.release = () => {
      if (!up.isDown) {
        this.player.speed.y = 0;
      }
    }; 
  }
}