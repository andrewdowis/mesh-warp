import React, { useEffect, useRef, useState } from "react"

import CanvasDrawer from "./components/CanvasDrawer"
import MeshDrawer from "./components/MeshDrawer"

import "./App.scss"

export default function App() {
  const imgUrl = useRef(require("./assets/textures/asset_01a.jpg").default).current
  const [sock, setSock] = useState()

  const [rightSource, setRightSource] = useState()
  const [leftSource, setLeftSource] = useState()

  const sourceRef = useRef()
  const holderRef = useRef()

  useEffect(() => {
    if (imgUrl && !sock) {
      setTimeout(() => {
        console.log(imgUrl)
        const img = new Image()
        img.src = imgUrl

        img.onload = () => {
          setTimeout(() => {
            console.log(`%c FUGGIN LOADED`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
            console.log(img)
            setSock(img)
          }, 200)
        }
      }, 200)
    }
  }, [imgUrl])

  useEffect(() => {
    if (sock) {
      setTimeout(() => {
        console.log(`%c sock updated`, "color: black; background-color: orange; font-style: italic; padding: 2px;")
        // 720x1188
        // let holder = document.getElementById("canvas-holder")
        let holder = holderRef.current
        while (holder.childNodes.length) holder.removeChild(holder.childNodes[0])

        let { width, height } = sock
        let can_width = width
        let can_height = height
        let asset_height = height

        let socks = ["right", "left"]

        socks.forEach((id, i) => {
          let x = 0
          let y = 0

          let canvas_item = document.createElement("canvas")
          canvas_item.id = `dummy_canvas_${id}`

          switch (id) {
            case "right":
              can_width = 294
              can_height = 971

              asset_height = 975
              x = -4
              y = -2

              break
            case "left":
              can_width = 297
              can_height = asset_height = 974
              break
            default:
              break
          }

          let asset_ratio = height / asset_height

          if (id == "left") x = -width / asset_ratio + can_width

          canvas_item.width = can_width * asset_ratio
          canvas_item.height = can_height * asset_ratio
          canvas_item
            .getContext("2d")
            .drawImage(sock, x * asset_ratio, y * asset_ratio, width, asset_height * asset_ratio)
          holder.appendChild(canvas_item)

          switch (id) {
            case "right":
              setRightSource(canvas_item)
              break
            case "left":
              setLeftSource(canvas_item)
              break
            default:
              break
          }
        })
      }, 200)
    }
  }, [sock])

  useEffect(() => {
    if (leftSource && rightSource) {
      console.log(`%c saucy`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
      console.log(leftSource)
      console.log(rightSource)
      console.warn("sources!!!!!!")
    }
  }, [leftSource, rightSource])

  return (
    <div>
      <div> nuh uh buddy</div>
      {sock && (
        <div ref={holderRef} className="canvas-container">
          {/* <CanvasDrawer right={true} img={sock} width={sock.width / 2} height={sock.height} /> */}
          {/* <CanvasDrawer ref={sourceRef} img={sock} width={sock.width / 2} height={sock.height} /> */}
          {leftSource && rightSource && (
            <>
              <MeshDrawer src={rightSource} />
              <MeshDrawer src={leftSource} />
            </>
          )}

          {/* <img alt="skin" src={sock.src} /> */}
        </div>
      )}
    </div>
  )
}
