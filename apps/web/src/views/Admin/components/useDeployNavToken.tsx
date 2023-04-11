import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useSWRConfig } from 'swr'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { useVaultPoolContract } from 'hooks/useContract'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchCakeVaultUserData } from 'state/pools'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { PrepConfirmArg } from '../../Pools/components/LockedPool/types'

interface HookArgs {
  name: string
  symbol: string
  onDismiss: () => void
  prepConfirmArg?: PrepConfirmArg
}

interface HookReturn {
  pendingTx: boolean
  handleConfirmClick: () => Promise<void>
}

export default function useDeployNavToken(hookArgs: HookArgs): HookReturn {
  const { name, symbol, onDismiss } = hookArgs

  const dispatch = useAppDispatch()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()

  const handleDeploy = useCallback(
    async (_name: string, _symbol: string) => {
      const callOptions = {
        gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }

      const receipt = await fetchWithCatchTxError(() => {
        const methodArgs = [_name, _symbol]
        return callWithGasPrice(vaultPoolContract, 'deployToken', methodArgs, callOptions)
      })

      if (receipt?.status) {
        toastSuccess(
          t('Deploy!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your token has been deployed')}
          </ToastDescriptionWithTx>,
        )
        onDismiss?.()
        dispatch(fetchCakeVaultUserData({ account }))
        mutate(['userDeployNavTokenStatus', account])
      }
    },
    [fetchWithCatchTxError, toastSuccess, dispatch, onDismiss, account, vaultPoolContract, t, callWithGasPrice, mutate],
  )

  const handleConfirmClick = useCallback(async () => {
    handleDeploy(name, symbol)
  }, [symbol, handleDeploy, name])

  return { pendingTx, handleConfirmClick }
}
