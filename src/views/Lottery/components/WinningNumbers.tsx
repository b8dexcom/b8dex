import React, { useEffect, useState } from 'react'
import { random } from 'lodash'
import uniqueId from 'lodash/uniqueId'
import { Flex, FlexProps } from '../../../uikit'
import { parseRetrievedNumber } from '../helpers'
import { BallWithNumber } from '../svgs'
import { BallColor } from '../svgs/Balls'

interface WinningNumbersProps extends FlexProps {
  number: string
  size?: string
  fontSize?: string
  rotateText?: boolean
  isMobile?: boolean
}

const WinningNumbers: React.FC<WinningNumbersProps> = ({
  number,
  size = '32px',
  fontSize = '16px',
  rotateText,
  isMobile = false,
  ...containerProps
}) => {
  const [rotationValues, setRotationValues] = useState([])
  const reversedNumber = parseRetrievedNumber(number)
  const numAsArray = reversedNumber.split('')
  const colors: BallColor[] = ['pink', 'lilac', 'teal', 'aqua', 'green', 'yellow']

  useEffect(() => {
    if (rotateText && numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)))
    }
  }, [rotateText, numAsArray, rotationValues])

  return (
    <Flex justifyContent="space-between" {...containerProps} flexWrap="wrap">
      {numAsArray.map((num, index) => {
        return (
          <BallWithNumber
            key={uniqueId()}
            rotationTransform={rotateText && rotationValues[index]}
            size={size}
            fontSize={fontSize}
            color={colors[index]}
            number={num}
            flex={isMobile ? '0 0 12%' : '0 0 24%'}
            mb={isMobile ? '0' : '30px'}
          />
        )
      })}
    </Flex>
  )
}

export default WinningNumbers
