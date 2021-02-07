import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import { CanvasColoring } from "@ff0000-ad-tech/ad-canvas"

import "./style.scss"
// while (whatever.current.childNodes.length) whatever.current.removeChild(whatever.current.childNodes[0])
//           CanvasDummyBuilder.meshables.forEach((dummy, i) => {
//             whatever.current.appendChild(dummy.meshCanvas.output)
//           })
import { Actions } from "../../App"

// const delayedPromise = async status => {
//   console.warn("called")
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, 300)
//   })
// }

const Preview = React.forwardRef((props, ref) => {
  const { thumbs, layers } = props
  const canvasRef = useRef()

  const [selected, setSelected] = useState(0)

  // const [status, setStatus] = useState("Loading")

  useEffect(async () => {
    if (selected >= 0) {
      CanvasDummyBuilder.refresh(thumbs[selected])
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = layers.length - 1; i > -1; i--) {
        const img = layers[i]
        switch (i) {
          case 0:
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            break
          case 1:
            ctx.globalCompositeOperation = "multiply"
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            break
          case 3:
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            ctx.globalCompositeOperation = "source-atop"

            ctx.drawImage(CanvasDummyBuilder.meshables[2].meshCanvas.filler, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(CanvasDummyBuilder.meshables[2].meshCanvas.output, 0, 0, canvas.width, canvas.height)
            break
          case 4:
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            ctx.globalCompositeOperation = "source-atop"

            ctx.drawImage(CanvasDummyBuilder.meshables[0].meshCanvas.filler, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(CanvasDummyBuilder.meshables[0].meshCanvas.output, 0, 0, canvas.width, canvas.height)
            break
          default:
            break
        }
        ctx.globalCompositeOperation = "source-over"

        CanvasColoring.tint({
          target: canvasRef.current,
          color: "rgb(255, 255, 255)",
          amount: 0.0075,
        })
        CanvasColoring.saturation({
          target: canvasRef.current,
          amount: 1.04,
        })
        CanvasColoring.contrast({
          target: canvasRef.current,
          amount: 1.015,
        })
      }
    }
  }, [selected])

  return (
    <div className="container">
      <div className="preview">
        <div className="samples">
          {thumbs.map((img, i) => {
            return (
              <img
                className={i === selected ? "selected" : ""}
                src={img.src}
                key={`${img.src}_${i}`}
                alt={`thumbnail${i}`}
                onClick={() => {
                  setSelected(i)
                }}
              />
            )
          })}
        </div>
        <div className="preview-content">
          <canvas ref={canvasRef} width={1000} height={1000} />
          {/* {status && <div className="status">{status}</div>} */}
        </div>
      </div>
    </div>
  )
})

export default Preview
