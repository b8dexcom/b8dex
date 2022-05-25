import React from 'react'
import styled from 'styled-components'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'
import { useMatchBreakpoints } from '../uikit'
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT } from '../uikit/widgets/Menu/config'

const StyledPage = styled.div<{ $removePadding: boolean; isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: ${({ isMobile }) => (isMobile ? '23px 16px' : '26px 42px')};
  padding-bottom: 0;
  min-height: ${({ isMobile }) =>
    isMobile ? `calc(100vh - ${MOBILE_MENU_HEIGHT}px)` : `calc(100vh - ${MENU_HEIGHT}px)`};
`

const Page: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { removePadding?: boolean; hideFooterOnDesktop?: boolean }
> = ({ children, removePadding = false, ...props }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <PageMeta />
      <StyledPage $removePadding={removePadding} isMobile={isMobile} {...props}>
        {children}
        <Footer />
      </StyledPage>
    </>
  )
}

export default Page
