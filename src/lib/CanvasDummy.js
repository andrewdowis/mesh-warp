import GridManager from "./GridManager"
import MeshCanvas from "./MeshCanvas"

export default class CanvasDummy {
  init(props) {
    const { width, height, image, id, data, mesh } = props

    const { src, x, y, width: image_width, height: image_height } = image

    this.id = id

    this.values = [src, x || 0, y || 0, image_width || src.width, image_height || src.height]
    this.parent = src

    if (mesh) {
      this.initMesh(width, height, data)
    } else {
      this.canvas = document.createElement("canvas")
      this.canvas.id = `dummy_canvas_${id}`

      this.canvas.width = width
      this.canvas.height = height
      const ctx = this.canvas.getContext("2d")

      ctx.drawImage(...this.values)
    }

    // document.getElementsByTagName("body").appendChild(canvas)
  }

  initMesh(width, height, data) {
    const gridManager = new GridManager()

    data = null
    let thing = true
    thing = false
    if (thing) {
      data = data || {
        width: this.parent.width,
        height: this.parent.height,
        columns: 2,
        rows: 2,
      }
    } else {
      data = data || {
        width: this.parent.width,
        height: this.parent.height,
        columns: 4,
        rows: 4,
      }
    }

    gridManager.init(data)

    this.meshCanvas = new MeshCanvas()
    this.meshCanvas.init(width, height, this.parent, gridManager)

    // this.parentDummy = parentDummy
  }

  doublePoints(newPositions) {
    console.warn(newPositions)
    this.meshCanvas.doublePoints(newPositions)
    this.refresh()
  }

  updateDot(index, x, y, iterations) {
    this.meshCanvas.gridManager.updateDot(index, x, y, iterations)
    this.meshCanvas.refresh()
  }

  refresh(showFiller = false) {
    if (this.meshCanvas) {
      this.meshCanvas.refresh(showFiller)
    } else {
      let ctx = this.canvas.getContext("2d")
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(...this.values)
    }
  }
}
