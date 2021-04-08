import React, { useEffect, useRef, useState } from "react"

import Uploader from "./components/Uploader"
import CanvasDummyBuilder from "./lib/CanvasDummyBuilder"

import rockEmLogo from "./assets/images/rock-em-logo.svg"
import "./App.scss"

export default function App() {
  const assets = [require("./assets/textures/asset_blank.jpg").default]
  const assetData = useRef([])

  const layers = [
    require("./assets/layers/layer_03_base.png").default,
    require("./assets/layers/layer_01.png").default,
    require("./assets/layers/layer_02_multiply.png").default,
    require("./assets/layers/layer_03_base_02.png").default,
    require("./assets/layers/sock_mask_left.png").default,
    require("./assets/layers/sock_mask_right.png").default,
  ]
  const layerData = useRef([])

  const [sourceBitmapData, setSourceBitmapData] = useState()

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
