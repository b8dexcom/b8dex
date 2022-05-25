import { Language } from '../LangSelector/types'
import { FooterLinkType } from './types'

export const footerLinks: FooterLinkType[] = [
  {
    label: 'Contact',
    href: 'https://docs.pancakeswap.finance/contact-us',
  },
  {
    label: 'Blog',
    href: 'https://pancakeswap.medium.com/',
  },
  {
    label: 'Community',
    href: 'https://docs.pancakeswap.finance/contact-us/telegram',
  },
  {
    label: 'CAKE',
    href: 'https://docs.pancakeswap.finance/tokenomics/cake',
  },
]

export const socials = [
  {
    label: 'Twitter',
    icon: 'Twitter',
    href: 'https://twitter.com/pancakeswap',
  },
  {
    label: 'Telegram',
    icon: 'Telegram',
    items: [
      {
        label: 'English',
        href: 'https://t.me/pancakeswap',
      },
      {
        label: 'Bahasa Indonesia',
        href: 'https://t.me/PancakeSwapIndonesia',
      },
      {
        label: '中文',
        href: 'https://t.me/PancakeSwap_CN',
      },
      {
        label: 'Tiếng Việt',
        href: 'https://t.me/PancakeSwapVN',
      },
      {
        label: 'Italiano',
        href: 'https://t.me/pancakeswap_ita',
      },
      {
        label: 'русский',
        href: 'https://t.me/pancakeswap_ru',
      },
      {
        label: 'Türkiye',
        href: 'https://t.me/pancakeswapturkiye',
      },
      {
        label: 'Português',
        href: 'https://t.me/PancakeSwapPortuguese',
      },
      {
        label: 'Español',
        href: 'https://t.me/PancakeswapEs',
      },
      {
        label: '日本語',
        href: 'https://t.me/pancakeswapjp',
      },
      {
        label: 'Français',
        href: 'https://t.me/pancakeswapfr',
      },
      {
        label: 'Announcements',
        href: 'https://t.me/PancakeSwapAnn',
      },
      {
        label: 'Whale Alert',
        href: 'https://t.me/PancakeSwapWhales',
      },
    ],
  },
  {
    label: 'Reddit',
    icon: 'Reddit',
    href: 'https://reddit.com/r/pancakeswap',
  },
  {
    label: 'Instagram',
    icon: 'Instagram',
    href: 'https://instagram.com/pancakeswap_official',
  },
  {
    label: 'Github',
    icon: 'Github',
    href: 'https://github.com/pancakeswap/',
  },
  {
    label: 'Discord',
    icon: 'Discord',
    href: 'https://discord.gg/pancakeswap',
  },
]

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}))
