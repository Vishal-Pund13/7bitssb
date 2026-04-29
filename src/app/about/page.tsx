import { Shield, BookOpen, Globe, Target, Award, Users } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About the SSB Research Journal — curated defence and geopolitics analysis for serious SSB aspirants.',
}

const features = [
  {
    icon: <BookOpen size={20} />,
    title: 'Research-Grade Analysis',
    desc: 'Each article synthesises multiple sources — WEF, IISS, IDSA, ORF, and primary government documents — into structured, officer-ready analysis.',
    color: '#185fa5',
  },
  {
    icon: <Globe size={20} />,
    title: 'India Angle on Everything',
    desc: "Every global event has an India dimension. We surface it explicitly — connecting world affairs to India's strategic interests, doctrine, and policy responses.",
    color: '#b7950b',
  },
  {
    icon: <Target size={20} />,
    title: 'SSB-Optimised Content',
    desc: 'Every article is tagged with key terms, mapped to GD topics, and structured for quick review before a PIQ or conference interview.',
    color: '#c0392b',
  },
  {
    icon: <Shield size={20} />,
    title: 'Defence-First Lens',
    desc: "Economy, technology, environment — all topics are analysed through a strategic and national security lens, because that's the lens the SSB uses.",
    color: '#1e6b3c',
  },
]

const sources = [
  { name: 'World Economic Forum', abbr: 'WEF' },
  { name: 'IISS Military Balance', abbr: 'IISS' },
  { name: 'Observer Research Foundation', abbr: 'ORF' },
  { name: 'IDSA Strategic Analysis', abbr: 'IDSA' },
  { name: 'Carnegie Endowment', abbr: 'CEIP' },
  { name: 'Ministry of Defence Reports', abbr: 'MoD' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-[#0f1724]">

      {/* ── HERO ── */}
      <div className="bg-navy-700 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gold-DEFAULT flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-gold-DEFAULT/20">
            <span className="text-white font-bold text-3xl font-serif">S</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-sans">
            SSB Research Journal
          </h1>
          <p className="text-blue-200 opacity-80 text-lg leading-relaxed max-w-xl mx-auto">
            A defence analyst&apos;s notebook — built for the SSB aspirant who wants to
            <em className="font-serif not-italic text-gold-light"> think</em>, not just memorise.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* ── MISSION ── */}
        <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-8 border-l-4 border-gold-DEFAULT">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-4 font-sans">The Mission</h2>
          <div className="space-y-4 font-serif text-base leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              The Services Selection Board does not test your ability to recall facts. It tests your
              ability to <strong className="text-navy-700 dark:text-white font-semibold">analyse, synthesise, and communicate</strong> — to think like an officer
              who will one day make decisions under uncertainty, with incomplete information, in
              high-stakes environments.
            </p>
            <p>
              This journal exists to bridge the gap between &ldquo;current affairs awareness&rdquo; and
              &ldquo;strategic thinking.&rdquo; Every article here is written not just to inform,
              but to build the mental models and vocabulary that the Interviewing Officer expects.
            </p>
            <p>
              The format is deliberate: a paper-feel layout, serif body text, and ruled-line backgrounds
              — because research should feel like research, not a news feed.
            </p>
          </div>
        </div>

        {/* ── WHAT YOU'LL FIND ── */}
        <div>
          <h2 className="text-lg font-bold text-navy-700 dark:text-white mb-4 font-sans">
            What You&apos;ll Find Here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-5 border-l-4"
                style={{ borderLeftColor: item.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <h3 className="font-semibold text-navy-700 dark:text-white text-sm">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW TO USE ── */}
        <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-6">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white mb-4 font-sans flex items-center gap-2">
            <Users size={18} className="text-steel" />
            How to Use This Journal
          </h2>
          <ol className="space-y-3">
            {[
              { step: '1', text: 'Read an article fully — use the paper-feel layout to focus. No sidebars, no ads, no distractions.' },
              { step: '2', text: 'Review the Key Terms section at the bottom. Each term links to its definition and related articles — build your vocabulary systematically.' },
              { step: '3', text: 'Study the India Angle callout — this is the bridge between global events and your interview answers.' },
              { step: '4', text: 'Use the GD Topic Bank linked to each article. Practice giving structured answers using the numbered points.' },
              { step: '5', text: 'Download as PDF for offline review before your selection tests.' },
            ].map(item => (
              <li key={item.step} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-700 text-white text-xs flex items-center justify-center font-bold">
                  {item.step}
                </span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── SOURCES ── */}
        <div className="bg-paper-DEFAULT dark:bg-[#1a2535] rounded-xl shadow-card p-6">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white mb-4 font-sans flex items-center gap-2">
            <Award size={18} className="text-gold-DEFAULT" />
            Primary Sources
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            All analysis is grounded in open-source primary research from credible institutions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sources.map(src => (
              <div
                key={src.abbr}
                className="flex items-center gap-2 p-3 rounded-lg bg-paper-dark dark:bg-[#0f1724] border border-paper-line dark:border-gray-700"
              >
                <span className="font-mono text-xs font-bold text-steel">{src.abbr}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{src.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="bg-paper-dark dark:bg-[#141e2e] rounded-xl p-5 border border-paper-line dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-700 dark:text-gray-200">Disclaimer:</strong>{' '}
            All content on this journal is for educational purposes only. Analysis represents the
            author&apos;s personal views based on open-source information. This is not affiliated
            with the Ministry of Defence, the Armed Forces, UPSC, or any government body.
            For official information, refer to government publications.
          </p>
        </div>
      </div>
    </div>
  )
}
