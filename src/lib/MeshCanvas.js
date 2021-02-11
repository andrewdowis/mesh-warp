import { MathUtils } from "@ff0000-ad-tech/ad-utils"
import { getAnglePoint } from "@ff0000-ad-tech/ad-utils/lib/MathUtils"

const getAverage = (...numbers) => {
  let number = 0
  numbers.forEach(num => (number += num))
  return number / numbers.length
}

const averagePoints = (...points) => {
  let newPoint = { x: 0, y: 0 }
  points.forEach(point => {
    newPoint.x += point.x
    newPoint.y += point.y
  })
  return {
    x: newPoint.x / points.length,
    y: newPoint.y / points.length,
  }
}

export default class MeshCanvas {
  init(width, height, image, gridManager) {
    this.output = document.createElement("canvas")
    this.output.id = `output`

    this.filler = document.createElement("canvas")
    this.filler.id = `filler`

    this.wireframe = document.createElement("canvas")
    this.wireframe.id = `wireframe`

    this.output.width = width
    this.output.height = height

    this.filler.width = width
    this.filler.height = height

    this.wireframe.width = width
    this.wireframe.height = height

    this.src = image

    this.gridManager = gridManager

    this.refresh()
  }

  updateMeshLines() {
    // update the mesh lines
    let ctx_wireframe = this.wireframe.getContext("2d")

    ctx_wireframe.clearRect(0, 0, this.wireframe.width, this.wireframe.height)
    ctx_wireframe.strokeStyle = "red"
    ctx_wireframe.lineWidth = 0.5
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

    ctx_wireframe.strokeStyle = "orange"
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

    // console.warn(this.gridManager.controlPoints)
    // if (this.gridManager.controlPoints) {
    // }
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

  meshify(showFiller = false) {
    const canvi = [this.output]
    if (showFiller) canvi.push(this.filler)
    // console.log(`%c ${showFiller}`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
    let img = this.src

    let gm = this.gridManager
    let { columns, rows } = gm
    let w = canvi[0].width
    let h = canvi[0].height

    let subwidth = img.width / columns
    let subheight = img.height / rows

    const target = gm.positions.length - 1 - columns - 2
    const rewind_amount = columns + 1
    const skip_amount = rewind_amount * rows - 1

    canvi.forEach((canvas, c) => {
      let ctx = canvas.getContext("2d")

      const offset = c * 4

      ctx.clearRect(0, 0, w, h)
      // render the images

      for (let i = target; i > -1; i -= rewind_amount) {
        // console.log(c, i)
        console.log()
        const c1 = gm.positions[i]
        const c2 = gm.positions[i + 1]
        const c3 = gm.positions[i + 1 + columns]
        const c4 = gm.positions[i + 2 + columns]

        let { x: rootX, y: rootY } = gm.rootPositions[i]

        let x1 = c1.x + offset
        let y1 = c1.y + offset
        let x2 = c2.x + offset
        let y2 = c2.y + offset
        let x3 = c3.x + offset
        let y3 = c3.y + offset
        let x4 = c4.x + offset
        let y4 = c4.y + offset

        // the bottom-right face
        let xn = this.linearSolution(subwidth, subheight, x4, subwidth, 0, x2, 0, subheight, x3)
        let yn = this.linearSolution(subwidth, subheight, y4, subwidth, 0, y2, 0, subheight, y3)

        ctx.save()
        ctx.setTransform(xn[0], yn[0], xn[1], yn[1], xn[2], yn[2])
        ctx.beginPath()
        ctx.moveTo(subwidth, subheight)
        ctx.lineTo(subwidth, 0)
        ctx.lineTo(0, subheight)
        ctx.closePath()
        ctx.fillStyle = "transparent"
        // ctx.fillStyle = "pink"
        ctx.fill()
        ctx.clip()
        ctx.drawImage(img, rootX, rootY, subwidth, subheight, 0, 0, subwidth, subheight)

        ctx.restore()

        // the top-left face
        let xm = this.linearSolution(0, 0, x1, subwidth, 0, x2, 0, subheight, x3)
        let ym = this.linearSolution(0, 0, y1, subwidth, 0, y2, 0, subheight, y3)

        ctx.save()
        ctx.setTransform(xm[0], ym[0], xm[1], ym[1], xm[2], ym[2])
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(subwidth, 0)
        ctx.lineTo(0, subheight)
        ctx.closePath()
        ctx.fillStyle = "transparent"
        // ctx.fillStyle = "purple"
        ctx.fill()
        ctx.clip()
        ctx.drawImage(img, rootX, rootY, subwidth, subheight, 0, 0, subwidth, subheight)
        ctx.restore()

        if (i && i - rewind_amount < 0) i += skip_amount
      }
    })
  }

  refresh(showFiller = false) {
    this.meshify(showFiller)
    this.updateMeshLines()
  }

  doublePoints(newPositions) {
    this.gridManager.doublePoints(newPositions)
  }
}
