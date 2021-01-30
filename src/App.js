import React, { useEffect, useRef, useState } from "react"

import "./App.scss"

export default function App() {
  const imgUrl = useRef(require("./assets/textures/asset.jpg").default).current
  const [sock, setSock] = useState()

  useEffect(() => {
    if (imgUrl && !sock) {
      console.log(imgUrl)
      const img = new Image()
      img.src = imgUrl

      img.onload = () => {
        console.log(`%c FUCKIN LOADED`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
        console.log(img)
        setSock(img.src)
      }
    }
  }, [imgUrl])

  return (
    <div>
      <div> nuh uh buddy</div>
      {sock && <img alt="skin" src={sock} />}
    </div>
  )
}
