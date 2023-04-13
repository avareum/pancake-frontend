import BigNumber from 'bignumber.js'

type VoidFn = () => void

// ------------ DeployNavToken ------------
export interface DeployNavTokenValidatorArg {
  name: string
  symbol: string
}

export interface DeployNavTokenValidatorReturn {
  name?: string
  symbol?: string
}

export type DeployPrepConfirmArg = (arg: DeployNavTokenValidatorArg) => DeployNavTokenValidatorReturn

export interface DeployNavTokenModalProps {
  onDismiss?: VoidFn
}

export interface DeployNavTokeModalBodyPropsType {
  name: string
  symbol: string
  onDismiss?: VoidFn
  prepConfirmArg: DeployPrepConfirmArg
}

export interface DeployNavTokeModalValidator {
  isValidName: boolean
  isValidSymbol: boolean
}

// ------------ MintNavToken ------------

export interface MintNavTokenValidatorArg {
  amount: BigNumber
  symbol: string
}

export interface MintNavTokenValidatorReturn {
  amount: BigNumber
  symbol: string
}

export type MintPrepConfirmArg = (arg: MintNavTokenValidatorArg) => MintNavTokenValidatorReturn
export interface MintNavTokenModalProps {
  onDismiss?: VoidFn
}

export interface MintNavTokeModalBodyPropsType {
  amount: BigNumber
  symbol: string
  onDismiss?: VoidFn
  prepConfirmArg: MintPrepConfirmArg
}

export interface MintNavTokeModalValidator {
  isValidAmount: boolean
  isValidSymbol: boolean
}
