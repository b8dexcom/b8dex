import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import {Card, CardHeader, useMatchBreakpoints} from '../../../../uikit'
import RoundSwitcher from './RoundSwitcher'
import { processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'

const StyledCard = styled(Card)<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '754px')};
  margin-top: 16px;
  border-radius: 24px;
`

const StyledCardHeader = styled(CardHeader)<{ isMobile?: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '28px 19px' : '24px 35px')};
  z-index: 2;
  background: none;
`

const AllHistoryCard = () => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const dispatch = useAppDispatch()
  const {
    currentLotteryId,
    lotteriesData,
    currentRound: { status, isLoading },
  } = useLottery()
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(null)
  const timer = useRef(null)

  const numRoundsFetched = lotteriesData?.length

  useEffect(() => {
    if (currentLotteryId) {
      const currentLotteryIdAsInt = currentLotteryId ? parseInt(currentLotteryId) : null
      const mostRecentFinishedRoundId =
        status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentLotteryId, status])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(processedLotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, numRoundsFetched, dispatch])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }

  return (
    <StyledCard background="#FFFFFF" isMobile={isMobile}>
      <StyledCardHeader isMobile={isMobile}>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
          selectedLotteryNodeData={selectedLotteryNodeData}
          locale={locale}
        />
      </StyledCardHeader>
      <PreviousRoundCardBody lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
    </StyledCard>
  )
}

export default AllHistoryCard
