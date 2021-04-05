import React, { useEffect, useRef, useState } from "react"
import { Button } from "@material-ui/core"
import CenteredItem from "../CenteredItem"

import uploadIcon from "../../assets/images/upload-icon.svg"

const UploadPanel = React.forwardRef((props, ref) => {
  const { classes, uploadedCallback, uploadedImage, label } = props

  const [imageError, setImageError] = useState()
  const [uploadSource, setUploadSource] = useState()

  const handleButtonClick = e => {
    // Math.floor(1000 * (image.width / image.height)) !== Math.floor(1000 * (720/1188)) ||
    const { width: uploaded_width, height: uploaded_height } = uploadedImage
    if (uploaded_width / uploaded_height !== 720 / 1188) {
      setImageError(
        `Image must be ratio of 720/1188 - approx 0.6061:1.` +
          `<br>Given image is ${uploaded_width}/${uploaded_width}, which is approx` +
          `${Math.floor(1000 * (uploaded_width / uploaded_height)) / 1000}:1`
      )
      return
    }
  }

  const handleSubmitUpload = e => {
    setImageError(null)
    const image = new Image()

    if (uploadedImage) window.URL.revokeObjectURL(uploadedImage)

    image.src = window.URL.createObjectURL(uploadSource)

    image.onload = () => {
      uploadedCallback(image)
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

  return (
    <>
      <p>{label}</p>
      <div className="upload-panel">
        {!!uploadedImage && (
          <div className="upload-result flex-column">
            <div
              className="img-holder"
              style={{
                backgroundImage: `url(${uploadedImage.src})`,
              }}
            />
            <CenteredItem>
              <Button
                className={classes.root}
                disableElevation
                variant="contained"
                color="primary"
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
    </>
  )
})

export default UploadPanel
