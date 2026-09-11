export type Chain = 'solana' | 'sui'

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface WalletSession {
  chain: Chain
  address: string | null
  status: WalletStatus
  connect(): Promise<void>
  disconnect(): Promise<void>
  getBalance(): Promise<string>
  signMessage(msg: string): Promise<string>
}
