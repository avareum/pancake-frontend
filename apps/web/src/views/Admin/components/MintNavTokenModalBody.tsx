import { useMemo, useState, useEffect } from 'react'
import { Button, AutoRenewIcon, Flex } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import isUndefinedOrNullOrBlankString from '@pancakeswap/utils/isUndefinedOrNullOrBlankString'

import { MintNavTokeModalBodyPropsType, MintNavTokeModalValidator } from './types'

import useMintNavToken from './useMintNavToken'

const MintNavTokeModalBody: React.FC<React.PropsWithChildren<MintNavTokeModalBodyPropsType>> = ({
  amount,
  symbol,
  onDismiss,
  prepConfirmArg,
}) => {
  const { t } = useTranslation()

  const { pendingTx, handleConfirmClick } = useMintNavToken({
    amount,
    symbol,
    onDismiss,
  })

  const { isValidAmount, isValidSymbol }: MintNavTokeModalValidator = useMemo(() => {
    return {
      isValidAmount: !isUndefinedOrNullOrBlankString(amount),
      isValidSymbol: !isUndefinedOrNullOrBlankString(symbol),
    }
  }, [amount, symbol])

  const [showAmountWarning, setShowAmountWarning] = useState(false)
  const [showSymbolWarning, setShowSymbolWarning] = useState(false)

  useEffect(() => {
    if (prepConfirmArg) {
      const { amount: _amount, symbol: _symbol } = prepConfirmArg({ amount, symbol })
      if (isUndefinedOrNullOrBlankString(_amount)) {
        setShowAmountWarning(true)
      }

      if (isUndefinedOrNullOrBlankString(_symbol)) {
        setShowSymbolWarning(true)
      }
    }
  }, [amount, symbol, showAmountWarning, showSymbolWarning, prepConfirmArg])

  return (
    <>
      <Flex mt="24px" flexDirection="column">
        <Button
          width="100%"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!(isValidAmount && isValidSymbol)}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default MintNavTokeModalBody
