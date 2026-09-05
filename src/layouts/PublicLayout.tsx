import type { ReactNode } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'

type PublicLayoutProps = {
  children: ReactNode
}

function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  )
}

export default PublicLayout