import { useMemo, useState, useEffect } from 'react'
import { Button, AutoRenewIcon, Flex } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import isUndefinedOrNullOrBlankString from '@pancakeswap/utils/isUndefinedOrNullOrBlankString'

import { DeployNavTokeModalBodyPropsType, DeployNavTokeModalValidator } from './types'

import useDeployNavToken from './useDeployNavToken'

const DeployNavTokeModalBody: React.FC<React.PropsWithChildren<DeployNavTokeModalBodyPropsType>> = ({
  name,
  symbol,
  onDismiss,
  prepConfirmArg,
}) => {
  const { t } = useTranslation()

  const { pendingTx, handleConfirmClick } = useDeployNavToken({
    name,
    symbol,
    onDismiss,
  })

  const { isValidName, isValidSymbol }: DeployNavTokeModalValidator = useMemo(() => {
    return {
      isValidName: !isUndefinedOrNullOrBlankString(name),
      isValidSymbol: !isUndefinedOrNullOrBlankString(symbol),
    }
  }, [name, symbol])

  const [showNameWarning, setShowNameWarning] = useState(false)
  const [showSymbolWarning, setShowSymbolWarning] = useState(false)

  useEffect(() => {
    if (prepConfirmArg) {
      const { name: _name, symbol: _symbol } = prepConfirmArg({ name, symbol })
      if (isUndefinedOrNullOrBlankString(_name)) {
        setShowNameWarning(true)
      }

      if (isUndefinedOrNullOrBlankString(_symbol)) {
        setShowSymbolWarning(true)
      }
    }
  }, [name, symbol, showNameWarning, showSymbolWarning, prepConfirmArg])

  return (
    <>
      <Flex mt="24px" flexDirection="column">
        <Button
          width="100%"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!(isValidName && isValidSymbol)}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default DeployNavTokeModalBody
