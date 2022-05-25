import React from 'react'
import styled from 'styled-components'
import { Button } from '../../../../uikit'

interface NumTicketsToBuyButtonProps {
  onClick: () => void
  disabled?: boolean
}

const StyledButton = styled(Button)`
  flex-grow: 1;
  background: #4e89e3;
  border: 0;
  border-radius: 4px;
  color: #ffffff;
`

const NumTicketsToBuyButton: React.FC<NumTicketsToBuyButtonProps> = ({ children, onClick, disabled = false }) => {
  return (
    <StyledButton disabled={disabled} scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default NumTicketsToBuyButton
