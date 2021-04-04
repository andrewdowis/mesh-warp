import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import useEffectOnce from "../../hooks/useEffectOnce"

import "./style.scss"

const CenteredItem = React.forwardRef(({ children }) => {
  return <div className="centered-item">{children}</div>
})

export default CenteredItem
