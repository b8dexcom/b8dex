import React, { useState } from 'react'
import Page from 'components/Layout/Page'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'
import { orderBy } from 'lodash'
import { Heading, Flex, Text, Button, TabMenu, Tab, useMatchBreakpoints } from '../../uikit'
import { useTranslation } from '../../contexts/Localization'
import CopyAddress from '../../components/Menu/UserMenu/CopyAddress'
import useTokenBalance, { useGetBnbBalance } from '../../hooks/useTokenBalance'
import { formatBigNumber, getFullDisplayBalance } from '../../utils/formatBalance'
import useAuth from '../../hooks/useAuth'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import { CurrencyLogo } from '../../components/Logo'
import Column from '../../components/Layout/Column'
import CircleLoader from '../../components/Loader/CircleLoader'
import Transaction from '../../components/App/Transactions/Transaction'
import { useAllTransactions } from '../../state/transactions/hooks'

export const Container = styled(Flex)<{ p?: string, isMobile?: boolean }>`
  position: relative;
  max-width: 651px;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: ${({ p }) => (p || '19px 21px')};
  margin-bottom: ${({ isMobile }) => (isMobile ? '20px' : '28px')};
`

export const DisconnectWallet = styled(Button)`
  background: #FFF5EC;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 15px;
  line-height: 16px;
  color: #FF822E;
`

const MenuItem = styled(RowBetween)<{ pt?: string, pb?: string, border?: string }>`
  padding: 0;
  height: 32px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 9px;
  border-bottom: ${({ border }) => (border || '1px solid #E5E5E5')};
  padding-bottom: ${({ pb }) => (pb || '53px')};
  padding-top: ${({ pt }) => (pt || '0')};
`

const Wallet: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useGetBnbBalance()
  const { logout } = useAuth()
  const { isMobile } = useMatchBreakpoints()
  const [mobileTab, setMobileTab] = useState(0)
  const allTransactions = useAllTransactions()

  const sortedTransactions = orderBy(
    Object.values(allTransactions),
    'addedTime',
    'desc',
  )

  const usdtCurrency: Token = tokens.usdt;
  const bnbCurrency: Token = tokens.bnb;
  const tbccCurrency: Token = tokens.tbcc;

  const { balance: usdtBalance } = useTokenBalance(usdtCurrency.address)
  const { balance: tbccBalance } = useTokenBalance(tbccCurrency.address)


  const handleLogout = () => {
    logout()
  }

  const handleMobileTabClick = (index: number) => setMobileTab(index)

  return (
    <Page>
      {!isMobile && (
        <Heading scale="lg" mb="16px"  mt="23px" fontSize="32px" lineHeight="32px" color="#505050" textAlign="center">
          {t('Your Wallet')}
        </Heading>
      )}
      {isMobile && (
        <TabMenu activeIndex={mobileTab} hasBorder={false} onItemClick={handleMobileTabClick}>
          <Tab hasBorder={false}>{t('Wallet')}</Tab>
          <Tab hasBorder={false}>{t('Transactions')}</Tab>
        </TabMenu>
      )}
      {!isMobile ? (
        <Flex flexDirection="column" alignItems="center" mt={isMobile ? '20px' : '30px'}>
          <Container flexDirection="column" isMobile={isMobile} p={isMobile ? '21px 19px' : '19px 21px'}>
            <Text color="#505050" fontSize="14px" lineHeight="16px" mb="12px">
              {t('Your Address')}
            </Text>
            <CopyAddress account={account} mobileVersion={isMobile} />
          </Container>
          <Container flexDirection="column" p="20px" isMobile={isMobile}>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pb={isMobile ? '51px' : '53px'}>
                <CurrencyLogo currency={usdtCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{usdtCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? getFullDisplayBalance(usdtBalance, 18, 3) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pt="20px" pb={isMobile ? '51px' : '53px'}>
                <CurrencyLogo currency={bnbCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{bnbCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? formatBigNumber(balance, 6) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pt="20px" border="0" pb={isMobile ? '32px' : '35px'}>
                <CurrencyLogo currency={tbccCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{tbccCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? getFullDisplayBalance(tbccBalance, 18, 3) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
          </Container>
          <Flex alignItems="center" maxWidth="651px" width="100%">
            <DisconnectWallet variant="secondary" width="100%" onClick={handleLogout}>
              {t('Disconnect Wallet')}
            </DisconnectWallet>
          </Flex>
        </Flex>
      ) : null}
      {isMobile && mobileTab === 0 ? (
        <Flex flexDirection="column" alignItems="center" mt={isMobile ? '20px' : '30px'}>
          <Container flexDirection="column" isMobile={isMobile} p={isMobile ? '21px 19px' : '19px 21px'}>
            <Text color="#505050" fontSize="14px" lineHeight="16px" mb="12px">
              {t('Your Address')}
            </Text>
            <CopyAddress account={account} mobileVersion={isMobile} />
          </Container>
          <Container flexDirection="column" p="20px" isMobile={isMobile}>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pb={isMobile ? '51px' : '53px'}>
                <CurrencyLogo currency={usdtCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{usdtCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? getFullDisplayBalance(usdtBalance, 18, 3) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pt="20px" pb={isMobile ? '51px' : '53px'}>
                <CurrencyLogo currency={bnbCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{bnbCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? formatBigNumber(balance, 6) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <MenuItem pt="20px" border="0" pb={isMobile ? '32px' : '35px'}>
                <CurrencyLogo currency={tbccCurrency} size="32px" />
                <Column>
                  <Text fontSize="15px" lineHeight="16px">{tbccCurrency.symbol}</Text>
                </Column>
                <RowFixed style={{ justifySelf: 'flex-end', fontSize: '15px', lineHeight: '16px', fontWeight: '500' }}>
                  {balance ? getFullDisplayBalance(tbccBalance, 18, 3) : account ? <CircleLoader /> : null}
                </RowFixed>
              </MenuItem>
            </Flex>
          </Container>
          <Flex alignItems="center" maxWidth="651px" width="100%">
            <DisconnectWallet variant="secondary" width="100%" onClick={handleLogout}>
              {t('Disconnect Wallet')}
            </DisconnectWallet>
          </Flex>
        </Flex>
      ) : null}
      {isMobile && mobileTab === 1 ? (
        <Flex flexDirection="column" alignItems="center" mt={isMobile ? '20px' : '30px'}>
          <Flex flexDirection="column" width="100%">
            {sortedTransactions.map((tx) => {
              return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
            })}
          </Flex>
        </Flex>
      ) : null}
    </Page>
  )
}

export default Wallet
