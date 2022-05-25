import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import {
  Button,
  Flex,
  AutoRenewIcon,
  Text
} from '../../../uikit'
import ClaimPrizesModal from './ClaimPrizesModal'
import useGetUnclaimedRewards, { FetchStatus } from '../hooks/useGetUnclaimedRewards'

const RewardsContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #C1C1DB;
  border-radius: 16px;
  padding: 15px;
  margin-top: 15px;
`

const StyledWinnerButton = styled(Button)`
  background: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-decoration-line: underline;
  color: #737398;
  height: auto;

  &:disabled {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    color: #737398;
    cursor: not-allowed;
  }
`

const CheckPrizesSection = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const { fetchAllRewards, unclaimedRewards, fetchStatus } = useGetUnclaimedRewards()
  const userLotteryData = useGetUserLotteriesGraphData()
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={unclaimedRewards} />, false)
  const isFetchingRewards = fetchStatus === FetchStatus.IN_PROGRESS
  const lotteryIsNotClaimable = status === LotteryStatus.CLOSE
  const isCheckNowDisabled = !userLotteryData.account || lotteryIsNotClaimable

  useEffect(() => {
    if (fetchStatus === FetchStatus.SUCCESS) {
      // Manage showing unclaimed rewards modal once per page load / once per lottery state change
      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(true)
        setHasCheckedForRewards(true)
        onPresentClaimModal()
      }

      if (unclaimedRewards.length === 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(false)
        setHasCheckedForRewards(true)
      }
    }
  }, [unclaimedRewards, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change, or when lottery isTransitioning state changes
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account, isTransitioning])

  const getBody = () => {
    if (!account) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex mx={['4px', null, '16px']} flexDirection="column" alignItems="center">
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t('Connect your wallet')}
            </Text>
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t("to check if you've won!")}
            </Text>
          </Flex>
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t('No prizes to collect')}...
            </Text>
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t('Better luck next time!')}
            </Text>
          </Flex>
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t('Congratulations!')}
            </Text>
            <Text
              textAlign="center"
              color="#333333"
              fontSize="18px"
              lineHeight="24px"
              fontWeight="500"
            >
              {t('Why not play again')}
            </Text>
          </Flex>
        </Flex>
      )
    }
    const checkNowText = () => {
      if (lotteryIsNotClaimable) {
        return `${t('Calculating rewards')}...`
      }
      if (isFetchingRewards) {
        return t('Checking')
      }
      return t('Check Now')
    }
    return (
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          textAlign="center"
          color="#333333"
          fontSize="18px"
          lineHeight="24px"
          fontWeight="500"
        >
          {'🎉 '}{t('Are you a winner?')}
        </Text>
        <StyledWinnerButton
          disabled={isCheckNowDisabled}
          onClick={fetchAllRewards}
          isLoading={isFetchingRewards}
          endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}
        >
          {checkNowText()}
        </StyledWinnerButton>
      </Flex>
    )
  }

  return <RewardsContainer>{getBody()}</RewardsContainer>
}

export default CheckPrizesSection
