import { SUPPORT_FARMS } from 'config/constants/supportChains'

// import { useAccount } from 'wagmi'
import { Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AdminPageLayout } from 'views/Admin'
import Page from 'components/Layout/Page'

const FarmsPage = () => {
  const { t } = useTranslation()

  // const { address: account } = useAccount()

  // TODO: Validate admin account

  return (
    <Page>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Actions')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Proxy Wallet')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Tokens')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Configurations')}
      </Heading>
    </Page>
  )
}

FarmsPage.Layout = AdminPageLayout

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
