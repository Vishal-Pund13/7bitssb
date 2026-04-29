import Link from 'next/link'
import { BookOpen, Globe, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-700 text-blue-200 mt-16 print-hide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold-DEFAULT flex items-center justify-center">
                <span className="text-white font-bold text-lg font-serif">S</span>
              </div>
              <div>
                <p className="text-white font-semibold">SSB Research Journal</p>
                <p className="text-xs opacity-60">Defence Analysis & Strategy</p>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              A curated research journal for SSB aspirants — combining strategic analysis, defence studies,
              and geopolitical insights to build comprehensive officer-grade thinking.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/articles', label: 'All Articles' },
                { href: '/glossary', label: 'Key Terms Glossary' },
                { href: '/gd-bank', label: 'GD Topic Bank' },
                { href: '/about', label: 'About the Analyst' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors opacity-70 hover:opacity-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Topics Covered</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Geopolitics', 'Defence', 'Economy', 'Science & Tech', 'Environment', 'India Focus'].map(cat => (
                <span key={cat} className="px-2 py-1 bg-white/10 rounded text-blue-200 opacity-80">
                  {cat}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs opacity-60">
              <div className="flex items-center gap-1"><Globe size={12} /><span>WEF</span></div>
              <div className="flex items-center gap-1"><Shield size={12} /><span>IDSA</span></div>
              <div className="flex items-center gap-1"><BookOpen size={12} /><span>ORF</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs opacity-50">
          <p>© {new Date().getFullYear()} SSB Research Journal. For educational purposes only.</p>
          <p className="mt-2 sm:mt-0">Built for SSB aspirants — think like an officer.</p>
        </div>
      </div>
    </footer>
  )
}
