import { useState, useCallback, ChangeEvent } from 'react'
import { Modal, Box, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'

import { DeployNavTokenModalProps } from './types'
import DeployNavTokeModalBody from './DeployNavTokenModalBody'

const DeployNavTokenModal: React.FC<React.PropsWithChildren<DeployNavTokenModalProps>> = ({ onDismiss }) => {
  const { theme } = useTheme()

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')

  const { t } = useTranslation()

  const prepConfirmArg = useCallback(() => {
    return {
      name,
      symbol,
    }
  }, [name, symbol])

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    switch (evt.target.id) {
      case 'name':
        setName(value)
        break
      case 'symbol':
        setSymbol(value)
        break
      default:
        throw new Error('expected valid name,symbol')
    }
  }

  return (
    <>
      <Modal title={t('Deploy NAV Token')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
        <Box mb="16px">
          <Input id="name" placeholder="name" onChange={handleChange} />
          <Input id="symbol" placeholder="symbol" onChange={handleChange} />
        </Box>
        <DeployNavTokeModalBody name={name} symbol={symbol} prepConfirmArg={prepConfirmArg} />
      </Modal>
    </>
  )
}

export default DeployNavTokenModal
