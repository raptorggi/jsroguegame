class ChunkRenderer {
  constructor() {
    this.size      = null;
    this.tile_size = null;

    this.renderer  = null;
  }

  init(config, renderer) {
    this.size      = config.map.chunk;
    this.tile_size = config.objects.Default.tile_size;

    // this.renderer  = new PIXI.CanvasRenderer({
    //   width: this.size.width * this.tile_size.width,
    //   height: this.size.height * this.tile_size.height,
    // });
    this.renderer = renderer;
  }

  render(map, position) {
    let container = new PIXI.Container();
    // let texture   = new PIXI.RenderTexture();
    let state     = Array(this.size.height).fill(null).map(()=>Array(this.size.width).fill(null));
    // debugger
    for(let y = 0; y < this.size.height; y++) {
      for(let x = 0; x < this.size.width; x++) {
        let position_x = x + position.x;
        let position_y = y + position.y;
        state[y][x] = {
          x: map.self[position_y][position_x].sprite.position.x,
          y: map.self[position_y][position_x].sprite.position.y
        }
        map.self[position_y][position_x].sprite.position.x = x * this.tile_size.width;
        map.self[position_y][position_x].sprite.position.y = y * this.tile_size.height;

        container.addChild(map.self[position_y][position_x].sprite);
      }
    }
    // debugger
    // this.renderer.render(container);
    console.log(this.texture)
    let texture = this.renderer.generateTexture(container);
    // let texture = this.renderer.generateTexture(container);
    // txt = PIXI.SystemRenderer.generateTexture(container);
    for(let y = 0; y < this.size.height; y++) {
      for(let x = 0; x < this.size.width; x++) {
        map.self[y + position.y][x + position.x].sprite.position.set(state[y][x].x, state[y][x].y)
      }
    }
    // debugger
    return texture;
  }
}