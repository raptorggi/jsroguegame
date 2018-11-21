class Viewport {
  constructor() {
    this.renderer       = null;
    this.window         = null;

    this.chunk_size     = null;
    this.tile_size      = null;
    this.size           = null;

    this.chunks         = null;
    this.container      = null;
    this.chunk_renderer = null;
  }

  init(config, renderer) {
    this.renderer       = renderer;

    this.chunk_size     = config.map.chunk;
    this.tile_size      = config.objects.Default.tile_size;
    this.size           = config.map.size;

    this.chunks         = Array(this.size.height).fill(null).map(()=>Array(this.size.width).fill(null));
    this.container      = new PIXI.Container();
    this.chunk_renderer = new ChunkRenderer();

    console.log('1', renderer)
    this.chunk_renderer.init(config, this.renderer);
  }

  build(map) {
  //   let sprite_size = {
  //     width: this.tile_size.width * this.chunk_size.width,
  //     height: this.tile_size.height * this.chunk_size.height
  //   }
  //   for(let y = 0; y < this.size.height; y++) {
  //     for (let x = 0; x < this.size.width; x++) {
  //       let position = {
  //         x: x * this.chunk_size.width,
  //         y: y * this.chunk_size.height
  //       }
  //       // debugger
  //       // console.log(position)
  //       let texture = this.chunk_renderer.render(map, position);
  //       console.log('t', texture)
  //       let sprite = new PIXI.Sprite(texture);
  //       // console.log(sprite, texture)
  //       sprite.position.set(sprite_size.width * x, sprite_size.height * y);
  //       this.chunks[y][x] = sprite;
  //       this.container.addChild(this.chunks[y][x]);
  //     }
  //   }
  //   console.log('c', this.container)
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      this.container.addChild(map.terrain.self[y][x].sprite);
    }
  }
  }

  change() {

  }

  ctx() {
    return this.container;
  }
}