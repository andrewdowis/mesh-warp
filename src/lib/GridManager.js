export default class GridManager {
  init({ width, height, rows, columns, positions, rootPositions }) {
    if (!this.build) {
      this.build = true
      this.width = width
      this.height = height
      this.rows = rows
      this.columns = columns

      const colWidth = width / columns
      const rowHeight = height / rows

      // given 1x1, should return 2x2, 4 total, 0-3
      // given 3x2, should return 4x3, 12 total, 0-11
      columns++
      rows++

      const total = rows * columns
      this.positions = positions || []
      this.rootPositions = rootPositions || []

      if (!this.rootPositions.length) {
        for (let i = 0; i < total; i++) {
          const data = {
            x: (i % columns) * colWidth,
            y: Math.floor(i / columns) * rowHeight,
            i,
          }
          this.positions.push(data)

          this.rootPositions.push({ ...data })
        }
      }
    }
  }

  doublePoints(newPositions) {
    // console.warn(`Going from ${this.columns}x${this.rows}`)
    // console.log(`\t ${this.positions.slice().length}`)
    this.columns *= 2
    this.rows *= 2
    this.positions = newPositions

    // console.warn(`\t to ${this.columns}x${this.rows}`)
    // console.log(`\t ${this.positions.length}`)

    let columns = this.columns
    let rows = this.rows
    const colWidth = this.width / columns
    const rowHeight = this.height / rows

    // given 1x1, should return 2x2, 4 total, 0-3
    // given 3x2, should return 4x3, 12 total, 0-11
    columns++
    rows++

    const total = rows * columns
    this.rootPositions = []
    if (!this.rootPositions.length) {
      for (let i = 0; i < total; i++) {
        const data = {
          x: (i % columns) * colWidth,
          y: Math.floor(i / columns) * rowHeight,
          i,
        }

        this.rootPositions.push(data)
      }
    }
  }

  updateDot(i, x, y, square) {
    this.positions[i] = {
      x,
      y,
      i,
    }

    const self = this
    // const index = i
    // const squareValue = square
    function makeGo(index, squareValue) {
      if (index === null || index === undefined || !(index >= 0) || squareValue > 2) return
      const props = self.buildCommon(index, squareValue)
      const nextUL = self.moveUpperLeft(props)
      const nextUR = self.moveUpperRight(props)
      const nextLR = self.moveLowerRight(props)
      const nextLL = self.moveLowerLeft(props)

      const double = squareValue * 2
      makeGo(nextUL, double)
      makeGo(nextUR, double)
      makeGo(nextLR, double)
      makeGo(nextLL, double)

      // // console.warn(self.moveUpperRight(props))
      // // console.warn(self.moveLowerRight(props))
      // // console.warn(self.moveLowerLeft(props))
    }

    makeGo(i, square)
  }

  buildCommon(i, square) {
    const divisions = this.columns / square
    const colsX = divisions + 2 * square
    const amount = Math.pow(this.columns, 2) / square

    let center = i

    // console.log({ square, divisions, colsX, amount })

    return { divisions, amount, center }
  }

  moveLowerLeft({ divisions, amount, center }) {
    if (center % (this.columns + 1) === 0) return

    // to the left or the right
    let opposite = center - divisions
    // across in a corner
    let hypoten = center + amount
    // above or below
    let adjacent = hypoten + divisions

    // // console.log("\t", { center, opposite, adjacent, hypoten })

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }
  moveLowerRight({ divisions, amount, center }) {
    if ((center + 1) % (this.columns + 1) === 0) return

    // to the left or the right
    let opposite = center + divisions
    // above or below
    let adjacent = opposite + amount
    // across in a corner
    let hypoten = adjacent + divisions

    // // console.log("\t", { center, opposite, adjacent, hypoten })

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }
  moveUpperRight({ divisions, amount, center }) {
    if ((center + 1) % (this.columns + 1) === 0) return
    // to the left or the right
    let opposite = center + divisions
    // across in a corner
    let hypoten = center - amount
    // above or below
    let adjacent = hypoten - divisions

    // // console.log("\t", { center, opposite, adjacent, hypoten })

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }

  moveUpperLeft({ divisions, amount, center }) {
    if (center % (this.columns + 1) === 0) return

    // to the left or the right
    let opposite = center - divisions
    // above or below
    let adjacent = opposite - amount
    // across in a corner
    let hypoten = adjacent - divisions

    // console.log("\t", { center, opposite, adjacent, hypoten })

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }

  moveCommon({ center, opposite, adjacent, hypoten }) {
    let mid1 = (center + adjacent) / 2
    let mid2 = (center + opposite) / 2

    let avg = (adjacent + opposite) / 2

    const next = (hypoten + center) / 2

    let adjacentPos = this.positions[adjacent]
    let hypotenPos = this.positions[hypoten]
    let oppositePos = this.positions[opposite]

    let centerPos = this.positions[center]
    // console.warn(avg)
    if (
      adjacentPos &&
      centerPos &&
      hypotenPos &&
      oppositePos &&
      this.positions[avg] &&
      this.positions[mid1] &&
      this.positions[mid2]
    ) {
      this.positions[avg] = {
        x: (adjacentPos.x + oppositePos.x + hypotenPos.x + centerPos.x) / 4,
        y: (adjacentPos.y + oppositePos.y + hypotenPos.y + centerPos.y) / 4,
        i: avg,
      }
      // console.log(center)
      // console.warn(this.positions[avg])
      this.crawlToAverage(center, adjacent)
      this.crawlToAverage(center, opposite)
    }

    return next
  }

  crawlToAverage(center, end) {
    const avg = (center + end) / 2
    if (avg === end || Math.abs(center - 1) <= 1) return

    // if (end % (this.columns + 1) === 0) return

    const centerPos = this.positions[center]
    const endPos = this.positions[end]
    if (centerPos && endPos) {
      this.positions[avg] = {
        x: (endPos.x + centerPos.x) / 2,
        y: (endPos.y + centerPos.y) / 2,
        i: avg,
      }
    }

    this.crawlToAverage(avg, end)
  }

  setControlPoints(array) {
    this.controlPoints = array.map(index => index)
  }
}
