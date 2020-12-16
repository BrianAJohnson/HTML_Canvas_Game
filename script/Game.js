class Game {
  constructor() {
    const WIDTH = 2560
    const HEIGHT = 720

    this.world = {
      background_color: 'black',
      friction: 0.75,
      gravity: 1.6,
      player: new Player(128, 128, 32, 64, 'red'),
      collision: new Collision(),

      width: 1280, //1280, //1280,
      height: 720, //720,
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
        let bullets = this.world.player.bullets
        for (let i = 0; i < enemies.length; i++) {
          enemies[i].vel.y += this.world.gravity

          enemies[i].playerCollision(this.world.player)
          this.world.checkTileCollision(enemies[i])
          enemies[i].update()
          for (let j = 0; j < bullets.length; j++) {
            let dx = enemies[i].x - bullets[j].x
            let dy = enemies[i].y - bullets[j].y
            if (Math.sqrt(dx * dx + dy * dy) <= 35) {
              enemies.splice(i, 1)
              this.world.player.bullets.splice(j, 1)
            }
          }
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
  constructor(x, y, width, height, type) {
    super(x, y, width, height)
    this.animation = new Animation('./img/enemy.png', 44, 100, 0, 8, 4)
    this.type = type
    this.spriteSheet = new Image()
    this.spriteSheet.src = './img/enemies.png'
    this.vel = { x: 3, y: 0 }
    this.dwell = Math.random() * 500
    this.counter = 0
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
    this.counter++
    if (this.counter >= this.dwell) {
      if (this.vel.x != 0) {
        this.vel.x = 0
        this.animation.spriteWidth = 68
      } else {
        Math.random() > 0.5 ? (this.vel.x = 4) : (this.vel.x = -4)
        this.animation.spriteWidth = 44
      }
      this.dwell = Math.random() * 500
      this.counter = 0
    }
    this.x += this.vel.x
    this.y += this.vel.y
    this.vel.x < 0
      ? (this.animation.position = 2)
      : (this.animation.position = 1)
    if (this.vel.x == 0) this.animation.position = 0

    this.animation.update()
  }

  render(buffer) {
    this.animation.drawAnimationFrame(
      buffer,
      this.x - this.width / 2 - 5,
      this.y - this.height / 2 - 20,
    )
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
    this.animation = new Animation('./img/spriteSheet2.png', 75, 128)
    this.jumpSound = new Sound('./sound/jumpSound.mp3')
    this.hitSound = new Sound('./sound/landingSound.mp3')
    this.bullets = []
    this.shotDelay = 6
    this.shotCounter = 0

    this.left = () => {
      this.vel.x -= 3
      this.animation.left()
    }
    this.right = () => {
      this.vel.x += 3
      this.animation.right()
    }
    this.jump = () => {
      //this.animation.jumping()
      if (this.jumping == false) {
        this.jumpSound.play()
        this.vel.y = -23
        this.jumping = true
      }
    }
    this.shooting = () => {
      if (this.shotCounter == 0) {
        this.shoot()
        this.shotCounter++
      }
      if (this.shotCounter >= this.shotDelay) this.shotCounter = 0
    }
    this.standing = () => {
      this.animation.standing()
    }
  }

  resolve(col) {
    if (col.hit == true && col.cn != undefined && !col.passable) {
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

  shoot() {
    this.bullets.push(new Bullet(this.x, this.y, this.vel.x > 0 ? 20 : -20))
  }

  update() {
    this.x += this.vel.x
    this.y += this.vel.y
    if (this.shotCounter > 0) {
      this.shotCounter++
      if (this.shotCounter >= this.shotDelay) this.shotCounter = 0
    }
    if (this.hit) {
      this.hitCounter++
      if (this.hitCounter == this.hitTime) {
        this.hit = false
        this.hitCounter = 0
      }
    }
    this.animation.update()
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update()
      this.bullets[i].animation.update()
      if (this.bullets[i].x > 3000) {
        this.bullets.splice(i, 1)
      }
    }
  }

  render(buffer) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].animation.drawAnimationFrame(
        buffer,
        this.bullets[i].x - 16,
        this.bullets[i].y - 16,
      )
    }
    if (this.hit && this.hitCounter % 4 == 0) return
    this.animation.drawAnimationFrame(
      buffer,
      this.x - this.width / 2 - 12,
      this.y - this.height - 10,
    )
  }
}

class Bullet {
  constructor(x, y, vel) {
    this.animation = new Animation('./img/bullet.png', 32, 32, 0, 8, 4)
    this.x = x
    this.y = y
    this.vel = vel
  }
  update() {
    this.x = this.x + this.vel
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
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,r,0,0,7,0,9,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,r,0,0,0,9,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,5,5,5,5,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,0,r,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,1,2,2,2,2,3,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,1,2,2,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,7,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,r,0,0,0,0,0,4,5,5,5,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        [8,8,8,6,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,6,0,0,0,0,4,5,5,8,8,8,8,8,8,8,8,8,8,8,6,0,0,7,0,0,0,0,0,r,0,0,0,0,0,0,0,0,4,5,5,6,0,0,0,0,4,5,5,8,8,8,8,8,8,8,8],
        [8,8,8,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,8,8,8,8,5,5,5,5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,8,8,8,8,5,5,5,5,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
        [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]]

    this.tileArray = this.getTileArray()
    this.spriteSheet = new Image()
    this.spriteSheet.src = './img/tiles2.png'

    this.render = function (buffer, pos) {
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
              tile = { x: -32, y: -32, size: 32 }
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
        tempRow.push({x: j*32, y: i*32, width:32, height:32, solid: (this.tileMap[i][j] !== 7 &&this.tileMap[i][j] > 0  ) ? true:false,passable: (this.tileMap[i][j] == 9) ? true:false})
        if (
          typeof this.tileMap[i][j] == 'object' &&
          this.tileMap[i][j].color == 'red'
        ) {
          this.enemies.push(
            new Enemy(j * 32, i * 32, 32, 64, Math.floor(Math.random() * 3)),
          )
        }
      }
      tempArray.push(tempRow)
    }
    return tempArray
  }
}
