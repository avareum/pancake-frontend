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
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { PrepConfirmArg } from '../../Pools/components/LockedPool/types'

interface HookArgs {
  amount: BigNumber
  symbol: string
  onDismiss: () => void
  prepConfirmArg?: PrepConfirmArg
}

interface HookReturn {
  pendingTx: boolean
  handleConfirmClick: () => Promise<void>
}

export default function useMintNavToken(hookArgs: HookArgs): HookReturn {
  const { amount, symbol, onDismiss } = hookArgs

  const dispatch = useAppDispatch()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()

  const handleMint = useCallback(
    async (_amount: BigNumber, _symbol: string) => {
      const callOptions = {
        gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }

      const receipt = await fetchWithCatchTxError(() => {
        // .toString() being called to fix a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        const methodArgs = [_symbol, _amount.toString()]
        return callWithGasPrice(vaultPoolContract, 'mintToken', methodArgs, callOptions)
      })

      if (receipt?.status) {
        toastSuccess(
          t('Mint!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your token has been minted')}
          </ToastDescriptionWithTx>,
        )
        onDismiss?.()
        dispatch(fetchCakeVaultUserData({ account }))
        mutate(['userMintNavTokenStatus', account])
      }
    },
    [fetchWithCatchTxError, toastSuccess, dispatch, onDismiss, account, vaultPoolContract, t, callWithGasPrice, mutate],
  )

  const handleConfirmClick = useCallback(async () => {
    // TODO : use mint decimals
    const decimals = 18
    const convertedMintAmount: BigNumber = getDecimalAmount(new BigNumber(amount), decimals)

    handleMint(convertedMintAmount, symbol)
  }, [symbol, handleMint, amount])

  return { pendingTx, handleConfirmClick }
}
