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

  initMesh(gridManager) {
    console.log(`%c init mesh`, "color: black; background-color: orange; font-style: italic; padding: 2px;")

    const meshCanvas = new MeshCanvas()
    meshCanvas.init(this.canvas.width, this.canvas.height, this.parent, gridManager)

    console.log("MAIDE")
    console.warn(meshCanvas)

    return meshCanvas
  }

  refresh() {
    this.canvas.getContext("2d").drawImage(...this.values)
  }
}
