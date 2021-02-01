export default class MeshCanvas {
  init(width, height, image, gridManager) {
    this.output = document.createElement("canvas")
    this.output.id = `output`

    this.wireframe = document.createElement("canvas")
    this.wireframe.id = `wireframe`

    this.output.width = width
    this.output.height = height

    this.wireframe.width = width
    this.wireframe.height = height

    const ctx_output = this.output.getContext("2d")
    const ctx_wireframe = this.wireframe.getContext("2d")

    this.src = image

    this.gridManager = gridManager

    this.update()
  }

  updateMeshLines() {
    // update the mesh lines
    let ctx_wireframe = this.wireframe.getContext("2d")

    ctx_wireframe.clearRect(0, 0, this.wireframe.width, this.wireframe.height)
    ctx_wireframe.strokeStyle = "lime"
    ctx_wireframe.lineWidth = 2
    for (let i = 0; i < this.gridManager.positions.length; i++) {
      const coord = this.gridManager.positions[i]
      let neighbor = this.gridManager.positions[i + 1]
      if (i && (i + 1) % (this.gridManager.columns + 1) === 0) neighbor = null
      ctx_wireframe.beginPath()
      if (i >= this.gridManager.columns + 1) {
        const upper = this.gridManager.positions[i - this.gridManager.columns - 1]
        ctx_wireframe.moveTo(upper.x, upper.y)
        ctx_wireframe.lineTo(coord.x, coord.y)
      } else {
        ctx_wireframe.moveTo(coord.x, coord.y)
      }
      if (neighbor) ctx_wireframe.lineTo(neighbor.x, neighbor.y)
      ctx_wireframe.stroke()
      ctx_wireframe.closePath()
    }

    ctx_wireframe.strokeStyle = "red"
    ctx_wireframe.lineWidth = 0.5
    for (let i = 0; i < this.gridManager.positions.length; i++) {
      if (i % (this.gridManager.columns + 1) === 0) continue

      const coord = this.gridManager.positions[i]
      let neighbor = this.gridManager.positions[i + this.gridManager.columns]

      if (!neighbor) break

      ctx_wireframe.beginPath()
      ctx_wireframe.moveTo(coord.x, coord.y)
      ctx_wireframe.lineTo(neighbor.x, neighbor.y)

      ctx_wireframe.stroke()
      ctx_wireframe.closePath()
    }
  }

  linearSolution(r1, s1, t1, r2, s2, t2, r3, s3, t3) {
    // make them all floats
    r1 = parseFloat(r1)
    s1 = parseFloat(s1)
    t1 = parseFloat(t1)
    r2 = parseFloat(r2)
    s2 = parseFloat(s2)
    t2 = parseFloat(t2)
    r3 = parseFloat(r3)
    s3 = parseFloat(s3)
    t3 = parseFloat(t3)

    let a = ((t2 - t3) * (s1 - s2) - (t1 - t2) * (s2 - s3)) / ((r2 - r3) * (s1 - s2) - (r1 - r2) * (s2 - s3))
    let b = ((t2 - t3) * (r1 - r2) - (t1 - t2) * (r2 - r3)) / ((s2 - s3) * (r1 - r2) - (s1 - s2) * (r2 - r3))
    let c = t1 - r1 * a - s1 * b

    return [a, b, c]
  }

  meshify() {
    let img = this.src

    let gm = this.gridManager
    let { columns, rows } = gm

    let ctx_output = this.output.getContext("2d")
    let w = this.output.width
    let h = this.output.height

    let w_sliced = img.width / columns
    let h_sliced = img.height / rows

    const upperLeft = gm.rootPositions[0]

    const { x: upperX, y: upperY } = upperLeft
    const w_x = upperX + w_sliced // * column
    const h_y = upperY + h_sliced // * row

    ctx_output.clearRect(0, 0, w, h)
    // render the images
    const target = gm.positions.length - columns - 1
    for (let i = target - 1; i > -1; i--) {
      if ((i + 1) % (columns + 1) === 0) continue
      const c1 = gm.positions[i]
      const c2 = gm.positions[i + 1]
      const c3 = gm.positions[i + 1 + columns]
      const c4 = gm.positions[i + 2 + columns]

      const { x: rootX, y: rootY } = gm.rootPositions[i]

      let x1 = c1.x
      let y1 = c1.y
      let x2 = c2.x
      let y2 = c2.y
      let x3 = c3.x
      let y3 = c3.y
      let x4 = c4.x
      let y4 = c4.y

      // the bottom-right face
      let xn = this.linearSolution(w_x, h_y, x4, w_x, upperX, x2, upperX, h_y, x3)
      let yn = this.linearSolution(w_x, h_y, y4, w_x, upperY, y2, upperY, h_y, y3)

      ctx_output.save()
      ctx_output.setTransform(xn[0], yn[0], xn[1], yn[1], xn[2], yn[2])
      ctx_output.beginPath()

      ctx_output.moveTo(w_x, h_y)
      ctx_output.lineTo(w_x, upperY)
      ctx_output.lineTo(upperX, h_y)
      ctx_output.lineTo(w_x, h_y)

      ctx_output.closePath()
      ctx_output.fillStyle = "purple"
      ctx_output.fill()
      ctx_output.clip()
      ctx_output.drawImage(img, rootX, rootY, w_sliced, h_sliced, 0, 0, w_sliced, h_sliced)

      ctx_output.restore()

      // the top-left face
      let xm = this.linearSolution(upperX, upperX, x1, w_x, upperX, x2, upperX, h_y, x3)
      let ym = this.linearSolution(upperY, upperY, y1, w_x, upperY, y2, upperY, h_y, y3)

      ctx_output.save()
      ctx_output.setTransform(xm[0], ym[0], xm[1], ym[1], xm[2], ym[2])
      ctx_output.beginPath()
      ctx_output.moveTo(upperX, upperY)
      ctx_output.lineTo(w_x, upperY)
      ctx_output.lineTo(upperX, h_y)
      ctx_output.lineTo(upperX, upperY)
      ctx_output.closePath()
      ctx_output.fill()
      ctx_output.clip()
      ctx_output.drawImage(img, rootX, rootY, w_sliced, h_sliced, 0, 0, w_sliced, h_sliced)
      ctx_output.restore()
    }
  }

  update() {
    this.meshify()
    this.updateMeshLines()
  }
}
