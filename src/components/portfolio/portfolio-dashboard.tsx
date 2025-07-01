'use client'

import { useState, useEffect } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from 'lucide-react'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

export function PortfolioDashboard() {
  const { account, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (account) {
      fetchPortfolioData()
    }
  }, [account]) // Add account to dependencies

  const fetchPortfolioData = async () => {
    if (!account) return

    setIsLoading(true)
    try {
      const mockData = {
        balance: 2500000000,
        tokens: [
          { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: '1000000', decimals: 6, symbol: 'USDC' },
          { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', amount: '500000000', decimals: 6, symbol: 'USDT' },
        ],
      }

      setPortfolio({
        balance: mockData.balance / 1_000_000_000, // store as SOL
        tokens: mockData.tokens,
        totalValue: 0
      }) // Update portfolio state

      const solBalance = mockData.balance / 1000000000 // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data') // Handle error
    }
    setIsLoading(false)
  }

  const formatTokenAmount = (amount: string, decimals: number): string => {
    return (parseFloat(amount) / Math.pow(10, decimals)).toFixed(2)
  }

  const calculateTotalValue = () => {
    return portfolio.tokens.reduce((total, token) => {
      return total + parseFloat(formatTokenAmount(token.amount, token.decimals))
    }, 0)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(2)
  }

  if (!account) {
    return (
      <div className="p-2">
        <h1 className="text-6xl font-bold mb-2 whitespace-nowrap overflow-hidden">
          Portfolio Dashboard - Please Connect Wallet
        </h1>
        <div className="bg-yellow-200 p-8 rounded border-4 border-yellow-500">
          <p className="text-2xl font-bold whitespace-nowrap">
            ⚠️ WALLET CONNECTION REQUIRED - Please connect your Solana wallet to view your cryptocurrency portfolio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 max-w-none overflow-x-hidden">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center tracking-tight leading-tight drop-shadow-lg">
        My Portfolio Dashboard
      </h1>
      <p className="text-lg md:text-2xl text-center text-primary mb-8 font-medium">
        for cryptocurrency assets
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">{error}</div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        <Card className="w-full md:w-1/3 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">SOL Balance Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg">Loading your balance...</div>
            ) : (
              <div>
                <p className="text-4xl font-bold">{formatBalance(portfolio.balance)} SOL</p>
                <p className="text-base text-gray-500">Current Network: {cluster.label}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Token Holdings & Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.tokens.length === 0 ? (
              <p className="text-lg">No tokens found in wallet</p>
            ) : (
              <div className="space-y-3">
                {portfolio.tokens.map((token, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">{token.symbol || 'Unknown Token'}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(token.mint)}
                        title="Copy mint address"
                        className="p-1 rounded hover:bg-primary/20 focus:outline-none"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <span className="text-lg font-mono">{formatTokenAmount(token.amount, token.decimals)} tokens</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${calculateTotalValue().toFixed(2)} USD</p>
            <Button
              onClick={fetchPortfolioData}
              disabled={isLoading}
              className="mt-6 w-full text-lg py-4 px-8 cursor-pointer active:scale-95"
            >
              Refresh Portfolio Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
