import React from 'react'
import styled from 'styled-components'

import { LotteryRound } from 'state/types'
import {useGetLotteryGraphDataById, useGetUserLotteriesGraphData} from 'state/lottery/hooks'
import { useTranslation } from 'contexts/Localization'
import BigNumber from "bignumber.js";
import { useModal } from '@pancakeswap/uikit'
import {
  CardBody,
  Heading,
  Flex,
  Skeleton,
  Text,
  Button,
  useMatchBreakpoints,
} from '../../../../uikit'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'
import {
  // formatNumber,
  getBalanceNumber
} from "../../../../utils/formatBalance";
import Balance from "../../../../components/Balance";
import {usePriceCakeBusd} from "../../../../state/farms/hooks";

const StyledCardBody = styled(CardBody)<{ isMobile?: boolean }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ isMobile }) => (isMobile ? '14px 19px' : '25px 56px')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
`

const PreviousRoundCardBody: React.FC<{ lotteryNodeData: LotteryRound; lotteryId: string }> = ({
  lotteryNodeData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteryGraphData = useGetLotteryGraphDataById(lotteryId)

  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const cakePriceBusd = usePriceCakeBusd()

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
  )

  let prizeInBusd = new BigNumber(NaN)
  if (lotteryNodeData) {
    const { amountCollectedInTBCC } = lotteryNodeData
    prizeInBusd = amountCollectedInTBCC.times(cakePriceBusd)
  }

  return (
    <StyledCardBody isMobile={isMobile}>
      <Flex
        flexDirection="column"
        flex="1"
        width="100%"
        borderBottom={isMobile ? '1px solid #E7E3EB' : '0'}
        paddingBottom={isMobile ? '33px' : '0'}
      >
        <Flex
          justifyContent={['center', null, null, 'flex-start']}
          flexDirection="column"
          mb="38px"
        >
          <Heading
            mb="11px"
            fontSize={isMobile ? '15px' : '18px'}
            lineHeight={isMobile ? '15px' : '20px'}
          >
            {t('Prize pool')}
          </Heading>
          <Flex
            maxWidth={['240px', null, null, '100%']}
            justifyContent={['center', null, null, 'flex-start']}
            flexDirection="column"
          >
            {prizeInBusd.isNaN() ? (
              <Skeleton my="7px" height={40} width={200} />
            ) : (
              // <Heading
              //   fontWeight="600"
              //   fontSize={isMobile ? '24px' : '40px'}
              //   lineHeight="24px"
              //   color="#4E89E3"
              //   mb="10px"
              // >
              //   {`$${formatNumber(getBalanceNumber(prizeInBusd), 0, 0)} `}
              // </Heading>
              <Balance
                fontWeight="600"
                fontSize={isMobile ? '24px' : '40px'}
                lineHeight="24px"
                color="#4E89E3"
                mb="10px"
                unit=" B8T"
                value={getBalanceNumber(lotteryNodeData?.amountCollectedInTBCC)}
                decimals={0}
              />
            )}

            {/* {prizeInBusd.isNaN() ? ( */}
            {/*  <Skeleton my="2px" height={14} width={90} /> */}
            {/* ) : ( */}
            {/*  <Balance */}
            {/*    fontWeight="500" */}
            {/*    fontSize={isMobile ? '15px' : '18px'} */}
            {/*    lineHeight={isMobile ? '15px' : '24px'} */}
            {/*    color="#a9a9a9" */}
            {/*    style={{ color: '#a9a9a9' }} */}
            {/*    unit=" B8T" */}
            {/*    value={getBalanceNumber(lotteryNodeData?.amountCollectedInTBCC)} */}
            {/*    decimals={0} */}
            {/*  /> */}
            {/* )} */}

            <Flex
              flexDirection="column"
              mt="13px"
            >
              <Text
                fontWeight="500"
                fontSize={isMobile ? '15px' : '18px'}
                lineHeight={isMobile ? '15px' : '24px'}
                color="#a9a9a9"
                display="inline"
              >
                {t('Total tickets this round')}:{' '}
                {
                  (lotteryGraphData?.totalTickets) ? lotteryGraphData.totalTickets : (
                    <Skeleton height={14} width={31} display="inline-block" />
                  )
                }
              </Text>
            </Flex>

          </Flex>
        </Flex>

        <Flex
          flexDirection="column"
          justifyContent={['center', null, null, 'flex-start']}
        >
          <Heading
            fontSize={isMobile ? '15px' : '18px'}
            lineHeight={isMobile ? '15px' : '20px'}
            mb="14px"
          >{t('Your tickets')}</Heading>

          <Flex>
            <Text
              fontWeight="500"
              fontSize={isMobile ? '15px' : '18px'}
              lineHeight={isMobile ? '15px' : '24px'}
              color="#a9a9a9"
              display="inline"
            >
              {t('You have')}{' '}
              {
                (userDataForRound) ? (
                  <Button
                    onClick={onPresentViewTicketsModal}
                    style={{
                      fontWeight: "500",
                      fontSize: isMobile ? '15px' : '18px',
                      lineHeight: isMobile ? '15px' : '24px',
                      color: "#4E89E3",
                      display: "inline",
                      background: "none",
                      border: 0,
                      boxShadow: "none",
                      padding: 0,
                      height: "auto",
                    }}
                  >
                    {`${userDataForRound.totalTickets} ${t('tickets')}`}
                  </Button>
                ) : (
                  <Text
                    fontWeight="500"
                    fontSize={isMobile ? '15px' : '18px'}
                    lineHeight={isMobile ? '15px' : '24px'}
                    color="#4E89E3"
                    display="inline"
                  >
                    {`0 ${t('tickets')}`}
                  </Text>
                )
              }
              {' '}{t('this round')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        flex="1"
        width="100%"
      >
        <Flex
          justifyContent={['center', null, null, 'flex-start']}
          marginTop={isMobile ? '24px' : '0'}
        >
          <Heading
            mb={isMobile ? '15px' : '29px'}
            fontSize={isMobile ? '15px' : '18px'}
            lineHeight={isMobile ? '15px' : '20px'}
          >{t('Winning Number')}</Heading>
        </Flex>
        <Flex maxWidth="100%" justifyContent={['center', null, null, 'flex-start']}>
          {lotteryId ? (
            lotteryNodeData ? (
              <WinningNumbers
                rotateText={isLargerScreen || false}
                number={lotteryNodeData?.finalNumber?.toString()}
                mr={[null, null, null, null]}
                size="100%"
                fontSize={isLargerScreen ? '42px' : '16px'}
                isMobile={isMobile}
              />
            ) : (
              <Skeleton
                width="100%"
                height={['34px', null, null, '71px']}
                mr="null"
              />
            )
          ) : (
            <>
              <Flex flexDirection="column" alignItems="center" width="100%">
                <Text mb="8px">{t('Please specify Round')}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
