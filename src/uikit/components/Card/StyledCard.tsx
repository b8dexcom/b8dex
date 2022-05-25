import styled, { DefaultTheme, keyframes, css } from 'styled-components'
import { space } from 'styled-system'
import { Box } from '../Box'
import { CardProps } from './types'

const PromotedGradient = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

interface StyledCardProps extends CardProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBorderColor = ({ isActive, isSuccess, isWarning, borderBackground, theme }: StyledCardProps) => {
  if (borderBackground) {
    return borderBackground
  }
  if (isWarning) {
    return theme.colors.warning
  }

  if (isSuccess) {
    return theme.colors.success
  }

  if (isActive) {
    return `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`
  }

  return theme.colors.cardBorder
}

export const StyledCard = styled.div<StyledCardProps>`
  background: ${getBorderColor};
  border-radius: 4px;
  color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? 'textDisabled' : 'text']};
  overflow: hidden;
  position: relative;

  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${PromotedGradient} 3s ease infinite;
      background-size: 400% 400%;
    `}

  ${space}
`

export const StyledCardInner = styled(Box)<{ background?: string; hasCustomBorder: boolean }>`
  width: 100%;
  height: 100%;
  overflow: ${({ hasCustomBorder }) => (hasCustomBorder ? 'initial' : 'inherit')};
  background: ${({ background }) => background || 'linear-gradient(172.95deg, #4e89e3 5.5%, #66c8ff 94.5%)'};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
`

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
}
