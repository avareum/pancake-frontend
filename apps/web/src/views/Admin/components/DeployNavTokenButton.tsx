import { useCallback, memo } from 'react'
import { Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import DeployNavTokenModal from './DeployNavTokenModal'

const DeployNavTokenButton: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(<DeployNavTokenModal />, true, true, 'DeployNavTokenModal')

  const handleClicked = useCallback(() => {
    openAddAmountModal()
  }, [openAddAmountModal])

  return (
    <Button
      onClick={handleClicked}
      width="100%"
      style={{ whiteSpace: 'nowrap', paddingLeft: 8, paddingRight: 8, height: '32px', margin: 8 }}
    >
      {t('Deploy')}
    </Button>
  )
}

export default memo(DeployNavTokenButton)
