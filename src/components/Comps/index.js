import React, { useEffect, useRef, useState } from "react"

import "./style.scss"

import img1 from "../../assets/comps/version1.jpg"
import img2 from "../../assets/comps/version2.jpg"
import img3 from "../../assets/comps/version3.jpg"
import img4 from "../../assets/comps/version4.jpg"

const Comps = React.forwardRef((props, ref) => {
  const images = [img1, img2, img3, img4]

  const [compIndex, setCompIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)

  function getIndex() {
    return hoverIndex !== null ? hoverIndex + 1 : compIndex + 1
  }

  return (
    <div className="comp-container">
      <div className="comp-preview">
        <div className="preview-holder">
          <img alt="preview_1" src={images[compIndex]} />
          {hoverIndex !== null ? <img alt="preview_2" src={images[hoverIndex]} /> : null}
          <p>{`Version ${getIndex()}${getIndex() === 1 ? " (original from comps)" : ""}`}</p>
        </div>
      </div>
      <div className="comp-samples">
        {images.map((src, i) => {
          return (
            <div>
              <p>{`preview ${i + 1}`}</p>

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
