import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Preview = React.forwardRef((props, ref) => {
  const { imgs } = props
  const canvasRef = useRef()

  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (selected >= 0) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      // ctx.drawImage(sock_mask_right, 0, 0, canvas.width, canvas.height)
    }
  }, [selected])

  return (
    <div className="preview">
      <div className="samples">
        {imgs.map((img, i) => {
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
      <canvas ref={canvasRef} width={1000} height={1000} />
    </div>
  )
})

export default Preview
