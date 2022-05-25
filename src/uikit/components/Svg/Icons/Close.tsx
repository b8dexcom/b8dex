import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 18 18" {...props} fill="none">
      <path d="M1 1L17 17M17 1L1 17" stroke="#505050"/>
    </Svg>
  )
}

export default Icon
