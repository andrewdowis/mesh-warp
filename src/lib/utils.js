const fs = require("fs")
const ncp = require("ncp").ncp
const rimraf = require("rimraf")

const log = require("@ff0000-ad-tech/debug")("rpb-show:lib:utils")

const pathExists = path => {
  return fs.existsSync(path)
}

const ensurePath = path => {
  let newPath = ""
  // log(`\n\n Ensuring the existance of ${path}!`)
  path.split("/").forEach(folder => {
    if (!pathExists((newPath += `/${folder}`))) fs.mkdirSync(newPath)
  })
  return path
}

const deletePath = path => {
  if (pathExists(path)) rimraf.sync(path)
  return path
}

// this is a simplified copy method
// it takes in a source path (folder or file) and places it into a dest location
const copySingle = async (source, dest) => {
  return new Promise((resolve, reject) => {
    ncp(source, dest, err => {
      if (err) return reject(err)

      resolve("copy process completed")
    })
  })
}

// this uses arrays of objects to copy from a source FOLDER or FILE to a destination location
/*
source_dest_array is an array of objects each containing source/path keys
	EX: source_dest_array = [
		{
			source: '/Users/you/Documents/',
			dest: '/Users/you/Videos/']
		}
	]
		this will read
			source_dest_array[i].source as the SOURCE path and
			source_dest_array[i].dest as the DEST path
		so '/Users/you/Documents/' would be copied into the '/Users/you/Videos/' location
*/

const copyArray = async source_dest_array => {
  await Promise.all(
    source_dest_array.map(async (array_obj, i) => {
      await copySingle(array_obj.from, array_obj.to)
    })
  )
  return
}

const readFile = file => {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(file)

      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

const readChildren = async (path, id, finalArray, parent) => {
  finalArray = finalArray || []
  return new Promise((resolve, reject) => {
    fs.readdir(path, async (error, children) => {
      try {
        if (children) {
          children = children.filter(child => {
            // if the child name contains a dot, it is a file with an extension
            // if the . is at the zero index, it's a system file and we ignore
            // otherwise, add the file to the finalArray and filter it out of the children array
            if (child.indexOf(".") !== 0) finalArray.push(parent ? `${parent}/${child}` : child)
            // if it's not a file, it's a folder - return it for further analysis
            return child.indexOf(".") < 0
          })

          await Promise.all(
            children.map(
              async child =>
                await readChildren(`${path}/${child}`, id, finalArray, parent ? `${parent}/${child}` : child)
            )
          )
        }
        // resolve when done looking at children
        id === undefined || id === null ? resolve(finalArray) : resolve({ children: finalArray, id })
      } catch (err) {
        reject(err)
      }
    })
  })
}

const getJson = async path => {
  const jsonData = await readFile(path)
  return JSON.parse(jsonData)
}

const jsonStringify = input => {
  if (typeof input === "object") for (let key in input) input[key] = jsonStringify(input[key])
  return JSON.stringify(input)
}

const getInput = input => {
  try {
    return JSON.parse(input)
  } catch (err) {
    return input
  }
}

const jsonParse = input => {
  const output = getInput(input)
  if (typeof output === "object") for (let key in output) output[key] = jsonParse(output[key])

  return output
}

const contains = (target, value) => target.indexOf(value) >= 0

const returnDelayedPromise = (delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log(`\t\t\t returnDelayedPromise() after ${delay}ms`)
      resolve()
    }, delay)
  })
}

module.exports = {
  pathExists,
  ensurePath,
  deletePath,
  copySingle,
  copyArray,
  readFile,
  readChildren,
  getJson,
  jsonStringify,
  jsonParse,
  contains,
  returnDelayedPromise,
}
