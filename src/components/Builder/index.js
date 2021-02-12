import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Builder = React.forwardRef((props, ref) => {
  const { sourceBitmapData, dispatch } = props

  const guideRight = require("../../assets/guides/guide_right_32x32.jpg").default
  const guideLeft01 = require("../../assets/guides/guide_left_01_32x32.jpg").default
  const guideLeft02 = require("../../assets/guides/guide_left_02_32x32.jpg").default

  const images = useRef([guideRight, guideLeft01, guideLeft02]).current
  const bitmapData = useRef(new Array(images.length).fill(null)).current

  const [imageArray, setImageArray] = useState()
  const [dummyIndex, setDummyIndex] = useState()
  const [dummy, setDummy] = useState()
  const [meshOpacity, setMeshOpacity] = useState(1)
  const [transparency, setTransparency] = useState(false)
  const [showDots, setShowDots] = useState(true)
  const [wireframeOpacity, setWireframeOpacity] = useState(1)
  const [iterations, setIterations] = useState(-1)
  const prevIteration = useRef(iterations)
  const [controlPoints, setControlPoints] = useState([])

  const gridItems = useRef([]).current

  const [forceUpdate, setForceUpdate] = useState()

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

          setDummyIndex(2)
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

      dummy.refresh()
      // canvasHolder.current.appendChild(dummy.meshCanvas.filler)
      canvasHolder.current.appendChild(dummy.meshCanvas.output)
      canvasHolder.current.appendChild(dummy.meshCanvas.wireframe)

      dummy.meshCanvas.output.style.opacity = meshOpacity
      dummy.meshCanvas.wireframe.style.opacity = wireframeOpacity

      console.log("calling iterations")
      setTimeout(updateIterations, 100)
    }
  }, [dummy])

  useEffect(() => {
    if (dummy) {
      dummy.meshCanvas.output.style.opacity = meshOpacity
    }
  }, [meshOpacity])

  useEffect(() => {
    if (dummy) {
      dummy.meshCanvas.wireframe.style.opacity = wireframeOpacity
    }
  }, [wireframeOpacity])

  function updateIterations(add_or_subtract) {
    let next
    switch (add_or_subtract) {
      case "+":
      case "add":
        next = Math.min(6, iterations + 1)
        break
      default:
        next = Math.max(0, iterations - 1)
        break
    }

    const square = Math.pow(2, next)

    let cols = dummy.meshCanvas.gridManager.columns
    let rows = dummy.meshCanvas.gridManager.rows

    if (square > rows || square > cols) {
      console.error("NOPE")
      return
    }

    updateControlPoints(next)
    setIterations(next)

    prevIteration.current = next
  }

  useEffect(() => {
    if (dummy && iterations === 0 && prevIteration.current < 0) {
      prevIteration.current = iterations
      updateIterations()
    }
  }, [iterations])

  function updateControlPoints(next) {
    next = next >= 0 ? next : iterations
    let cols = dummy.meshCanvas.gridManager.columns
    let rows = dummy.meshCanvas.gridManager.rows

    const square = Math.pow(2, next)

    cols /= square
    rows /= square

    const cols1 = dummy.meshCanvas.gridManager.gCols
    let viewPoints = []
    dummy.meshCanvas.gridManager.positions.forEach(coord => {
      coord.isControl = false
    })
    console.clear()
    if (dummy.meshCanvas.gridManager.positions.length === 4) {
      viewPoints = [0, 1, 2, 3]
    } else {
      for (let i = 0; i < dummy.meshCanvas.gridManager.positions.length; i += cols * cols1) {
        let point = dummy.meshCanvas.gridManager.positions[i]
        point.isControl = true
        viewPoints.push(i)

        for (let c = rows; c < cols1; c += rows) {
          point = dummy.meshCanvas.gridManager.positions[i + c]
          point.isControl = true
          viewPoints.push(i + c)
        }
      }
    }
    dummy.meshCanvas.gridManager.setControlPoints(viewPoints)
    setControlPoints(viewPoints)
  }

  useEffect(() => {
    if (dummy) updateControlPoints()
  }, [props.forceUpdate])

  function getControls(type) {
    // return null
    return (
      <div className="controls">
        <div className="button-holder">
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
              setMeshOpacity(+!meshOpacity)
            }}
          >
            <p>{`${!meshOpacity ? "Show" : "Hide"} Mesh Warp`}</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              setWireframeOpacity(+!wireframeOpacity)
            }}
          >
            <p>{`${!wireframeOpacity ? "Show" : "Hide"} Wireframe`}</p>
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
              const next_opacity = meshOpacity === 1 ? 0.55 : 1
              setTransparency(next_opacity)
              setMeshOpacity(next_opacity)
            }}
          >
            <p>Toggle Transparency</p>
          </div>
        </div>
        <div className="button-holder">
          <div className="button-input">
            <div
              className="button"
              onClick={() => {
                dummy.updateQuantity("+")
                updateControlPoints(iterations)
                setForceUpdate(Math.random())
              }}
            >
              <p>Double Points</p>
            </div>
            <div
              className="button"
              onClick={() => {
                dummy.updateQuantity("-")
                updateControlPoints(iterations)
                setForceUpdate(Math.random())
              }}
            >
              <p>Half Points</p>
            </div>
          </div>
          <div className="button-input">
            <p>{`Iterations: ${Math.pow(2, iterations)}`}</p>
            <div
              className="iterate-button"
              onClick={() => {
                updateIterations("+")
              }}
            >
              +
            </div>
            <div
              className="iterate-button"
              onClick={() => {
                updateIterations("-")
              }}
            >
              -
            </div>
          </div>
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
                output += `{ "x": ${coord.x}, "y": ${coord.y}, "i": ${coord.i}, "isControl": ${coord.isControl ||
                  false} }`
                if (gm.positions[index + 1]) output += ", "
              })

              output += `], "rootPositions": [ `
              gm.rootPositions.forEach((coord, index) => {
                output += `{ "x": ${coord.x}, "y": ${coord.y}, "i": ${coord.i} }`
                if (gm.positions[index + 1]) output += ", "
              })

              // output += `], "viewPoints": [ `
              // controlPoints.forEach(index => {
              //   output += index
              //   if (gm.positions[index + 1]) output += ", "
              // })
              output += "]}"

              console.clear()
              console.log(output)

              // width: ${GridManager.width}, height: ${GridManager.height}, width: ${GridManager.width}, height: ${GridManager.height},  `
            }}
          >
            <p>Output Points</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dummy) return null

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
          <div className="canvas-holder" ref={canvasHolder}></div>

          <div
            ref={dotsHolder}
            id="dots-holder"
            className="dots-holder"
            onMouseDown={event => {
              dispatch(event, Infinity, dummyIndex, dotsHolder.current)
            }}
            style={{
              opacity: +showDots,
              width: dummy.meshCanvas.output.width,
              height: dummy.meshCanvas.output.height,
            }}
          >
            <>
              {controlPoints.map(index => {
                return (
                  <div
                    onMouseDown={event => {
                      dispatch(event, index, dummyIndex, dotsHolder.current, Math.pow(2, iterations))
                    }}
                    key={`dot_${index}`}
                    className="grid-dot"
                    style={{
                      left: dummy.meshCanvas.gridManager.positions[index].x,
                      top: dummy.meshCanvas.gridManager.positions[index].y,
                    }}
                  >
                    <div className="cross-01" />
                    <div className="cross-02" />
                    {/* <p>{index}</p> */}
                  </div>
                )
              })}
              {/* {dummy.meshCanvas.gridManager.positions
                .filter((point, index) => !controlPoints.includes(index))
                .map((point, index) => {
                  return (
                    <div
                      key={`dot_${point.i}`}
                      className="grid-dot-small"
                      style={{
                        left: point.x,
                        top: point.y,
                      }}
                    >
                      <p>{point.i}</p>
                    </div>
                  )
                })} */}
            </>
            {/* </div> */}
          </div>
        </div>
      </div>
      {getControls()}
    </div>
  )
})

export default Builder
