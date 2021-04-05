import React, { useEffect, useRef, useState } from "react"
import { traverseTwoPhase } from "react-dom/test-utils"
import useEffectOnce from "../../hooks/useEffectOnce"

import "./style.scss"

const CenteredItem = React.forwardRef(({ children, className }) => {
  return <div className={`centered-item${className ? ` ${className}` : ""}`}>{children}</div>
})

export default CenteredItem
