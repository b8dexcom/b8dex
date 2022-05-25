import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 18 18" {...props}>
      <path d="M0 4.93986L0.944019 5.86354L3.7518 3.05379L3.7518 16.8716H5.06385L5.06385 3.05379L7.87229 5.86288L8.81566 4.93986L4.40783 0.53334L0 4.93986ZM9.18434 13.0582L13.5922 17.4666L18 13.0582L17.0566 12.1358L14.2482 14.9442L14.2482 1.12704H12.9361L12.9361 14.9449L10.1277 12.1358L9.18434 13.0582Z" fill="#CDEDFF"/>
    </Svg>
  )
}

export default Icon
