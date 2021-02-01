import CanvasDummy from "./CanvasDummy"

import right_sock from "../data/right_sock.json"

class CanvasDummyBuilder {
  init(src) {
    const canvas_data = [
      {
        id: "right_sock_source",
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
        id: "right_sock_target",
        width: 1000,
        height: 1000,
        image: { src: "right_sock_source" },
        data: right_sock,
      },
      {
        id: "left_sock_source",
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
        id: "left_sock_target_01",
        width: 287,
        height: 940,
        image: {
          x: -10,
          y: -34,
          width: 297,
          height: 974,
          src: "left_sock_source",
        },
      },
      {
        id: "left_sock_target_02",
        width: 1000,
        height: 1000,
        image: { src: "left_sock_target_01" },
      },
    ]

    let prev
    let prevMesh
    this.meshables = []

    this.dummies = canvas_data.map((data, i) => {
      const dummy = new CanvasDummy()
      data.image = data.image || {}
      if (data.image.src) {
      } else {
      }

      data.image.src = data.image.src ? prev : src

      dummy.init(data)

      if (data.image.src === prev) {
        dummy.initMesh(data.data)
        this.meshables.push(dummy)
      }

      prevMesh = dummy
      prev = dummy.meshCanvas ? dummy.meshCanvas.output : dummy.canvas

      return dummy
    })

    // throw new Error("STOP")
  }
}

export default new CanvasDummyBuilder()
