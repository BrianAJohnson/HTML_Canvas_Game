class Collision {
  constructor() {}

  check = (rect, obj) => {
    // Get ray vs rectangle intersection points
    let t_near = this.getNear(rect, obj)
    let t_far = this.getFar(rect, obj)

    // Sort near and far values so they make sense from different angles
    if (t_near.x > t_far.x) {
      let temp = t_near.x
      t_near.x = t_far.x
      t_far.x = temp
    }

    if (t_near.y > t_far.y) {
      let temp = t_near.y
      t_near.y = t_far.y
      t_far.y = temp
    }

    // Check if x and y points are outside of collision
    if (t_near.x > t_far.y || t_near.y > t_far.x) return false

    // Determine is collision occured in x or y direction
    let hit_near = this.max(t_near.x, t_near.y)
    let hit_far = this.min(t_far.x, t_far.y)

    // If collision happened behind or ahead out of reach - return
    if (hit_far < 0 || hit_near > 1) return false

    // Set the contact point.
    let contact_point = {
      x: rect.x + rect.vel.x * hit_near,
      y: rect.y + rect.vel.y * hit_near,
    }

    // Set the contact normals
    let contact_normal
    if (t_near.x < t_near.y) {
      contact_normal = rect.vel.y < 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }
    } else if (t_near.x > t_near.y) {
      contact_normal = rect.vel.x < 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }
    }

    return {
      hit: true,
      cp: contact_point,
      cn: contact_normal,
      passable: obj.passable,
    }
  }

  getNear = (rect, obj) => {
    let x = (obj.x - rect.x - rect.width / 3) / rect.vel.x
    let y = (obj.y - rect.y - rect.height / 3) / rect.vel.y
    return { x: x, y: y }
  }

  getFar = (rect, obj) => {
    let x = (obj.x + obj.width + rect.width / 3 - rect.x) / rect.vel.x
    let y = (obj.y + obj.height + rect.height / 3 - rect.y) / rect.vel.y
    return { x: x, y: y }
  }

  min = (n1, n2) => {
    return n1 < n2 ? n1 : n2
  }
  max = (n1, n2) => {
    return n1 > n2 ? n1 : n2
  }
}
