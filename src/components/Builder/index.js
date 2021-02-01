import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Builder = React.forwardRef((props, ref) => {
  const { sourceBitmapData, layers, dispatch } = props

  const guideRight = require("../../assets/guides/guide_right_01.jpg").default
  const guideLeft01 = require("../../assets/guides/guide_left_01.jpg").default
  const guideLeft02 = require("../../assets/guides/guide_left_02.jpg").default

  const images = useRef([guideRight, guideLeft01, guideLeft02]).current
  const bitmapData = useRef(new Array(images.length).fill(null)).current

  const [imageArray, setImageArray] = useState()
  const [dummyIndex, setDummyIndex] = useState()
  const [dummy, setDummy] = useState()
  const [opacity, setOpacity] = useState(1)

  const gridItems = useRef([]).current

  const canvasHolder = useRef()
  const dotsHolder = useRef()

  useEffect(() => {
    if (!imageArray) {
      let completed = 0
      function callback() {
        if (++completed === images.length) {
          if (CanvasDummyBuilder.meshables[0].parent) {
            // gridItems.current = CanvasDummyBuilder.meshables.map((dummy, i) => {
            //   const gridManager = new GridManager()
            //   const { parent } = dummy
            //   gridManager.init(parent.width, parent.height, 2, 2)
            //   CanvasDummyBuilder.meshables[i] = dummy.initMesh(gridManager)
            //   return gridManager
            // })
          }

          setDummyIndex(0)
        }
      }

      images.forEach((url, index) => {
        const img = new Image()
        img.src = url

        bitmapData[index] = img

        img.onload = callback
      })
    }
  }, [imageArray])

  useEffect(() => {
    if (dummyIndex >= 0) {
      setDummy(CanvasDummyBuilder.meshables[dummyIndex])
    }
  }, [dummyIndex])

  useEffect(() => {
    if (dummy) {
      while (canvasHolder.current.childNodes.length)
        canvasHolder.current.removeChild(canvasHolder.current.childNodes[0])

      console.log("DUMMY IS NOW")
      console.log(dummy)
      dummy.refresh()
      canvasHolder.current.appendChild(dummy.meshCanvas.output)
      canvasHolder.current.appendChild(dummy.meshCanvas.wireframe)
    }
  }, [dummy])

  if (!dummy) return null

  return (
    <div className="builder">
      <div className="controls">
        <div className="button-holder">
          <div>THESE ARE THE DUMMIES</div>
          {CanvasDummyBuilder.meshables.map((ignore, index) => {
            return (
              <div
                className="button"
                key={`button_${index}`}
                onClick={() => {
                  setDummyIndex(index)
                  setDummy(CanvasDummyBuilder.meshables[index])
                }}
              >{`Show Canvas ${index}`}</div>
            )
          })}
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setOpacity(opacity ? 0 : 1)
            }}
          >
            <p>Toggle Visibility</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setOpacity(opacity === 1 ? 0.5 : 1)
            }}
          >
            <p>Toggle Transparency</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              const attributes = ["width", "height", "columns", "rows"]
              let output = `{ `
              const gm = dummy.meshCanvas.gridManager
              attributes.forEach(attribute => {
                output += `"${attribute}": ${gm[attribute]} , `
              })
              output += `"positions": [ `
              gm.positions.forEach((coord, index) => {
                output += `{ "x": ${coord.x}, "y": ${coord.y} }`
                if (gm.positions[index + 1]) output += ", "
              })
              output += `], "rootPositions": [ `

              gm.rootPositions.forEach((coord, index) => {
                output += `{ "x": ${coord.x}, "y": ${coord.y} }`
                if (gm.positions[index + 1]) output += ", "
              })
              output += "]"

              output += "}"
              console.log(output)
              // width: ${GridManager.width}, height: ${GridManager.height}, width: ${GridManager.width}, height: ${GridManager.height},  `
            }}
          >
            <p>Output Points</p>
          </div>
        </div>
      </div>
      <div className="holder">
        <div
          className="guide"
          style={{
            width: dummy.meshCanvas.output.width + 200,
            height: dummy.meshCanvas.output.height + 200,
          }}
        >
          <img draggable={false} src={bitmapData[dummyIndex].src} alt={`guide`} />
          <div
            className="canvas-holder"
            ref={canvasHolder}
            style={{
              opacity,
            }}
          ></div>
          <div
            ref={dotsHolder}
            id="dots-holder"
            className="dots-holder"
            onMouseDown={event => {
              dispatch(event, Infinity, dummyIndex, dotsHolder.current)
            }}
            style={{
              width: dummy.meshCanvas.output.width,
              height: dummy.meshCanvas.output.height,
            }}
          >
            {dummy.meshCanvas.gridManager.positions.map((coord, index) => {
              return (
                <div
                  onMouseDown={event => {
                    dispatch(event, index, dummyIndex, dotsHolder.current)
                  }}
                  key={`dot_${index}`}
                  className="grid-dot"
                  style={{
                    left: coord.x,
                    top: coord.y,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
})

export default Builder
