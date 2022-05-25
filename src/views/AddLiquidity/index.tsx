import React, { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, ETHER, TokenAmount } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import Page from 'components/Layout/Page'
import {
  Button,
  Flex,
  IconButton,
  ArrowBackIcon,
  Box,
  Heading,
  Text,
  MessageCloseIcon,
  useMatchBreakpoints,
} from '../../uikit'
import { AppDispatch } from '../../state'
import { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AppBody } from '../../components/App'
import { RowBetween } from '../../components/Layout/Row'

import { ROUTER_ADDRESS } from '../../config/constants'
import { PairState } from '../../hooks/usePairs'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field, resetMintState } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useGasPrice, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import Dots from '../../components/Loader/Dots'
import { currencyId } from '../../utils/currencyId'
import PoolPriceBar from './PoolPriceBar'


const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`

const Message = styled(Flex)`
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 20px;
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const gasPrice = useGasPrice()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showMessage, setShowMessage] = useState<boolean>(true) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

        }),
      )
      .catch((err) => {
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
      })
  }

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else if (currencyIdB) {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      } else {
        history.push(`/add/${newCurrencyIdA}`)
      }
    },
    [currencyIdB, history, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'BNB'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB],
  )

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const closeMessage = () => { setShowMessage(false) }

  return (
    <Page>
      <Flex alignItems="center" justifyContent="center" flexDirection="column" mt="23px">

        {
          isMobile ? null : (
            <Flex alignItems="center" justifyContent="center" maxWidth="648px" width="100%" mb="28px">
              <IconButton as={Link} to="/liquidity" style={{ marginRight: 'auto'}}>
                <ArrowBackIcon width="16px" />
              </IconButton>
              <Heading scale="lg" fontSize="32px" lineHeight="32px" color="#505050" textAlign="center" mr="auto">
                {t('Adding liquidity')}
              </Heading>
            </Flex>
          )
        }

        {
          showMessage ? (
            <Flex alignItems="center" justifyContent="center" maxWidth="648px" width="100%" mb="28px">
              <Message alignItems="center" justifyContent="space-between" >
                <Text fontSize="15px" lineHeight="24px" color="#505050" textAlign="left">
                  {t('Add liquidity to get liquidity provider tokens.')}
                </Text>
                <IconButton onClick={closeMessage} style={{ background: 'transparent', height: '20px' }}>
                  <MessageCloseIcon width="20px" />
                </IconButton>
              </Message>
            </Flex>
          ) : null
        }

        <Flex flexDirection="column" alignItems="center" maxWidth="648px" width="100%">
          <AppBody maxWidth="100%">
            <Wrapper id="swap-page">
              <AutoColumn gap="lg">
                <CurrencyInputPanel
                  label={t('Coin 1 in the pool')}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                />
                <CurrencyInputPanel
                  label={t('Coin 2 in the pool')}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                  }}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                />
              </AutoColumn>
              <Box mt="21px">
                {addIsUnsupported ? (
                  <Button disabled mb="4px">
                    {t('Unsupported Asset')}
                  </Button>
                ) : (
                  <AutoColumn gap="md">
                    {(approvalA === ApprovalState.NOT_APPROVED ||
                      approvalA === ApprovalState.PENDING ||
                      approvalB === ApprovalState.NOT_APPROVED ||
                      approvalB === ApprovalState.PENDING) &&
                    isValid && (
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <Button
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                            )}
                          </Button>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <Button
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                            )}
                          </Button>
                        )}
                      </RowBetween>
                    )}
                    <Button
                      variant={
                        !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                          ? 'danger'
                          : 'primary'
                      }
                      onClick={() => { onAdd() }}
                      disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    >
                      {error ?? t('Supply')}
                    </Button>
                  </AutoColumn>
                )}
              </Box>
            </Wrapper>
          </AppBody>
        </Flex>

        {
          (currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID) ? (
            <Flex flexDirection="column" alignItems="center" maxWidth="648px" width="100%">
              <PoolPriceBar
                currencies={currencies}
                poolTokenPercentage={poolTokenPercentage}
                noLiquidity={noLiquidity}
                price={price}
              />
            </Flex>
          ) : null
        }
      </Flex>

    </Page>
  )
}
