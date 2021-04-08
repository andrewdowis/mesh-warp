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
    primary: { main: "#1f7cf2" },
    // primary: { main: "#ff0000" },
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

const throttler = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay || 75)
  })
}

const UploadPanel = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const terminate = useRef(false)
  const currentJobs = useRef(0)
  const { generateCallback, label, buttonLabel, disabled } = props

  const [imageError, setImageError] = useState()

  // what was selected to upload
  const [uploadSource, setUploadSource] = useState()
  // the result of the upload, to use in the app
  const [uploadedImage, setUploadedImage] = useState()

  const [loadedPercent, setLoadedPercent] = useState(0)
  const [loadingValue, setLoadingValue] = useState()

  const handleButtonClick = e => {
    // const { width: uploaded_width, height: uploaded_height } = uploadedImage
    // if (uploaded_width !== 2550 && uploaded_height !== 4560) {
    //   setImageError(
    //     `Image must be ratio of <b>2550x4560</b>.<br>The image you selected is <b>${uploaded_width}x${uploaded_height}</b>`
    //   )
    //   return
    // }
    generateCallback(uploadedImage)
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

    if (currentJobs.current) {
      terminate.current = true
      currentJobs.current = 0
    }

    currentJobs.current++
    const image = new Image()
    image.src = window.URL.createObjectURL(acceptedFiles)
    fetch(image.src, {
      method: "GET",
      headers: {},
    })
      .then(async response => {
        const reader = response.body.getReader()

        // Step 2: get total length
        const contentLength = +response.headers.get("Content-Length")

        // Step 3: read the data
        let receivedLength = 0 // received that many bytes at the moment
        while (true) {
          const throttle = throttler()
          const { done, value } = await reader.read()
          receivedLength += value.length
          if (terminate.current) {
            window.URL.revokeObjectURL(acceptedFiles)
            terminate.current = false
            return
          }

          let percent = done ? 100 : Math.floor((receivedLength / contentLength) * 100)
          setLoadedPercent(receivedLength / contentLength)
          setLoadingValue(`${percent}% Loaded`)

          await throttle
          if (done || receivedLength === contentLength) {
            await throttler(1000)
            break
          }
        }

        // if this job wasn't terminated by a new upload process
        // then update images accordingly
        currentJobs.current = 0
        setUploadedImage(image)
        window.URL.revokeObjectURL(acceptedFiles)
        setUploadSource(acceptedFiles)
        setLoadedPercent(0)
        setLoadingValue(null)
      })
      .catch(err => {})
  }, [])

  const inputProps = { accept: ".png,.gif,.jpg,.jpeg", multiple: false }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const debug = () => {}

  const canDownload = () => {
    return !!uploadedImage && !loadedPercent && !loadingValue
  }

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
                  backgroundImage: loadingValue ? "unset" : `url(${uploadedImage.src})`,
                }
              }
            >
              {loadingValue && <p className="loading-value">{loadingValue}</p>}
            </div>
          </div>

          <div className="upload-source flex-column">
            <div className="upload flex-column">
              {loadingValue && (
                <>
                  {debug()}
                  <div
                    className="progress-bar"
                    style={{
                      transform: `scaleY(${loadedPercent})`,
                    }}
                  />
                </>
              )}

              <div className="file-dropbox" {...getRootProps()}>
                <input {...getInputProps(inputProps)} />
                <p>{ReactHtmlParser("Drag & drop here<br>or click to select files")}</p>
                <img alt="upload-icon" src={uploadIcon} />
              </div>
            </div>
          </div>
        </div>
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
          <p
            style={
              !canDownload()
                ? {
                    pointerEvents: "none",
                    opacity: 0.5,
                  }
                : {}
            }
            onClick={canDownload() ? downloadArt : null}
          >
            Download Front Art
          </p>
        </CenteredItem>
      </div>
    </ThemeProvider>
  )
})

export default UploadPanel
