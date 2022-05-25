import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from "@web3-react/core";
import {ethers} from "ethers";
import { ButtonProps } from '../../../uikit'
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import ApproveConfirmButtons, {ButtonArrangement} from "../../../components/ApproveConfirmButtons";
import useApproveConfirmTransaction from "../../../hooks/useApproveConfirmTransaction";
import {ethersToBigNumber} from "../../../utils/bigNumber";
import {ToastDescriptionWithTx} from "../../../components/Toast";
import {useBUSD, useICOContract} from "../../../hooks/useContract";
import {useCallWithGasPrice} from "../../../hooks/useCallWithGasPrice";
import useToast from "../../../hooks/useToast";

interface BuyTicketsButtonProps extends ButtonProps {
  disabled?: boolean
  busdForPurchase: number
}

const BuyTokensButton: React.FC<BuyTicketsButtonProps> = ({ disabled, busdForPurchase }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const icoContract = useICOContract()
  const busdContract = useBUSD()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await busdContract.allowance(account, icoContract.address)
          const currentAllowance = ethersToBigNumber(response)
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(busdContract, 'approve', [icoContract.address, ethers.constants.MaxUint256])
      },
      onApproveSuccess: async ({ receipt }) => {
        toastSuccess(
          t('Contract enabled - you can now purchase tickets'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
        )
      },
      onConfirm: () => {
        return callWithGasPrice(icoContract, 'buy', [busdForPurchase])
      },
      onSuccess: async ({ receipt }) => {
        toastSuccess(t('B8T tokens purchased!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  const disableBuying = !isApproved || isConfirmed || disabled

  return (
    <>
      {account ? (
        <ApproveConfirmButtons
          isApproveDisabled={isApproved || disabled}
          isApproving={isApproving}
          isConfirmDisabled={disableBuying}
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
          buttonArrangement={ButtonArrangement.SEQUENTIAL}
          confirmLabel={t('Buy')}
          confirmId="lotteryBuyInstant"
        />
      ) : (
        <ConnectWalletButton />
      )}
    </>
  )
}

export default BuyTokensButton
