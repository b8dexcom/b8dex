import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  width: 100%;
`

export const StyledInputCurrencyWrapper = styled(Box)<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '435px')};
`
