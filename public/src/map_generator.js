class MapGenerator {
  constructor() {
  }

  generateGameFieldTemplate(width, height) {
    let template = this.initializeGameField(width, height);

    let simulate_steps = 5;
    for (let step = 0; step <= simulate_steps; step++) {
      let new_template = this.simulateStep(template);
      template = new_template.copy();
    }
    return template;
  }

  initializeGameField(width, height) {
    let template = new Map(width, height) // map W x H
    let chance_to_set_wall = 35;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        template.self[y][x] = (randomInteger(0, 100) > chance_to_set_wall) ? 0 : 1;
      }
    }
    return template;
  }

  simulateStep(old_template) {
    let birth_limit = 4;
    let death_limit = 3;
    let template = old_template.copy();
    for (let y = 0; y < template.height; y++) {
      for (let x = 0; x < template.width; x++) {
        let count = this.countAliveNeighbours(template, x, y);
        if (old_template.self[y][x]) {
          (count < death_limit) ? template.self[y][x] = 0 : template.self[y][x] = 1;
        }
        else {
          (count > birth_limit) ? template.self[y][x] = 1 : template.self[y][x] = 0;
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
        else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= template.width || neighbour_y >= template.height) {
          count += 1;
        }
        else if (template.self[neighbour_y][neighbour_x] == 1) {
          count += 1;
        }
      }
    }
    return count;
  }
}