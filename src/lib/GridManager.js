export default class GridManager {
  init({ width, height, rows, columns, positions, rootPositions }) {
    if (!this.build) {
      this.build = true
      this.width = width
      this.height = height
      this.rows = rows
      this.columns = columns

      this.makePoints()
    }
  }

  doublePoints(newPositions) {
    this.columns *= 2
    this.rows *= 2
    this.positions = newPositions

    this.makePoints()
  }

  makePoints() {
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
    let make_positions
    if (!this.positions) {
      this.positions = []
      make_positions = true
    }
    if (!this.rootPositions.length) {
      for (let i = 0; i < total; i++) {
        if (make_positions)
          this.positions.push({
            x: (i % columns) * colWidth,
            y: Math.floor(i / columns) * rowHeight,
            i,
          })
        this.rootPositions.push({
          x: (i % columns) * colWidth,
          y: Math.floor(i / columns) * rowHeight,
          i,
        })
      }
    }
    this.corners = {
      tl: 0,
      tr: this.rows,
      bl: (this.columns + 1) * this.rows,
      br: (this.columns + 1) * this.rows + this.rows,
    }
  }

  updateDot(i, x, y, square) {
    this.positions[i] = {
      x,
      y,
      i,
    }

    const self = this
    const limit = this.columns / 2
    console.log(limit, this.columns, square)
    // return
    function makeGo(index, squareValue) {
      if (squareValue > limit || index === null || index === undefined || !(index >= 0)) return

      const props = {
        divisions: self.columns / squareValue,
        amount: Math.pow(self.columns, 2) / squareValue,
        center: index,
      }
      const corners = [
        self.moveUpperLeft(props),
        self.moveUpperRight(props),
        self.moveLowerRight(props),
        self.moveLowerLeft(props),
      ]

      const double = squareValue * 2
      corners.forEach(corner => {
        for (let item in corner) makeGo(corner[item], double)
      })
    }

    makeGo(i, square)
  }

  moveLowerLeft({ divisions, amount, center }) {
    if (center % (this.columns + 1) === 0) return

    // to the left or the right
    let opposite = center - divisions
    // across in a corner
    let hypoten = center + amount
    // above or below
    let adjacent = hypoten + divisions

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

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }

  moveCommon({ center, opposite, adjacent, hypoten }) {
    let mid1 = (center + adjacent) / 2
    let mid2 = (center + opposite) / 2

    let avg = (adjacent + opposite) / 2

    let adjacentPos = this.positions[adjacent]
    let hypotenPos = this.positions[hypoten]
    let oppositePos = this.positions[opposite]

    let centerPos = this.positions[center]
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

      this.positions[mid1] = {
        x: (centerPos.x + adjacentPos.x) / 2,
        y: (centerPos.y + adjacentPos.y) / 2,
        i: mid1,
      }
      this.positions[mid2] = {
        x: (centerPos.x + oppositePos.x) / 2,
        y: (centerPos.y + oppositePos.y) / 2,
        i: mid2,
      }
    }

    return { avg, mid1, mid2, center }
  }

  setControlPoints(array) {
    this.controlPoints = array.map(index => index)
  }
}
