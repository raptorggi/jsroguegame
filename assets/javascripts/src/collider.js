class Collider {
  constructor() {}
  
  collide(map, object) {
    let collisions = [];
    for (let y = -1; y < 2; y++){
      for (let x = -1; x < 2; x++) {
        let neighbour_x = object.position.x + x;
        let neighbour_y = object.position.y + y;
        if (x == 0 && y == 0 ) {}
        else if (neighbour_x >= 0 && neighbour_y >= 0 && neighbour_x < map.width && neighbour_y < map.height) {
          if (this.collideWith(object, map.units.self[neighbour_y][neighbour_x])) {
            collisions.push(map.units.self[neighbour_y][neighbour_x]);
            console.log([neighbour_x, neighbour_y], object, map.units.self[neighbour_y][neighbour_x], [x ,y]);
          }
          if (this.collideWith(object, map.terrain.self[neighbour_y][neighbour_x])) {
            collisions.push(map.terrain.self[neighbour_y][neighbour_x]);
          }
        }
      }
    }
    return collisions;
  }

  collideWith(object, target) {
    if (target && target.canCollide && object.canCollide) {
      return this.collideRectWithRect(object, target);
    }
    return false;
  }

  collideRectWithRect(object, target) {
    return this.overlap(object.sprite.x, object.sprite.x + object.size.width, target.sprite.x, target.sprite.x + target.size.width) &&
           this.overlap(object.sprite.y, object.sprite.y + object.size.height, target.sprite.y, target.sprite.y + target.size.height);
  }

  overlap(a, b, x, y) {
    return max(a, x) < min(b, y);
  }
}