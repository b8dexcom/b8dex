import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button as UIKitButton, AutoRenewIcon, Box } from '../../../uikit'

interface ApproveClaimButtonProps {
  isClaimDisabled: boolean
  isClaiming: boolean
  onClaim: () => void
  claimId: string
}

const Button = styled(UIKitButton)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 160px;
  }
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const StyledWinnerButton = styled(Button)`
  background: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-decoration-line: underline;
  color: #737398;
  height: auto;

  &:disabled {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    color: #737398;
    cursor: not-allowed;
  }
`

const ClaimButton: React.FC<ApproveClaimButtonProps> = ({
  isClaimDisabled,
  isClaiming,
  onClaim,
  claimId,
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <StyledWinnerButton
        id={claimId}
        onClick={onClaim}
        disabled={isClaimDisabled}
        isLoading={isClaiming}
        endIcon={isClaiming ? spinnerIcon : undefined}
      >
        {isClaiming ? t('Claiming') : t('Claim')}
      </StyledWinnerButton>
    </Box>
  )
}

export default ClaimButton
