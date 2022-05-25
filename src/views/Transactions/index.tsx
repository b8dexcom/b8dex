import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import { Heading, Flex, Button } from '../../uikit'
import { useTranslation } from '../../contexts/Localization'
import { useAllTransactions } from '../../state/transactions/hooks'
import Transaction from '../../components/App/Transactions/Transaction'

export const Container = styled(Flex)<{ p?: string }>`
  max-width: 871px;
  width: 100%;
`

export const DisconnectWallet = styled(Button)`
  background: #FFF5EC;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 15px;
  line-height: 16px;
  color: #FF822E; 
`

const Transactions: React.FC = () => {
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()


  const sortedTransactions = orderBy(
    Object.values(allTransactions),
    'addedTime',
    'desc',
  )

  return (
    <Page>
      <Heading scale="lg" mb="16px"  mt="23px" fontSize="32px" lineHeight="32px" color="#505050" textAlign="center">
        {t('Recent Transactions')}
      </Heading>
      <Flex flexDirection="column" alignItems="center" mt="30px">
        <Container flexDirection="column">
          <Flex flexDirection="column">
            {sortedTransactions.map((tx) => {
              return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
            })}
          </Flex>
        </Container>
      </Flex>
    </Page>
  )
}

export default Transactions
