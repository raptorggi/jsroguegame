class MiniMap {
  constructor() {
    this.tile_size = null;

    this.minimap   = null;
    this.terrain   = null;
    this.objects   = null;
  }

  init(tile_size) {
    this.tile_size = tile_size;

    this.minimap   = new PIXI.Container();
    this.terrain   = new PIXI.Container();
    this.objects   = new PIXI.Container();

    this.minimap.addChild(this.terrain);
    this.minimap.addChild(this.objects);
  }

  render(map) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        this.terrain.addChild(map.terrain.self[y][x].minimap_sprite);
      }
    }
    this.objects.addChild(map.units.self[map.startPosition().y][map.startPosition().x].minimap_sprite);
  }

  ctx() {
    return this.minimap;
  }
}