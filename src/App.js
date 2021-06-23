import React, { useEffect, useRef, useState } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
import history from "./history.js"

import Uploader from "./components/Uploader"
import Builder from "./components/Builder"
import Preview from "./components/Preview"
import Gridder from "./components/Gridder"
import Comps from "./components/Comps"

import CanvasDummyBuilder from "./lib/CanvasDummyBuilder"

import "./App.scss"

export const Actions = {
  MOUSE_DOWN: "mousedown",
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
  KEY_DOWN: "keydown",
  KEY_UP: "keyup",
}

export default function App() {
  const assets = [require("./assets/textures/asset_blank.jpg").default]
  const assetData = useRef([])
  const [shiftState, setShiftState] = useState(false)
  const shiftDown = useRef(false)
  const [mouseDown, setMouseDown] = useState(false)

  const uploaderRef = useRef()
  const [bodyRef, setBody] = useState()
  const dotIndexRef = useRef()
  const boundingRect = useRef()
  const mouseDownPos = useRef()
  const mouseCurPos = useRef()
  const iterationsRef = useRef()
  const [forceUpdate, setForceUpdate] = useState()

  const layers = [
    require("./assets/layers/layer_03_base.png").default,
    require("./assets/layers/layer_01.png").default,
    require("./assets/layers/layer_03_base_02.png").default,
    require("./assets/layers/layer_02_multiply.png").default,
    require("./assets/layers/layer_00_safe_zone.png").default,
    // require("./assets/layers/sock_mask_right.png").default,
  ]
  const layerData = useRef([])

  const [sourceBitmapData, setSourceBitmapData] = useState()
  const gridTarget = useRef()

  function handleKeyEvents(event) {
    if (event.keyCode === 16) {
      switch (event.type) {
        case Actions.KEY_UP:
          shiftDown.current = !shiftDown.current
          setShiftState(shiftDown.current)
          break
        default:
          break
      }
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

        if (dotIndexRef.current === Infinity) return

        // const sub = 5
        const sub = shiftState ? 7 : 1
        const { x: downX, y: downY } = mouseDownPos.current
        const { x: boundX, y: boundY } = boundingRect.current

        const nextX = downX - boundX - document.documentElement.scrollLeft + (event.pageX - downX) / sub
        const nextY = downY - boundY - document.documentElement.scrollTop + (event.pageY - downY) / sub
        targetMeshable.updateDot(dotIndexRef.current, nextX, nextY, iterationsRef.current)
        mouseCurPos.current = {
          x: event.pageX,
          y: event.pageY,
        }

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

          setSourceBitmapData(img)
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

  /*

Components:

Comps:    Loads a number of bitmaps and puts them into a grid where they can be quickly compared
            - originally built to compare different warps between the App and Photoshop
Gridder:  Generates a colored grid with custom colors
          -   originally used to instantly generate reference grid mesh images to overlay onto designs
              or use as temporary design meshes

*/

  return (
    <Router history={history}>
      <Switch>
        <Route path="/comps" component={Comps} />
        <Route path="/gridder" component={Gridder} />
        <Route
          path="/builder"
          render={() => (
            <Builder
              sourceBitmapData={sourceBitmapData}
              dispatch={handleMouseEvent}
              forceUpdate={forceUpdate}
              showDots={!mouseDown}
              color={shiftState}
            />
          )}
        />
        <Route path="/preview" component={() => <Preview thumbs={assetData.current} layers={layerData.current} />} />
        <Route exact path="/" component={() => <Uploader ref={uploaderRef} layers={layerData.current} />} />
      </Switch>
    </Router>
  )
}
