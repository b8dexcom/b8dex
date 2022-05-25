import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useLocation } from 'react-router'
import { Button, IconButton, useMatchBreakpoints, WalletFilledIcon, Text } from '../../../uikit'
import WalletIcon from '../../../uikit/components/Svg/Icons/Wallet'
import { PATHS } from '../../../config/paths'

const UserMenu = () => {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { pathname } = useLocation()
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;

  const isWalletActive = pathname === '/wallet';

  if (!account) {
    return (
      <>
        <ConnectWalletButton scale="sm" />
      </>
    )
  }

  return isMobile ? isWalletActive ? null : (
    <Button
      startIcon={<WalletIcon fill="#4E89E3" width="20px" />}
      className="connectedWallet"
      scale="sm"
      as={Link}
      to={PATHS.WALLET}
    />
  ) : isWalletActive ? (
    <Button
      startIcon={<WalletIcon fill="#4E89E3" width="20px" mr="0" />}
      mt="0"
      className="activeWallet"
      scale="sm"
      as={Link}
      to={PATHS.WALLET}
    >
      <Text color="#505050" fontSize="15px" lineHeight="16px" ml="6px">
        {accountEllipsis}
      </Text>
    </Button>
  ) : (
    <IconButton
      variant="text"
      scale="sm"
      style={{ marginRight: '34px', marginTop: '3px', marginLeft: '11px', display: 'flex',  alignItems: 'center' }}
      as={Link}
      to={PATHS.WALLET}
    >
      <WalletFilledIcon color="primary" width="21px" />
      <Text color="#505050" fontSize="15px" lineHeight="16px" ml="6px">
        {accountEllipsis}
      </Text>
    </IconButton>
  )
}

export default UserMenu
