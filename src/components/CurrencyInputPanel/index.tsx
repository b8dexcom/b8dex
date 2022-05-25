import React from 'react'
import { Currency, Pair } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useModal } from '@pancakeswap/uikit'
import { Button, ChevronDownIcon, Text, Flex, Box, useMatchBreakpoints } from '../../uikit'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ isMobile?: boolean }>`
  padding: 2px;
  border-radius: 4px;
  background: linear-gradient(121.13deg, #4e89e3 0%, #66c8ff 100%);
  margin-right: 12px;
  height: 46px;
  width: ${({ isMobile }) => (isMobile ? '220px' : '189px')};
`

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  z-index: 1;
  background: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 8px;
`
const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  id: string
  showCommonBases?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      showCommonBases={showCommonBases}
    />,
  )
  return (
    <Box>
      <Flex mb="11px" alignItems="center" justifyContent="space-between">
        {label && (
          <Text color="#FFFFFF" fontSize="14px" lineHeight="16px" fontWeight="500">
            {label}
          </Text>
        )}
        {account && (
          <Text
            onClick={onMax}
            color="#FFFFFF"
            fontSize="14px"
            lineHeight="16px"
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
      <InputPanel id={id}>
        <Container>
          <CurrencySelectButton selected={!!currency} onClick={() => onPresentCurrencyModal()} isMobile={isMobile}>
            <Flex
              alignItems="center"
              justifyContent="center"
              background="#FFFFFF"
              width="100%"
              height="100%"
              padding="10px 5px"
            >
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" color="#505050" fontSize="15px" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" color="#505050" fontSize="15px" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
          <RowBetween>
            <NumericalInput
              className="token-amount-input"
              style={{ height: '46px', color: '#505050' }}
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
          </RowBetween>
        </Container>

        {/* <InputRow selected={disableCurrencySelect}> */}
        {/*  {account && currency && showMaxButton && label !== 'To' && ( */}
        {/*    <Button onClick={onMax} scale="xs" variant="secondary"> */}
        {/*      MAX */}
        {/*    </Button> */}
        {/*  )} */}
        {/* </InputRow> */}
      </InputPanel>
    </Box>
  )
}
