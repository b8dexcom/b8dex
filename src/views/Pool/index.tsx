import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Page from 'components/Layout/Page'
import { Text, Flex, Button, Heading, useMatchBreakpoints, IconButton, MessageCloseIcon } from '../../uikit'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import tokens from '../../config/constants/tokens'

const Container = styled(Flex)<{ p?: string, isMobile?: boolean }>`
  position: relative;
  max-width: 651px;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: ${({ p }) => (p || '19px 21px')};
`

const Message = styled(Flex)`
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 20px;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [showMessage, setShowMessage] = useState<boolean>(true)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens2) => ({ liquidityToken: toV2LiquidityToken(tokens2), tokens2 })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens2 }) => tokens2))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const closeMessage = () => { setShowMessage(false) }

  const currencyIdA: string = tokens[Object.keys(tokens).filter((token) => tokens[token].symbol === 'USDT')[0]].address
  const currencyIdB: string = tokens[Object.keys(tokens).filter((token) => tokens[token].symbol === 'TBCC')[0]].address

  return (
    <Page>
      <Flex alignItems="center" justifyContent="center" flexDirection="column" mt="23px">

        {
          isMobile ? null : (
            <Flex alignItems="center" justifyContent="center" maxWidth="648px" width="100%" mb="28px">
              <Heading scale="lg" fontSize="32px" lineHeight="32px" color="#505050" textAlign="center">
                {t('Your Liquidity')}
              </Heading>
            </Flex>
          )
        }

        {
          showMessage ? (
            <Flex alignItems="center" justifyContent="center" maxWidth="648px" width="100%" mb="28px">
              <Message alignItems="flex-start" justifyContent="space-between" >
                <Text fontSize="15px" lineHeight="24px" color="#505050" textAlign="left">
                  {t('By adding liquidity, you will receive 0.17% of all trades on this pair in proportion to your share in the pool. Commissions are added to the pool, accumulated in real time and can be earned by withdrawing your liquidity.')}
                </Text>
                <IconButton onClick={closeMessage} style={{ background: 'transparent', height: '20px', marginLeft: '10px' }}>
                  <MessageCloseIcon width="20px" />
                </IconButton>
              </Message>
            </Flex>
          ) : null
        }

        <Flex maxWidth="648px" width="100%" mb="28px">
          <Container flexDirection="column" p="5px 19px 5px 21px" isMobile={isMobile}>
            <Flex alignItems="center" flexDirection="column">
              {
                (!account) ? (
                  <Text color="textSubtle" textAlign="center" mt="15px" mb="15px">
                    {t('Connect to a wallet to view your liquidity.')}
                  </Text>
                ) : null
              }

              {
                (account && !v2IsLoading && allV2PairsWithLiquidity?.length < 0) ? (
                  <Flex flexDirection="column" alignItems="center" mt="15px" mb="15px">
                    <Text color="textSubtle" mb="8px">
                      {t("Don't see a pool you joined?")}
                    </Text>
                  </Flex>
                ) : null
              }

              {
                (v2IsLoading) ? (
                  <Text color="textSubtle" textAlign="center" mt="15px" mb="15px">
                    {t('Loading')}...
                  </Text>
                ) : null
              }

              {
                (allV2PairsWithLiquidity?.length > 0) ? allV2PairsWithLiquidity.map((v2Pair, index) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
                    lastItem={index === (allV2PairsWithLiquidity?.length - 1)}
                  />
                )) : null
              }

            </Flex>
          </Container>
        </Flex>

        <Flex alignItems="center" width="100%" maxWidth="648px" >
          <Button
            as={Link}
            to={`/add/${currencyIdA}/${currencyIdB}`}
            width="100%"
            className="addLiquidity"
            style={{ fontWeight: 500, fontSize: '15px', lineHeight: '16px' }}
          >
            {t('Add Liquidity')}
          </Button>
        </Flex>

      </Flex>
    </Page>
  )
}
