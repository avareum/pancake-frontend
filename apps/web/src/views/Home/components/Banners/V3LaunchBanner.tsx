import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Flex,
  LogoIcon,
  NextLinkFromReactRouter,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import styled, { css, keyframes } from 'styled-components'
import * as S from './Styled'
import { v3LaunchBg, v3LaunchBgMobile, v3LaunchBunny, v3LaunchBunnyMobile } from './images'

const flyingAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  to {
    transform: translate(0, 0px);
  }
`
const TextBox = styled(Flex)`
  flex-direction: column-reverse;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
`

const StyledSubheading = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-right: 100px;
  margin-bottom: 10px;
  &::after {
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    padding-right: 100px;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 8px rgba(101, 50, 205, 1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    &::after {
      padding-right: 0px;
    }
  }
`

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: -18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -2px;
  }
  overflow: visible;
  > span:first-child {
    // v3LaunchBg
    position: absolute !important;
    right: 0px;
    bottom: 0;
    overflow: hidden;
    ${({ theme }) => theme.mediaQueries.sm} {
      top: 0px;
    }
  }
  > span:nth-child(2) {
    // v3LaunchBunny
    position: absolute !important;
    top: -20px;
    right: -40px;
    animation: ${flyingAnim} 7.5s ease-in-out infinite;
    ${({ theme }) => theme.mediaQueries.sm} {
      top: -40px;
      right: 153px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      display: block !important;
      animation: ${flyingAnim} 7.5s ease-in-out infinite;
    }
  }
`
const TitleWrapper = styled(Flex)`
  margin-top: -20px;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 10px;
    margin-bottom: 8px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 10px;
  }
`

const Title = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  margin-top: 0px;
  padding-right: 80px;

  @media screen and (max-width: 375px) {
    font-size: 16px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    padding-right: 240px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
    padding-right: 0px;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  margin-top: 10px;
`

const V3LaunchBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(239.62deg, rgba(49, 78, 119, 0.35) 15.52%, rgba(60, 46, 87, 0.35) 86.5%), linear-gradient(114.79deg, #C040FC -17.76%, #4B3CFF 99.88%)`,
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <TextBox>
            <StyledSubheading data-text={t(`Ev3ryone's Favourite D3X`)}>
              {t(`Ev3ryone's Favourite D3X`)}
            </StyledSubheading>
            <TitleWrapper alignItems="center" style={{ gap: 5 }}>
              <LogoIcon /> <Title>{t('PancakeSwap v3 is live!')}</Title>
            </TitleWrapper>
          </TextBox>
          <NextLinkFromReactRouter
            target="_blank"
            to="https://blog.pancakeswap.finance/articles/introducing-pancake-swap-v3-a-more-efficient-and-user-friendly-dex-on-bnb-chain-and-ethereum"
            rel='"noopener noreferrer'
          >
            <StyledButtonLeft scale={isMobile ? 'sm' : 'md'}>
              <Text bold fontSize="16px" mr="4px" color="invertedContrast">
                {t('Discover V3')}
              </Text>
              <OpenNewIcon color="invertedContrast" />
            </StyledButtonLeft>
          </NextLinkFromReactRouter>
        </S.LeftWrapper>
        <RightWrapper>
          {!isMobile ? (
            <Image src={v3LaunchBg} alt="v3LaunchBg" width={595} height={192} placeholder="blur" />
          ) : (
            <Image src={v3LaunchBgMobile} alt="v3LaunchBgMobile" width={232} height={192} placeholder="blur" />
          )}
          {isMobile ? (
            <Image src={v3LaunchBunnyMobile} alt="v3LaunchBunnyMobile" width={176} height={201} placeholder="blur" />
          ) : (
            <Image src={v3LaunchBunny} alt="v3LaunchBunny" width={221} height={254} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default V3LaunchBanner
