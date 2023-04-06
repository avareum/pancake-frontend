import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Avareum',
  defaultTitle: 'Avareum',
  description: 'Invest with Avareum.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Avareum',
    site: '@Avareum',
  },
  openGraph: {
    title: 'Avareum',
    description: 'Invest with Avareum.',
    images: [{ url: 'https://avareum.finance/images/hero.jpeg' }],
  },
}
