import React, { useEffect, useRef, useState } from "react"

import "./style.scss"

// import img01 from "../../assets/comps/version01.jpg"
// import img02 from "../../assets/comps/version02.jpg"
// import img03 from "../../assets/comps/version03.jpg"
// import img04 from "../../assets/comps/version04.jpg"
// import img05 from "../../assets/comps/version05.jpg"
import img06 from "../../assets/comps/version06.jpg"
// import img07 from "../../assets/comps/version07.jpg"
import img08 from "../../assets/comps/version08.jpg"
import img09 from "../../assets/comps/version09.jpg"
import img10 from "../../assets/comps/version10.jpg"

const Comps = React.forwardRef((props, ref) => {
  const images = [img06, img08, img09, img10]

  const [compIndex, setCompIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)

  function getIndex() {
    let value = (hoverIndex !== null ? hoverIndex : compIndex) + 6
    console.log(`%c ${value}`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
    if (value > 6) value++
    return value
  }

  return (
    <div className="comp-container">
      <div className="comp-preview">
        <div className="preview-holder">
          <img alt="preview_1" src={images[compIndex]} />
          {hoverIndex !== null ? <img alt="preview_2" src={images[hoverIndex]} /> : null}
          <p>{`Version ${getIndex()}${getIndex() === 6 ? " (original client PSD)" : ""}`}</p>
        </div>
      </div>
      <div className="comp-samples">
        {images.map((src, i) => {
          return (
            <div>
              <p>{`thumb ${i < 1 ? i + 6 : i + 7}`}</p>

              <img
                className={i === compIndex ? "comp-selected" : ""}
                src={src}
                key={`${src}_${i}`}
                alt={`thumbnail${i}`}
                onMouseOver={() => {
                  if (i !== compIndex) setHoverIndex(i)
                }}
                onMouseOut={() => {
                  if (i !== compIndex) setHoverIndex(null)
                }}
                onClick={() => {
                  setCompIndex(i)
                  setHoverIndex(null)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Comps
