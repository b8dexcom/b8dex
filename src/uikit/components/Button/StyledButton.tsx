import styled, { DefaultTheme } from 'styled-components'
import { space, layout, variant } from 'styled-system'
import { scaleVariants, styleVariants } from './theme'
import { BaseButtonProps } from './types'

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.pancake-button--disabled {
        cursor: not-allowed;
      }
    `
  }

  return `
    &:disabled,
    &.pancake-button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      filter: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `
}

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? '.5' : '1'
}

const StyledButton = styled.button<BaseButtonProps>`
  align-items: center;
  border: 0;
  background: #4e89e3;
  color: #ffffff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  transition: background-color 0.2s, opacity 0.2s;

  &.connectWallet {
    background: #fff5ec;
    border-radius: 4px;
    box-shadow: none;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 16px;
    color: #ff822e;
    height: auto;
    padding: ${({ isMobile }) => (isMobile ? '12px 12px' : '10px 14px')};
    margin-top: ${({ isMobile }) => (isMobile ? '0' : '0')};
    margin-right: ${({ isMobile }) => (isMobile ? '0' : '0')};
    margin-left: 7px;

    svg {
      margin-right: ${({ isMobile }) => (isMobile ? '0' : '6px')};
    }
  }

  &.connectedWallet {
    background: #E7F7FF;
    border-radius: 4px;
    box-shadow: none;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 16px;
    color: #4E89E3;
    height: auto;
    padding: ${({ isMobile }) => (isMobile ? '12px 12px' : '10px 14px')};
    margin-top: ${({ isMobile }) => (isMobile ? '0' : '9px')};
    margin-right: ${({ isMobile }) => (isMobile ? '0' : '21px')};

    svg {
      margin-right: ${({ isMobile }) => (isMobile ? '0' : '6px')};
    }
  }
  
  &.activeWallet {
    display: flex;
    align-items: center;
    background: #E7F7FF;
    border-radius: 4px;
    box-shadow: none;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 16px;
    color: #4E89E3;
    height: auto;
    padding: ${({ isMobile }) => (isMobile ? '12px 12px' : '10px 12px')};
    margin-top: ${({ isMobile }) => (isMobile ? '0' : '0')};
    margin-right: ${({ isMobile }) => (isMobile ? '0' : '23px')};

    svg {
      margin-right: ${({ isMobile }) => (isMobile ? '0' : '0')};
    }
  }
  
  &.activeTransactions {
    background: #E7F7FF;
    border-radius: 4px;
    box-shadow: none;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 16px;
    color: #4E89E3;
    height: auto;
    padding: ${({ isMobile }) => (isMobile ? '12px 12px' : '10px 12px')};
    margin-top: ${({ isMobile }) => (isMobile ? '0' : '0')};
    margin-left: -14px;

    svg {
      margin-right: ${({ isMobile }) => (isMobile ? '0' : '0')};
      g {
        path {
          fill: #4E89E3;
        }
      }
    }
  }

  &.getTouchButton {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #4E89E3;
    background: no-repeat;
    box-shadow: none;
    border: 2px solid #4E89E3;
    box-sizing: border-box;
    filter: drop-shadow(0px 8px 16px rgba(38, 219, 148, 0.15));
    border-radius: 40px;
    padding: ${({ isMobile }) => (isMobile ? '28px 50px' : '34px 70px')};
  }
  
  &#confirm-swap-or-send {
    background: #4E89E3;
    border-radius: 4px;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    
    &:disabled {
      background-color: #E9EAEB;
      border-color: #E9EAEB;
      box-shadow: none;
      color: #BDC2C4;
      cursor: not-allowed;
    }
  }

  &.addLiquidity {

  }

  &.participateICO {
    border-radius: 24px;
    height: 50px;
  }

  &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
    opacity: 0.65;
  }

  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    opacity: 0.85;
    transform: translateY(1px);
    box-shadow: none;
  }

  ${getDisabledStyles}
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
`

export default StyledButton
