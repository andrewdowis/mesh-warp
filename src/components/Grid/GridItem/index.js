import React, { useEffect, useRef, useState } from "react"

const GridItem = React.forwardRef((props, ref) => {
  const { positions } = props
  return <div className="grid-item"></div>
})
export default GridItem
