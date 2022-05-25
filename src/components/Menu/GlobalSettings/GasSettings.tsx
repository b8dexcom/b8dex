import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'
import styled from "styled-components";
import { Flex, Button, Text, useMatchBreakpoints } from '../../../uikit'

const ButtonContainer = styled(Flex)<{ isMobile: boolean }>`
  flex-wrap: wrap;
  width: ${({ isMobile }) => isMobile ? 'calc(100% - 2px)' : '650px'};
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  overflow: hidden;
`

const SelectButton = styled(Button)<{ isActive: boolean, isMobile: boolean }>`
  font-weight: normal;
  font-size: 15px;
  line-height: 16px;
  background-color: ${({ isActive }) => isActive ? '#F9F9F9' : 'transparent'};
  color: ${({ isActive }) => isActive ? '#505050' : '#8A8A8A'};
  border-right: 1px solid #E5E5E5;
  flex: 1 1 0;
  height: ${({ isMobile }) => isMobile ? '50px' : '47px'};
  padding: ${({ isMobile }) => isMobile ? '0 8px' : '0 24px'};
  border-radius: 0;

  &:last-child {
    border-right: 0;
  }
`

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex flexDirection="column">
      <Flex mb="11px" alignItems="center">
        <Text fontSize={isMobile ? '15px' : '14px'} lineHeight="16px" color="#505050">{t('Default Transaction Speed (GWEI)')}</Text>
      </Flex>
      <ButtonContainer isMobile={isMobile}>
        <SelectButton
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          isActive={gasPrice === GAS_PRICE_GWEI.default}
          isMobile={isMobile}
        >
          {t('Standard')}
        </SelectButton>
        <SelectButton
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          isActive={gasPrice === GAS_PRICE_GWEI.fast}
          isMobile={isMobile}
        >
          {t('Fast')}
        </SelectButton>
        <SelectButton
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          isActive={gasPrice === GAS_PRICE_GWEI.instant}
          isMobile={isMobile}
        >
          {t('Instant')}
        </SelectButton>
      </ButtonContainer>
    </Flex>
  )
}

export default GasSettings
