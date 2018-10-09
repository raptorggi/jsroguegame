class Game {
  constructor() {
    this.config = loadConfig("assets/json/config.json");
    this.objects_params    = null;
    this.game_params       = null;

    this.map_size    = new Size(60, 60);
    this.screen_size = new Size(40, 38);

    this.screen_resolution = null;
    this.player            = null;

    this.factory           = null;
    this.renderer          = null;
    this.map               = null;
    this.ticker            = null;
    this.collider          = null;
  }

  gameLoop(delta) {
    this.actions();
    this.renderer.render(this.player);
  }

  init() {
    this.objects_params = this.config.objects;
    this.game_params    = this.config.game;

    this.screen_resolution = new Size(this.game_params.screen.width, this.config.game.screen.height);
    
    this.renderer       = new Renderer();
    this.map            = new GameMap();
    this.collider       = new Collider();
    this.ticker         = new PIXI.ticker.Ticker(); 

    this.map.init(this.game_params.map_size, this.objects_params);
    this.renderer.init(this.game_params.screen, this.game_params.window);
    this.renderer.loadTextures(this.config.objects);

    this.factory        = new Factory(this.objects_params.Default, this.renderer.texture["Default"]);

    this.generateMap();
    this.keySetup();
    this.ticker.add(delta => this.gameLoop(delta));
    this.ticker.start();
  }

  start() {
    this.init();
  }

  actions() {
    this.player.move(this.map, this.collider);

  }

  generateMap() {
    this.player = this.map.createMap(this.factory, this.renderer.texture, this.objects_params);
    this.renderer.renderMap(this.map);  
  }

  keySetup() {
    let left  = keyboard(37),
        up    = keyboard(38),
        right = keyboard(39),
        down  = keyboard(40);

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