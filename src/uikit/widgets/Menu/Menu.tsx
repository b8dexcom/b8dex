import throttle from 'lodash/throttle'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Box } from '../../components/Box'
import Flex from '../../components/Box/Flex'
import MenuItems from '../../components/MenuItems/MenuItems'
import { useMatchBreakpoints } from '../../hooks'
import Logo from './components/Logo'
import MobileMenuToogle from './components/MobileMenuToogle'
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT } from './config'
import { NavProps } from './types'
import LangSelector from '../../components/LangSelector/LangSelector'
import { LogoutIcon, HistoryIcon, HistoryDotIcon } from '../../components/Svg'
import { Button, IconButton } from '../../components/Button'
import useAuth from '../../../hooks/useAuth'
import MobileMenu from './components/MobileMenu'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { Text } from '../../components/Text'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
`

const StyledNav = styled.nav<{ isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${({ isMobile }) => (isMobile ? `${MOBILE_MENU_HEIGHT}px` : `${MENU_HEIGHT}px`)};
  transform: translate3d(0, 0, 0);

  padding-left: ${({ isMobile }) => (isMobile ? '16px' : '42px')};
  padding-right: ${({ isMobile }) => (isMobile ? '16px' : '42px')};
  max-width: 1400px;
  margin: 0 auto;
`

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
  background-color: #ffffff;
`

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`

const Menu: React.FC<NavProps> = ({
  userMenu,
  loggedIn,
  currentLang,
  setLang,
  links,
  titles,
  footerLinks,
  activeItem,
  activeTitleItem,
  activeSubItem,
  langs,
  children,
}) => {
  const { isMobile } = useMatchBreakpoints()
  const [showMenu, setShowMenu] = useState(true)
  const [mobileMenuActive, setMobileMenuActive] = useState(false)
  const refPrevOffset = useRef(window.pageYOffset)
  const { pathname } = useLocation()
  const allTransactions = useAllTransactions()

  const totalTopMenuHeight = isMobile ? MOBILE_MENU_HEIGHT : MENU_HEIGHT

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
      const isTopOfPage = currentOffset === 0
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true)
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true)
        } else {
          // Has scroll down
          setShowMenu(false)
        }
      }
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [totalTopMenuHeight])

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')
  const isTransactionsActive = pathname === '/transactions';
  const hasTransactions = !!Object.keys(allTransactions).length
  const { logout } = useAuth()
  const isActiveLink = titles.filter(({ href}) => activeTitleItem === href)[0]

  return (
    <Wrapper>
      <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
        <StyledNav isMobile={isMobile}>
          <Flex>
            {isMobile && <MobileMenuToogle isActive={mobileMenuActive} loggedIn={loggedIn} onMobileMenuToogle={setMobileMenuActive} />}
            {!isMobile && <Logo onlyIcon={loggedIn} href={homeLink?.href ?? '/'} />}
            {isMobile && !loggedIn && <Logo onlyIcon={loggedIn} href={homeLink?.href ?? '/'} />}
            {isMobile && loggedIn && (
              <Text
                color="#505050"
                fontSize="18px"
                lineHeight="20px"
                fontWeight="500"
                pt="5px"
                height="34px"
                width="252px"
                pr="16px"
                style={{ position: "relative", whiteSpace: "nowrap", wordBreak: "keep-all" }}
                className="addDots"
              >
                <div
                  style={{ overflow: "hidden" }}
                >
                  {isActiveLink?.label ? isActiveLink?.label : ''}
                </div>
              </Text>
            )}
            {!isMobile && <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} ml="32px" />}
          </Flex>
          <Flex alignItems="center" height="100%">
            {!isMobile ? (
              <Box mt={isMobile ? '4px' : '0'} mr={isMobile ? '17px' : '16px'}>
                <LangSelector
                  currentLang={currentLang}
                  langs={langs}
                  setLang={setLang}
                  buttonScale="xs"
                  color="textSubtle"
                  hideLanguage
                />
              </Box>
            ) : null}
            {!isMobile ? userMenu : null}
            {(loggedIn && !isMobile) ? isTransactionsActive ? (
              <Button
                startIcon={hasTransactions ? <HistoryDotIcon color="textSubtle" width="35px" /> : <HistoryIcon color="textSubtle" width="23px" />}
                mt="0"
                className="activeTransactions"
                scale="sm"
                as={Link}
                to="/transactions"
              />
            ) : (
              <IconButton
                variant="text"
                scale="sm"
                style={{ marginRight: '10px', marginTop: '3px'}}
                as={Link}
                to="/transactions"
              >
                {hasTransactions ? <HistoryDotIcon color="textSubtle" width="35px" /> : <HistoryIcon color="textSubtle" width="23px" />}
              </IconButton>
            ) : null}
            {(loggedIn && !isMobile) ? (
              <IconButton onClick={logout} variant="text" scale="sm" mr="6px" ml="19px">
                <LogoutIcon width="26px" />
              </IconButton>
            ) : null}
            {isMobile ? userMenu : null}
          </Flex>
        </StyledNav>
      </FixedContainer>
      <BodyWrapper pt={`${totalTopMenuHeight + 1}px`}>
        <Inner isPushed={false} showMenu={showMenu}>
          {children}
        </Inner>
        {isMobile && (
          <MobileMenu
            isActive={mobileMenuActive}
            onMobileMenuToogle={setMobileMenuActive}
            items={links}
            footerLinks={footerLinks}
            activeItem={activeItem}
            currentLang={currentLang}
            langs={langs}
            setLang={setLang}
          />
        )}
      </BodyWrapper>
    </Wrapper>
  )
}

export default Menu
