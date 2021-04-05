import React, { useState } from "react"

import { ThemeProvider, makeStyles, createMuiTheme } from "@material-ui/core"
import Downloader from "../Downloader"
import UploadPanel from "../UploadPanel"

import "./style.scss"

const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    // MuiButtonBase: {
    //   // The properties to apply
    //   disableRipple: true, // No more ripple, on the whole application 💣!
    // },
  },
  palette: {
    primary: { main: "#1f7cf2" },
    secondary: { main: "#3d3d3d" },
  },
})

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      padding: "5px 10px",
      // margin: theme.spacing(1),
    },
    // "&:hover": {
    //   backgroundColor: "#000000",
    // },
  },
  input: {
    display: "none",
  },
}))

const Uploader = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const text_default = "Enter Title Here"
  const [title, setTitle] = useState(text_default)
  const [isTitleValid, setIsTitleValid] = useState(true)
  // const [isTitleValid, setIsTitleValid] = useState(title !== text_default)
  const [uploadedImage, setUploadedImage] = useState()

  const updateTitle = new_title => {
    setTitle(new_title)
    // setIsTitleValid(new_title && new_title.length && new_title !== text_default)
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

  const uploadedCallback = img => {
    setUploadedImage(img)
  }

  const debug = () => {
    console.warn(isTitleValid, title)
  }

  return (
    <div className="mocker">
      <Downloader texture={uploadedImage} title={title} layers={props.layers} />
      <ThemeProvider theme={theme}>
        <div className="uploader">
          <div className="row">
            <div
              className="header"
              style={{
                visibility: isTitleValid ? "visible" : "hidden",
              }}
            >{`${title} Art`}</div>
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
            <UploadPanel label="Front Art" {...{ classes, uploadedImage, uploadedCallback }} />
            <UploadPanel label="Back Art" {...{ classes, uploadedImage, uploadedCallback }} />
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
})

export default Uploader
