import { useAccount } from 'wagmi'

export const AdminPageLayout = ({ children }) => {
  const { address: account } = useAccount()

  console.log('TODO: Validate admin account', account)

  return <>{children}</>
}
