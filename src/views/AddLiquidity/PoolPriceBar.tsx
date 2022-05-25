import { Currency, Percent, Price } from '@pancakeswap/sdk'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text } from '../../uikit'
import { AutoColumn } from '../../components/Layout/Column'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'

export const Wrapper = styled.div`
  margin-top: 28px;
  padding: 19px 4px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
`

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn gap="md" style={{ padding: '0 16px' }}>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="#505050">
              {t('Share of Pool')}
            </Text>
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px" color="#505050" fontWeight="500" textAlign="right">
              {noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
              %
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="#505050">
              {t('Price')}
            </Text>
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px" color="#505050" fontWeight="500" textAlign="right">
              {`${price?.invert()?.toSignificant(6) ?? '-'} ${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    </Wrapper>
  )
}

export default PoolPriceBar
