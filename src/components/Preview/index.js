import React, { useEffect, useRef, useState } from "react"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import { CanvasColoring } from "@ff0000-ad-tech/ad-canvas"

import "./style.scss"

const Status = {
  NONE: null,
  LOADING: "Loading...",
  TEXTURE: "Loading & Applying Texture...",
  TINTING: "Tinting...",
  SATURATION: "Saturation...",
  CONTRAST: "Adding Contrast...",
}

const Preview = React.forwardRef((props, ref) => {
  const { thumbs, layers } = props
  const canvasRef = useRef()

  const [selected, setSelected] = useState(0)

  const [status, setStatus] = useState(Status.LOADING)

  const update_status = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  useEffect(async () => {
    if (selected >= 0) {
      setStatus(Status.TEXTURE)
    }
  }, [selected])

  useEffect(async () => {
    if (status !== undefined) {
      let status_promise = update_status()
      await status_promise

      let next_status
      switch (status) {
        case Status.TEXTURE:
          CanvasDummyBuilder.refresh(thumbs[selected])
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")

          const { width, height } = canvas
          ctx.clearRect(0, 0, width, height)

          for (let i = layers.length - 1; i > -1; i--) {
            const img = layers[i]
            switch (i) {
              case 0:
                ctx.globalCompositeOperation = "destination-atop"
                ctx.drawImage(img, 0, 0, width, height)
                break
              case 1:
                ctx.drawImage(img, 0, 0, width, height)
                break
              case 2:
                ctx.globalCompositeOperation = "multiply"
                ctx.drawImage(img, 0, 0, width, height)
                break
              case 3:
                ctx.globalCompositeOperation = "multiply"
                ctx.drawImage(img, 0, 0, width, height)
                break
              case 4:
                for (let i = 1; i > -1; i--) {
                  ctx.drawImage(CanvasDummyBuilder.meshables[0].meshCanvas.filler, i, i, width, height)
                  ctx.drawImage(CanvasDummyBuilder.meshables[0].meshCanvas.output, i, i, width, height)
                }
                break
              case 5:
                for (let i = 1; i > -1; i--) {
                  ctx.drawImage(CanvasDummyBuilder.meshables[2].meshCanvas.filler, i, i, width, height)
                  ctx.drawImage(CanvasDummyBuilder.meshables[2].meshCanvas.output, i, i, width, height)
                }
                break
              default:
                break
            }
            ctx.globalCompositeOperation = "source-over"
          }
          next_status = Status.TINTING

          break

        case Status.TINTING:
          next_status = Status.SATURATION

          CanvasColoring.tint({
            target: canvasRef.current,
            color: "rgb(255, 255, 255)",
            amount: 0.0075,
          })
          break
        case Status.SATURATION:
          next_status = Status.CONTRAST

          CanvasColoring.saturation({
            target: canvasRef.current,
            amount: 1.04,
          })
          break
        case Status.CONTRAST:
          next_status = Status.NONE

          CanvasColoring.contrast({
            target: canvasRef.current,
            amount: 1.035,
          })
          break
        default:
          // Loading
          break
      }
      if (next_status !== undefined) setStatus(next_status)
    }
  }, [status])

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
          {status && <div className="status">{status}</div>}
        </div>
      </div>
    </div>
  )
})

export default Preview
