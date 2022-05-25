import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, ArrowDownIcon, IconButton, ChartDisableIcon, useMatchBreakpoints } from '../../../uikit'
import GlobalSettings from '../../../components/Menu/GlobalSettings'

interface Props {
  title: string
  setSwitchTokens: () => void
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
}

const CurrencyInputContainer = styled(Flex)`
  align-items: center;
  padding: 21px 20px 14px;
  width: 100%;
`

const CurrencyInputHeader: React.FC<Props> = ({ title, setSwitchTokens, setIsChartDisplayed, isChartDisplayed }) => {
  const { isMobile } = useMatchBreakpoints()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }

  return (
    <CurrencyInputContainer>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" alignItems="center">
          <Heading as="h2" mb="0" color="#ffffff">
            {title}
          </Heading>
        </Flex>
        <Flex>
          {setIsChartDisplayed && !isMobile && (
            <IconButton
              onClick={toggleChartDisplayed}
              variant="light"
              scale="sm"
              mr="18px"
            >
              {isChartDisplayed ? <ChartDisableIcon width="18px" color="#CDEDFF" /> : <ChartDisableIcon width="18px" color="#CDEDFF" />}
            </IconButton>
          )}
          <IconButton variant="light" scale="sm" mr="18px">
            <ArrowDownIcon
              width="18px"
              onClick={() => {
                setSwitchTokens()
              }}
              color="#CDEDFF"
            />
          </IconButton>
          <GlobalSettings color="#CDEDFF" mr="4px" />
        </Flex>
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
