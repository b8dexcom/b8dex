import React, {useState} from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import {useWeb3React} from "@web3-react/core";
import {Flex, Input, CardHeader, Heading, Text, useMatchBreakpoints, useTooltip, HelpIcon} from '../../../../uikit'
import BuyTokensButton from "../BuyTokensButton";

const StyledCard = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: column;
  width: ${({ isMobile }) => (isMobile ? '100%' : '445px')};
  margin-top: 46px;
  background: #FFFFFF;
  border-radius: 24px;
`

const StyledCardHeader = styled(CardHeader)<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  z-index: 2;
  background: none;
  padding: ${({ isMobile }) => (isMobile ? '28px 19px' : '41px 46px 26px')};
  border-bottom: 2px solid rgba(65, 65, 65, 0.15);
`

const StyledCardBody = styled(Flex)<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: none;
  padding: ${({ isMobile }) => (isMobile ? '11px 46px 41px' : '11px 46px 41px')};
`

const StyledCardBodyRow = styled(Flex)<{ isMobile?: boolean, withBorder?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  border-bottom: ${({ withBorder }) => (withBorder ? '1px solid rgba(65, 65, 65, 0.15)' : '')};
  padding: 23px 0;
`

const StyledCardBtnWrap = styled(Flex)<{ isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 29px;
  margin-bottom: 21px;
`

const StyledCardBtn = styled(Flex)<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  background: #FBFBFB;
  border: 1px solid rgba(65, 65, 65, 0.15);
  border-radius: 6px;
`

const StyledCardBtnLabel = styled(Flex)<{ isMobile?: boolean }>`
  display: block;
  margin-top: 16px;
`

const StyledCardBtnInput = styled(Input)<{ isMobile?: boolean }>`
  height: 30px;
  position: relative;
  background: none;
  border: 0;
  text-align: center;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  color: #333333;
  box-shadow: none;
  padding: 20px 0;
  margin-bottom: 18px;
  
  &:disabled {
    background: none;
    box-shadow: none;
    color: #333333;
    cursor: not-allowed;
  }
`

interface OptionCardProps {
  title: string
  startDate: string
  totalTokens: string
  price: number
  tge: number
  lock: string
  vesting: string
  disabled?: boolean
}

const OptionCard = ({ title, startDate, totalTokens, price, tge, lock, vesting, disabled }: OptionCardProps) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [firstOptionInputValue, setFirstOptionInputValue] = useState('0$')
  const [firstOptionValue, setFirstOptionValue] = useState(0)
  const [secondOptionInputValue, setSecondOptionInputValue] = useState('0B8T')

  const enforcer = (nextUserInput: string) => {
    const newNextUserInput = Number(nextUserInput.replace(/\D/g, ''))
    setFirstOptionInputValue(`${newNextUserInput}$`)
    setFirstOptionValue(newNextUserInput)
    setSecondOptionInputValue(`${newNextUserInput / price}B8T`)
  }

  const TooltipComponent = () => (
    <>
      <Text>{t('Token Generating Event - the moment when tokens are issued to owners')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <StyledCard isMobile={isMobile}>
      {tooltipVisible && tooltip}
      <StyledCardHeader isMobile={isMobile}>
        <div>
          <Heading
            fontWeight="600"
            fontSize={isMobile ? '19px' : '30px'}
            lineHeight={isMobile ? '24px' : '30px'}
            color="#60b6f7"
            mb={isMobile ? '11px' : '16px'}
          >
            {title}
          </Heading>
          <Text
            display="inline"
            fontWeight="500"
            fontSize={isMobile ? '14px' : '16px'}
            lineHeight={isMobile ? '18px' : '18px'}
            color="#a9a9a9"
          >
            {t('Total tokens:')}{' '}
            <span
              style={{ color: '#414141', fontSize: isMobile ? '16px' : '18px' }}
            >
              {totalTokens}
            </span>
          </Text>
        </div>
        <Text
          display="inline"
          fontWeight="500"
          fontSize={isMobile ? '14px' : '16px'}
          lineHeight={isMobile ? '18px' : '18px'}
          color="#a9a9a9"
          mt="10px"
        >
          {startDate}
        </Text>
      </StyledCardHeader>
      <StyledCardBody isMobile={isMobile}>
        <StyledCardBodyRow withBorder>
          <Text
            display="inline"
            fontWeight="500"
            fontSize={isMobile ? '14px' : '15px'}
            lineHeight={isMobile ? '14px' : '19px'}
            color="#a9a9a9"
          >
            {t('Price for 1 B8T:')}
          </Text>

          <Text
            display="inline"
            fontWeight="400"
            fontSize={isMobile ? '14px' : '19px'}
            lineHeight={isMobile ? '14px' : '19px'}
            color="#a9a9a9"
          >
            {`${price}$`}
          </Text>
        </StyledCardBodyRow>
        <StyledCardBodyRow withBorder>
          <Flex alignItems="center" justifyContent="center" ref={targetRef}>
            <Text
              display="inline"
              fontWeight="500"
              fontSize={isMobile ? '14px' : '15px'}
              lineHeight={isMobile ? '14px' : '19px'}
              color="#a9a9a9"
            >
              {t('TGE:')}
            </Text>
            <HelpIcon ml="4px" width="14px" height="14px" color="textSubtle" />
          </Flex>
          <Text
            display="inline"
            fontWeight="400"
            fontSize={isMobile ? '14px' : '19px'}
            lineHeight={isMobile ? '14px' : '19px'}
            color="#a9a9a9"
          >
            {`${tge}%`}
          </Text>
        </StyledCardBodyRow>
        <StyledCardBodyRow>
          <Text
            display="inline"
            fontWeight="500"
            fontSize={isMobile ? '14px' : '15px'}
            lineHeight={isMobile ? '14px' : '19px'}
            color="#a9a9a9"
          >
            {t('Lock for:')}
          </Text>

          <Text
            display="inline"
            fontWeight="400"
            fontSize={isMobile ? '14px' : '19px'}
            lineHeight={isMobile ? '14px' : '19px'}
            color="#a9a9a9"
          >
            {lock}
          </Text>
        </StyledCardBodyRow>
        <div style={{ background: 'rgba(78, 137, 227, 0.12)', borderRadius: '6px', marginTop: '4px' }}>
          <Text
            textAlign="center"
            fontWeight="400"
            fontSize={isMobile ? '15px' : '15px'}
            lineHeight={isMobile ? '33px' : '33px'}
            color="#4E89E3"
          >
            {vesting}
          </Text>
        </div>
        <StyledCardBtnWrap>
          <StyledCardBtn>
            <StyledCardBtnLabel>
              <Text
                textAlign="center"
                fontWeight="500"
                fontSize={isMobile ? '15px' : '15px'}
                lineHeight={isMobile ? '24px' : '24px'}
                color="#a9a9a9"
              >
                {t('Your invest:')}
              </Text>
            </StyledCardBtnLabel>
            <StyledCardBtnInput
              value={firstOptionInputValue}
              placeholder="0$"
              onChange={(event) => {
                // replace commas with periods, because we exclusively uses period as the decimal separator
                enforcer(event.target.value.replace(/,/g, '.'))
              }}
            />
          </StyledCardBtn>
          <StyledCardBtn>
            <StyledCardBtnLabel>
              <Text
                textAlign="center"
                fontWeight="500"
                fontSize={isMobile ? '15px' : '15px'}
                lineHeight={isMobile ? '24px' : '24px'}
                color="#a9a9a9"
              >
                {t('Your get:')}
              </Text>
            </StyledCardBtnLabel>
            <StyledCardBtnInput
              value={secondOptionInputValue}
              placeholder="0B8T"
              disabled
            />
          </StyledCardBtn>
        </StyledCardBtnWrap>
        {
          account ? (
            <BuyTokensButton
              className="participateICO"
              disabled={disabled || !firstOptionValue}
              busdForPurchase={firstOptionValue}
            />
          ) : null
        }
      </StyledCardBody>
    </StyledCard>
  )
}

export default OptionCard
