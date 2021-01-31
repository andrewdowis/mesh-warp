import CanvasDummy from "./CanvasDummy"

class CanvasDummyBuilder {
  init(src) {
    console.log(`%c dummybuilder`, "color: black; background-color: orange; font-style: italic; padding: 2px;")
    console.log(src)
    const canvas_data = [
      {
        id: "right_sock",
        width: 294,
        height: 971,
        image: {
          x: -4,
          y: -2,
          width: 590,
          height: 975,
        },
      },
      {
        id: "left_sock_01",
        width: 297,
        height: 974,
        image: {
          x: -293,
          y: -1,
          width: 590,
          height: 975,
        },
      },
      {
        id: "left_sock_02",
        width: 287,
        height: 940,
        image: {
          x: -10,
          y: -34,
          width: 297,
          height: 974,
        },
      },
    ]

    let prev
    console.clear()
    this.dummies = canvas_data.map((data, i) => {
      const dummy = new CanvasDummy()
      data.image.src = i === canvas_data.length - 1 ? prev.canvas || prev : src
      console.log("")
      console.log(`%c  FUCK YOU`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
      console.log(i)
      console.log(data)
      dummy.init(data)
      console.warn("DONE")
      console.log("")

      prev = dummy.canvas

      return dummy
    })
    // throw new Error("STOP")
  }
}

export default new CanvasDummyBuilder()
