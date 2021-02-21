import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Builder = React.forwardRef((props, ref) => {
  const { sourceBitmapData, dispatch } = props

  const guideRight = require("../../assets/guides/guide_right_01.jpg").default
  const guideLeft01 = require("../../assets/guides/guide_left_01.jpg").default
  const guideLeft02 = require("../../assets/guides/guide_left_02.jpg").default

  const images = useRef([guideRight, guideLeft01, guideLeft02]).current
  const bitmapData = useRef(new Array(images.length).fill(null)).current

  const [imageArray, setImageArray] = useState()
  const [dummyIndex, setDummyIndex] = useState()
  const [dummy, setDummy] = useState()
  const [opacity, setOpacity] = useState(1)
  const [showDots, setShowDots] = useState(true)
  const [wireframeOpacity, setWireframeOpacity] = useState(1)

  const gridItems = useRef([]).current

  const canvasHolder = useRef()
  const dotsHolder = useRef()

  useEffect(() => {
    if (!imageArray) {
      let completed = 0
      function callback() {
        if (++completed === images.length) {
          // if (CanvasDummyBuilder.meshables[0].parent) {
          // gridItems.current = CanvasDummyBuilder.meshables.map((dummy, i) => {
          //   const gridManager = new GridManager()
          //   const { parent } = dummy
          //   gridManager.init(parent.width, parent.height, 2, 2)
          //   CanvasDummyBuilder.meshables[i] = dummy.initMesh(gridManager)
          //   return gridManager
          // })
          // }

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

  useEffect(() => {
    console.log(`%c  ${wireframeOpacity}`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
    if (dummy) {
      dummy.meshCanvas.wireframe.style.opacity = wireframeOpacity
    }
  }, [wireframeOpacity])

  if (!dummy) return null

  // function getControls(type) {
  //   const number = dummy.meshCanvas.gridManager[type]
  //   const dummies
  //   switch (type) {
  //     case "columns":
  //       return <div className="controls-column"></div>
  //       break
  //   }
  // }

  return (
    <div className="builder">
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
          {showDots && (
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
              {/* <div className="controls">{getControls("columns")}</div> */}
              {/* <div> */}
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
                  >
                    <div className="cross-01" />
                    <div className="cross-02" />
                    <p>{index}</p>
                  </div>
                )
              })}
              {/* </div> */}
            </div>
          )}
        </div>
      </div>
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
            <p>{`${!opacity ? "Show" : "Hide"} Mesh Warp`}</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setWireframeOpacity(+!wireframeOpacity)
            }}
          >
            <p>{`${wireframeOpacity ? "Show" : "Hide"} Wireframe`}</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setShowDots(!showDots)
            }}
          >
            <p>{`${!showDots ? "Show" : "Hide"} Dots`}</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setOpacity(opacity === 1 ? 0.55 : 1)
            }}
          >
            <p>Toggle Transparency</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              console.clear()
              console.warn("Doubling points")
              const gm = dummy.meshCanvas.gridManager
              const columns = gm.columns + 1
              const new_01 = []
              const new_02 = []
              const new_03 = []
              let fill_type = "across"
              let additional = 0
              let balls = 0
              const final = []
              for (let i = 0; i < gm.positions.length; i++) {
                // if (i === 5) break
                if (i && i % (gm.columns + additional) === 0) {
                  if (fill_type === "across") {
                    i -= gm.columns
                    additional = 1
                    fill_type = "down"
                  } else if (fill_type === "down") {
                    i -= gm.columns + additional
                    additional = 0
                    fill_type = "middle"
                  } else {
                    fill_type = "across"
                    i = 4
                    console.warn("break")
                    // console.error(`i is going to be ${i + 1}`)
                  }
                }
                console.log("\t is", fill_type, i, gm.positions.length)

                if (balls++ > 50) break
                continue
                console.warn("Direction:", fill_type)
                switch (fill_type) {
                  case "across":
                    new_01.push((i + (i + 1)) / 2)
                    break
                  case "down":
                    console.warn("\t adding", i, columns)
                    new_02.push((i + (i + columns)) / 2)
                    break
                  default:
                    console.warn(i, i + 1, i + columns, i + columns + 1)
                    new_03.push((i + (i + columns) + (i + 1) + (i + columns + 1)) / 4)
                    break
                }
              }
              const new_00 = gm.positions.map((pos, i) => i)
              console.log(new_00)
              console.log(new_01)
              console.log(new_02)
              console.log(new_03)

              const flip_at = columns + gm.columns
              fill_type = "across"
              let counter = gm.positions.length + new_01.length + new_02.length + new_03.length + 10
              let next
              console.warn("\r\r.... con-tin-ue")
              console.log(gm.positions.length + new_01.length + new_02.length + new_03.length)
              let tick = 0
              return
              while (new_00.length && new_01.length && new_02.length && new_03.length) {
                console.warn("\t", tick++, fill_type)
                console.log("\t\t", new_00.length + new_01.length + new_02.length + new_03.length)

                switch (fill_type) {
                  case "across":
                    next = new_00.shift()
                    // console.log(next)
                    if (next >= 0) final.push(next)

                    next = new_01.shift()
                    // console.log(next)
                    if (next >= 0) final.push(next)

                    if (tick > 0 && tick % flip_at === 0) fill_type = "down"
                    break
                  case "down":
                    next = new_02.shift()
                    if (next >= 0) final.push(next)

                    next = new_03.shift()
                    if (next >= 0) final.push(next)

                    if (tick > 0 && tick % flip_at === 0) fill_type = "across"
                    break

                  default:
                    break
                }
                if (--counter <= 0) {
                  console.error("STOP IT")
                  break
                }
              }
              console.warn(final)
              // width: ${GridManager.width}, height: ${GridManager.height}, width: ${GridManager.width}, height: ${GridManager.height},  `
            }}
          >
            <p>Double Points</p>
          </div>
          <div
            className="button"
            onClick={() => {
              console.clear()
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
    </div>
  )
})

export default Builder
