/*

MAIN COMP:
  Comp: 1000x1000
  Guide: 1200x1200


RIGHT SOCK:
  Canvas 1 (lives on main comp):
    294x971
      Bitmap Data Drawn into Canvas:
        x: -4, y: -2
        590x975

LEFT SOCK:
  Canvas 1 (initial warping used in Canvas 2):
    297x974
      Bitmap Data Drawn into Canvas:
        x: -293 (Align.RIGHT), y: -1
        590x975
      Guide:
        487x1140
  Canvas 2 (lives on main comp, warps Canvas 1):
    287x940
*/

import React, { useEffect, useRef, useState } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
import history from "./history.js"

import Builder from "./components/Builder"
import Preview from "./components/Preview"
import Gridder from "./components/Gridder"
import Comps from "./components/Comps"
import Uploader from "./components/Uploader"

import CanvasDummyBuilder from "./lib/CanvasDummyBuilder"

import rockEmLogo from "./assets/images/rock-em-logo.svg"

import "./App.scss"

export const Actions = {
  MOUSE_DOWN: "mousedown",
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
  KEY_DOWN: "keydown",
  KEY_UP: "keyup",
}

export default function App() {
  const [bodyRef, setBody] = useState()

  const dotIndexRef = useRef()
  const boundingRect = useRef()
  const mouseDownPos = useRef()
  const mouseCurPos = useRef()
  const iterationsRef = useRef()
  const [forceUpdate, setForceUpdate] = useState()

  const assets = [
    require("./assets/textures/asset_blank.jpg").default,
    // require("./assets/textures/asset_bp2.jpg").default,
    // require("./assets/textures/lxl_bp.png").default,
    // require("./assets/textures/lxl_wildcats.png").default,
    // require("./assets/textures/asset_01a.jpg").default,
    // require("./assets/textures/asset_01.jpg").default,
    // require("./assets/textures/asset_02.jpg").default,
    // require("./assets/textures/asset_03.jpg").default,
    // require("./assets/textures/asset_04.jpg").default,
    // require("./assets/textures/asset_looney2.jpg").default,
    // require("./assets/textures/asset_tmnt2.jpg").default,
    // require("./assets/textures/grids_01.jpg").default,
    // require("./assets/textures/grids_02.jpg").default,
  ]
  const assetData = useRef([])
  const [shiftState, setShiftState] = useState(false)
  const shiftDown = useRef(false)
  const [mouseDown, setMouseDown] = useState(false)

  const layers = [
    require("./assets/layers/layer_03_base.png").default,
    require("./assets/layers/layer_01.png").default,
    require("./assets/layers/layer_02_multiply.png").default,
    require("./assets/layers/layer_03_base_02.png").default,
    require("./assets/layers/sock_mask_left.png").default,
    require("./assets/layers/sock_mask_right.png").default,
  ]
  const layerData = useRef([])

  // const whatever = useRef()

  const [sourceBitmapData, setSourceBitmapData] = useState()

  const gridTarget = useRef()

  function handleKeyEvents(event) {
    if (event.keyCode === 16) {
      let next
      switch (event.type) {
        // case Actions.KEY_DOWN:
        //   mouseDownPos.current = {
        //     ...mouseCurPos.current,
        //   }
        //   next = true
        //   break
        case Actions.KEY_UP:
          shiftDown.current = !shiftDown.current
          setShiftState(shiftDown.current)
          // next = false
          break
        default:
          break
      }
      // if (next !== null) {
      //   shiftDown.current = next
      //   setShiftState(next)
      //   // event.target.style.cursor = next ? "none" : "default"
      // }
    }
  }

  ////////////////////////////////////////////////////////////

  function handleMouseEvent(event, index, dummyIndex, parent, iterations) {
    event.preventDefault()
    event.stopPropagation()
    switch (event.type) {
      case Actions.MOUSE_DOWN:
        if (index === Infinity) return

        bodyRef.addEventListener(Actions.MOUSE_MOVE, handleMouseEvent, false)
        bodyRef.addEventListener(Actions.MOUSE_UP, handleMouseEvent, false)
        bodyRef.style.cursor = "none"
        gridTarget.current = dummyIndex
        dotIndexRef.current = index
        boundingRect.current = parent.getBoundingClientRect()
        iterationsRef.current = iterations

        mouseDownPos.current = {
          x: event.pageX,
          y: event.pageY,
        }
        setMouseDown(true)

        break
      case Actions.MOUSE_UP:
        bodyRef.removeEventListener(Actions.MOUSE_MOVE, handleMouseEvent, false)
        bodyRef.removeEventListener(Actions.MOUSE_UP, handleMouseEvent, false)
        bodyRef.style.cursor = "default"
        gridTarget.current = null
        dotIndexRef.current = null
        boundingRect.current = null
        mouseDownPos.current = null
        setMouseDown(false)
        break
      case Actions.MOUSE_MOVE:
        const targetMeshable = CanvasDummyBuilder.meshables[gridTarget.current]

        // Infinity means move everything as a large group
        // if (dotIndexRef.current === Infinity) {
        //   targetMeshable.meshCanvas.gridManager.positions.forEach((coord, i) => {
        //     // console.log(i, targetMeshable.updateDot)
        //     targetMeshable.updateDot(
        //       i,
        //       coord.x - (downX - event.pageX),
        //       coord.y - (downY - event.pageY),
        //       iterations
        //     )
        //   })
        //   mouseDownPos.current = {
        //     x: event.pageX,
        //     y: event.pageY,
        //   }
        // } else {
        if (dotIndexRef.current === Infinity) return

        const sub = shiftState ? 7 : 1
        const { x: downX, y: downY } = mouseDownPos.current
        const { x: boundX, y: boundY } = boundingRect.current

        const nextX = downX - boundX - document.documentElement.scrollLeft + (event.pageX - downX) / sub
        const nextY = downY - boundY - document.documentElement.scrollTop + (event.pageY - downY) / sub
        targetMeshable.updateDot(
          dotIndexRef.current,
          nextX,
          nextY,
          // event.pageX - boundX,
          // event.pageY - boundY - document.documentElement.scrollTop,
          iterationsRef.current
        )
        mouseCurPos.current = {
          x: event.pageX,
          y: event.pageY,
        }
        // }
        setForceUpdate(Math.random())
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!bodyRef) {
      const ref = document.getElementsByTagName("body")[0]
      // ref.addEventListener(Actions.KEY_DOWN, handleKeyEvents, false)
      ref.addEventListener(Actions.KEY_UP, handleKeyEvents, false)
      setBody(ref)
    }
  }, [bodyRef])

  ////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!sourceBitmapData) {
      let completed = 0
      function callback() {
        if (++completed === assets.length + layers.length) {
          const img = assetData.current[0]

          // setTimeout(() => {
          setSourceBitmapData(img)
          // }, 1000)
          CanvasDummyBuilder.init(img)
        }
      }

      assets.forEach((url, i) => {
        const img = new Image()
        img.src = url

        img.onload = () => {
          assetData.current[i] = img
          callback()
        }
      })
      layers.forEach((url, i) => {
        const img = new Image()
        img.src = url

        img.onload = () => {
          layerData.current[i] = img
          callback()
        }
      })
    }
  }, [sourceBitmapData])

  if (!sourceBitmapData) return <div className="loading">LOADING!</div>

  return (
    <>
      <div className="section-header">
        <img src={rockEmLogo} alt="rock-em-logo" />
        <p>3D Mocker</p>
      </div>
      <Uploader layers={layerData.current} />
    </>
  )
}
