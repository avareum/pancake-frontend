import { PageSection } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { cakeSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const { t } = useTranslation()

  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
          }
          [data-theme='dark'] #home-2 .page-bg {
            background: linear-gradient(180deg, #09070c 22%, #201335 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
          }
          [data-theme='dark'] #home-3 .page-bg {
            background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #201335;
          }
        `}
      </style>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...cakeSectionData(t)} />
        <CakeDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #343435 0%, #676667 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>
    </>
  )
}

export default Home
