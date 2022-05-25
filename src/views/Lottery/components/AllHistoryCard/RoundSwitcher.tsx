import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import {
  IconButton,
  Flex,
  Heading,
  Input,
  Text,
  Skeleton,
  ArrowBackLottery,
  ArrowForwardLottery, useMatchBreakpoints
} from '../../../../uikit'
import {getDrawnDate} from "../../helpers";

const StyledInput = styled(Input)<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '71px' : '106px')};
  height: ${({ isMobile }) => (isMobile ? '40px' : '60px')};
  padding: 4px 16px;
  border: 1px solid #D6D6EB;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: none;
  font-weight: 400;
  font-size: ${({ isMobile }) => (isMobile ? '20px' : '26px')};
  line-height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  color: #414141;
  text-align: center;
`

const StyledIconButton = styled(IconButton)`
  width: 12px;

  svg {
    path {
      stroke: #414141;
    }
  }

  :disabled {
    background: none;

    svg {
      path {
        stroke: #c6c6c6;
      }
    }
  }
`

interface RoundSwitcherProps {
  isLoading: boolean
  selectedRoundId: string
  mostRecentRound: number
  handleInputChange: (event: any) => void
  handleArrowButtonPress: (targetRound: number) => void
  selectedLotteryNodeData: any
  locale: any
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({
  isLoading,
  selectedRoundId,
  mostRecentRound,
  handleInputChange,
  handleArrowButtonPress,
  selectedLotteryNodeData,
  locale
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const selectedRoundIdAsInt = parseInt(selectedRoundId, 10)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      handleInputChange(e)
    }
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px #E7E3EB solid"
      pb={isMobile ? '18px' : '27px'}
    >
      <Flex flexDirection="column" width="100%">
        <Flex
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <Heading
              mr={isMobile ? '17px' : '18px'}
              font-weight="600!important"
              fontSize={isMobile ? '20px' : '28px'}
              line-height={isMobile ? '20px' : '28px'}
              color="#414141"
            >{t('Round')}</Heading>
            <StyledInput
              pattern="^[0-9]+$"
              inputMode="numeric"
              disabled={isLoading}
              id="round-id"
              name="round-id"
              value={selectedRoundId}
              scale="lg"
              onChange={handleOnChange}
              isMobile={isMobile}
            />
          </Flex>
          {
            !isMobile ? (
              <Flex alignItems="center" marginRight="auto" marginLeft="33px">
                {selectedRoundId ? (
                  selectedLotteryNodeData?.endTime ? (
                    <Text
                      font-weight="400"
                      fontSize="18px"
                      lineHeight="24px"
                      color="#a9a9a9"
                    >
                      {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
                    </Text>
                  ) : (
                    <Skeleton width="185px" height="21px" />
                  )
                ) : null}
              </Flex>
            ) : null
          }

          <Flex alignItems="center">
            <StyledIconButton
              disabled={!selectedRoundIdAsInt || selectedRoundIdAsInt <= 1}
              onClick={() => handleArrowButtonPress(selectedRoundIdAsInt - 1)}
              variant="text"
              scale="sm"
              mr={isMobile ? '20px' : '30px'}
            >
              <ArrowBackLottery width={isMobile ? '9px' : '12px'} />
            </StyledIconButton>
            <StyledIconButton
              disabled={selectedRoundIdAsInt >= mostRecentRound}
              onClick={() => handleArrowButtonPress(selectedRoundIdAsInt + 1)}
              variant="text"
              scale="sm"
            >
              <ArrowForwardLottery width={isMobile ? '9px' : '12px'} />
            </StyledIconButton>
          </Flex>
        </Flex>

        {
          isMobile ? (
            <Flex alignItems="center">
              {selectedRoundId ? (
                selectedLotteryNodeData?.endTime ? (
                  <Text
                    font-weight="500"
                    fontSize="15px"
                    lineHeight="15px"
                    color="#a9a9a9"
                    mt="24px"
                  >
                    {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
                  </Text>
                ) : (
                  <Skeleton width="185px" height="21px" />
                )
              ) : null}
            </Flex>
          ) : null
        }
      </Flex>
    </Flex>
  )
}

export default RoundSwitcher
