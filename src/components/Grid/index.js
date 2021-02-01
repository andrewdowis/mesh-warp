import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import GridManager from "../../lib/GridManager"

import "./style.scss"

import { Actions } from "../../App"

const Grid = React.forwardRef((props, ref) => {
  const { width, height, dispatch } = props
  const [isBuilt, setIsBuilt] = useState(false)
  const [forceUpdate, setForceUpdate] = useState()

  const meshRef = useRef()
  const imageRef = useRef()

  useEffect(() => {
    if (!isBuilt) {
      GridManager.init({
        width,
        height,
        rows: 3,
        columns: 3,
      })

      setIsBuilt(true)
    }
  }, [isBuilt])

  function updateMeshLines() {
    // update the mesh lines
    let ctx = meshRef.current.getContext("2d")

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = "lime"
    ctx.lineWidth = 2
    for (let i = 0; i < GridManager.positions.length; i++) {
      const coord = GridManager.positions[i]
      let neighbor = GridManager.positions[i + 1]
      if (i && (i + 1) % (GridManager.columns + 1) === 0) neighbor = null
      ctx.beginPath()
      if (i >= GridManager.columns + 1) {
        const upper = GridManager.positions[i - GridManager.columns - 1]
        ctx.moveTo(upper.x, upper.y)
        ctx.lineTo(coord.x, coord.y)
      } else {
        ctx.moveTo(coord.x, coord.y)
      }
      if (neighbor) ctx.lineTo(neighbor.x, neighbor.y)
      ctx.stroke()
      ctx.closePath()
    }

    ctx.strokeStyle = "red"
    ctx.lineWidth = 0.5
    for (let i = 0; i < GridManager.positions.length; i++) {
      if (i % (GridManager.columns + 1) === 0) continue

      const coord = GridManager.positions[i]
      let neighbor = GridManager.positions[i + GridManager.columns]

      if (!neighbor) break

      ctx.beginPath()
      ctx.moveTo(coord.x, coord.y)
      ctx.lineTo(neighbor.x, neighbor.y)

      ctx.stroke()
      ctx.closePath()
    }
  }

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
    if (imageRef && meshRef && imageRef.current && meshRef.current) {
      var img = props.src
      var c = imageRef.current.getContext("2d")
      var w = imageRef.current.width
      var h = imageRef.current.height

      // 0 1 2 3 4 5
      // 6 7 8 9 0 1
      // 1 2 3 4 5 6
      // 7 8 9 0 1 2

      // i, i+1, i + coloumns
      // i + 1, i + columns, i + 1 + columns

      c.clearRect(0, 0, w, h)
      // render the images
      const target = GridManager.positions.length - GridManager.columns - 1
      for (let i = target - 1; i > -1; i--) {
        if ((i + 1) % (GridManager.columns + 1) === 0) continue
        const c1 = GridManager.positions[i]
        const c2 = GridManager.positions[i + 1]
        const c3 = GridManager.positions[i + 1 + GridManager.columns]
        const c4 = GridManager.positions[i + 2 + GridManager.columns]
        // if (i === 14) console.log("looking at:", i, target, GridManager.positions.length, i + 2 + GridManager.columns)
        var x1 = c1.x
        var y1 = c1.y
        var x2 = c2.x
        var y2 = c2.y
        var x3 = c3.x
        var y3 = c3.y
        var x4 = c4.x
        var y4 = c4.y

        /*
        x1 -> x2 -> x3
        x4 -> x2 -> x3
        */

        // 1 = red = TL
        // 2 = green = TR
        // 3 = cyan = BL
        // 4 = blue = BR

        // x1 = 25 + Math.round(Math.random() * (w - 50))
        // y1 = 25 + Math.round(Math.random() * (h - 50))
        // x2 = 25 + Math.round(Math.random() * (w - 50))
        // y2 = 25 + Math.round(Math.random() * (h - 50))
        // x3 = 25 + Math.round(Math.random() * (w - 50))
        // y3 = 25 + Math.round(Math.random() * (h - 50))
        // x4 = 25 + Math.round(Math.random() * (w - 50))
        // y4 = 25 + Math.round(Math.random() * (h - 50))

        // x1 = 0
        // y1 = 0
        // x2 = w
        // y2 = 0
        // x3 = 0
        // y3 = h
        // x4 = w
        // y4 = h

        var xm = linearSolution(0, 0, x1, img.width, 0, x2, 0, img.height, x3)
        var ym = linearSolution(0, 0, y1, img.width, 0, y2, 0, img.height, y3)

        var xn = linearSolution(img.width, img.height, x4, img.width, 0, x2, 0, img.height, x3)
        var yn = linearSolution(img.width, img.height, y4, img.width, 0, y2, 0, img.height, y3)

        // var xm = linearSolution(img.width, img.height, x4, img.width, 0, x2, 0, img.height, x3)
        // var ym = linearSolution(img.width, img.height, y4, img.width, 0, y2, 0, img.height, y3)

        // var xn = linearSolution(0, 0, x1, img.width, 0, x2, 0, img.height, x3)
        // var yn = linearSolution(0, 0, y1, img.width, 0, y2, 0, img.height, y3)

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

        c.save()
        c.setTransform(xm[0], ym[0], xm[1], ym[1], xm[2], ym[2])
        c.beginPath()
        c.moveTo(0, 0)
        c.lineTo(img.width, 0)
        c.lineTo(0, img.height)
        c.lineTo(0, 0)
        c.closePath()
        c.fill()
        c.clip()
        c.drawImage(img, 0, 0, img.width, img.height)
        c.restore()
      }
    }
  })

  useEffect(() => {
    if (meshRef && meshRef.current) {
      updateMeshLines()
    }
  })
  if (!isBuilt) return null

  return (
    <>
      <div
        className="grid-item"
        style={{
          width,
          height,
          // marginLeft: 200,
        }}
      >
        <canvas ref={imageRef} width={width} height={height} />
        <canvas ref={meshRef} width={width} height={height} />
        {GridManager.positions.map((coord, index) => {
          return (
            <div
              onMouseDown={event => {
                console.log("MOUSE DOWN YO")
                // dispatch(event, index)
              }}
              key={`dot_${index}`}
              className="grid-dot"
              style={{
                left: coord.x,
                top: coord.y,
              }}
            />
          )
        })}
      </div>
      <div
        className="button"
        onClick={() => {
          console.log(`%c Save points`, "color: black; background-color: lime; font-style: italic; padding: 2px;")

          const attributes = ["width", "height", "columns", "rows"]
          let output = "{ positions: ["
          GridManager.positions.forEach((coord, index) => {
            output += `{ x: ${coord.x}, y: ${coord.y} }`
            if (GridManager.positions[index + 1]) output += ", "
          })

          output += "]"
          attributes.forEach(attribute => {
            output += `, ${attribute}: ${GridManager[attribute]}`
          })
          // width: ${GridManager.width}, height: ${GridManager.height}, width: ${GridManager.width}, height: ${GridManager.height},  `
          console.log(GridManager.positions)
          console.log(output)
        }}
      >
        <p>Output Points</p>
      </div>
      {/* <div
        className="button"
        onClick={() => {


          const getCol = index => {
            console.warn(`getCol.given ... ${index}`)
            const answer = index % (GridManager.columns + 1)
            console.log(`\t\t ${answer}`)
            return answer
          }
          const getRow = index => {
            console.warn(`getRow.given ... ${index}`)
            const answer = Math.floor(index / (GridManager.columns + 1))
            console.log(`\t\t ${answer}`)
            return answer
          }

          console.log(`%c Double points`, "color: black; background-color: lime; font-style: italic; padding: 2px;")
          const inserts = []

          for (let i = 0; i < GridManager.positions.length; i++) {
            // for (let i = 0; i < 4; i++) {
            // if (i) break

            const target = GridManager.positions[i]
            const rightIndex = i + 1
            const upperIndex = i - (GridManager.columns + 1)

            const right = GridManager.positions[rightIndex]
            const upper = GridManager.positions[upperIndex]

            const targetCol = getCol(i)
            const targetRow = getRow(i)

            if (right) {
              const neighborCol = getCol(rightIndex)
              const neighborRow = getRow(rightIndex)

              if (targetRow === neighborRow) {
                inserts.push({
                  x: (target.x + right.x) / 2,
                  y: (target.y + right.y) / 2,
                })
              }
            }
            if (upper) {
              const neighborCol = getCol(upperIndex)
              const neighborRow = getRow(upperIndex)

              if (targetCol === targetCol) {
                inserts.push({
                  x: (target.x + upper.x) / 2,
                  y: (target.y + upper.y) / 2,
                })
              }
            }
          }


          console.log(GridManager.positions.slice())
          console.log(inserts.slice())
          const dummy = []
          console.log(GridManager.positions.length, inserts.length)
          while (GridManager.positions.length + inserts.length > 0) {
            // while (dummy.length < 7) {
            if (GridManager.positions.length) {
              console.error("adding from OG")
              dummy.push(GridManager.positions.shift())
            }
            if (inserts.length) {
              console.warn("\t adding from insert")
              dummy.push(inserts.shift())
            }
          }
          console.log(dummy)
          // GridManager.positions = dummy.map(value => value)
        }}
      >
        <p>Double</p>
      </div> */}
    </>
  )
})
export default Grid
