class Viewport {
  constructor() {
    this.chunk_size     = null;
    this.tile_size      = null;
    this.size           = null;

    this.chunks         = null;
    this.container      = null;
    this.chunk_renderer = null;
  }

  init(config) {
    this.chunk_size     = config.map.chunk;
    this.tile_size      = config.objects.Default.tile_size;
    this.size           = config.map.size;

    this.chunks         = Array(this.size.height).fill(null).map(()=>Array(this.size.width).fill(null));
    this.container      = new PIXI.Container();
    this.chunk_renderer = new ChunkRenderer();

    this.chunk_renderer.init(config);
  }

  build(map) {
    let sprite_size = {
      width: this.tile_size.width * this.chunk_size.width,
      height: this.tile_size.height * this.chunk_size.height
    }
    for(let y = 0; y < this.size.height; y++) {
      for (let x = 0; x < this.size.width; x++) {
        let position = {
          x: x * this.chunk_size.width,
          y: y * this.chunk_size.height
        }
        // debugger
        // console.log(position)
        let texture = this.chunk_renderer.render(map, position);

        let sprite = new PIXI.Sprite(texture);
        // console.log(sprite, texture)
        sprite.position.set(sprite_size.width * x, sprite_size.height * y);
        this.chunks[y][x] = sprite;
        this.container.addChild(this.chunks[y][x]);
      }
    }
  }

  change() {

  }

  ctx() {
    return this.container;
  }
}