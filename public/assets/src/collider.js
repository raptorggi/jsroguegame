class Collider {
  constructor() {}
  
  collide(map, object) {
    let position
  }

  collideWith(object, target) {
    if (!object.canCollide || !target.canCollide) {
      return false;
    }
    return this.collideRectWithRect(object, target);
  }

  collideRectWithRect(object, target) {
    return this.overlap(object.sprite.x, object.sprite.x + object.size.width, target.sprite.x, target.sprite.x + target.size.width) &&
           this.overlap(object.sprite.y, object.sprite.y + object.size.height, target.sprite.y, target.sprite.y + target.size.height);
  }

  overlap(a, b, x, y) {
    return max(a, x) < min(b, y);
  }
}