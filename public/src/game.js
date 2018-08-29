class Game {
  constructor() {
    this.config = loadConfig("assets/json/config.json");
    this.map_size = new Size(40, 38);
    this.screen_size = new Size(40, 38);

    this.map = new GameMap(this.map_size.width, this.map_size.height);
    this.tile = new Size(20, 20);
    this.minimap = new Size(this.map_size.width * 2, this.map_size.height * 2);
    this.canvas = new Size(1366, 768);
    this.screen_resolution = new Size(1366, 768);

    this.renderer = new Renderer(this.screen_resolution, this.map_size, this.screen_size);
    
    this.interface = new UserInteface("#ffffff", this.ctx);
    this.player;  // player coordinates (Point)
    this.player_new; //player coordinates after pressing move button
    this.started = 1;
    this.non_static_objects = []; // array of references non static objects
  }

  // addKeyEventListeners(container_id) {
  //   let keys = document.getElementById(container_id);
  //   keys.addEventListener("keydown", function (event) {
  //     let key = event.key || event.keyCode;
  //     if (key === 'ArrowUp' || key === 'ArrowUp' || key === 38) {
  //         game.player_new.y -= 1;
  //     }
  //     if (key === 'ArrowDown' || key === 'ArrowDown' || key === 40) {
  //         game.player_new.y += 1;
  //     }
  //     if (key === 'ArrowLeft' || key === 'ArrowLeft' || key === 37) {
  //         game.player_new.x -= 1;
  //     }
  //     if (key === 'ArrowRight' || key === 'ArrowRight' || key === 39) {
  //         game.player_new.x += 1;
  //     }
  //   });

  init() {
    this.renderer.loadTextures(this.config.objects);
    this.generateMap();
  }

  start() {
    this.init();
    animate();

    function animate() {
      requestAnimationFrame(animate);
      game.renderer.render();
    }
  }

  generateMap() {
    let template = this.map.createTemplate();

    this.player = this.map.start_position.copy();
    template.self[this.player.y][this.player.x] = 2;

    this.map.game_field = this.renderer.initMap(template);
  }

  draw() {
    this.renderer.draw(this.map, this.player);
  }

  playerMove() {
    if (this.non_static_objects[0].movement.isReady()) {
      if (!this.map.isOnMap(this.player_new)) {
        this.player_new = this.player.copy();
      }
      if (!this.player.isEqual(this.player_new)) {
        if (this.map.game_field[this.player_new.y][this.player_new.x] == null) {
          this.map.game_field[this.player_new.y][this.player_new.x] = this.map.game_field[this.player.y][this.player.x]; 
          this.map.game_field[this.player.y][this.player.x] = null;
          this.player = this.player_new.copy();
          this.non_static_objects[0].movement.perform();
        }
        else {
          this.player_new = this.player.copy();
        }
      }
    }
    else {
      this.player_new = this.player.copy();
    }
  }

  actions() {
    for (let object of this.non_static_objects) {
      object.movement.reduce();
    }
  }

  stop() {
    this.started = 0;
  }

  isStarted() {
    return this.started;
  }
}

class UserInteface {
  constructor(color, ctx) {
    this.color = color;
    this.ctx = ctx;
    this.main_border = 2;
    this.minimap_border = 1;
  }

  drawDelimiters(main_w, main_h, map_w, map_h, minimap_w, minimap_h) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(map_w, 0, 5, main_w);
  }

  drawBorders() {
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = minimap_border;
  }
}