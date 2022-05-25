import { Percent } from '@pancakeswap/sdk'
import React from 'react'
import { ONE_BIPS } from '../../../config/constants'
import { Text } from '../../../uikit'
/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  return (
    <Text fontSize="14px" color="#505050" fontWeight="500" textAlign="right">
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </Text>
  )
}
