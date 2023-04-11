import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'

import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useAccount } from 'wagmi'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { YieldBoosterStateContext } from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import { Box, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AdminPageLayout } from 'views/Admin'
import Page from 'components/Layout/Page'
import DeployNavTokenButton from 'views/Admin/components/DeployNavTokenButton'

export const ProxyFarmCardContainer = ({ farm }) => {
  const { address: account } = useAccount()
  const cakePrice = usePriceCakeUSD()

  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)
  const finalFarm = shouldUseProxyFarm ? proxyFarm : farm

  return (
    <FarmCard
      key={finalFarm.pid}
      farm={finalFarm}
      displayApr={getDisplayApr(finalFarm.apr, finalFarm.lpRewardsApr)}
      cakePrice={cakePrice}
      account={account}
      removed={false}
    />
  )
}

const FarmsPage = () => {
  const { t } = useTranslation()

  const { address: account } = useAccount()

  // TODO: Validate admin account

  return (
    <Page>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Deploy Nav Token')}
        <Flex>
          <Box width="auto" mr="4px">
            <DeployNavTokenButton />
          </Box>
        </Flex>
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Mint Nav Token')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Add Authority')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Remove Authority')}
      </Heading>
      <Heading scale="lg" mt="40px" mb="16px">
        {t('Change Nav Token Authority')}
      </Heading>
    </Page>
  )
}

FarmsPage.Layout = AdminPageLayout

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
