import React, { useEffect, useRef, useState } from "react"

import CanvasDrawer from "./components/CanvasDrawer"
import MeshDrawer from "./components/MeshDrawer"

import "./App.scss"

export default function App() {
  const imgUrl = useRef(require("./assets/textures/asset.jpg").default).current
  const [sock, setSock] = useState()

  const [canvas1, setCanvas1] = useState()

  const sourceRef = useRef()

  useEffect(() => {
    if (imgUrl && !sock) {
      setTimeout(() => {
        console.log(imgUrl)
        const img = new Image()
        img.src = imgUrl

        img.onload = () => {
          setTimeout(() => {
            console.log(`%c FUCKIN LOADED`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
            console.log(img)
            setSock(img)
          }, 1500)
        }
      }, 1500)
    }
  }, [imgUrl])

  useEffect(() => {
    if (sock) {
      setTimeout(() => {
        console.log(`%c sock updated`, "color: black; background-color: orange; font-style: italic; padding: 2px;")
        setCanvas1(sourceRef.current)
      }, 1500)
    }
  }, [sock])

  return (
    <div>
      <div> nuh uh buddy</div>
      {sock && (
        <div className="canvas-container">
          {/* <CanvasDrawer right={true} img={sock} width={sock.width / 2} height={sock.height} /> */}
          <CanvasDrawer ref={sourceRef} img={sock} width={sock.width / 2} height={sock.height} />
          {canvas1 && <MeshDrawer src={canvas1} />}
          {/* <img alt="skin" src={sock.src} /> */}
        </div>
      )}
    </div>
  )
}
