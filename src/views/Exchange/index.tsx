import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'contexts/Localization'
import { useFetchLottery } from 'state/lottery/hooks'
import moment from 'moment-timezone';
import {useWeb3React} from "@web3-react/core";
import {
  Flex,
  Heading,
  Text,
  useMatchBreakpoints,
} from '../../uikit'
import useStatusTransitions from './hooks/useStatusTransitions'
import Footer from "../../components/Menu/Footer";
import OptionCard from "./components/OptionCard";
import CheckClaimSection from "./components/CheckClaimSection";

const ExchangePage = styled.div<{ isMobile?: boolean }>`
  min-height: calc(100vh - 64px);
  background: #F0F0FE;
  background-image: ${({ isMobile }) => (isMobile ? 'url(/images/decorations/exchange_first_slide_mobile.png)' : 'url(/images/decorations/exchange_first_slide.png)')};
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 67px;
`

const GappedFlex = styled(Flex)<{ gap?: string }>`
  gap: ${({ gap }) => gap ||  '24px'};
`

const Roadmap = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 100%;
`

const RoadmapRow = styled(Flex)<{ gap?: string }>`
  flex-direction: row;
  justify-content: center;
  gap: ${({ gap }) => gap ||  '12%'};
  width: 100%;
`

const RoadmapLine = styled(Flex)<{ isMobile?: boolean }>`
  width: 100%;
  height: 2px;
  background-image: ${({ isMobile }) => (isMobile ? 'url(/images/decorations/exchange_roadmap_line.png)' : 'url(/images/decorations/exchange_roadmap_line.png)')};
  background-size: 100% auto;
  margin-top: 51px;
  margin-bottom: 48px;
`

const RoadmapPost = styled(Flex)<{ bottomPost?: boolean }>`
  position: relative;
  width: 200px;
  background: #FFFFFF;
  border-radius: 6px;
  text-align: left;
  padding: 20px 15px;
  
  &:before {
    content: "";
    display: block;
    position: absolute;
    right: auto;
    left: 22px;
    border: 17px solid transparent;
    border-top-color: ${({ bottomPost }) => (bottomPost ? 'transparent' : '#FFFFFF')};
    border-bottom-color: ${({ bottomPost }) => (bottomPost ? '#FFFFFF' : 'transparent')};
    bottom: ${({ bottomPost }) => (bottomPost ? 'auto' : '-32px')};
    top: ${({ bottomPost }) => (bottomPost ? '-32px' : 'auto')};
  }
`

const RoadmapPostDot = styled.div<{ bottomPost?: boolean }>`
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background: #589BFF;
  border-radius: 50%;
  bottom: ${({ bottomPost }) => (bottomPost ? 'auto' : '-57px')};
  top: ${({ bottomPost }) => (bottomPost ? '-55px' : 'auto')};
  left: 32px;
`

const RoadmapPostDotWhite = styled.div<{ bottomPost?: boolean }>`
  position: absolute;
  display: block;
  width: 6px;
  height: 6px;
  background: #FFFFFF;
  border-radius: 50%;
  bottom: ${({ bottomPost }) => (bottomPost ? 'auto' : '-55px')};
  top: ${({ bottomPost }) => (bottomPost ? '-53px' : 'auto')};
  left: 34px;
`

const Exchange = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const currentTime = moment.utc()
  const firstOptionEnabled = currentTime.diff(moment.utc('2022-05-06 05:00'), 'seconds') > 0 && currentTime.diff(moment.utc('2022-06-08 15:00'), 'seconds') < 0;
  const secondOptionEnabled = currentTime.diff(moment.utc('2022-06-13 05:00'), 'seconds') < 0 && currentTime.diff(moment.utc('2022-06-15 15:00'), 'seconds') > 0;

  return (
    <ExchangePage isMobile={isMobile}>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        margin={isMobile ? '0 20px 0 20px' : '0 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '26px 42px'}
      >
        <GappedFlex flexDirection={['column', 'column', 'column', 'row']} gap="50px" width="100%">
          <Flex flex="1" justifyContent="flex-start" flexDirection="column" alignItems="flex-end">
            <OptionCard
              title={t('1 Option')}
              startDate={t('6 June')}
              totalTokens="30 000 000"
              price={0.25}
              tge={10}
              lock={t('3 month')}
              vesting={t('linear vesting 15 month')}
              disabled={!firstOptionEnabled}
            />
          </Flex>
          <Flex flex="1" justifyContent="flex-start" flexDirection="column">
            <OptionCard
              title={t('2 Option')}
              startDate={t('13 June')}
              totalTokens="70 000 000"
              price={0.50}
              tge={20}
              lock="-"
              vesting={t('linear vesting 8 month')}
              disabled={!secondOptionEnabled}
            />
          </Flex>
        </GappedFlex>
      </Flex>

      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        margin={isMobile ? '0 20px 0 20px' : '0 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '87px 42px 53px'}
      >
        {
          account ? (
            <CheckClaimSection />
          ) : null
        }
      </Flex>

      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        margin={isMobile ? '0 20px 0 20px' : '0 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '87px 42px 53px'}
      >
        <Flex flexDirection="column" alignItems="center">
          <Heading
            fontWeight="600"
            fontSize={isMobile ? '27px' : '33px'}
            lineHeight={isMobile ? '27px' : '33px'}
            color="#414141"
            mb={isMobile ? '25px' : '29px'}
            textAlign="center"
          >
            {t('Roadmap')}
          </Heading>
          {/* <Text */}
          {/*  fontWeight="400" */}
          {/*  fontSize={isMobile ? '16px' : '16px'} */}
          {/*  lineHeight={isMobile ? '24px' : '16px'} */}
          {/*  color="#78809C" */}
          {/*  textAlign="center" */}
          {/*  mb={isMobile ? '29px' : '58px'} */}
          {/* > */}
          {/*  {t('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.')} */}
          {/* </Text> */}
        </Flex>
        <Roadmap>
          <RoadmapRow>
            <RoadmapPost>
              <Text
                fontWeight="400"
                fontSize={isMobile ? '16px' : '16px'}
                lineHeight={isMobile ? '24px' : '22px'}
                color="#333333"
                textAlign="left"
              >
                {t('Development and Presentation NFT MarketPlace')}
              </Text>
              <RoadmapPostDot />
              <RoadmapPostDotWhite />
            </RoadmapPost>

            <RoadmapPost>
              <Text
                fontWeight="400"
                fontSize={isMobile ? '16px' : '16px'}
                lineHeight={isMobile ? '24px' : '22px'}
                color="#333333"
                textAlign="left"
              >
                {t('Development and Presentation Staking Program')}
              </Text>
              <RoadmapPostDot />
              <RoadmapPostDotWhite />
            </RoadmapPost>
          </RoadmapRow>
          <RoadmapLine />
          <RoadmapRow>
            <RoadmapPost bottomPost >
              <Text
                fontWeight="400"
                fontSize={isMobile ? '16px' : '16px'}
                lineHeight={isMobile ? '24px' : '22px'}
                color="#333333"
                textAlign="left"
              >
                {t('Listing CEX')}
              </Text>
              <RoadmapPostDot bottomPost />
              <RoadmapPostDotWhite bottomPost />
            </RoadmapPost>

            <RoadmapPost bottomPost>
              <Text
                fontWeight="400"
                fontSize={isMobile ? '16px' : '16px'}
                lineHeight={isMobile ? '24px' : '22px'}
                color="#333333"
                textAlign="left"
              >
                {t('Development and Presentation Launchpad')}
              </Text>
              <RoadmapPostDot bottomPost />
              <RoadmapPostDotWhite bottomPost />
            </RoadmapPost>
            <RoadmapPost bottomPost>
              <Text
                fontWeight="400"
                fontSize={isMobile ? '16px' : '16px'}
                lineHeight={isMobile ? '24px' : '22px'}
                color="#333333"
                textAlign="left"
              >
                {t('Development and Presentation Lottery')}
              </Text>
              <RoadmapPostDot bottomPost />
              <RoadmapPostDotWhite bottomPost />
            </RoadmapPost>
          </RoadmapRow>
        </Roadmap>
      </Flex>
      <Footer
        backgroundColor="#ffffff"
      />
    </ExchangePage>
  )
}

export default Exchange
