import React from 'react'
import styled from 'styled-components'
import { useUserSingleHopOnly } from 'state/user/hooks'
// import { useExpertModeManager, useUserExpertModeAcknowledgementShow, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
// import { useSwapActionHandlers } from 'state/swap/hooks'
import { Text, Toggle, Flex, Modal, InjectedModalProps, useMatchBreakpoints } from '../../../uikit'
import TransactionSettings from './TransactionSettings'
// import ExpertModal from './ExpertModal'
import GasSettings from "./GasSettings";

const ScrollableContainer = styled(Flex)<{ isMobile: boolean }>`
  flex-direction: column;
  max-height: ${({ isMobile }) => isMobile ? '412px' : '400px'};
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  // const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  // const [setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  // const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  // const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  // const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // if (showConfirmExpertModal) {
  //   return (
  //     <ExpertModal
  //       setShowConfirmExpertModal={setShowConfirmExpertModal}
  //       onDismiss={onDismiss}
  //       setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
  //     />
  //   )
  // }

  // const handleExpertModeToggle = () => {
  //   if (expertMode) {
  //     onChangeRecipient(null)
  //     toggleExpertMode()
  //   } else if (!showExpertModeAcknowledgement) {
  //     onChangeRecipient(null)
  //     toggleExpertMode()
  //   } else {
  //     setShowConfirmExpertModal(true)
  //   }
  // }

  if (isMobile) {
    setSingleHopOnly(true)
  }

  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: isMobile ? 'calc(100% - 30px)' : '704px' }}
      bodyPadding={isMobile ? '17px 17px 17px 17px' : '28px'}
    >
      <ScrollableContainer isMobile={isMobile}>
        <Flex pb={isMobile ? '42px' : '28px'} flexDirection="column">
          <GasSettings />
        </Flex>
        <Flex flexDirection="column">
          <TransactionSettings />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="24px">
          {/* <Flex alignItems="center"> */}
          {/*  <Toggle id="toggle-expert-mode-button" scale="md" checked={expertMode} onChange={handleExpertModeToggle} /> */}
          {/*  <Text fontSize="14px" lineHeight="16px" color="#505050">{t('Expert Mode')}</Text> */}
          {/* </Flex> */}
          <Flex alignItems="center">
            <Toggle
              id="toggle-disable-multihop-button"
              checked={singleHopOnly}
              scale="md"
              onChange={() => {
                setSingleHopOnly(!singleHopOnly)
              }}
            />
            <Text fontSize="14px" lineHeight="16px" color="#505050">{t('Disable Multihops')}</Text>
          </Flex>
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal;
