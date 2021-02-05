import React, { useEffect, useRef, useState, useReducer } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
import history from "./history.js"

import Builder from "./components/Builder"
import Preview from "./components/Preview"
// import CanvasDrawer from "./components/CanvasDrawer"
// import MeshDrawer from "./components/MeshDrawer"
// import Grid from "./components/Grid"
import CanvasDummyBuilder from "./lib/CanvasDummyBuilder"

import "./App.scss"
// import GridManager from "./lib/GridManager"

export const Actions = {
  MOUSE_DOWN: "mousedown",
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
}

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

export default function App() {
  const [bodyRef, setBody] = useState()

  const dotIndexRef = useRef()
  const boundingRect = useRef()
  const mouseDownPos = useRef()
  const [forceUpdate, setForceUpdate] = useState()

  const assets = [
    // require("./assets/textures/asset_01a.jpg").default,
    require("./assets/textures/asset_01.jpg").default,
    require("./assets/textures/asset_02.jpg").default,
    require("./assets/textures/asset_03.jpg").default,
    require("./assets/textures/asset_04.jpg").default,
    require("./assets/textures/asset_looney2.jpg").default,
    require("./assets/textures/asset_bp2.jpg").default,
    require("./assets/textures/asset_tmnt2.jpg").default,
  ]
  const assetData = useRef([])

  const layers = [
    require("./assets/layers/layer_01.png").default,
    require("./assets/layers/layer_02_multiply.png").default,
    require("./assets/layers/layer_03_base.png").default,
    require("./assets/layers/sock_mask_left.png").default,
    require("./assets/layers/sock_mask_right.png").default,
  ]
  const layerData = useRef([])

  // const whatever = useRef()

  const [sourceBitmapData, setSourceBitmapData] = useState()

  const canvasHolder = useRef()

  const gridTarget = useRef()

  ////////////////////////////////////////////////////////////

  function handleMouseEvent(event, index, dummyIndex, parent) {
    event.preventDefault()
    event.stopPropagation()
    switch (event.type) {
      case Actions.MOUSE_DOWN:
        bodyRef.addEventListener(Actions.MOUSE_MOVE, handleMouseEvent, false)
        bodyRef.addEventListener(Actions.MOUSE_UP, handleMouseEvent, false)
        gridTarget.current = dummyIndex
        dotIndexRef.current = index
        boundingRect.current = parent.getBoundingClientRect()

        mouseDownPos.current = {
          x: event.pageX,
          y: event.pageY,
        }

        break
      case Actions.MOUSE_UP:
        bodyRef.removeEventListener(Actions.MOUSE_MOVE, handleMouseEvent, false)
        bodyRef.removeEventListener(Actions.MOUSE_UP, handleMouseEvent, false)
        gridTarget.current = null
        dotIndexRef.current = null
        boundingRect.current = null
        mouseDownPos.current = null
        break
      case Actions.MOUSE_MOVE:
        const targetMeshable = CanvasDummyBuilder.meshables[gridTarget.current]
        if (dotIndexRef.current === Infinity) {
          targetMeshable.meshCanvas.gridManager.positions.forEach((position, i) => {
            // console.log(i, targetMeshable.updateDot)
            targetMeshable.updateDot(
              i,
              position.x - (mouseDownPos.current.x - event.pageX),
              position.y - (mouseDownPos.current.y - event.pageY)
            )
          })
          mouseDownPos.current = {
            x: event.pageX,
            y: event.pageY,
          }
        } else {
          targetMeshable.updateDot(
            dotIndexRef.current,
            event.pageX - boundingRect.current.x,
            event.pageY - boundingRect.current.y - document.documentElement.scrollTop
          )
        }
        // GridManager.updateDot(dotIndexRef.current, event.pageX, event.pageY)
        setForceUpdate(Math.random())
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!bodyRef) {
      setBody(document.getElementsByTagName("body")[0])
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

  // return (
  //   <div>
  //     <div ref={canvasHolder} />
  //   </div>
  // )

  if (!sourceBitmapData) return <div className="loading">LOADING!</div>

  // return <div ref={whatever} />
  return (
    <Router history={history}>
      <Switch>
        <Route
          path="/admin"
          // path="/"
          render={props => {
            return <Builder sourceBitmapData={sourceBitmapData} dispatch={handleMouseEvent} />
          }}
        />
        <Route path="" render={props => <Preview thumbs={assetData.current} layers={layerData.current} />} />
      </Switch>
    </Router>
  )
}
