import { useTranslation } from '@pancakeswap/localization'
import { Swap } from '@pancakeswap/uikit'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => {
  const { t } = useTranslation()
  return (
    <Swap.Page
      externalText={t('Bridge assets to Aptos Chain')}
      externalLinkUrl="https://bridge.pancakeswap.finance/aptos"
    >
      {children}
    </Swap.Page>
  )
}
