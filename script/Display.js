class Display {
  constructor(canvas) {
    this.buffer = document.createElement('CANVAS').getContext('2d')
    this.context = canvas.getContext('2d')

    this.fill = function (color) {
      this.buffer.fillStyle = color
      this.buffer.fillRect(
        0,
        0,
        this.buffer.canvas.width,
        this.buffer.canvas.height,
      )
    }

    //Wipe screen with black
    this.render = function (world) {
      this.context.fillStyle = '#000'
      this.context.fillRect(
        0,
        0,
        this.buffer.canvas.width,
        this.buffer.canvas.height,
      )

      //

      if (world) {
        let position = world.player.x - this.context.canvas.width / 3
        if (position < 0) position = 0
        if (position + this.context.canvas.width > this.buffer.canvas.width)
          position = this.buffer.canvas.width - this.context.canvas.width
        this.context.drawImage(
          this.buffer.canvas,
          position,
          0,
          this.context.canvas.width,
          this.buffer.canvas.height,
          0,
          0,
          this.context.canvas.width,
          this.context.canvas.height,
        )
      }
    }

    this.resize = function (width, height, height_width_ratio) {
      if (height / width > height_width_ratio) {
        this.context.canvas.height = width * height_width_ratio
        this.context.canvas.width = width
      } else {
        this.context.canvas.height = height
        this.context.canvas.width = height / height_width_ratio
      }
      this.context.imageSmoothingEnabled = false
    }

    this.getSize = function () {
      return { x: this.context.canvas.width, y: this.context.canvas.height }
    }
  }
}

class Animation {
  constructor() {
    this.frame = 0
    this.delay = 5
    this.count = 0
    this.animation = 0
    this.spriteSheet = new Image()
    this.spriteSheet.src = './img/SpriteSheet.png'
    this.scale = 1
    this.spriteWidth = 32
    this.spriteHeight = 48
    this.numFrames = 1 // this.spriteSheet.width / this.spriteWidth;
  }

  update() {
    this.count++
    if (this.count >= this.delay) {
      this.count = 0
      this.frame++
      if (this.frame > this.numFrames - 1) this.frame = 0
    }
  }

  right() {
    this.animation = 3
    this.numFrames = 4
    this.delay = 5
  }

  left() {
    this.animation = 2
    this.numFrames = 4
    this.delay = 5
  }

  jumping() {
    this.animation = 0
    this.numFrames = 4
    this.delay = 1
  }

  standing() {
    this.animation = 0
    this.numFrames = 1
    this.delay = 5
  }

  drawAnimationFrame(canvas, x, y) {
    canvas.drawImage(
      this.spriteSheet,
      this.frame * this.spriteWidth,
      this.animation * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      Math.floor(x),
      Math.floor(y),
      this.spriteWidth * this.scale,
      this.spriteHeight * this.scale,
    )
  }
}
