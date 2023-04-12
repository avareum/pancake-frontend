import { useState, useCallback, ChangeEvent } from 'react'
import { Modal, Box, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'

import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { MintNavTokenModalProps } from './types'
import MintNavTokeModalBody from './MintNavTokenModalBody'

const MintNavTokenModal: React.FC<React.PropsWithChildren<MintNavTokenModalProps>> = ({ onDismiss }) => {
  const { theme } = useTheme()

  const [amount, setAmount] = useState('')
  const [symbol, setSymbol] = useState('')

  const { t } = useTranslation()

  const prepConfirmArg = useCallback(() => {
    // TODO : use mint decimals
    const decimals = 18
    const convertedMintAmount: BigNumber = getDecimalAmount(new BigNumber(amount), decimals)

    return {
      amount: convertedMintAmount,
      symbol,
    }
  }, [amount, symbol])

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    switch (evt.target.id) {
      case 'amount':
        setAmount(value)
        break
      case 'symbol':
        setSymbol(value)
        break
      default:
        throw new Error('expected valid amount,symbol')
    }
  }

  return (
    <>
      <Modal title={t('Mint NAV Token')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
        <Box mb="16px">
          <Input id="amount" placeholder="amount" onChange={handleChange} />
          <Input id="symbol" placeholder="symbol" onChange={handleChange} />
        </Box>
        <MintNavTokeModalBody amount={new BigNumber(amount)} symbol={symbol} prepConfirmArg={prepConfirmArg} />
      </Modal>
    </>
  )
}

export default MintNavTokenModal
