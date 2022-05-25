/* eslint-disable no-nested-ternary */
import React, { lazy, useEffect, useMemo } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import styled from 'styled-components'
import Page from 'views/Page'
import { CurrencyLogo } from 'components/Logo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { usePoolDatas, usePoolChartData, useTokenData } from 'state/info/hooks'
import { useTranslation } from 'contexts/Localization'
import { fromUnixTime } from 'date-fns'
import {
  Text,
  Flex,
  Heading,
  ArrowBackIcon,
  IconButton
} from '../../../uikit'
import { PATHS } from '../../../config/paths'
import { PoolUpdater, TokenUpdater } from '../../../state/info/updaters'

const PoolLineChart = lazy(() => import('./PoolLineChart'))

const ValueFlex = styled(Flex)`
  flex: 1 1 auto;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 26px 21px;
`

const ChartFlex = styled(Flex)`
  flex: 1 1 auto;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 30px 15px 30px 21px;
`

const PoolPage: React.FC<RouteComponentProps<{ address: string }>> = ({
  match: {
    params: { address: routeAddress },
  },
}) => {
  const { t } = useTranslation()

  // Needed to scroll up if user comes to this page by clicking on entry in the table
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const poolData = usePoolDatas([address])[0]
  const USDTData = usePoolDatas(['0x6fc06dd1d630acbbdd1b035e1b790af924a7850d'])[0]
  const chartData = usePoolChartData(address)
  const priceUSDTBCC = USDTData?.token0?.address === '0x55d398326f99059ff775485246999027b3197955' ? USDTData?.token1Price : USDTData?.token0Price

  const currencyTBCC: any = useTokenData('0xf29480344d8e21efeab7fde39f8d8299056a7fea')

  const poolCurrency:any = {
    currency: poolData?.token0?.address === currencyTBCC?.address ? poolData?.token1 : poolData?.token0,
    price: poolData?.token0?.address === currencyTBCC?.address ? poolData?.token0Price : poolData?.token1Price,
  };

  poolCurrency.currencyAddress = useTokenData(poolCurrency?.currency?.address)

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.liquidityUSD,
        }
      })
    }
    return []
  }, [chartData])


  return (
    <>
      <PoolUpdater />
      <TokenUpdater />
      <Page>
        {poolData ? (
          <>
            <Flex alignItems="center" justifyContent="center" width="100%" mb="37px" mt="12px">
              <IconButton as={Link} to={PATHS.POOLS} style={{ marginRight: 'auto'}}>
                <ArrowBackIcon width="16px" />
              </IconButton>
              <Heading scale="lg" display="flex" fontSize="32px" lineHeight="32px" color="#505050" textAlign="center" mr="auto">
                <CurrencyLogo currency={poolCurrency.currencyAddress} size="32px" />
                &nbsp;
                {`1 ${poolCurrency.currencyAddress?.symbol} =`}
                &nbsp;
                <CurrencyLogo currency={currencyTBCC} size="32px" />
                &nbsp;
                {`${formatAmount(poolCurrency.price)} TBCC`}
              </Heading>
            </Flex>

            <Flex flexDirection="row" width="100%" mb="40px" style={{ gap: "24px" }}>
              <ValueFlex flexDirection="column">
                <Flex flexDirection="row" mb="16px">
                  <Text color="#000000" fontSize="15px" lineHeight="16px" fontWeight="normal">
                    {t('Dynamics 7 days')}
                  </Text>
                </Flex>
                <Flex flexDirection="row">
                  <Text color="#2DC96C" fontSize="32px" lineHeight="32px" fontWeight="500">
                    +{formatAmount(poolData.lpApr7d)}
                  </Text>
                </Flex>
              </ValueFlex>
              <ValueFlex flexDirection="column">
                <Flex flexDirection="row" mb="16px">
                  <Text color="#000000" fontSize="15px" lineHeight="16px" fontWeight="normal">
                    {t('Volume in 24 hours')}
                  </Text>
                </Flex>
                <Flex flexDirection="row">
                  <CurrencyLogo currency={currencyTBCC} size="20px" />
                  <Text ml="8px" color="#505050" fontSize="32px" lineHeight="32px" fontWeight="500">
                    {formatAmount(poolData.volumeUSD * priceUSDTBCC)}
                  </Text>
                </Flex>
              </ValueFlex>
              <ValueFlex flexDirection="column">
                <Flex flexDirection="row" mb="16px">
                  <Text color="#000000" fontSize="15px" lineHeight="16px" fontWeight="normal">
                    {t('Volume in 7 days')}
                  </Text>
                </Flex>
                <Flex flexDirection="row">
                  <CurrencyLogo currency={currencyTBCC} size="20px" />
                  <Text ml="8px" color="#505050" fontSize="32px" lineHeight="32px" fontWeight="500">
                    {formatAmount(poolData.volumeUSDWeek * priceUSDTBCC)}
                  </Text>
                </Flex>
              </ValueFlex>
            </Flex>

            <Flex flexDirection="row" width="100%"style={{ gap: "24px" }}>
              <ChartFlex>
                <Flex flexDirection="row" mb="18px">
                  <Text color="#000000" fontSize="15px" lineHeight="16px" fontWeight="normal">
                    {t('Volume')}
                  </Text>
                </Flex>

                <Flex flexDirection="column" width="100%" height="570px">
                  <PoolLineChart data={formattedVolumeData} />
                </Flex>
              </ChartFlex>

              <ChartFlex>
                <Flex flexDirection="row" mb="18px">
                  <Text color="#000000" fontSize="15px" lineHeight="16px" fontWeight="normal">
                    {t('Liquidity')}
                  </Text>
                </Flex>
                <Flex flexDirection="column" width="100%" height="570px">
                  <PoolLineChart data={formattedTvlData} />
                </Flex>
              </ChartFlex>
            </Flex>
          </>
        ) : null}
      </Page>
    </>
  )
}

export default PoolPage
