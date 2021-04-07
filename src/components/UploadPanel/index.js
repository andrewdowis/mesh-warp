import React, { useEffect, useRef, useState, useCallback } from "react"
import CenteredItem from "../CenteredItem"
import { Button, ThemeProvider, makeStyles, createMuiTheme } from "@material-ui/core"
import ReactHtmlParser from "react-html-parser"
import { useDropzone } from "react-dropzone"

import "./style.scss"

import uploadIcon from "../../assets/images/upload-icon.svg"

const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    // MuiButtonBase: {
    //   // The properties to apply
    //   disableRipple: true, // No more ripple, on the whole application 💣!
    // },
  },
  palette: {
    // primary: { main: "#1f7cf2" },
    primary: { main: "#ff0000" },
    secondary: { main: "#3d3d3d" },
  },
})

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      padding: "5px 10px",
      textTransform: "capitalize",
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

const UploadPanel = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const { generateCallback, label, buttonLabel, disabled } = props

  const [imageError, setImageError] = useState()

  const [uploadedImage, setUploadedImage] = useState()
  const [uploadSource, setUploadSource] = useState()
  // const [backgroundImage, setBackgroundImage] = useState()

  const handleButtonClick = e => {
    // Math.floor(1000 * (image.width / image.height)) !== Math.floor(1000 * (720/1188)) ||
    const { width: uploaded_width, height: uploaded_height } = uploadedImage
    // if (uploaded_width !== 2550 && uploaded_height !== 4560) {
    //   setImageError(
    //     `Image must be ratio of <b>2550x4560</b>.<br>The image you selected is <b>${uploaded_width}x${uploaded_height}</b>`
    //   )
    //   return
    // }
    generateCallback(uploadedImage)
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

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    acceptedFiles = acceptedFiles[0]

    // const image = new Image()
    // image.src = window.URL.createObjectURL(acceptedFiles)
    // image.onload = () => {
    //   setBackgroundImage(image)

    //   // setUploadSource(null)
    //   window.URL.revokeObjectURL(acceptedFiles)
    // }

    setUploadSource(acceptedFiles)
    // handleUpload(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const debug = () => {}

  return (
    <ThemeProvider theme={theme}>
      <div className={`upload-group${disabled ? " disabled" : ""}`}>
        <p>{label}</p>
        <div className="upload-panel">
          <div className="upload-result flex-column">
            <div
              className="img-holder"
              style={
                uploadedImage && {
                  backgroundImage: `url(${uploadedImage.src})`,
                }
              }
            />
            <CenteredItem>
              <Button
                className={classes.root}
                disableElevation
                variant="contained"
                color="primary"
                disabled={!!!uploadedImage}
                onClick={handleButtonClick}
              >
                Generate Preview
              </Button>
              {imageError && <p className="error">{ReactHtmlParser(imageError)}</p>}
            </CenteredItem>
          </div>

          <div className="upload-source flex-column">
            <div className="upload flex-column">
              {debug()}
              <div
                className="file-dropbox"
                {...getRootProps()}
                // style={
                //   backgroundImage && {
                //     backgroundImage: `url(${backgroundImage.src})`,
                //   }
                // }
              >
                <input {...getInputProps()} />
                <p>{ReactHtmlParser("Drag 'n' drop here<br>or click to select files")}</p>
                <img alt="upload-icon" src={uploadIcon} />
              </div>

              <Button
                className={classes.root}
                disableElevation
                variant="contained"
                color="secondary"
                disabled={!!!uploadSource}
                onClick={handleSubmitUpload}
              >
                {buttonLabel}
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
  )
})

export default UploadPanel
