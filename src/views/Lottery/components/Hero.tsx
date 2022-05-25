import React from 'react'
import styled from 'styled-components'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useWeb3React } from "@web3-react/core";
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'
import {Flex, Heading, Skeleton, Text, useMatchBreakpoints} from "../../../uikit";
import Countdown from "./Countdown";
import CheckPrizesSection from "./CheckPrizesSection";

const HeroContainer = styled(Flex)<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: ${({ isMobile }) => (isMobile ? '110px 19px' : '198px 42px')};
  padding-bottom: 0;
  min-height: calc(100vh - 65px);
`

const TicketBlock = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  justify-content: space-between;
  width: 100%;
  z-index: 9;
`

const TicketTitles = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: column;
  margin-top: ${({ isMobile }) => (isMobile ? '0' : '90px')};
  margin-bottom: ${({ isMobile }) => (isMobile ? '33px' : '0')};
`

const RightSide = styled(Flex)`
  flex-direction: column;
  margin-left: auto;
`

const TicketContainer = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: column;
  margin-left: auto;
  background: #FFFFFF;
  border-radius: 30px;
  padding: ${({ isMobile }) => (isMobile ? '35px 25px' : '40px 70px')};
`

const PrizeTotalBalance = styled(Balance)`
  background: linear-gradient(180deg, #64C2FC 0%, #4E89E3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean, isMobile?: boolean }>`
  width: 100%;
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
  padding: ${({ isMobile }) => (isMobile ? '28px 0' : '34px 0')};
`

const ButtonWrapper = styled.div`
  display: block;
  position: relative;
`

const TicketSvgWrapper = styled.div<{ isMobile?: boolean }>`
  position: relative;
  margin-bottom: ${({ isMobile }) => (isMobile ? '35px' : '27px')};
  
  svg {
    width: 100%;
    height: auto;
  }
`

const TicketSvgText = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  
  & .TicketSvgText {
    &__main {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    
    &__currency {
      display: flex;
      align-items: center;
      width: 19%;
    }
  }
`

interface HeroProps {
  // currentLottery?: any
  // setCurrentLottery?: any
  nextEventTime?: number
}
// const Hero = ({ currentLottery, setCurrentLottery, nextEventTime }: HeroProps) => {
const Hero = ({ nextEventTime }: HeroProps) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const {
    currentRound: { amountCollectedInTBCC, status },
    isTransitioning, currentRound
  } = useLottery()
  const { userTickets } = currentRound

  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInTBCC.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning
  const userTicketCount = userTickets?.tickets?.length || 0

  const ticketRoundText =
    userTicketCount > 1
      ? t('You have %amount% tickets this round', { amount: userTicketCount })
      : t('You have %amount% ticket this round', { amount: userTicketCount })
  const [youHaveText, ticketsThisRoundText] = ticketRoundText.split(userTicketCount.toString())

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {prizeInBusd.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance fontSize={isMobile ? '57px' : '130px'} fontWeight="800" unit=" B8T" lineHeight={isMobile ? '57px' : '130px'} value={prizeTotal} mb={isMobile ? '16px' : '25px'} decimals={0} textAlign={isMobile ? 'center' : 'left'} />
          )}
          <Heading
            color="rgba(65, 65, 65, 0.6)"
            fontWeight="500"
            fontSize={isMobile ? '23px' : '53px'}
            lineHeight={isMobile ? '23px' : '53px'}
            textAlign={isMobile ? 'center' : 'left'}
          >
            {t('prizes pool')}
          </Heading>
        </>
      )
    }
    return (
      <Heading
        color="rgba(65, 65, 65, 0.6)"
        fontWeight="500"
        fontSize={isMobile ? '23px' : '53px'}
        lineHeight={isMobile ? '23px' : '53px'}
        textAlign={isMobile ? 'center' : 'left'}
      >
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  return (
    <HeroContainer isMobile={isMobile}>
      <TicketBlock isMobile={isMobile}>
        <TicketTitles isMobile={isMobile}>
          <h2
            style={{
              color: "#414141",
              fontSize: isMobile ? '26px' : '53px',
              lineHeight: isMobile ? '26px' : '53px',
              fontWeight: "600",
              marginBottom: "18px",
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {t('The B8Dex Lottery')}
          </h2>
          {getHeroHeading()}
        </TicketTitles>

        <RightSide>
          <TicketContainer isMobile={isMobile}>
            {/* <Toggle */}
            {/*  className="toggle-lottery-button" */}
            {/*  checked={!currentLottery} */}
            {/*  startText={t('B8Dex Lottery')} */}
            {/*  endText={t('TBCC Lottery')} */}
            {/*  scale="md" */}
            {/*  onChange={() => { */}
            {/*    setCurrentLottery(!currentLottery) */}
            {/*  }} */}
            {/* /> */}
            <Flex mt="35px" mb={isMobile ? '13px' : '20px'} style={{ textAlign: "center", justifyContent: "center" }} >
              <Text
                fontSize={isMobile ? '18px' : '26px'}
                lineHeight={isMobile ? '18px' : '26px'}
                color="rgba(65, 65, 65, 0.45)"
                fontWeight="500"

              >
                {t('Get your tickets now!')}
              </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="center" mb="28px">
              {nextEventTime ? (
                <Countdown
                  nextEventTime={nextEventTime}
                />
              ) : (
                <Skeleton height="41px" width="250px" />
              )}
            </Flex>
            <TicketSvgWrapper isMobile={isMobile}>
              <TicketPurchaseCard width="100%" />
              <TicketSvgText>
                <div className="TicketSvgText__main">
                  <Text
                    fontSize={isMobile ? '16px' : '20px'}
                    lineHeight={isMobile ? '16px' : '20px'}
                    color="#4E89E3"
                    fontWeight="500"
                  >
                    {t('1 B8T token per ticket')}
                  </Text>
                  {account && (
                    <Flex justifyContent={['center', null, null, 'flex-start']} mt={isMobile ? '10px' : '8px'}>
                      <Text
                        display="inline"
                        fontSize={isMobile ? '13px' : '16px'}
                        lineHeight={isMobile ? '13px' : '16px'}
                        color="#333333"
                        fontWeight="500"
                      >{youHaveText}</Text>
                      {!userTickets.isLoading ? (
                        <Balance value={userTicketCount} decimals={0} display="inline" bold mx="4px" />
                      ) : (
                        <Skeleton mx="4px" height={isMobile ? 13 : 16} width={40} />
                      )}
                      <Text
                        display="inline"
                        fontSize={isMobile ? '13px' : '16px'}
                        lineHeight={isMobile ? '13px' : '16px'}
                        color="#333333"
                        fontWeight="500"
                      > {ticketsThisRoundText}</Text>
                    </Flex>
                  )}
                </div>
                <div className="TicketSvgText__currency">
                  <Text
                    fontSize={isMobile ? '18px' : '23px'}
                    lineHeight={isMobile ? '18px' : '23px'}
                    color="#BBBDCE"
                    fontWeight="500"
                    style={{ transform: "rotate(90deg)" }}
                  >
                    {t('B8DEX')}
                  </Text>
                </div>
              </TicketSvgText>
            </TicketSvgWrapper>

            <ButtonWrapper>
              <StyledBuyTicketButton disabled={ticketBuyIsDisabled} isMobile={isMobile} />
            </ButtonWrapper>

          </TicketContainer>

          <CheckPrizesSection />
        </RightSide>
      </TicketBlock>
    </HeroContainer>
  )
}

export default Hero
