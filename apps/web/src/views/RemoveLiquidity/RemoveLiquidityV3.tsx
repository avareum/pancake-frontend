import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, WNATIVE } from '@pancakeswap/sdk'
import {
  AutoRow,
  CardBody,
  Heading,
  Flex,
  Slider,
  Button,
  Text,
  ColumnCenter,
  ArrowDownIcon,
  AutoColumn,
  useModal,
  ConfirmationModalContent,
  RowBetween,
  RowFixed,
  Toggle,
  Box,
  Tag,
  Message,
} from '@pancakeswap/uikit'
import { NonfungiblePositionManager, MasterChefV3 } from '@pancakeswap/v3-sdk'
import { AppBody, AppHeader } from 'components/App'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useDerivedV3BurnInfo } from 'hooks/v3/useDerivedV3BurnInfo'
import { useV3PositionFromTokenId, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { calculateGasMargin } from 'utils'
import Page from 'views/Page'
import { useSigner } from 'wagmi'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import styled from 'styled-components'
import { useDebouncedChangeHandler } from '@pancakeswap/hooks'
import { LightGreyCard } from 'components/Card'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import FormattedCurrencyAmount from 'components/Chart/FormattedCurrencyAmount/FormattedCurrencyAmount'
import useNativeCurrency from 'hooks/useNativeCurrency'

import { RangeTag } from 'components/RangeTag'
import Divider from 'components/Divider'
import { formatCurrencyAmount, formatRawAmount } from 'utils/formatCurrencyAmount'
import { basisPointsToPercent } from 'utils/exchange'

import { useBurnV3ActionHandlers } from './form/hooks'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

// redirect invalid tokenIds
export default function RemoveLiquidityV3() {
  const router = useRouter()

  const { tokenId } = router.query

  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  return <Remove tokenId={parsedTokenId} />
}

function Remove({ tokenId }: { tokenId: BigNumber }) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency()
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  const { percent } = useLocalSelector<{ percent: number }>((s) => s) as { percent: number }

  const { account, chainId } = useActiveWeb3React()
  const { data: signer } = useSigner()
  const addTransaction = useTransactionAdder()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds, loading: tokenIdsInMCv3Loading } = useV3TokenIdsByAccount(masterchefV3, account)

  const { position } = useV3PositionFromTokenId(tokenId)

  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useDerivedV3BurnInfo(position, percent, receiveWETH)

  const { onPercentSelect } = useBurnV3ActionHandlers()

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const handleChangePercent = useCallback(
    (value) => onPercentSelectForSlider(Math.ceil(value)),
    [onPercentSelectForSlider],
  )

  const [allowedSlippage] = useUserSlippage() // custom from users
  // const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  const deadline = useTransactionDeadline() // custom from users settings
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()

  const positionManager = useV3NFTPositionManagerContract()

  const isStakedInMCv3 = Boolean(tokenId && stakedTokenIds.find((id) => id.eq(tokenId)))

  const onRemove = useCallback(async () => {
    if (
      tokenIdsInMCv3Loading ||
      !masterchefV3 ||
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !deadline ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !signer
    ) {
      return
    }

    const manager = isStakedInMCv3 ? masterchefV3 : positionManager
    const interfaceManager = isStakedInMCv3 ? MasterChefV3 : NonfungiblePositionManager

    setAttemptingTxn(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = interfaceManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: basisPointsToPercent(allowedSlippage),
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account,
      },
    })

    const txn = {
      to: manager.address,
      data: calldata,
      value,
    }

    signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer.sendTransaction(newTxn).then((response: TransactionResponse) => {
          const amount0 = formatRawAmount(liquidityValue0.quotient.toString(), liquidityValue0.currency.decimals, 4)
          const amount1 = formatRawAmount(liquidityValue1.quotient.toString(), liquidityValue1.currency.decimals, 4)

          setTxnHash(response.hash)
          setAttemptingTxn(false)
          addTransaction(response, {
            type: 'remove-liquidity-v3',
            summary: `Remove ${amount0} ${liquidityValue0.currency.symbol} and ${amount1} ${liquidityValue1.currency.symbol}`,
          })
        })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [
    tokenIdsInMCv3Loading,
    masterchefV3,
    positionManager,
    liquidityValue0,
    liquidityValue1,
    deadline,
    account,
    chainId,
    positionSDK,
    liquidityPercentage,
    signer,
    isStakedInMCv3,
    tokenId,
    allowedSlippage,
    feeValue0,
    feeValue1,
    addTransaction,
  ])

  const removed = position?.liquidity?.eq(0)

  function modalHeader() {
    return (
      <>
        <RowBetween alignItems="flex-end">
          <Text fontSize={16} fontWeight={500}>
            {t('Pooled')} {liquidityValue0?.currency?.symbol}:
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue0?.currency} />
          </RowFixed>
        </RowBetween>
        <RowBetween alignItems="flex-end">
          <Text fontSize={16} fontWeight={500}>
            {t('Pooled')} {liquidityValue1?.currency?.symbol}:
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue1?.currency} />
          </RowFixed>
        </RowBetween>
        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
          <>
            <Text fontSize={12} textAlign="left" padding="8px 0 0 0">
              {t('You will also collect fees earned from this position.')}
            </Text>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {feeValue0?.currency?.symbol} Fees Earned:
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue0?.currency} />
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {feeValue1?.currency?.symbol} Fees Earned:
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue1?.currency} />
              </RowFixed>
            </RowBetween>
          </>
        ) : null}
      </>
    )
  }

  const router = useRouter()

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      if (percentForSlider === 100) {
        router.push('/liquidity')
      } else {
        onPercentSelectForSlider(0)
      }
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, percentForSlider, router, txnHash])

  const [onPresentRemoveLiquidityModal] = useModal(
    <TransactionConfirmationModal
      title={t('Remove Liquidity')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txnHash ?? ''}
      style={{
        minHeight: 'auto',
      }}
      content={() => (
        <ConfirmationModalContent
          topContent={modalHeader}
          bottomContent={() => (
            <Button width="100%" mt="16px" onClick={onRemove}>
              {t('Remove')}
            </Button>
          )}
        />
      )}
      pendingText={`Removing ${liquidityValue0?.toSignificant(6)} ${liquidityValue0?.currency?.symbol} and
      ${liquidityValue1?.toSignificant(6)} ${liquidityValue1?.currency?.symbol}`}
    />,
    true,
    true,
    'TransactionConfirmationModalRemoveLiquidity',
  )

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WNATIVE[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WNATIVE[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped)),
  )

  return (
    <Page>
      <AppBody>
        <AppHeader
          backTo={`/liquidity/${tokenId}`}
          title={t('Remove %assetA%-%assetB% Liquidity', {
            assetA: liquidityValue0?.currency?.symbol ?? '',
            assetB: liquidityValue1?.currency?.symbol ?? '',
          })}
          noConfig
        />
        <CardBody>
          <AutoRow justifyContent="space-between" mb="24px">
            <Box>
              <Flex>
                <DoubleCurrencyLogo
                  size={24}
                  currency0={liquidityValue0?.currency}
                  currency1={liquidityValue1?.currency}
                />
                <Heading ml="8px" as="h2">
                  {liquidityValue0?.currency?.symbol}-{liquidityValue1?.currency?.symbol} LP
                </Heading>
              </Flex>
              <Text color="textSubtle">#{tokenId?.toString()}</Text>
            </Box>

            <Flex>
              {isStakedInMCv3 && (
                <Tag mr="8px" outline variant="warning">
                  {t('Farming')}
                </Tag>
              )}
              <RangeTag removed={removed} outOfRange={outOfRange} />
            </Flex>
          </AutoRow>
          <Text fontSize="12px" color="secondary" bold textTransform="uppercase" mb="4px">
            {t('Amount of Liquidity to Remove')}
          </Text>
          <BorderCard style={{ padding: '16px' }}>
            <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
              {percentForSlider}%
            </Text>
            <Slider
              name="lp-amount"
              min={0}
              max={100}
              value={percentForSlider}
              onValueChanged={handleChangePercent}
              mb="16px"
            />
            <Flex flexWrap="wrap" justifyContent="space-evenly">
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(25)}>
                25%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(50)}>
                50%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(75)}>
                75%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(100)}>
                {t('Max')}
              </Button>
            </Flex>
          </BorderCard>
          <ColumnCenter>
            <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
          </ColumnCenter>
          <AutoColumn gap="8px" mb="16px">
            <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
              {t('You will receive')}
            </Text>
            <LightGreyCard>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={liquidityValue0?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {t('Pooled')} {liquidityValue0?.currency?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text small>{formatCurrencyAmount(liquidityValue0, 4, locale)}</Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" as="label" alignItems="center" mb="8px">
                <Flex alignItems="center">
                  <CurrencyLogo currency={liquidityValue1?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                    {t('Pooled')} {liquidityValue1?.currency?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text small>{formatCurrencyAmount(liquidityValue1, 4, locale)}</Text>
                </Flex>
              </Flex>
              <Divider />
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={feeValue0?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {feeValue0?.currency?.symbol} {t('Fee Earned')}
                  </Text>
                </Flex>
                <Flex>
                  <Text small>{formatCurrencyAmount(feeValue0, 4, locale)}</Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={feeValue1?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {feeValue1?.currency?.symbol} {t('Fee Earned')}
                  </Text>
                </Flex>
                <Flex>
                  <Text small>{formatCurrencyAmount(feeValue1, 4, locale)}</Text>
                </Flex>
              </Flex>
            </LightGreyCard>
          </AutoColumn>
          {showCollectAsWeth && (
            <Flex justifyContent="space-between" alignItems="center" mb="16px">
              <Text mr="8px">
                {t('Collect as')} {nativeWrappedSymbol}
              </Text>
              <Toggle
                id="receive-as-weth"
                scale="sm"
                checked={receiveWETH}
                onChange={() => setReceiveWETH((prevState) => !prevState)}
              />
            </Flex>
          )}
          {isStakedInMCv3 ? (
            <Message variant="primary" mb="20px">
              {t(
                'This liquidity position is currently staking in the Farm. Adding or removing liquidity will also harvest any unclaimed CAKE to your wallet.',
              )}
            </Message>
          ) : null}

          <Button
            disabled={attemptingTxn || removed || Boolean(error)}
            width="100%"
            onClick={onPresentRemoveLiquidityModal}
          >
            {removed ? t('Closed') : error ?? t('Remove')}
          </Button>
        </CardBody>
      </AppBody>
    </Page>
  )
}
