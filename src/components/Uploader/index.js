import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import useEffectOnce from "../../hooks/useEffectOnce"

import { ThemeProvider, Button, makeStyles, createMuiTheme } from "@material-ui/core"
import Downloader from "../Downloader"
import CenteredItem from "../CenteredItem"

import uploadIcon from "../../assets/images/upload-icon.svg"

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
  const [uploadSource, setUploadSource] = useState()
  const [uploadFormat, setUploadFormat] = useState()
  const [uploadedImage, setUploadedImage] = useState()
  const [imageError, setImageError] = useState()
  const [thing, setThing] = useState(false)

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

  const handleButtonClick = e => {
    // Math.floor(1000 * (image.width / image.height)) !== Math.floor(1000 * (720/1188)) ||
    if (uploadedImage.width !== 720 && uploadedImage.height !== 1188) {
      setImageError("Image must be of dimensions 720x1188")
      return
    }
    setThing(true)
  }

  const handleSubmitUpload = e => {
    setImageError(null)
    const image = new Image()

    if (uploadedImage) window.URL.revokeObjectURL(uploadedImage)

    image.src = window.URL.createObjectURL(uploadSource)

    image.onload = () => {
      setUploadedImage(image)
      // setUploadSource(null)
      window.URL.revokeObjectURL(uploadSource)
    }
  }

  const handleUpload = e => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      // this.setState({ errors: { fileUpload: "Must upload an image" } })
      return
    }

    setUploadFormat(file.name.split(".")[1])

    setUploadSource(file)
  }

  const downloadArt = () => {
    const image = new Image()

    image.src = window.URL.createObjectURL(uploadSource)

    image.onload = () => {
      fetch(image.src, {
        method: "GET",
        headers: {},
      })
        .then(response => {
          response.arrayBuffer().then(function(buffer) {
            const link = document.createElement("a")
            link.href = window.URL.createObjectURL(new Blob([buffer]))
            link.download = uploadSource.name

            document.body.appendChild(link)
            link.click()

            setTimeout(function() {
              window.URL.revokeObjectURL(link)
              document.body.removeChild(link)
            }, 200)
          })
        })
        .catch(err => {})
    }
  }

  const debug = () => {
    console.warn(isTitleValid, title)
  }

  return (
    <>
      {thing ? (
        <Downloader texture={uploadedImage} title={title} layers={props.layers} />
      ) : (
        <ThemeProvider theme={theme}>
          <div className="uploader">
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
            <p>Front Art</p>
            <div className="upload-panel">
              {!!uploadedImage && (
                <div className="upload-result flex-column">
                  <div
                    className="img-holder"
                    style={{
                      backgroundImage: `url(${uploadedImage.src})`,
                    }}
                  />
                  {/* {debug()} */}
                  <CenteredItem>
                    <Button
                      className={classes.root}
                      disableElevation
                      variant="contained"
                      color="primary"
                      disabled={!isTitleValid}
                      onClick={handleButtonClick}
                    >
                      Generate Preview
                    </Button>
                    {imageError && <p className="error">{imageError}</p>}
                  </CenteredItem>
                </div>
              )}
              <div className="upload-source flex-column">
                <div className="upload flex-column">
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleUpload}
                  />
                  <label htmlFor="contained-button-file">
                    <div className="file-dropbox">
                      <img alt="upload-icon" src={uploadIcon} />
                    </div>
                  </label>
                  <Button
                    className={classes.root}
                    disableElevation
                    variant="contained"
                    color="secondary"
                    disabled={!!!uploadSource}
                    onClick={handleSubmitUpload}
                  >
                    Upload Front
                  </Button>
                </div>
                <CenteredItem>
                  <p
                    style={
                      !!!uploadSource
                        ? {
                            pointerEvents: "none",
                            opacity: 0.5,
                          }
                        : {}
                    }
                    onClick={!!uploadSource ? downloadArt : null}
                  >
                    Download Front Art
                  </p>
                </CenteredItem>
              </div>
            </div>
          </div>
        </ThemeProvider>
      )}
    </>
  )
})

export default Uploader
