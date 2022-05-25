import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { LotteryTicketClaimData } from 'config/constants/types'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserLotteries } from 'state/lottery'
import ClaimPrizesInner from './ClaimPrizesInner'
import { Heading, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalCloseButton } from '../../../../uikit'

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<ClaimPrizesModalModalProps> = ({ onDismiss, roundsToClaim }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { currentLotteryId } = useLottery()
  const dispatch = useAppDispatch()

  return (
    <StyledModal minWidth="280px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p="24px">
        <ClaimPrizesInner
          onSuccess={() => {
            dispatch(fetchUserLotteries({ account, currentLotteryId }))
            onDismiss()
          }}
          roundsToClaim={roundsToClaim}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default ClaimPrizesModal
