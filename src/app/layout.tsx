import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FoodTrack - AI-Powered Delivery Time Predictions',
  description: 'Predict your food delivery time accurately using machine learning. Smart ETA predictions based on distance, traffic, weather, and more.',
  keywords: 'food delivery, ETA prediction, machine learning, delivery time, AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
