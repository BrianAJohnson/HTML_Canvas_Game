class Game {
  constructor() {
    const WIDTH = 2560
    const HEIGHT = 720

    this.world = {
      background_color: 'black',
      friction: 0.75,
      gravity: 1.6,
      player: new Player(50, 128, 32, 32, 'red'),
      collision: new Collision(),

      width: 1280, //1280,
      height: 932, //720,
      map: new Map(WIDTH, HEIGHT),
      color: 'blue',

      render: (buffer) => {
        this.world.map.render(buffer, this.world.player.x)
        let enemies = this.world.map.enemies
        for (let i = 0; i < enemies.length; i++) {
          enemies[i].render(buffer)
        }
      },
      update: () => {
        this.world.player.vel.x *= 0.7
        this.world.player.vel.y += this.world.gravity
        let enemies = this.world.map.enemies
        for (let i = 0; i < enemies.length; i++) {
          enemies[i].vel.y += this.world.gravity

          enemies[i].playerCollision(this.world.player)
          this.world.checkTileCollision(enemies[i])
          enemies[i].update()
        }

        this.world.checkTileCollision(this.world.player)
        this.world.player.update()
      },

      checkTileCollision: (obj) => {
        //checking collision with map items
        let collision = false
        let map_pos_x = Math.floor(obj.x / 32)
        let map_pos_y = Math.floor(obj.y / 32)
        // prettier-ignore
        if(map_pos_x -1 < 0 ||map_pos_x + 1 > this.world.map.tileArray[this.world.map.tileArray.length -1].length -1) return false
        if (
          map_pos_y - 1 < 0 ||
          map_pos_y + 1 > this.world.map.tileArray.length - 1
        )
          return false
        if (this.world.map.tileArray[map_pos_y][map_pos_x].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y][map_pos_x],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y + 1][map_pos_x].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y + 1][map_pos_x],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y + 1][map_pos_x + 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y + 1][map_pos_x + 1],
          )
          obj.resolve(collision)
        }

        if (this.world.map.tileArray[map_pos_y][map_pos_x + 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y][map_pos_x + 1],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y - 1][map_pos_x + 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y - 1][map_pos_x + 1],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y - 1][map_pos_x].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y - 1][map_pos_x],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y - 1][map_pos_x - 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y - 1][map_pos_x - 1],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y][map_pos_x - 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y][map_pos_x - 1],
          )
          obj.resolve(collision)
        }
        if (this.world.map.tileArray[map_pos_y + 1][map_pos_x - 1].solid) {
          collision = this.world.collision.check(
            obj,
            this.world.map.tileArray[map_pos_y + 1][map_pos_x - 1],
          )
          obj.resolve(collision)
        }
      },
    }
  }
  update() {
    this.world.update()
  }
}

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }

  render(c) {
    c.fillStyle = this.color
    c.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    )
  }
}

class Enemy extends Rectangle {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color)
    this.vel = { x: this.random_Velocity(6, 4), y: 0 }
  }
  resolve(col) {
    if (col.hit == true && col.cn != undefined) {
      // moving - left
      if (col.cn.x == 1) {
        this.vel.x *= -1
        this.x = col.cp.x + 1
      }
      // moving - right
      if (col.cn.x == -1) {
        this.vel.x *= -1
        this.x = col.cp.x - 1
      }
      // moving - up
      if (col.cn.y == 1) {
        this.vel.y = 1
        this.y = col.cp.y + 1
      }
      // moving - down
      if (col.cn.y == -1) {
        this.vel.y = 0
        this.y = col.cp.y - 1
      }
    }
  }
  update() {
    this.x += this.vel.x
    this.y += this.vel.y
  }
  playerCollision(player) {
    if (player.hit) return
    let half_width = this.width / 2
    let half_height = this.height / 2
    let half_player_width = player.width / 3
    let half_player_height = player.height / 3

    if (
      this.x - half_width > player.x + half_player_width ||
      this.x + half_width < player.x - half_player_width ||
      this.y - half_height > player.y + half_player_height ||
      this.y + half_height < player.y - half_player_height
    ) {
    } else {
      player.hit = true
      player.hitSound.play()
      if (player.vel.x < 1 && player.vel.x > -1) {
        player.vel.x = this.vel.x * 8
        console.log(player.vel.x)
      } else {
        player.vel.x *= -5
      }
      player.vel.y = -10
    }
  }
  random_Velocity(vMax, vMin) {
    let random_vel = Math.floor(Math.random() * vMax - vMax / 2)
    if (random_vel > -vMin && random_vel < vMin)
      random_vel <= 0 ? (random_vel = -vMin) : (random_vel = vMin)
    return random_vel
  }
}

class Player extends Rectangle {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color)
    this.vel = { x: 0, y: 0 }
    this.jumping = false
    this.hit = false
    this.hitTime = 35
    this.hitCounter = 0
    this.animation = new Animation()
    this.jumpSound = new Sound('./sound/jumpSound.mp3')
    this.hitSound = new Sound('./sound/landingSound.mp3')

    this.left = () => {
      this.vel.x -= 3
      this.animation.left()
    }
    this.right = () => {
      this.vel.x += 3
      this.animation.right()
    }
    this.jump = () => {
      this.animation.jumping()
      if (this.jumping == false) {
        this.jumpSound.play()
        this.vel.y = -23
        this.jumping = true
      }
    }
    this.standing = () => {
      this.animation.standing()
    }
  }

  update() {
    this.x += this.vel.x
    this.y += this.vel.y
    if (this.hit) {
      this.hitCounter++
      if (this.hitCounter == this.hitTime) {
        this.hit = false
        this.hitCounter = 0
      }
    }
    this.animation.update()
  }

  resolve(col) {
    if (col.hit == true && col.cn != undefined) {
      // moving - left
      if (col.cn.x == 1) {
        this.vel.x = 0
        this.x = col.cp.x + 1
      }
      // moving - right
      if (col.cn.x == -1) {
        this.vel.x = 0
        this.x = col.cp.x - 1
      }
      // moving - up
      if (col.cn.y == 1) {
        this.vel.y = 1
        this.y = col.cp.y + 1
      }
      // moving - down
      if (col.cn.y == -1) {
        this.vel.y = 0
        this.y = col.cp.y - 1
        this.jumping = false
      }
    }
  }

  render(buffer) {
    if (this.hit && this.hitCounter % 4 == 0) return
    this.animation.drawAnimationFrame(
      buffer,
      this.x - this.width / 2,
      this.y - this.height * 0.9,
    )
  }
}
class Sound {
  constructor(src) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    document.body.appendChild(this.sound)
    this.play = function () {
      this.sound.play()
    }
    this.stop = function () {
      this.sound.pause()
    }
  }
}

class Map {
  constructor(width, height) {
    let r = { color: 'red' }
    let b = { color: 'blue' }
    let g = { color: 'green' }
    this.enemies = []
    this.width = width
    this.height = height
    // prettier-ignore
    this.tileMap = 
        [[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,g,7,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,5,5,5,5,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,1,2,2,2,2,3,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,7,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,r,0,0,0,0,0,4,5,5,5,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,8,8,6,0,0,7,0,0,0,0,b,0,0,0,0,0,0,0,0,0,4,5,5,6,0,0,0,0,4,5,5,8,8,8,8,8,8,8,8,8,8,8,6,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,6,0,0,0,0,4,5,5,8,8,8,8,8,8,8,8],
        [8,8,8,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,8,8,8,8,5,5,5,5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,8,8,8,8,5,5,5,5,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]

    this.tileArray = this.getTileArray()
    this.spriteSheet = new Image()
    this.spriteSheet.src = './img/tiles2.png'
    this.background = new Image()
    this.background.src = './img/bg.png'

    this.render = function (buffer, pos) {
      buffer.width = 2560
      buffer.drawImage(
        this.background,
        0,
        0,
        this.background.width,
        this.background.height,
        0,
        0,
        this.width,
        this.height,
      )

      let tile = 0
      for (let i = 0; i < this.tileMap.length; i++) {
        for (let j = 0; j < this.tileMap[i].length; j++) {
          switch (this.tileMap[i][j]) {
            case 0:
              tile = null
              break
            case 1:
              tile = { x: 0, y: 0, size: 32 }
              break
            case 2:
              tile = { x: 32, y: 0, size: 32 }
              break
            case 3:
              tile = { x: 64, y: 0, size: 32 }
              break
            case 4:
              tile = { x: 0, y: 32, size: 32 }
              break
            case 5:
              tile = { x: 32, y: 32, size: 32 }
              break
            case 6:
              tile = { x: 64, y: 32, size: 32 }
              break
            case 7:
              tile = { x: 0, y: 64, size: 32 }
              break
            case 8:
              tile = { x: 32, y: 64, size: 32 }
              break
            case 9:
              tile = { x: 64, y: 64, size: 32 }
              break
          }
          // prettier-ignore
          if (tile)
            buffer.drawImage(
              this.spriteSheet,
              tile.x,
              tile.y,
              tile.size,
              tile.size,
              j * tile.size,
              i * tile.size,
              tile.size,
              tile.size,
            )
        }
      }
    }
  }
  getTileArray = () => {
    let tempArray = []
    for (let i = 0; i < this.tileMap.length; i++) {
      let tempRow = []
      for (let j = 0; j < this.tileMap[i].length; j++) {
        // prettier-ignore
        tempRow.push({x: j*32, y: i*32, width:32, height:32, solid: (this.tileMap[i][j] !== 7 &&this.tileMap[i][j] > 0  ) ? true:false})
        if (typeof this.tileMap[i][j] == 'object') {
          this.enemies.push(
            new Enemy(j * 32, i * 32, 16, 32, this.tileMap[i][j].color),
          )
        }
      }
      tempArray.push(tempRow)
    }
    return tempArray
  }
}
