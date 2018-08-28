class Game {
  constructor(canvas, containerId) {
    this.canvas_id = canvas;
    this.container_id = containerId;
    this.map_size = new Size(100, 100);
    this.screen_size = new Size(41, 41);

    this.map = new GameMap(this.map_size.width, this.map_size.height);
    this.tile = new Size(15, 15);
    this.map = new Size(this.screen_size.width * this.tile.width, this.screen_size.height * this.tile.height);
    this.minimap = new Size(this.map_size.width * 2, this.map_size.height * 2);
    this.canvas = new Size(1366, 768);
    
    //Create a Pixi Application
    this.renderer = PIXI.autoDetectRenderer({ width: 1366, height: 768});
    this.stage = new PIXI.Container();
    this.texture = PIXI.Texture.fromImage('assets/images/wall.png'); 

    //var carrotTex = PIXI.Texture.fromImage('assets/carrot.png');

    // create a new Sprite using the texture
    this.bunny = new PIXI.Sprite(this.texture);
    this.bunny.anchor.set(0.5);

    this.stage.addChild(this.bunny);
    this.renderer.render(this.stage);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(this.renderer.view);

    // PIXI.loader
    //   .add("assets/images/wall.png")
    //   .load(function () {
    //     let cat = new PIXI.Sprite(PIXI.loader.resources["assets/images/wall.png"].texture);
      
    //   //Add the cat to the stage

    //     game.app.stage.addChild(cat);
    //   });

    //This `setup` function will run when the image has loaded
    
    

    this.interface = new UserInteface("#ffffff", this.ctx);
    this.player;  // player coordinates (Point)
    this.player_new; //player coordinates after pressing move button
    this.started = 1;
    this.non_static_objects = []; // array of references non static objects

    this.addKeyEventListeners(this.container_id);
  }

  setup() {

      //Create the cat sprite
      let cat = new PIXI.Sprite(PIXI.loader.resources["assets/images/wall.png"].texture);
      
      //Add the cat to the stage

      this.app.stage.addChild(cat);
  }

  addKeyEventListeners(container_id) {
    let keys = document.getElementById(container_id);
    keys.addEventListener("keydown", function (event) {
      let key = event.key || event.keyCode;
      if (key === 'ArrowUp' || key === 'ArrowUp' || key === 38) {
          game.player_new.y -= 1;
      }
      if (key === 'ArrowDown' || key === 'ArrowDown' || key === 40) {
          game.player_new.y += 1;
      }
      if (key === 'ArrowLeft' || key === 'ArrowLeft' || key === 37) {
          game.player_new.x -= 1;
      }
      if (key === 'ArrowRight' || key === 'ArrowRight' || key === 39) {
          game.player_new.x += 1;
      }
    });
  }

  generateMap() {
    let template = this.map.generateGameFieldTemplate();
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (template[y][x] == 1) {
          this.map.game_field[y][x] = new Wall(this.renderer.tile.width, this.renderer.tile.height);
        }
      }
    }
    this.map.game_field[this.map.start_position.y][this.map.start_position.x] = new Player(this.renderer.tile.width, this.renderer.tile.height, 2);
    this.player = this.map.start_position.copy();
    this.player_new = this.player.copy();
    this.non_static_objects.push(this.map.game_field[this.player.y][this.player.x]);
  }

  draw() {
    this.renderer.drawAll(this.map, this.player);
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