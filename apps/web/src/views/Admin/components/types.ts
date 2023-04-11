export interface ValidatorArg {
  name: string
  symbol: string
}

export interface ValidatorReturn {
  name?: string
  symbol?: string
}

type VoidFn = () => void
export type PrepConfirmArg = (arg: ValidatorArg) => ValidatorReturn

// export interface DeployNavTokenButtonProps {

// }

export interface DeployNavTokenModalProps {
  onDismiss?: VoidFn
}

export interface DeployNavTokeModalBodyPropsType {
  name: string
  symbol: string
  onDismiss?: VoidFn
  prepConfirmArg: PrepConfirmArg
}

export interface DeployNavTokeModalValidator {
  isValidName: boolean
  isValidSymbol: boolean
}
