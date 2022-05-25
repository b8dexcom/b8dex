import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useModal } from '@pancakeswap/uikit'
import { Button, ButtonProps } from '../../../uikit'
import BuyTicketsModal from './BuyTicketsModal/BuyTicketsModal'

interface BuyTicketsButtonProps extends ButtonProps {
  disabled?: boolean
}

const BuyTicketsButton: React.FC<BuyTicketsButtonProps> = ({ disabled, ...props }) => {
  const { t } = useTranslation()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const {
    currentRound: { status },
  } = useLottery()

  const getBuyButtonText = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Buy B8Dex Ticket')
    }
    return t('On sale soon!')
  }

  return (
    <Button {...props} disabled={disabled} onClick={onPresentBuyTicketsModal}>
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
