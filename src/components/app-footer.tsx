import React from 'react'

// Changed the footer to be more consistent with the header
export function AppFooter() {
  return (
    <footer className="w-full py-4 px-2 bg-background dark:bg-[color:var(--header-background)] text-center text-sm flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 shadow-md">
      <span className="font-medium">© {new Date().getFullYear()} Third Time. All rights reserved.</span>
      <span className="font-medium">Solana Portfolio Dashboard</span>
    </footer>
  )
}
