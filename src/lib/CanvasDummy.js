export default class CanvasDummy {
  init(props) {
    const { width, height, image, id } = props
    const { src, x, y, width: image_width, height: image_height } = image

    this.canvas = document.createElement("canvas")
    this.canvas.id = `dummy_canvas_${id}`

    this.canvas.width = width
    this.canvas.height = height

    const ctx = this.canvas.getContext("2d")
    console.warn("CANVAS")
    console.log(this.canvas)
    console.log(image)
    this.values = [src, x || 0, y || 0, image_width || src.width, image_height || src.height]
    ctx.drawImage(...this.values)
    console.log(src)
    console.log(`%c  DONE DRAWING`, "color: black; background-color: yellow; font-style: italic; padding: 2px;")

    // document.getElementsByTagName("body").appendChild(canvas)
  }

  refresh() {
    console.clear()
    console.warn("VALUES")
    console.log(...this.values)
    this.canvas.getContext("2d").drawImage(...this.values)
  }
}
