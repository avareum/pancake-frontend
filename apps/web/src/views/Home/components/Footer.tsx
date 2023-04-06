import styled from 'styled-components'
import { Flex, Heading, Text, Link, OpenNewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useAccount } from 'wagmi'

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Footer = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  return (
    <>
      <Wrapper>
        <Heading mb="24px" scale="xl" color="white">
          {t('Start in seconds.')}
        </Heading>
        <Text textAlign="center" color="white">
          {t('Connect your crypto wallet to start using the app in seconds.')}
        </Text>
        <Text mb="24px" bold color="white">
          {t('No registration needed.')}
        </Text>

        <Link external href="https://docs.avareum.finance/">
          {t('Learn how to start')}
          <OpenNewIcon color="primary" ml="4px" />
        </Link>
        {!account && <ConnectWalletButton mt="24px" />}
      </Wrapper>
    </>
  )
}

export default Footer
