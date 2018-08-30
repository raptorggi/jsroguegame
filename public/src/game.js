class Game {
  constructor() {
    this.config = loadConfig("assets/json/config.json");
    this.objects_config    = null;
    this.game_config       = null;

    this.map_size    = new Size(60, 60);
    this.screen_size = new Size(40, 38);

    this.screen_resolution = null;
    this.player            = null;

    this.factory           = null;
    this.renderer          = null;
    this.map               = null;
    this.ticker            = null;
  }

  gameLoop(delta) {
    this.actions();
    this.renderer.render();
  }

  init() {
    this.objects_config = this.config.objects;
    this.game_config    = this.config.game;

    this.screen_resolution = new Size(this.game_config.window.width, this.config.game.window.height);

    this.factory        = new Factory();
    this.renderer       = new Renderer();
    this.map            = new GameMap();
    this.ticker         = new PIXI.ticker.Ticker(); 

    this.map.init(this.game_config.map_size);
    this.renderer.init(this.game_config.window);
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
    this.map.createTemplate();
    this.renderer.initMap(this.map, this.factory, this.objects_config);
    this.player = this.factory.create( 
                                        "Player", 
                                        this.objects_config["Player"],
                                        this.map.start_position,
                                        this.renderer.texture["Player"]
                                      );
    this.renderer.objects_container.addChild(this.player.sprite);
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