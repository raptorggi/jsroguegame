class GameMap {
  constructor(h, w) {
    this.width = w;
    this.height = h;
    this.game_field = Array(this.height).fill(null).map(()=>Array(this.width).fill(null)); // map W x H
    this.start_position = new Point(Math.abs(randomInteger(0, this.height - 1)), Math.abs(randomInteger(0, this.width - 1)));
  }

  isOnMap(coords) {
    if (coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height) {
     return  true;
    }
    return false;
  }

  generateGameFieldTemplate() {
    let template = this.initializeGameField();
    let simulate_steps = 5;
    for (let step = 0; step <= simulate_steps; step++) {
      let new_template = this.simulateStep(template);
      template = arrayClone(new_template);
    }
    return template;
  }

  initializeGameField() {
    let template = Array(this.height).fill(1).map(()=>Array(this.width).fill(1)); // map W x H
    let chance_to_set_wall = 35;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        template[y][x] = (randomInteger(0, 100) > chance_to_set_wall) ? 0 : 1;
      }
    }
    return template;
  }

  simulateStep(old_template) {
    let birth_limit = 4;
    let death_limit = 3;
    let template = arrayClone(old_template);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let count = this.countAliveNeighbours(template,x ,y);
        if (old_template[y][x]) {
          (count < death_limit) ? template[y][x] = 0 : template[y][x] = 1;
        }
        else {
          (count > birth_limit) ? template[y][x] = 1 : template[y][x] = 0;
        }
      }
    }
    return template;
  }

  countAliveNeighbours(template, x, y) {
    let count = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let neighbour_x = x + i;
        let neighbour_y = y + j;
        if (i == 0 && j == 0 ) {
          // nothing
        }
        else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= this.width || neighbour_y >= this.height) {
          count += 1;
        }
        else if (template[neighbour_y][neighbour_x] == 1) {
          count += 1;
        }
      }
    }
    return count;
  }
} 