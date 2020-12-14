class Controller {
  constructor() {
    this.left = false
    this.right = false
    this.jump = false
    this.shoot = false
    this.standing = true

    this.keys = (e) => {
      let code = e.keyCode
      let keydown = e.type == 'keydown' ? true : false
      switch (code) {
        case 32:
          this.shoot = keydown
          break
        case 37:
          this.left = keydown
          break
        case 38:
          this.jump = keydown
          break
        case 39:
          this.right = keydown
          break
        case 40:
          this.duck = keydown
          break
      }
      !this.left && !this.right
        ? (this.standing = true)
        : (this.standing = false)
    }
  }
}
