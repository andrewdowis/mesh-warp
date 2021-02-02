import CanvasDummy from "./CanvasDummy"

import right_sock from "../data/right_sock.json"
import left_sock_01 from "../data/left_sock_01.json"
import left_sock_02 from "../data/left_sock_02.json"

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
        data: left_sock_01,
      },
      {
        id: "left_sock_target_02",
        width: 1000,
        height: 1000,
        image: { src: "left_sock_target_01" },
        data: left_sock_02,
      },
    ]

    let prev
    this.meshables = []

    this.dummies = canvas_data.map((obj, i) => {
      const dummy = new CanvasDummy()
      obj.image = obj.image || {}
      if (obj.image.src) {
      } else {
      }

      const addMesh = obj.image.src || false
      obj.image.src = addMesh ? prev : src

      if (addMesh) obj.mesh = addMesh

      dummy.init(obj)

      if (obj.image.src === prev) {
        this.meshables.push(dummy)
      }

      prev = dummy.meshCanvas ? dummy.meshCanvas.output : dummy.canvas

      return dummy
    })

    // throw new Error("STOP")
  }

  refresh(img) {
    const non_meshy = this.dummies.filter(dummy => {
      return !dummy.meshCanvas
    })

    non_meshy.forEach((dummy, i) => {
      dummy.values[0] = img
      dummy.refresh()
    })

    this.meshables.forEach((dummy, i) => {
      dummy.refresh()
    })
  }
}

export default new CanvasDummyBuilder()
