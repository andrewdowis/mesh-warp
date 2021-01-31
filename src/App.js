import React, { useEffect, useRef, useState, useReducer } from "react"
import { Router, Route, Switch, withRouter } from "react-router-dom"
import history from "./history.js"

import Builder from "./components/Builder"
// import CanvasDrawer from "./components/CanvasDrawer"
// import MeshDrawer from "./components/MeshDrawer"
// import Grid from "./components/Grid"

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
  const thing = useRef(2)

  function no() {
    return "nope"
  }

  return (
    <Router history={history}>
      <Switch>
        <Route path="" component={Builder} />
      </Switch>
    </Router>
  )
}
