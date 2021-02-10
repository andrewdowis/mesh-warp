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

      dummy.refresh()
      // canvasHolder.current.appendChild(dummy.meshCanvas.filler)
      canvasHolder.current.appendChild(dummy.meshCanvas.output)
      canvasHolder.current.appendChild(dummy.meshCanvas.wireframe)

      dummy.meshCanvas.wireframe.style.opacity = wireframeOpacity

      console.log("calling iterations")
      setIterations(1)
    }
  }, [dummy])

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

    console.warn("EXT", next)
    updateControlPoints(next)
    // console.table(dummy.meshCanvas.gridManager.positions)
    // console.table(viewPoints)

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

    const cols1 = dummy.meshCanvas.gridManager.columns + 1
    const rows1 = dummy.meshCanvas.gridManager.rows + 1
    // let index = 0
    // const viewPoints = [dummy.meshCanvas.gridManager.positions[0]]
    const viewPoints = []
    controlPoints.forEach(index => {
      dummy.meshCanvas.gridManager.positions[index].isControl = false
    })
    for (let i = 0; i < dummy.meshCanvas.gridManager.positions.length; i += cols * cols1) {
      // index = i
      let point = dummy.meshCanvas.gridManager.positions[i]
      point.isControl = true
      viewPoints.push(i)

      for (let c = rows; c < cols1; c += rows) {
        point = dummy.meshCanvas.gridManager.positions[i + c]
        point.isControl = true
        viewPoints.push(i + c)
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
              setOpacity(opacity ? 0 : transparency)
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
              const next_opacity = opacity === 1 ? 0.55 : 1
              setTransparency(next_opacity)
              setOpacity(next_opacity)
            }}
          >
            <p>Toggle Transparency</p>
          </div>
        </div>
        <div className="button-holder">
          <div
            className="button"
            onClick={() => {
              const gm = dummy.meshCanvas.gridManager
              const columns = gm.columns + 1

              const old_points = gm.positions
              const new_points_01_columns = []
              const new_points_02_rows = []
              const new_points_03_square = []
              const new_points = []

              function getAverage(...indexes) {
                let x = 0
                let y = 0
                indexes.forEach(index => {
                  x += old_points[index].x
                  y += old_points[index].y
                })
                x /= indexes.length
                y /= indexes.length

                return { x, y }
              }

              for (let i = 0; i < old_points.length; i++) {
                if (i + columns < old_points.length) new_points_02_rows.push(getAverage(i, i + columns))
                if (i % columns !== gm.columns) {
                  if (i + 1 < old_points.length) new_points_01_columns.push(getAverage(i, i + 1))
                  if (i + columns < old_points.length)
                    new_points_03_square.push(getAverage(i, i + 1, i + columns, i + columns + 1))
                }
              }

              let direction = "across"
              const col_total = gm.columns + columns
              function pushNew(array1, array2, nextValue) {
                for (let i = 0; i < col_total; i++) {
                  if (i % 2) {
                    new_points.push(array1.shift())
                  } else {
                    new_points.push(array2.shift())
                  }

                  new_points[new_points.length - 1].i = new_points.length - 1
                  if (i === col_total - 1) direction = nextValue
                }
              }
              while (
                old_points.length +
                new_points_01_columns.length +
                new_points_02_rows.length +
                new_points_03_square.length
              ) {
                switch (direction) {
                  case "across":
                    pushNew(new_points_01_columns, old_points, "middle")
                    break
                  case "middle":
                    pushNew(new_points_03_square, new_points_02_rows, "across")

                    break
                  default:
                    break
                }
              }
              dummy.doublePoints(new_points)
              setForceUpdate(Math.random())
            }}
          >
            <p>Double Points</p>
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
                output += `{ "x": ${coord.x}, "y": ${coord.y} }`
                if (gm.positions[index + 1]) output += ", "
              })
              output += `], "rootPositions": [ `

              gm.rootPositions.forEach((coord, index) => {
                output += `{ "x": ${coord.x}, "y": ${coord.y} }`
                if (gm.positions[index + 1]) output += ", "
              })
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
              opacity: +showDots,
              width: dummy.meshCanvas.output.width,
              height: dummy.meshCanvas.output.height,
            }}
          >
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
                  <p>{index}</p>
                </div>
              )
            })}
            {/* </div> */}
          </div>
        </div>
      </div>
      {getControls()}
    </div>
  )
})

export default Builder
