import React, { lazy } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import useScrollOnRouteChange from 'hooks/useScrollOnRouteChange'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import GlobalCheckClaimStatus from './components/GlobalCheckClaimStatus'
import history from './routerHistory'
// Views included in the main bundle
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
} from './views/AddLiquidity/redirects'
import { useInactiveListener } from './hooks/useInactiveListener'
import Wallet from './views/Wallet'
import Transactions from './views/Transactions'
import { PATHS } from './config/paths'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
// const Home = lazy(() => import('./views/Home'));
// const Farms = lazy(() => import('./views/Farms'))
// const FarmAuction = lazy(() => import('./views/FarmAuction'));
const Lottery = lazy(() => import('./views/Lottery'));
const Exchange = lazy(() => import('./views/Exchange'));
const Launchpad = lazy(() => import('./views/Launchpad'));
// const Ifos = lazy(() => import('./views/Ifos'));
const NotFound = lazy(() => import('./views/NotFound'))
// const Teams = lazy(() => import('./views/Teams'));
// const Team = lazy(() => import('./views/Teams/Team'));
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'));
// const Predictions = lazy(() => import('./views/Predictions'));
// const PredictionsLeaderboard = lazy(() => import('./views/Predictions/Leaderboard'));
// const Voting = lazy(() => import('./views/Voting'));
// const Proposal = lazy(() => import('./views/Voting/Proposal'));
// const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'));
const AddLiquidity = lazy(() => import('./views/AddLiquidity'));
const Liquidity = lazy(() => import('./views/Pool'))
// const PoolFinder = lazy(() => import('./views/PoolFinder'));
// const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'));
const Pools = lazy(() => import('./views/Info/Pools'));
const Pool = lazy(() => import('./views/Info/Pools/PoolPage'));
// const NftMarket = lazy(() => import('./views/Nft/market'));
// const ProfileCreation = lazy(() => import('./views/ProfileCreation'));
// const PancakeSquad = lazy(() => import('./views/PancakeSquad'));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // const { account } = useWeb3React();

  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  useScrollOnRouteChange()
  useUserAgent()
  useInactiveListener()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <GlobalCheckClaimStatus excludeLocations={[]} />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            {/* <Route exact path="/farms/auction"> */}
            {/*  <FarmAuction /> */}
            {/* </Route > */}
            {/* <Route path={PATHS.FARMS}> */}
            {/*  <Farms /> */}
            {/* </Route> */}
            {/* <Route path="/pools"> */}
            {/*  <Pools /> */}
            {/* </Route> */}

            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route exact path="/teams"> */}
            {/*  <Teams /> */}
            {/* </Route> */}
            {/* <Route path="/teams/:id"> */}
            {/*  <Team /> */}
            {/* </Route> */}
            {/* <Route path="/create-profile"> */}
            {/*  <ProfileCreation /> */}
            {/* </Route> */}
            {/* <Route path="/competition"> */}
            {/*  <TradingCompetition /> */}
            {/* </Route> */}
            {/* <Route exact path="/prediction"> */}
            {/*  <Predictions /> */}
            {/* </Route> */}
            {/* <Route path="/prediction/leaderboard"> */}
            {/*  <PredictionsLeaderboard /> */}
            {/* </Route> */}
            {/* <Route exact path="/voting"> */}
            {/*  <Voting /> */}
            {/* </Route> */}
            {/* <Route exact path="/voting/proposal/create"> */}
            {/*  <CreateProposal /> */}
            {/* </Route> */}
            {/* <Route path="/voting/proposal/:id"> */}
            {/*  <Proposal /> */}
            {/* </Route> */}

            {/* NFT */}
            {/* <Route path="/nfts"> */}
            {/*  <NftMarket /> */}
            {/* </Route> */}

            {/* <Route path="/pancake-squad"> */}
            {/*  <PancakeSquad /> */}
            {/* </Route> */}

            {/* Info pages */}
            {/* <Route path="/info"> */}
            {/*  <Info /> */}
            {/* </Route> */}

            <Route exact strict path={PATHS.POOLS} component={Pools} />
            <Route exact strict path={PATHS.POOL} component={Pool} />

            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            <Route exact strict path={PATHS.HOME} component={Swap} />
            <Route exact strict path={PATHS.WALLET} component={Wallet} />
            <Route exact strict path={PATHS.TRANSACTIONS} component={Transactions} />
            {/* <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} /> */}
            {/* <Route exact strict path="/send" component={RedirectPathToSwapOnly} /> */}
            {/* <Route exact strict path="/find" component={PoolFinder} /> */}
            <Route exact strict path={PATHS.LIQUIDITY} component={Liquidity} />
            {/* <Route exact strict path="/create" component={RedirectToAddLiquidity} /> */}
            <Route exact path={PATHS.ADD} component={AddLiquidity} />
            <Route exact path={PATHS.ADDA} component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path={PATHS.ADDAB} component={RedirectDuplicateTokenIds} />

            <Route exact strict path={PATHS.LOTTERY} component={Lottery} />
            <Route exact strict path={PATHS.EXCHANGE} component={Exchange} />
            <Route exact strict path={PATHS.LAUNCHPAD} component={Launchpad} />
            {/* <Route exact path="/create" component={AddLiquidity} /> */}
            {/* <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} /> */}
            {/* <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} /> */}
            {/* <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} /> */}
            {/* <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} /> */}

            {/* Redirect */}
            {/* <Route path="/pool"> */}
            {/*  <Redirect to="/liquidity" /> */}
            {/* </Route> */}
            {/* <Route path="/staking"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* <Route path="/collectibles"> */}
            {/*  <Redirect to="/nfts" /> */}
            {/* </Route> */}
            {/* <Route path="/profile"> */}
            {/*  <Redirect to={`${nftsBaseUrl}/profile/${account?.toLowerCase() || ''}`} /> */}
            {/* </Route> */}

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
