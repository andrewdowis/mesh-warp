import GridManager from "./GridManager"
import MeshCanvas from "./MeshCanvas"

export default class CanvasDummy {
  init(props) {
    const { width, height, image, id } = props

    const { src, x, y, width: image_width, height: image_height } = image

    this.canvas = document.createElement("canvas")
    this.canvas.id = `dummy_canvas_${id}`
    this.id = id

    this.canvas.width = width
    this.canvas.height = height

    const ctx = this.canvas.getContext("2d")

    this.values = [src, x || 0, y || 0, image_width || src.width, image_height || src.height]

    this.parent = src

    ctx.drawImage(...this.values)

    // document.getElementsByTagName("body").appendChild(canvas)
  }

  initMesh(data) {
    const gridManager = new GridManager()

    data = data || {
      width: this.parent.width,
      height: this.parent.height,
      columns: 5,
      rows: 5,
    }

    gridManager.init(data)

    this.meshCanvas = new MeshCanvas()
    this.meshCanvas.init(this.canvas.width, this.canvas.height, this.parent, gridManager)

    this.canvas = null
    delete this.canvas

    // this.parentDummy = parentDummy
  }

  updateDot(index, x, y) {
    this.meshCanvas.gridManager.updateDot(index, x, y)
    this.meshCanvas.update()
  }

  refresh() {
    if (this.meshCanvas) this.meshCanvas.update()
    // let ctx = this.canvas.getContext("2d")
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // ctx.drawImage(...this.values)
  }
}
