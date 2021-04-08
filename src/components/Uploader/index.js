import React, { useState } from "react"

import Downloader from "../Downloader"
import UploadPanel from "../UploadPanel"

import "./style.scss"

const Uploader = React.forwardRef((props, ref) => {
  const text_default = "Enter Title Here"
  const [title, setTitle] = useState(text_default)
  const [outputTitle, setOutputTitle] = useState("Enter Title Below")
  const [uploadedImage, setUploadedImage] = useState()

  const updateTitle = new_title => {
    setTitle(new_title)
  }

  const handleTextFocus = e => {
    switch (e.type) {
      case "focus":
        if (title === text_default) updateTitle("")
        break
      case "blur":
        if (!title.length) updateTitle(text_default)
        break
      default:
        break
    }
  }

  const handleNameChange = e => updateTitle(`${e.target.value}`)

  const handleKeyDown = e => {
    if (e.key.toLowerCase() === "enter" || e.keyCode === 13) e.target.blur()
  }

  const generateCallback = img => {
    setUploadedImage(img)
    setOutputTitle(title)
  }

  const debug = () => {
    // console.log(`%c piss`, "color: black; background-color: cyan; font-style: italic; padding: 2px;")
    // console.warn(uploadedImage)
  }

  return (
    <div className="mocker">
      {/* {debug()} */}
      <Downloader texture={uploadedImage} title={outputTitle} layers={props.layers} />
      <div className="uploader">
        <div>
          <div className="header">{`${title} Art`}</div>
          <div className="enter-title">
            <p>Enter Name</p>
            <label>
              <input
                type="text"
                name="name"
                value={title}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                onFocus={handleTextFocus}
                onBlur={handleTextFocus}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <UploadPanel label="Front Art" buttonLabel={"Upload Front"} {...{ uploadedImage, generateCallback }} />
          <UploadPanel
            label="Back Art (disabled)"
            buttonLabel={"Upload Back"}
            {...{ uploadedImage, generateCallback }}
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
})

export default Uploader
