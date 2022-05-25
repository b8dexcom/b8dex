import React from 'react'
import { useModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { Button, useMatchBreakpoints } from '../uikit'
import WalletIcon from '../uikit/components/Svg/Icons/Wallet'
import ConnectModal from '../uikit/widgets/WalletModal/ConnectModal'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { login } = useAuth()
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} t={t} />)

  return (
    <Button
      onClick={onPresentConnectModal}
      startIcon={<WalletIcon width="20px" />}
      className="connectWallet"
      {...props}
    >
      {!isMobile ? t('Connect Wallet') : null}
    </Button>
  )
}

export default ConnectWalletButton
