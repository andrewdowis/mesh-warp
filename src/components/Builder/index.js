import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Builder = React.forwardRef((props, ref) => {
  const { sourceBitmapData } = props

  const guideRight = require("../../assets/guides/guide_right_01.jpg").default
  const guideLeft01 = require("../../assets/guides/guide_left_01.jpg").default
  const guideLeft02 = require("../../assets/guides/guide_left_02.jpg").default

  const images = useRef([guideRight, guideLeft01, guideLeft02]).current
  const bitmapData = useRef(new Array(images.length).fill(null)).current

  const [imageArray, setImageArray] = useState()
  const [dummyIndex, setDummyIndex] = useState()
  const [dummy, setDummy] = useState()

  const gridItems = useRef([]).current

  const canvasHolder = useRef()
  const dotsHolder = useRef()

  useEffect(() => {})

  useEffect(() => {
    if (!imageArray) {
      let completed = 0
      function callback() {
        if (++completed === images.length) {
          if (CanvasDummyBuilder.meshables[0].parent) {
            gridItems.current = CanvasDummyBuilder.meshables.map((dummy, i) => {
              const gridManager = new GridManager()
              const { parent } = dummy

              gridManager.init(parent.width, parent.height, 2, 2)
              console.log(`%c WAS`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
              console.log(CanvasDummyBuilder.meshables[i])
              CanvasDummyBuilder.meshables[i] = dummy.initMesh(gridManager)
              console.log(`%c is now`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
              console.log(CanvasDummyBuilder.meshables[i])

              return gridManager
            })
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
      console.log("THESE ARE THE GRID IRONS")
      console.log(gridItems.current)
      console.log("SETTING DUMM TO", dummyIndex)
      console.log(CanvasDummyBuilder.meshables)
      setDummy(CanvasDummyBuilder.meshables[dummyIndex])
    }
  }, [dummyIndex])

  useEffect(() => {
    if (dummy) {
      console.log(dummy)

      console.log("THIS IS THE NEW DUMMY, DUMMY")
      while (canvasHolder.current.childNodes.length)
        canvasHolder.current.removeChild(canvasHolder.current.childNodes[0])

      console.log(`%c appending`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
      console.log(dummy.output)
      console.log(dummy.wireframe)
      canvasHolder.current.appendChild(dummy.output)
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
        <div className="button-holder right-side">
          <div
            className="button"
            onClick={() => {
              // console.clear()
              // console.log(`%c Save points`, "color: black; background-color: lime; font-style: italic; padding: 2px;")
              // const attributes = ["width", "height", "columns", "rows"]
              // let output = "{ positions: ["
              // GridManager.positions.forEach((coord, index) => {
              //   output += `{ x: ${coord.x}, y: ${coord.y} }`
              //   if (GridManager.positions[index + 1]) output += ", "
              // })
              // output += "]"
              // attributes.forEach(attribute => {
              //   output += `, ${attribute}: ${GridManager[attribute]}`
              // })
              // // width: ${GridManager.width}, height: ${GridManager.height}, width: ${GridManager.width}, height: ${GridManager.height},  `
              // console.log(GridManager.positions)
              // console.log(output)
            }}
          >
            <p>Output Points</p>
          </div>
        </div>
      </div>
      {/* <div className="holder"> */}
      <div className="guide">
        <img src={bitmapData[dummyIndex].src} />
        <div className="canvas-holder" ref={canvasHolder}></div>
        <div
          ref={dotsHolder}
          id="dots-holder"
          className="dots-holder"
          style={{
            width: dummy.output.width,
            height: dummy.output.height,
          }}
        >
          {gridItems.current[dummyIndex].positions.map((coord, index) => {
            console.log(index, coord)
            return (
              <div
                onMouseDown={event => {
                  console.log("MOUSE DOWN YO")
                  // dispatch(event, index)
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
      {/* </div> */}
    </div>
  )
})

export default Builder
