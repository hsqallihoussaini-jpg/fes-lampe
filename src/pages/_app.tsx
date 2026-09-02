import '../../src/styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-cream text-fes-black">
        <Header />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
