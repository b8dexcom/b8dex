import React from 'react'
// import React, { useState } from 'react'
import styled from 'styled-components'

import { useTranslation } from 'contexts/Localization'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import {Link} from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  useMatchBreakpoints,
  Button
} from '../../uikit'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import AllHistoryCard from './components/AllHistoryCard'
import {BallWithNumber, MatchExampleA, MatchExampleB, PoolAllocationChart} from "./svgs";
import Footer from "../../components/Menu/Footer";

const LotteryPage = styled.div<{ isMobile?: boolean }>`
  min-height: calc(100vh - 64px);
  background: #F0F0FE;
  background-image: ${({ isMobile }) => (isMobile ? 'url(/images/decorations/lottery_first_slide_mobile.png)' : 'url(/images/decorations/lottery_first_slide.png)')};
  background-repeat: no-repeat;
  background-size: ${({ isMobile }) => (isMobile ? '100% auto' : '120% auto')};
  background-position: ${({ isMobile }) => (isMobile ? 'top center' : 'center -128px')};
`

const GappedFlex = styled(Flex)<{ gap?: string }>`
  gap: ${({ gap }) => gap ||  '24px'};
`

const BulletList = styled.ul<{ isMobile?: boolean }>`
  list-style-type: none;
  margin-left: ${({ isMobile }) => (isMobile ? '8px' : '11px')};
  padding: 0;
  li {
    margin: 0;
    padding: 0;
    margin-bottom: ${({ isMobile }) => (isMobile ? '21px' : '31px')};
  }
  li::before {
    content: '•';
    margin-right: 9px;
    font-size: 20px;
    color: #78809C;
  }
  li::marker {
    font-size: 12px;
  }
`

const BallsContainer = styled(Flex)<{ isMobile?: boolean }>`
  gap: 6.5px;
  padding-left: 7px;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ isMobile }) => (isMobile ? '23px' : '29px')};
`

const ExampleBalls = () => {
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const ballSize = isDesktop ? '40px' : '32px'
  const fontSize = isDesktop ? '14px' : '16px'
  return (
    <BallsContainer isMobile={isMobile}>
      <BallWithNumber size={ballSize} fontSize={fontSize} color="aqua" number="4" flex="0 0 8%" mb="0" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="lilac" number="7" flex="0 0 8%" mb="0" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="teal" number="3" flex="0 0 8%" mb="0" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="yellow" number="5" flex="0 0 8%" mb="0" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="pink" number="9" flex="0 0 8%" mb="0" />
      <BallWithNumber size={ballSize} fontSize={fontSize} color="green" number="6" flex="0 0 8%" mb="0" />
    </BallsContainer>
  )
}

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  background: #FFFFFF;
  padding: 1px 1px 3px 1px;
  border-radius: 24px;
`

const StepCardInner = styled(Box)<{ isMobile?: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '25px 26px' : '41px 33px')};
`

const MatchExampleContainer = styled.div<{ isMobile?: boolean }>`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: ${({ isMobile }) => (isMobile ? '63px 104px 63px' : '69px 123px 64px')};
`

const MatchExampleCard = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledStepCard
      width={isMobile ? '100%' : '417px'}
      mt={isMobile ? '8px' : '53px'}
    >
      <StepCardInner isMobile={isMobile} height="376px">
        <MatchExampleContainer isMobile={isMobile}>
          <Box />
          <ExampleBalls />
          <Text
            lineHeight="72px"
            textAlign="right"
            color="#414141"
            fontSize="22px"
            fontWeight="600"
          >
            {t('A')}
          </Text>
          <div style={{
            marginLeft: isMobile ? '12px' : '15px',
            marginTop: isMobile ? '30px' : '30px',
          }}>
            <MatchExampleA width={isMobile ? '247px' : '285px'} />
          </div>
          <Text
            lineHeight="72px"
            textAlign="right"
            color="#414141"
            fontSize="22px"
            fontWeight="600"
          >
            {t('B')}
          </Text>
          <div style={{
            marginLeft: isMobile ? '12px' : '15px',
            marginTop: isMobile ? '27px' : '30px',
          }}>
            <MatchExampleB width={isMobile ? '258px' : '298px'} />
          </div>
        </MatchExampleContainer>
      </StepCardInner>
    </StyledStepCard>
  )
}

const AllocationGrid = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  row-gap: 15px;
`

const AllocationColorCircle = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 13px;
  height: 13px;
  margin-right: 14px;
  background-color: ${({ color }) => color};
`

const AllocationMatch: React.FC<{ color: string; text: string; percent: string }> = ({ color, text, percent }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <AllocationColorCircle color={color} />
      <Text
        fontWeight="500"
        fontSize="16px"
        lineHeight="24px"
        color="#78809C"
        mr="auto"
        ml="0"
      >{text}</Text>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          borderBottom: '1px dashed #4F437A',
          marginLeft: '6px',
          marginRight: '6px',
          marginTop: '10px'
        }}
      />
      <Text
        fontWeight="500"
        fontSize="17px"
        lineHeight="24px"
        color="#414141"
        textAlign="right"
      >
        {percent}
      </Text>
    </Flex>
  )
}

const PoolAllocations = () => {
  const { t } = useTranslation()
  return (
    <StyledStepCard width="448px">
      <StepCardInner height="auto" style={{ padding: "47px 33px" }}>
        <Flex mb="17px" justifyContent="center">
          <PoolAllocationChart width="100%" />
        </Flex>
        <Flex mb="32px" justifyContent="center">
          <Text
            fontWeight="500"
            fontSize="16px"
            lineHeight="24px"
            color="#8C8C8D"
          >
            {t('Distribution of funds from purchased tickets:')}
          </Text>
        </Flex>
        <AllocationGrid>
          <AllocationMatch color="#899EE6" text={t('Matches first %digits%', { digits: 1 })} percent="2%" />
          <AllocationMatch color="#6158C4" text={t('Matches first %digits%', { digits: 2 })} percent="3%" />
          <AllocationMatch color="#521C96" text={t('Matches first %digits%', { digits: 3 })} percent="5%" />
          <AllocationMatch color="#AE1F83" text={t('Matches first %digits%', { digits: 4 })} percent="10%" />
          <AllocationMatch color="#DC385D" text={t('Matches first %digits%', { digits: 5 })} percent="20%" />
          <AllocationMatch color="#FF9055" text={t('Matches all 6')} percent="40%" />
          <AllocationMatch color="#FFCF61" text={t('Burn Pool')} percent="15%" />
          <AllocationMatch color="#D7FF65" text={t('Provider')} percent="5%" />
        </AllocationGrid>
      </StepCardInner>
    </StyledStepCard>
  )
}

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  // const [currentB8D, setCurrentB8D] = useState(true)
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime } = useGetNextLotteryEvent(endTimeAsInt, status)

  return (
    <LotteryPage isMobile={isMobile}>
      <div style={{ display: "block", position: "relative"}}>
        <Hero
          // currentLottery={currentB8D}
          // setCurrentLottery={setCurrentB8D}
          nextEventTime={nextEventTime}
        />
      </div>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        margin={isMobile ? '31px 20px 0 20px' : '232px 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '26px 42px'}
      >
        <GappedFlex flexDirection={['column', 'column', 'column', 'row']} gap="100px">
          <Flex flex="1" justifyContent="flex-start" flexDirection="column">
            <Heading
              mb={isMobile ? '18px' : '28px'}
              fontWeight="600"
              fontSize={isMobile ? '27px' : '41px'}
              lineHeight={isMobile ? '27px' : '41px'}
              color="#414141"
              textAlign={isMobile ? 'center' : 'left'}
            >
              {t('Finished Rounds')}
            </Heading>
            <AllHistoryCard />
          </Flex>
          <Flex flex="2" flexDirection="column">
            <Heading
              mb={isMobile ? '26px' : '73px'}
              fontWeight="600"
              fontSize={isMobile ? '27px' : '41px'}
              lineHeight={isMobile ? '27px' : '41px'}
              color="#414141"
              textAlign={isMobile ? 'center' : 'left'}
            >
              {t('How to Play?')}
            </Heading>
            <Heading
              fontWeight="500"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '19px' : '24px'}
              mb={isMobile ? '26px' : '16px'}
            >
              <span style={{ color: "#4E89E3" }}>01. </span>
              {t('Buy Tickets')}
            </Heading>
            <Text
              display="inline"
              fontWeight="400"
              fontSize="16px"
              lineHeight="22px"
              color="#78809C"
              mb={isMobile ? '26px' : '64px'}
            >
              {t('The cost of 1 ticket is equal to 1 USD in B8T tokens.')}
            </Text>
            <Heading
              fontWeight="500"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '19px' : '24px'}
              mb={isMobile ? '26px' : '16px'}
            >
              <span style={{ color: "#4E89E3" }}>02. </span>
              {t('Wait for the Draw')}
            </Heading>
            <Text
              display="inline"
              fontWeight="400"
              fontSize="16px"
              lineHeight="22px"
              color="#78809C"
              mb={isMobile ? '26px' : '64px'}
            >
              {t('There is two draw every day alternating between 0 AM UTC and 12 PM UTC.')}
            </Text>
            <Heading
              fontWeight="500"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '19px' : '24px'}
              mb={isMobile ? '26px' : '16px'}
            >
              <span style={{ color: "#4E89E3" }}>03. </span>
              {t('Check Results')}
            </Heading>
            <Text
              display="inline"
              fontWeight="400"
              fontSize="16px"
              lineHeight="22px"
              color="#78809C"
              mb={isMobile ? '26px' : '64px'}
            >
              {t('Once the round’s over, come back to the page and check to see if you’ve won!')}
            </Text>
          </Flex>
        </GappedFlex>
      </Flex>

      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        margin={isMobile ? '31px 20px 0 20px' : '100px 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '26px 42px'}
      >
        <GappedFlex flexDirection={['column', 'column', 'column', 'row']}>
          <Flex flex="2" flexDirection="column">
            <Heading
              mb={isMobile ? '18px' : '35px'}
              fontWeight="600"
              fontSize={isMobile ? '27px' : '41px'}
              lineHeight={isMobile ? '27px' : '41px'}
              color="#414141"
              textAlign={isMobile ? 'center' : 'left'}
            >
              {t('Winning Criteria')}
            </Heading>
            <Heading
              mb={isMobile ? '24px' : '40px'}
              fontWeight="600"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '24px' : '24px'}
              color="#414141"
            >
              {t('The digits on your ticket must match in the correct order to win.')}
            </Heading>
            <Text
              mb={isMobile ? '21px' : '29px'}
              fontWeight="500"
              fontSize={isMobile ? '16px' : '18px'}
              lineHeight={isMobile ? '22px' : '24px'}
              color="#78809C"
            >
              {t('Here’s an example lottery draw, with two tickets, A and B.')}
            </Text>
            <BulletList isMobile={isMobile}>
              <li>
                <Text
                  display="inline"
                  fontWeight="500"
                  fontSize={isMobile ? '14px' : '18px'}
                  lineHeight={isMobile ? '22px' : '29px'}
                  color="#78809C"
                >
                  <span
                    style={{ color: '#414141' }}
                  >
                    {t('Ticket')}{' A'}:{' '}
                  </span>
                  {t(
                    'The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.',
                  )}
                </Text>
              </li>
              <li>
                <Text
                  display="inline"
                  fontWeight="500"
                  fontSize={isMobile ? '14px' : '18px'}
                  lineHeight={isMobile ? '22px' : '24px'}
                  color="#78809C"
                >
                  <span
                    style={{ color: '#414141' }}
                  >
                    {t('Ticket')}{' B'}:{' '}
                  </span>
                  {t(
                    'Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.',
                  )}
                </Text>
              </li>
            </BulletList>
            <Text
              mt="4px"
              fontWeight="500"
              fontSize={isMobile ? '14px' : '18px'}
              lineHeight={isMobile ? '22px' : '29px'}
              color="#78809C"
            >
              {t(
                'Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.',
              )}
            </Text>
          </Flex>
          <Flex flex="1" justifyContent="center">
            <MatchExampleCard />
          </Flex>
        </GappedFlex>
      </Flex>

      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        margin={isMobile ? '31px 20px 0 20px' : '118px 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '26px 42px'}
      >
        <GappedFlex flexDirection={['column', 'column', 'column', 'row']} gap="112px">
          {
            !isMobile ? (
              <Flex flex="1" justifyContent="center">
                <PoolAllocations />
              </Flex>
            ) : null
          }

          <Flex flex="2" flexDirection="column">
            <Heading
              mb={isMobile ? '18px' : '37px'}
              mt={isMobile ? '18px' : '42px'}
              fontWeight="600"
              fontSize={isMobile ? '27px' : '39px'}
              lineHeight={isMobile ? '27px' : '39px'}
              color="#414141"
              textAlign={isMobile ? 'center' : 'left'}
            >
              {t('Prize Funds')}
            </Heading>
            <Text
              fontWeight="500"
              fontSize={isMobile ? '16px' : '17px'}
              lineHeight={isMobile ? '22px' : '17px'}
              color="#78809C"
              mb={isMobile ? '21px' : '43px'}
            >
              {t('The prizes for each lottery round come from three sources:')}
            </Text>
            <Heading
              mb={isMobile ? '24px' : '23px'}
              fontWeight="600"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '24px' : '22px'}
              color="#414141"
            >
              {t('Ticket Purchases')}
            </Heading>
            <Text
              fontWeight="500"
              fontSize={isMobile ? '16px' : '18px'}
              lineHeight={isMobile ? '22px' : '25px'}
              color="#78809C"
              mb={isMobile ? '21px' : '40px'}
            >
              {t('80% of the B8T paid by people buying tickets that round goes back into the prize pools.')}
            </Text>
            <Heading
              fontWeight="600"
              fontSize={isMobile ? '19px' : '22px'}
              lineHeight={isMobile ? '24px' : '22px'}
              color="#414141"
              mb={isMobile ? '24px' : '23px'}
            >
              {t('Rollover Prizes')}
            </Heading>
            <Text
              fontWeight="500"
              fontSize={isMobile ? '16px' : '18px'}
              lineHeight={isMobile ? '22px' : '25px'}
              color="#78809C"
            >
              {t('After every round, if nobody wins in one of the prize brackets, the unclaimed B8T tokens for that bracket will roll over into the next round and will be redistributed among the prize pools.')}
            </Text>
          </Flex>

          {
            isMobile ? (
              <Flex flex="1" justifyContent="center">
                <PoolAllocations />
              </Flex>
            ) : null
          }
        </GappedFlex>
      </Flex>

      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        margin={isMobile ? '182px 20px 197px 20px' : '178px 20px 281px 20px'}
      >
        <Flex maxWidth="635px" flexDirection="column" alignItems="center">
          <Heading
            fontWeight="600"
            fontSize={isMobile ? '27px' : '40px'}
            lineHeight={isMobile ? '27px' : '40px'}
            color="#414141"
            mb={isMobile ? '25px' : '31px'}
            textAlign="center"
          >
            {t('Have a questions?')}
          </Heading>
          <Text
            fontWeight="500"
            fontSize={isMobile ? '16px' : '20px'}
            lineHeight={isMobile ? '24px' : '28px'}
            color="#78809C"
            textAlign="center"
            mb={isMobile ? '29px' : '42px'}
          >
            {t('If you have any questions about the lottery, you can ask them in the chat.')}{' '}
          </Text>
          <Button
            isMobile={isMobile}
            as={Link}
            to={{ pathname: 'https://t.me/b8dex' }}
            target="_blank"
            className="getTouchButton"
          >
            {t('Get in Touch')}
          </Button>
        </Flex>
      </Flex>
      <Footer
        backgroundColor="#ffffff"
      />
    </LotteryPage>
  )
}

export default Lottery
