import React, { useEffect, useRef, useState, useReducer } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
import history from "./history.js"

import Builder from "./components/Builder"
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
  const imgUrl = require("./assets/textures/asset_01a.jpg").default
  const [sourceBitmapData, setSourceBitmapData] = useState()

  const canvasHolder = useRef()

  useEffect(() => {
    if (!sourceBitmapData) {
      const img = new Image()
      img.src = imgUrl

      img.onload = () => {
        console.log(`%c  crap loaded`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
        console.log(img)
        setSourceBitmapData(img)
        CanvasDummyBuilder.init(img)

        // while (canvasHolder.current.childNodes.length)
        //   canvasHolder.current.removeChild(canvasHolder.current.childNodes[0])

        // CanvasDummyBuilder.dummies.forEach(dum => {
        //   canvasHolder.current.appendChild(dum.canvas)
        //   dum.canvas.style.backgroundColor = "lime"
        // })
      }
    }
  }, [sourceBitmapData])

  // return (
  //   <div>
  //     <div ref={canvasHolder} />
  //   </div>
  // )

  if (!sourceBitmapData) return <div>give your nuts a tug, ta tit fucker</div>

  return (
    <Router history={history}>
      <Switch>
        <Route path="" render={props => <Builder sourceBitmapData={sourceBitmapData} />} />
      </Switch>
    </Router>
  )
}
