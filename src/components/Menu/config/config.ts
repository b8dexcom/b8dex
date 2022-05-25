import { ContextApi } from 'contexts/Localization/types'
import { MenuItemsType } from '../../../uikit'
import { PATHS } from '../../../config/paths'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Exchange'),
    href: PATHS.HOME,
    icon: 'Exchange',
    items: [],
  },
  {
    label: t('Liquidity'),
    href: PATHS.LIQUIDITY,
    icon: 'Liquidity',
    items: [],
  },
  {
    label: t('Pools'),
    href: PATHS.POOLS,
    icon: 'Pools',
    items: [],
  },
  // {
  //   label: t('Lottery'),
  //   href: PATHS.LOTTERY,
  //   icon: 'Lottery',
  //   items: [],
  // },
]

export default config

export const SIDEBAR_WIDTH_REDUCED = 56

export const titles: (t: ContextApi['t'], account?: string) => ConfigMenuItemsType[] = (t, account) => [
  {
    label: t('Exchange'),
    href: PATHS.HOME,
  },
  {
    label: `${t('Wallet')} ${account}`,
    href: PATHS.WALLET,
  },
  {
    label: `${t('Wallet')} ${account}`,
    href: PATHS.TRANSACTIONS,
  },
  {
    label: t('Your Liquidity'),
    href: PATHS.LIQUIDITY,
  },
  {
    label: t('Adding liquidity'),
    href: PATHS.ADD,
  },
  {
    label: t('Add Liquidity'),
    href: PATHS.ADDA,
  },
  {
    label: t('Add Liquidity'),
    href: PATHS.ADDAB,
  },
  {
    label: t('Farms'),
    href: PATHS.FARMS,
  },
  {
    label: t('All Pools'),
    href: PATHS.POOLS,
  },
  {
    label: t('All Pools'),
    href: PATHS.POOL,
  },
]
