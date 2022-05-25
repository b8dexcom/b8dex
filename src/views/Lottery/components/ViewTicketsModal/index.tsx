import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/lottery/hooks'
import {Modal, useMatchBreakpoints} from '../../../../uikit'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled(Modal)`

`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<ViewTicketsModalProps> = ({ onDismiss, roundId, roundStatus }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { currentLotteryId } = useLottery()
  const isPreviousRound = roundStatus?.toLowerCase() === LotteryStatus.CLAIMABLE || roundId !== currentLotteryId

  return (
    <StyledModal
      title={`${t('Round')} ${roundId}`}
      onDismiss={onDismiss}
      minWidth={isMobile ? 'calc(100% - 30px)' : '384px'}
    >
      {isPreviousRound ? <PreviousRoundTicketsInner roundId={roundId} /> : <CurrentRoundTicketsInner />}
    </StyledModal>
  )
}

export default ViewTicketsModal
