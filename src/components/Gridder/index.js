import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import useEffectOnce from "../../hooks/useEffectOnce"

import "./style.scss"

const Gridder = React.forwardRef((props, ref) => {
  // amount is the multiple factor, divisible by 2 (2, 4, 8, 16, 32, etc)
  const amount = 32

  // the WIDTHxHEIGHT of the bitmap to generate - should correlate to what is in photoshop
  const [bitmapData, setBitmapData] = useState(["294x971"])
  const [status, setStatus] = useState("canvas")

  useEffectOnce(() => {
    const images = bitmapData.map(dimensions => {
      let [width, height] = dimensions.split("x")

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const c = canvas.getContext("2d")

      width = canvas.width / amount
      height = canvas.height / amount

      let x = 0
      let y = 0

      function getColor(i) {
        if (amount === 32) {
          if (i % 4 === 0) {
            c.strokeStyle = "rgb(255, 255, 0)"
          } else if (i % 2 === 0) {
            c.strokeStyle = "rgb(0, 128, 255)"
          } else {
            c.strokeStyle = "rgb(128, 0, 0)"
          }
        }
      }

      function makePath(i, x1, x2, y1, y2) {
        c.beginPath()
        getColor(i)
        c.moveTo(x1, y1)
        c.lineTo(x2, y2)
        c.stroke()
        c.closePath()
      }

      // VERTICAL LINES
      c.lineWidth = 1
      for (let i = 0; i < amount; i++) {
        makePath(i, x, x, 0, canvas.height)
        x += width
      }

      // HORIZONTAL LINES
      // c.lineWidth = 4
      for (let i = 0; i < amount; i++) {
        makePath(i, 0, canvas.width, y, y)
        y += height
      }

      // DO THE BORDER, WHICH MAY GET CROPPED SO LINE THICKNESS MUST DOUBLE
      c.strokeStyle = "rgb(255, 255, 0)"
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
  }, [status])

  return (
    <div className="gridder">
      {status !== "done" ? (
        <p>Loading.</p>
      ) : (
        bitmapData.map((src, i) => {
          return <img src={src} key={`img_${i}`} alt={`img_${i}`} />
        })
      )}
    </div>
  )
})

export default Gridder
