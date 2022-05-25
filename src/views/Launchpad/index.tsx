import React from 'react'
import styled from 'styled-components'

import {
  Flex,
  Heading,
  Text,
  useMatchBreakpoints,
} from '../../uikit'

import Footer from "../../components/Menu/Footer";

const LaunchpadPage = styled.div`
  min-height: calc(100vh - 64px);
`

const Launchpad = () => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <LaunchpadPage>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        margin={isMobile ? '0 20px 0 20px' : '0 20px 0 20px'}
        maxWidth="1400px"
        padding={isMobile ? '0' : '26px 42px'}
      >
        <Heading
          fontWeight="600"
          fontSize={isMobile ? '27px' : '33px'}
          lineHeight={isMobile ? '27px' : '33px'}
          color="#414141"
          mb={isMobile ? '25px' : '29px'}
          textAlign="center"
        >
          Roadmap
        </Heading>
        <Text
          fontWeight="400"
          fontSize={isMobile ? '16px' : '16px'}
          lineHeight={isMobile ? '24px' : '16px'}
          color="#78809C"
          textAlign="center"
          mb={isMobile ? '29px' : '58px'}
        >
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
        </Text>
      </Flex>
      <Footer
        backgroundColor="#ffffff"
      />
    </LaunchpadPage>
  )
}

export default Launchpad
