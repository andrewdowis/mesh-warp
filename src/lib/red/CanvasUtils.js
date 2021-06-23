/**
 * @npmpackage
 * @class CanvasUtils
 * @desc
 * Utilities for Canvas DOM elements<br>
 * <codeblock>
 * import { CanvasUtils } from 'ad-canvas'
 * </codeblock>
 */

/**
 * @memberof CanvasUtils
 * @method getImageData
 * @param {canvas|UICanvas|CanvasDrawer} source
 * 	a CANVAS DOM element or CanvasDrawer from whcih to get image data
 * @desc
 * 	Gets the image data associated with a canvas
 * @example
 * CanvasUtils.getImageData(_myCanvas)
 */
export function getImageData(source) {
  var _canvas = source.canvas || source
  try {
    return _canvas.getContext("2d").getImageData(0, 0, _canvas.width, _canvas.height)
  } catch (err) {
    _returnError(source, "get")
  }
}

/**
 * @memberof CanvasUtils
 * @method setImageData
 * @param {canvas|UICanvas|CanvasDrawer} target
 * 	a CANVAS DOM element or CanvasDrawer to apply image data
 * @param {array} data
 * 	the image data to apply to the canvas
 * @desc
 * 	Applies image data to a canvas.
 * @example
 * var _imageData = CanvasUtils.getImageData(_sourceCanvas)
 * CanvasUtils.setImageData(_targetCanvas, _imageData)
 */
export function setImageData(target, data) {
  var _canvas = target.canvas || target

  try {
    _canvas.getContext("2d").putImageData(data, 0, 0)
  } catch (err) {
    _returnError(target, "set")
  }
}

export function sharpen(ctx, w, h, mix) {
  var x,
    sx,
    sy,
    r,
    g,
    b,
    a,
    dstOff,
    srcOff,
    wt,
    cx,
    cy,
    scy,
    scx,
    weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
    katet = Math.round(Math.sqrt(weights.length)),
    half = (katet * 0.5) | 0,
    dstData = ctx.createImageData(w, h),
    dstBuff = dstData.data,
    srcBuff = ctx.getImageData(0, 0, w, h).data,
    y = h

  while (y--) {
    x = w
    while (x--) {
      sy = y
      sx = x
      dstOff = (y * w + x) * 4
      r = 0
      g = 0
      b = 0
      a = 0

      for (cy = 0; cy < katet; cy++) {
        for (cx = 0; cx < katet; cx++) {
          scy = sy + cy - half
          scx = sx + cx - half

          if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
            srcOff = (scy * w + scx) * 4
            wt = weights[cy * katet + cx]

            r += srcBuff[srcOff] * wt
            g += srcBuff[srcOff + 1] * wt
            b += srcBuff[srcOff + 2] * wt
            a += srcBuff[srcOff + 3] * wt
          }
        }
      }

      dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix)
      dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix)
      dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix)
      dstBuff[dstOff + 3] = srcBuff[dstOff + 3]
    }
  }

  ctx.putImageData(dstData, 0, 0)
}

//
function _returnError(source, getOrSet) {
  var _output = "Unable to " + getOrSet + " image data, try a Local Server or network connection.\n- And/or -\n"
  if (source.canvas) {
    _output += "ImageManager failed to load ONE or ALL of the following as 'forCanvas':"
    for (var dI in source.elements) {
      if (source.elements[dI]._type === "image") {
        var _src = source.elements[dI].src
        _output += "\n\t" + _src.id + ": " + _src.src
      }
    }
  }
  _output += "\nMake sure images used on Canvas elements are loaded using the model: "
  _output += "ImageManager.addToLoad ( 'http://some/full/file/path/sample.png', { forCanvas:true });"

  throw new Error(_output)
}
