'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, BookOpen } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/gd-bank', label: 'GD Bank' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      'sticky top-0 z-50 bg-navy-700 transition-shadow duration-200',
      scrolled ? 'shadow-[0_1px_20px_rgba(0,0,0,0.25)]' : 'shadow-[0_1px_0_rgba(255,255,255,0.08)]'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gold-DEFAULT flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-lg font-serif leading-none">S</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm leading-tight">SSB Research Journal</p>
              <p className="text-blue-200 text-xs opacity-70 leading-tight">Defence Analysis & Strategy</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-blue-100 hover:text-white hover:bg-white/05'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-blue-200 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              <BookOpen size={14} />
              Admin
            </Link>
            <button
              className="md:hidden p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-800">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white/05'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:text-white"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
