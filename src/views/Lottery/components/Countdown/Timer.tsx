import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import {Flex, Heading, useMatchBreakpoints} from "../../../../uikit";

export interface TimerProps {
  minutes?: number
  hours?: number
  days?: number
}

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const StyledTimerText = styled(Heading)<{ isMobile?: boolean }>`
  font-weight: 500;
  font-size: ${({ isMobile }) => (isMobile ? '29px' : '38px')};
  line-height: ${({ isMobile }) => (isMobile ? '29px' : '38px')};
  color: #333333;
`

const Wrapper: React.FC<TimerProps> = ({ minutes, hours, days }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledTimerFlex alignItems="flex-end">
      {Boolean(days) && (
        <>
          <StyledTimerText isMobile={isMobile} mr="4px">
            {days}
          </StyledTimerText>
          <StyledTimerText isMobile={isMobile} mr="12px">{t('d')}</StyledTimerText>
          <StyledTimerText isMobile={isMobile} mr="4px">:</StyledTimerText>
        </>
      )}
      {Boolean(hours) && (
        <>
          <StyledTimerText isMobile={isMobile} mr="4px">
            {hours}
          </StyledTimerText>
          <StyledTimerText isMobile={isMobile} mr="12px">{t('h')}</StyledTimerText>
          <StyledTimerText isMobile={isMobile} mr="12px">:</StyledTimerText>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <StyledTimerText isMobile={isMobile} mr="4px">
            {minutes}
          </StyledTimerText>
          <StyledTimerText isMobile={isMobile} mr="12px">{t('m')}</StyledTimerText>
        </>
      )}
    </StyledTimerFlex>
  )
}

export default Wrapper
