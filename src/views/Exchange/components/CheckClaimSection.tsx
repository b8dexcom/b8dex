import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from "@web3-react/core";
import moment from "moment-timezone";
import styled from "styled-components";
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import {ToastDescriptionWithTx} from "../../../components/Toast";
import {useICOContract} from "../../../hooks/useContract";
import {useCallWithGasPrice} from "../../../hooks/useCallWithGasPrice";
import useToast from "../../../hooks/useToast";
import useGetUnclaimedTokens from "../hooks/useGetUnclaimedTokens";
import ClaimButton from "./ClaimButton";
import {ethersToBigNumber} from "../../../utils/bigNumber";
import {Flex} from "../../../uikit";

const claimWindows = [
  [1653469200, 1653472800, 1653476400, 1653480000, 1653483600, 1653487200, 1653490800, 1653494400, 1653498000, 1653501600, 1653505200, 1653508800, 1653512400, 1653516000, 1653519600, 1653523200],
  [1653469200, 1653472800, 1653476400, 1653480000, 1653483600, 1653487200, 1653490800, 1653494400, 1653498000]
]

const currentTime = moment.utc()

let checkPreSaleDate = 0;
let windowPreSaleIndex = 0;
let checkSaleDate = 0;
let windowSaleIndex = 0;

claimWindows.forEach((arr: number[], index: number) => {
  arr.forEach((time: number, ind: number) => {
    const timeDiff = currentTime.diff(moment.unix(time), 'seconds');

    if (timeDiff > 0) {
      if (index === 0) {
        if (!checkPreSaleDate || (checkPreSaleDate > timeDiff)) {
          checkPreSaleDate = timeDiff
          windowPreSaleIndex = ind
        }
      }

      if (index === 1) {
        if (!checkSaleDate || (checkSaleDate > timeDiff)) {
          checkSaleDate = timeDiff
          windowSaleIndex = ind
        }
      }
    }
  })
})

const RewardsContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #C1C1DB;
  border-radius: 16px;
  padding: 15px;
  margin-top: 15px;
`

const CheckClaimSection: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const icoContract = useICOContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const { isClaiming, isClaimed, handleClaim } =
    useGetUnclaimedTokens({
      onRequiresClaim: async () => {
        try {
          const responsePreSaleAmount = await icoContract.userBuys(account, 0)
          const preSaleAmount = ethersToBigNumber(responsePreSaleAmount)
          const responsePreSale = await icoContract.claimed(account, 0, windowPreSaleIndex)
          const responseSaleAmount = await icoContract.userBuys(account, 1)
          const saleAmount = ethersToBigNumber(responseSaleAmount)
          const responseSale = await icoContract.claimed(account, 1, windowSaleIndex)

          return (preSaleAmount.gt(0) && !responsePreSale) || (saleAmount.gt(0) && !responseSale)
        } catch (error) {
          return false
        }
      },
      onClaim: () => {
        return callWithGasPrice(icoContract, 'claimAll')
      },
      onSuccess: async ({ receipt }) => {
        toastSuccess(t('B8T tokens are claimed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  return (
    <RewardsContainer>
      {account ? (
        <ClaimButton
          isClaimDisabled={isClaimed}
          isClaiming={isClaiming}
          onClaim={handleClaim}
          claimId="ico-claim-btn"
        />
      ) : (
        <ConnectWalletButton />
      )}
    </RewardsContainer>
  )
}

export default CheckClaimSection
