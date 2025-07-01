'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterButton, WalletButton } from '@/components/solana/solana-provider'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="relative z-50 px-4 py-4 bg-background dark:bg-[color:var(--header-background)] dark:text-neutral-400 shadow-md">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)} aria-label="Toggle menu">
            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <Link className="text-2xl font-extrabold text-black dark:text-white hover:text-neutral-500 dark:hover:text-white" href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-black dark:bg-transparent flex items-center justify-center">
                <img src="/third-time-icon-tiny-white.png" alt="Third Time" className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-black dark:text-white">Third Time</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="font-semibold" onClick={() => router.push('/')}>Home</Button>
          <WalletButton size="sm" />
          <ClusterButton size="sm" />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-background/95 dark:bg-[color:var(--header-background)]/95 backdrop-blur-sm z-50">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800 relative">
              <ul className="flex flex-col gap-4 mt-8">
                <li>
                  <Button
                    variant="outline"
                    className="w-full font-semibold"
                    onClick={() => {
                      setShowMenu(false)
                      router.push('/')
                    }}
                  >
                    Home
                  </Button>
                </li>
              </ul>
              <div className="flex flex-col gap-4">
                <WalletButton />
                <ClusterButton />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
