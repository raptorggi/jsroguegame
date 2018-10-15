class Viewport {
  constructor() {
    this.chunk_size = null;
    this.size       = null;

    this.chunks     = null;

    this.container  = null;
  }

  init(config) {
    this.container = new PIXI.Container();
    
    
  }
}