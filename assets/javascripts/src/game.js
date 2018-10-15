class Game {
  constructor() {
    this.config = loadConfig("assets/json/config.json");

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
    this.renderer       = new Renderer();
    this.map            = new GameMap();
    this.collider       = new Collider();
    this.ticker         = new PIXI.ticker.Ticker(); 

    this.map.init(this.config);
    this.renderer.init(this.config);
    this.renderer.loadTextures(this.config.objects, this.config.minimap);

    this.factory        = new Factory(this.config, this.renderer.texture["Default"]);

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
    this.player = this.map.createMap(this.factory, this.renderer.texture, this.config);
    this.renderer.renderMap(this.map);
    this.renderer.renderMinimap(this.map);
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