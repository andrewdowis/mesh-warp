import React, { useEffect, useRef, useState } from "react"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import * as CanvasColoring from "../../lib/red/CanvasColoring"

import { Button, makeStyles } from "@material-ui/core"

import "./style.scss"

import blank from "../../assets/images/blank.png"

const Status = {
  NONE: null,
  LOADING: "Loading...",
  TEXTURE: "Loading & Applying Texture...",
  TINTING: "Tinting...",
  SATURATION: "Saturation...",
  CONTRAST: "Adding Contrast...",
}

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      padding: "5px 150px",
      textTransform: "capitalize",
      // margin: theme.spacing(1),
    },
    // "&:hover": {
    //   backgroundColor: "#000000",
    // },
  },
  input: {
    display: "none",
  },
}))

const Downloader = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const { layers, texture, title } = props
  const filename = `${title} Product Photo - Separated Style.png`
  const canvasRef = useRef()

  const [status, setStatus] = useState(Status.TEXTURE)
  const [textureCount, setTextureCount] = useState(0)

  const update_status = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 750)
    })
  }

  useEffect(async () => {
    if (texture && status !== undefined) {
      let status_promise = update_status()
      await status_promise

      let next_status
      switch (status) {
        case Status.TEXTURE:
          if (!textureCount) setTextureCount(textureCount + 1)

          CanvasDummyBuilder.refresh(texture)
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
        case Status.NONE:
          break
        default:
          // Loading
          break
      }
      if (next_status !== undefined) setStatus(next_status)
    }
  }, [status, texture])

  useEffect(() => {
    setStatus(Status.TEXTURE)
  }, [texture])

  // useEffect(() => {

  // })

  const downloadBitmap = () => {
    const canvas = document.createElement("canvas")
    canvas.width = canvasRef.current.width
    canvas.height = canvasRef.current.height
    const ctx = canvas.getContext("2d")

    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    ctx.drawImage(canvasRef.current, 0, 0)

    const bitmapData = canvas.toDataURL("image/jpg")

    const image = new Image()

    image.src = bitmapData

    image.onload = () => {
      fetch(image.src, {
        method: "GET",
        headers: {},
      })
        .then(response => {
          response.arrayBuffer().then(function(buffer) {
            const link = document.createElement("a")
            link.href = window.URL.createObjectURL(new Blob([buffer]))
            link.download = filename

            document.body.appendChild(link)
            link.click()

            setTimeout(function() {
              window.URL.revokeObjectURL(link)
              document.body.removeChild(link)
            }, 200)
          })
        })
        .catch(err => {})
    }
  }

  const debug = () => {}

  return (
    <div className="downloader">
      {debug()}
      <div className="image-preview">
        {texture && (
          <>
            <canvas className={status ? "blur" : ""} ref={canvasRef} width={588} height={588} />
            {status && <div className="status">{status}</div>}
          </>
        )}
        {!textureCount && <img src={blank} alt="rock-em-socks" />}
      </div>
      <div className="download-panel">
        <div className="title-container">
          <p>PRODUCT PREVIEW</p>
          <p className="art-title">{title}</p>
        </div>
        <Button
          style={{
            borderRadius: "28px",
            backgroundColor: texture && status === Status.NONE ? "#000000" : "",
            color: texture && status === Status.NONE ? "#D8D8D8" : "",
          }}
          className={classes.root}
          disableElevation
          variant="contained"
          color="default"
          disabled={!(texture && status === Status.NONE)}
          onClick={downloadBitmap}
        >
          Download Hero Image
        </Button>
      </div>
    </div>
  )
})

export default Downloader
