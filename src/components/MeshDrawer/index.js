import React, { useEffect, useRef, useState } from "react"

const MeshDrawer = React.forwardRef((props, ref) => {
  const canRef = useRef()

  console.log(`%c props`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
  const { width, height } = props.src

  function linearSolution(r1, s1, t1, r2, s2, t2, r3, s3, t3) {
    // make them all floats
    r1 = parseFloat(r1)
    s1 = parseFloat(s1)
    t1 = parseFloat(t1)
    r2 = parseFloat(r2)
    s2 = parseFloat(s2)
    t2 = parseFloat(t2)
    r3 = parseFloat(r3)
    s3 = parseFloat(s3)
    t3 = parseFloat(t3)

    var a = ((t2 - t3) * (s1 - s2) - (t1 - t2) * (s2 - s3)) / ((r2 - r3) * (s1 - s2) - (r1 - r2) * (s2 - s3))
    var b = ((t2 - t3) * (r1 - r2) - (t1 - t2) * (r2 - r3)) / ((s2 - s3) * (r1 - r2) - (s1 - s2) * (r2 - r3))
    var c = t1 - r1 * a - s1 * b

    return [a, b, c]
  }

  useEffect(() => {
    console.log(`%c rendered the canvas`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
    var img = props.src

    console.log(`%c KILL ME`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")

    var c = canRef.current.getContext("2d")
    var w = canRef.current.width
    var h = canRef.current.height

    c.clearRect(0, 0, w, h)

    var x1 = 25 + Math.round(Math.random() * (w - 50))
    var y1 = 25 + Math.round(Math.random() * (h - 50))
    var x2 = 25 + Math.round(Math.random() * (w - 50))
    var y2 = 25 + Math.round(Math.random() * (h - 50))
    var x3 = 25 + Math.round(Math.random() * (w - 50))
    var y3 = 25 + Math.round(Math.random() * (h - 50))
    var x4 = 25 + Math.round(Math.random() * (w - 50))
    var y4 = 25 + Math.round(Math.random() * (h - 50))

    x1 = 0
    y1 = 0
    x2 = w
    y2 = 0
    x3 = 0
    y3 = h
    x4 = w
    y4 = h

    var xm = linearSolution(0, 0, x1, img.width, 0, x2, 0, img.height, x3)
    var ym = linearSolution(0, 0, y1, img.width, 0, y2, 0, img.height, y3)

    var xn = linearSolution(img.width, img.height, x4, img.width, 0, x2, 0, img.height, x3)
    var yn = linearSolution(img.width, img.height, y4, img.width, 0, y2, 0, img.height, y3)

    c.save()
    // another matrix argument order bug?
    c.setTransform(xm[0], ym[0], xm[1], ym[1], xm[2], ym[2])
    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(img.width, 0)
    c.lineTo(0, img.height)
    c.lineTo(0, 0)
    c.closePath()
    c.fill()
    c.clip()
    console.warn("INAGE IS")
    console.log(img)
    console.warn("~~~~~~")
    c.drawImage(img, 0, 0, img.width, img.height)
    c.restore()

    c.save()
    // another matrix argument order bug?
    c.setTransform(xn[0], yn[0], xn[1], yn[1], xn[2], yn[2])
    c.beginPath()
    c.moveTo(img.width, img.height)
    c.lineTo(img.width, 0)
    c.lineTo(0, img.height)
    c.lineTo(img.width, img.height)
    c.closePath()
    c.fill()
    c.clip()
    c.drawImage(img, 0, 0, img.width, img.height)
    c.restore()

    c.beginPath()
    c.arc(x1, y1, 15, 0, Math.PI * 2, true)
    c.closePath()
    c.fillStyle = "#ff0000"
    c.fill()

    c.beginPath()
    c.arc(x2, y2, 15, 0, Math.PI * 2, true)
    c.closePath()
    c.fillStyle = "#00ff00"
    c.fill()

    c.beginPath()
    c.arc(x3, y3, 15, 0, Math.PI * 2, true)
    c.closePath()
    c.fillStyle = "#0000ff"
    c.fill()

    c.beginPath()
    c.arc(x4, y4, 15, 0, Math.PI * 2, true)
    c.closePath()
    c.fillStyle = "#ffffff"
    c.fill()
  }, [canRef])

  return <canvas ref={canRef} width={width} height={height} />
})

export default MeshDrawer
