// Initial all Global Variables //
const COLLISION_BOX = true

function init() {
  update = function (time_stamp) {
    if (controller.left) {
      game.world.player.left()
    }
    if (controller.right) {
      game.world.player.right()
    }
    if (controller.jump) {
      game.world.player.jump()
    }
    if (controller.shoot) {
      game.world.player.shooting()
    }
    if (controller.standing) {
      game.world.player.standing()
    }
    game.update()
  }

  render = function () {
    display.fill(game.world.background_color) // Clear background to game's background color.
    game.world.render(display.buffer)
    game.world.player.render(display.buffer)
    display.render(game.world)
  }

  resize = function () {
    display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      game.world.height / game.world.width,
    )
    display.render()
  }

  keyDownUp = function (event) {
    controller.keys(event)
  }

  let controller = new Controller()
  let display = new Display(document.getElementById('canvas'))
  let game = new Game()
  let engine = new Engine(1000 / 30, update, render)

  addEventListener('keydown', keyDownUp)
  addEventListener('keyup', keyDownUp)
  addEventListener('resize', resize)

  display.context.canvas.width = game.world.width
  display.context.canvas.height = game.world.height
  display.buffer.canvas.width = 2560 //game.world.width
  display.buffer.canvas.height = game.world.height

  resize()

  engine.start()
}

// Call init on page load //
window.onload = () => init()
