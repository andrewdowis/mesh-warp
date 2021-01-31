import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"
import CanvasDummyBuilder from "../../lib/CanvasDummyBuilder"

import "./style.scss"

import { Actions } from "../../App"

const Builder = React.forwardRef((props, ref) => {
  const imgUrl = require("../../assets/textures/asset_01a.jpg").default
  const guideRight = require("../../assets/guides/guide_right_01.jpg").default
  const guideLeft01 = require("../../assets/guides/guide_left_01.jpg").default
  const guideLeft02 = require("../../assets/guides/guide_left_02.jpg").default

  const images = useRef([imgUrl, guideRight, guideLeft01, guideLeft02]).current
  const bitmapData = useRef(new Array(images.length).fill(null)).current

  const [imageArray, setImageArray] = useState()
  const [dummyIndex, setDummyIndex] = useState()
  const [dummy, setDummy] = useState()

  const canvasHolder = useRef()

  useEffect(() => {
    if (!imageArray) {
      // console.log(`%c  ${imgUrl}`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")

      let completed = 0
      function callback() {
        console.log(
          `%c  Looking at ${completed + 1} / ${images.length} loaded`,
          "color: black; background-color: white; font-style: italic; padding: 2px;"
        )
        if (++completed === images.length) {
          CanvasDummyBuilder.init(bitmapData.shift())
          setDummyIndex(0)
        }
      }
      console.warn("IMAGES")
      console.log(images)
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
      console.warn("THIS IS THE DUMMY INDEX", dummyIndex)
      setDummy(CanvasDummyBuilder.dummies[dummyIndex])
    }
  }, [dummyIndex])

  useEffect(() => {
    if (dummy) {
      console.warn("THIS IS THE DUMMY", dummyIndex)
      console.log(dummy.canvas)

      while (canvasHolder.current.childNodes.length)
        canvasHolder.current.removeChild(canvasHolder.current.childNodes[0])

      canvasHolder.current.appendChild(dummy.canvas)
      // CanvasDummyBuilder.dummies.forEach(dum => {
      //   canvasHolder.current.appendChild(dum.canvas)
      //   dum.refresh()
      //   dum.canvas.style.backgroundColor = "lime"
      // })
      // console.warn(CanvasDummyBuilder.dummies)
      // setDummy(CanvasDummyBuilder.dummies[dummy])

      console.log(bitmapData[dummyIndex].src)
    }
  }, [dummy])

  if (!dummy) return null

  return (
    <div className="builder">
      <div>
        <div>THESE ARE THE DUMMIES</div>
        {CanvasDummyBuilder.dummies.map((canvas, index) => {
          return (
            <div
              key={`button_${index}`}
              onClick={() => {
                setDummyIndex(index)
                setDummy(CanvasDummyBuilder.dummies[index])
              }}
            >{`Show Canvas ${index}`}</div>
          )
        })}
      </div>
      {/* <div className="holder"> */}
      <div className="guide">
        <img src={bitmapData[dummyIndex].src} />
        <div className="canvas-holder" ref={canvasHolder}></div>
      </div>
      {/* </div> */}
    </div>
  )
})

export default Builder
