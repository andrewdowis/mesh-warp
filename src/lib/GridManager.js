export default class GridManager {
  init({ width, height, rows, columns, rootPositions, positions }) {
    if (!this.build) {
      this.build = true
      this.width = width
      this.height = height
      this.rows = rows
      this.columns = columns

      this.makePoints(rootPositions, positions)
    }
  }

  getAverage(...indexes) {
    let x = 0
    let y = 0
    indexes.forEach(index => {
      x += this.positions[index].x
      y += this.positions[index].y
    })
    x /= indexes.length
    y /= indexes.length

    return { x, y }
  }

  updateQuantity(add_or_subtract) {
    let new_points = []
    switch (add_or_subtract) {
      case "+":
      case "add":
        const old_points = this.positions
        const new_points_01_columns = []
        const new_points_02_rows = []
        const new_points_03_square = []

        for (let i = 0; i < old_points.length; i++) {
          if (i + this.gCols < old_points.length) new_points_02_rows.push(this.getAverage(i, i + this.gCols))
          if (i % this.gCols !== this.columns) {
            if (i + 1 < old_points.length) new_points_01_columns.push(this.getAverage(i, i + 1))
            if (i + this.gCols < old_points.length)
              new_points_03_square.push(this.getAverage(i, i + 1, i + this.gCols, i + this.gCols + 1))
          }
        }

        let direction = "across"
        const col_total = this.columns + this.gCols
        function pushNew(array1, array2, nextValue) {
          for (let i = 0; i < col_total; i++) {
            if (i % 2) {
              new_points.push(array1.shift())
            } else {
              new_points.push(array2.shift())
            }

            new_points[new_points.length - 1].i = new_points.length - 1
            if (i === col_total - 1) direction = nextValue
          }
        }
        while (
          old_points.length +
          new_points_01_columns.length +
          new_points_02_rows.length +
          new_points_03_square.length
        ) {
          switch (direction) {
            case "across":
              pushNew(new_points_01_columns, old_points, "middle")
              break
            case "middle":
              pushNew(new_points_03_square, new_points_02_rows, "across")

              break
            default:
              break
          }
        }

        this.columns *= 2
        this.rows *= 2
        break
      case "-":
      case "subtract":
        let modulo = 1

        for (let i = 0; i < this.gRows; i += 2) {
          for (let c = 0; c < this.gCols; c += 2) {
            const index = i * this.gCols + c
            let coord = this.positions[index]
            coord.i = index
            new_points.push(coord)
          }
        }

        this.columns /= 2
        this.rows /= 2
        break
      default:
        break
    }

    this.gCols = this.columns + 1
    this.gRows = this.rows + 1

    this.positions = new_points

    this.makePoints()
  }

  makePoints(rootPositions, positions) {
    const colWidth = this.width / this.columns
    const rowHeight = this.height / this.rows

    this.gCols = this.columns + 1
    this.gRows = this.rows + 1

    if (positions && rootPositions) {
      this.positions = positions
      this.rootPositions = rootPositions
    } else {
      const total = this.gRows * this.gCols
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
              x: (i % this.gCols) * colWidth,
              y: Math.floor(i / this.gCols) * rowHeight,
              i,
            })
          this.rootPositions.push({
            x: (i % this.gCols) * colWidth,
            y: Math.floor(i / this.gCols) * rowHeight,
            i,
          })
        }
      }
    }
    this.corners = {
      tl: 0,
      tr: this.rows,
      bl: this.gCols * this.rows,
      br: this.gCols * this.rows + this.rows,
    }
  }

  updateDot(i, x, y, square) {
    this.positions[i] = {
      x,
      y,
      i,
    }

    this.makeGo(i, square, this.columns / Math.max(1, square / 2))
  }

  makeGo(index, squareValue, checks) {
    if (checks <= 1 || index === null || index === undefined || !(index >= 0)) return

    const props = {
      divisions: this.columns / squareValue,
      amount: Math.pow(this.columns, 2) / squareValue,
      center: index,
    }
    const corners = [
      this.moveUpperLeft(props),
      this.moveUpperRight(props),
      this.moveLowerRight(props),
      this.moveLowerLeft(props),
    ]

    const double = squareValue * 2
    corners.forEach(corner => {
      for (let item in corner) this.makeGo(corner[item], double, checks / 2)
    })
  }

  moveLowerLeft({ divisions, amount, center }) {
    if (center % this.gCols === 0) return

    // to the left or the right
    let opposite = center - divisions
    // across in a corner
    let hypoten = center + amount
    // above or below
    let adjacent = hypoten + divisions

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }
  moveLowerRight({ divisions, amount, center }) {
    if ((center + 1) % this.gCols === 0) return

    // to the left or the right
    let opposite = center + divisions
    // above or below
    let adjacent = opposite + amount
    // across in a corner
    let hypoten = adjacent + divisions

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }
  moveUpperRight({ divisions, amount, center }) {
    if ((center + 1) % this.gCols === 0) return
    // to the left or the right
    let opposite = center + divisions
    // across in a corner
    let hypoten = center - amount
    // above or below
    let adjacent = hypoten - divisions

    return this.moveCommon({ center, opposite, adjacent, hypoten })
  }

  moveUpperLeft({ divisions, amount, center }) {
    if (center % this.gCols === 0) return

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
