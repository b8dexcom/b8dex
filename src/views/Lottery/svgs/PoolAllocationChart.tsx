import React from 'react'
import { Svg, SvgProps } from '../../../uikit'

const PoolAllocationChart: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 318 23" {...props}>
      <svg width="318" height="23" viewBox="0 0 318 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="318" height="23" fill="#FF9055"/>
        <rect x="122" width="68" height="23" fill="#DC385D"/>
        <rect x="190" width="32" height="23" fill="#AE1F83"/>
        <rect x="222" width="47" height="23" fill="#FFCF61"/>
        <rect x="269" width="18" height="23" fill="#521C96"/>
        <rect x="287" width="17" height="23" fill="#D7FF65"/>
        <rect x="313" width="5" height="23" fill="#899EE6"/>
        <rect x="304" width="9" height="23" fill="#6158C4"/>
      </svg>
    </Svg>
  )
}

export default PoolAllocationChart
