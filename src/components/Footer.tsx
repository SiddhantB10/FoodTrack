'use client'

import Link from 'next/link'
import { Clock, Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { label: 'Predict ETA', href: '/predict' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '#contact' },
    ],
  }

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">
                FoodTrack
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Predicting your food's arrival time with machine learning precision. 
              Smart, accurate, and reliable ETA predictions for better delivery experiences.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:contact@foodtrack.com"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display font-semibold text-gray-900 mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} FoodTrack. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
