import { Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AdminPageLayout } from 'views/Admin'
import Page from 'components/Layout/Page'

const AdminPage = () => {
  const { t } = useTranslation()

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

AdminPage.Layout = AdminPageLayout

export default AdminPage
