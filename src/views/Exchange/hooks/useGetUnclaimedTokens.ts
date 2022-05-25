import { useEffect, useReducer, useRef } from 'react'
import { noop } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail'

type Action =
  | { type: 'claim_approval' }
  | { type: 'claim_sending' }
  | { type: 'claim_error' }

interface State {
  claimState: LoadingState
}

const initialState: State = {
  claimState: 'idle'
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
    case 'claim_approval':
      return {
        ...state,
        claimState: 'success',
      }
    case 'claim_sending':
      return {
        ...state,
        claimState: 'loading',
      }
    case 'claim_error':
      return {
        ...state,
        claimState: 'fail',
      }
    default:
      return state
  }
}

interface OnSuccessProps {
  state: State
  receipt: ethers.providers.TransactionReceipt
}

interface ClaimedTransaction {
  onClaim: () => Promise<ethers.providers.TransactionResponse>
  onRequiresClaim?: () => Promise<boolean>
  onSuccess: ({ state, receipt }: OnSuccessProps) => void
}

const useGetUnclaimedTokens = ({
  onClaim,
  onRequiresClaim,
  onSuccess = noop,
}: ClaimedTransaction) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [state, dispatch] = useReducer(reducer, initialState)
  const handlePreApprove = useRef(onRequiresClaim)
  const { toastError } = useToast()

  // Check if approval is necessary, re-check if account changes
  useEffect(() => {
    if (account && handlePreApprove.current) {
      handlePreApprove.current().then((result) => {
        if (result) {
          dispatch({ type: 'claim_approval' })
        }
      })
    }
  }, [account, handlePreApprove, dispatch])

  return {
    isClaiming: state.claimState === 'loading',
    isClaimed: state.claimState === 'fail' || state.claimState === 'idle',
    handleClaim: async () => {
      try {
        const tx = await onClaim()
        dispatch({ type: 'claim_sending' })
        const receipt = await tx.wait()

        if (receipt.status) {
          dispatch({ type: 'claim_error' })
          onSuccess({ state, receipt })
        }
      } catch (error) {
        dispatch({ type: 'claim_error' })
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    }
  }
}

export default useGetUnclaimedTokens
