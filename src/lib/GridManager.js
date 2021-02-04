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
          }
          this.positions.push(data)

          this.rootPositions.push({ ...data })
        }
      }

      this.grids = []

      for (let i = 0; i < this.positions.length - columns; i++)
        this.grids.push({
          t1: [0, 1, columns],
          t2: [1, columns, 1 + columns],
        })
    }
  }

  doublePoints(newPositions) {
    console.warn(`Going from ${this.columns}x${this.rows}`)
    console.log(`\t ${this.positions.slice().length}`)
    this.columns *= 2
    this.rows *= 2
    this.positions = newPositions

    console.warn(`\t to ${this.columns}x${this.rows}`)
    console.log(`\t ${this.positions.length}`)

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
        }

        this.rootPositions.push(data)
      }
    }

    console.warn("new positions")
    console.log(this.positions)
    console.warn("new roots")
    console.log(this.rootPositions)

    // throw new Error("STOP")
  }

  updateDot(index, x, y) {
    this.positions[index] = {
      x,
      y,
    }
  }
}
