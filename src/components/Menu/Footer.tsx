import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, useMatchBreakpoints } from '../../uikit'

const Wrapper = styled.div<{ isMobile: boolean, backgroundColor?: string }>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 16px;
  padding-right: 0;
  margin-top: ${({ isMobile }) => (isMobile ? 'auto' : '100px')};
  background-color: ${({ backgroundColor }) => (backgroundColor || 'none')};
  padding-bottom: 40px;
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: center;
    flex-direction: row;
  }
`

const Footer: React.FC<{ backgroundColor?: string }> = ({ backgroundColor }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Wrapper isMobile={isMobile} backgroundColor={backgroundColor}>
      <Flex flexDirection={['column', 'column', 'row']} alignItems="center" justifyContent="center">
        <Text color="#8A8A8A" fontSize="14px" lineHeight="16px">
          {t('All rights reserved © 2022 B8DEX')}
        </Text>
      </Flex>
    </Wrapper>
  )
}

export default Footer
