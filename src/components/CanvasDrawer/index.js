import React, { useEffect, useRef, useState } from "react"

const CanvasDrawer = React.forwardRef((props, ref) => {
  useEffect(() => {
    console.log(`%c rendered the canvas`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")

    var ctx = ref.current.getContext("2d")
    var img = props.img
    ctx.drawImage(
      img,
      props.width * !(props.right === true),
      0,
      props.width,
      props.height,
      0,
      0,
      props.width,
      props.height
    )
  }, [ref])

  return <canvas ref={ref} width={props.width} height={props.height} />
})

export default CanvasDrawer
