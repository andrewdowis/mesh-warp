import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import useEffectOnce from "../../hooks/useEffectOnce"

import "./style.scss"

const Gridder = React.forwardRef((props, ref) => {
  const images = useRef([])
  const holder = useRef()
  const amount = 32

  const [bitmapData, setBitmapData] = useState(["294x971", "297x974", "287x940", "728x1188"])
  const [status, setStatus] = useState("canvas")

  useEffectOnce(() => {
    const images = bitmapData.map(dimensions => {
      let [width, height] = dimensions.split("x")

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const c = canvas.getContext("2d")

      let total = Math.pow(amount, 2)
      width = canvas.width / amount
      height = canvas.height / amount

      let x = 0
      let y = 0

      for (let i = 0; i < total; i++) {
        c.beginPath()
        c.lineWidth = 1
        c.strokeStyle = "red"
        c.moveTo(x, y)
        c.lineTo(x + width, y)
        c.stroke()
        c.closePath()

        c.beginPath()
        c.lineWidth = 1
        c.strokeStyle = "cyan"
        c.moveTo(x + width, y)
        c.lineTo(x + width, y + height)
        c.stroke()
        c.closePath()

        c.beginPath()
        c.lineWidth = 1
        c.strokeStyle = "red"
        c.moveTo(x + width, y + height)
        c.lineTo(x, y + height)
        c.stroke()
        c.closePath()

        c.beginPath()
        c.lineWidth = 1
        c.strokeStyle = "cyan"
        c.moveTo(x, y + height)
        c.lineTo(x, y + height)
        c.stroke()
        c.closePath()

        x += width

        if (x >= canvas.width) {
          x = 0
          y += height
        }
      }

      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(canvas.width, 0)
      c.lineTo(canvas.width, canvas.height)
      c.lineTo(0, canvas.height)
      c.lineTo(0, 0)
      c.lineWidth *= 2

      c.stroke()
      c.closePath()

      return canvas.toDataURL("image/png")
    })

    setBitmapData(images)
    setStatus("image")
  })

  useEffect(() => {
    if (status === "image") {
      let i = 0
      const images = []
      function loadImage(i) {
        var img = new Image()
        img.src = bitmapData[i]

        img.onload = function() {
          images.push(img.src)
          if (i < bitmapData.length - 1) {
            loadImage(++i)
          } else {
            setBitmapData(images)
            setStatus("done")
          }
        }
      }
      loadImage(0)
    }
    // else if (status === "done") {
    //   while (holder.current.childNodes.length) holder.current.removeChild(holder.current.childNodes[0])
    //   bitmapData.forEach((img, i) => {
    //     holder.current.appendChild(img)
    //   })
    // }
  }, [status])

  return (
    <div className="gridder">
      {status !== "done" ? (
        <p>Loading.</p>
      ) : (
        bitmapData.map((src, i) => {
          return <img src={src} key={`img_${i}`} />
        })
      )}
    </div>
  )
})

export default Gridder
