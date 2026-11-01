import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Gamepad2, Zap, Trophy, Keyboard,
  Smartphone, ShieldCheck, Code2, Layers3, ShoppingBag,
  Mail, BookOpen, Sparkles, Monitor, Heart, Target,
} from 'lucide-react'
import type { ReactNode } from 'react'

type PageProps = { title: string; eyebrow: string; description: string; children: ReactNode }

function PageLayout({ title, eyebrow, description, children }: PageProps) {
  return (
    <main className="min-h-screen bg-[#101126] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#101126]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="PLAYZO home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500"><Gamepad2 size={23} /></span>
            <span className="text-2xl font-black">PLAY<span className="text-violet-400">ZO</span></span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm font-bold transition hover:border-violet-400/50"><ArrowLeft size={16} /> Back to games</Link>
        </div>
      </header>
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-14 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold tracking-wider text-violet-300"><Sparkles size={14} /> {eyebrow}</div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#B7B9D3] sm:text-lg">{description}</p>
          <div className="mt-10 space-y-5">{children}</div>
        </div>
      </section>
      <footer className="border-t border-white/[.07] bg-[#0C0D20] px-5 py-8 text-center">
        <p className="text-sm font-black">PLAY<span className="text-violet-400">ZO</span></p>
        <p className="mt-1 text-xs text-[#777A99]">CLICK. PLAY. REPEAT.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#9295B5]">
          <Link to="/about" className="hover:text-white">About</Link><Link to="/categories" className="hover:text-white">Categories</Link><Link to="/hooks" className="hover:text-white">Hooks</Link><Link to="/libraries" className="hover:text-white">Libraries</Link><Link to="/store" className="hover:text-white">Store</Link><Link to="/styles" className="hover:text-white">Styles</Link><Link to="/privacy" className="hover:text-white">Privacy</Link><Link to="/terms" className="hover:text-white">Terms</Link><Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
        <p className="mt-5 text-[11px] text-[#777A99]">© {new Date().getFullYear()} PLAYZO. All rights reserved.</p>
      </footer>
    </main>
  )
}

function Panel({ icon: Icon, title, children }: { icon: typeof Zap; title: string; children: ReactNode }) {
  return <article className="rounded-2xl border border-white/10 bg-[#191A35] p-5 sm:p-6"><div className="mb-3 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={20} /></span><h2 className="text-lg font-extrabold">{title}</h2></div><div className="text-sm leading-7 text-[#AEB0CB]">{children}</div></article>
}

export function AboutPage() {
  return <PageLayout title="A little more PLAYZO" eyebrow="ABOUT PLAYZO" description="PLAYZO is a browser-based arcade playground built around a simple idea: games should be easy to discover and quick to enjoy.">
    <div className="grid gap-4 md:grid-cols-3"><Panel icon={Gamepad2} title="Play instantly">Open a game in your browser. No game download or account is required for the current collection.</Panel><Panel icon={Trophy} title="Beat your best">Selected games save personal bests locally in your browser so you can challenge your own records.</Panel><Panel icon={Heart} title="Made for fun">A growing collection of arcade, puzzle, strategy and brain games with a consistent PLAYZO experience.</Panel></div>
    <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold">Explore games <ArrowRight size={17}/></Link>
  </PageLayout>
}

export function CategoriesPage() {
  const categories = [{name:'Arcade',desc:'Quick reflexes, timing and classic arcade action.',emoji:'🕹️',games:'Snake · Flappy Challenge · Brick Breaker'},{name:'Puzzle',desc:'Think ahead, match patterns and solve challenges.',emoji:'🧩',games:'2048 · Memory Match'},{name:'Strategy',desc:'Plan your moves and outsmart the board.',emoji:'🎯',games:'Tic Tac Toe'},{name:'Brain',desc:'Use logic, focus and careful observation.',emoji:'🧠',games:'Sudoku'},{name:'Action',desc:'Fast-paced challenges that test your reactions.',emoji:'🚀',games:'Space Shooter'}]
  return <PageLayout title="Find your kind of fun" eyebrow="GAME CATEGORIES" description="Browse the PLAYZO collection by the kind of challenge you want. Choose a category and jump into a game.">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c=><article key={c.name} className="rounded-2xl border border-white/10 bg-[#191A35] p-6"><div className="text-4xl">{c.emoji}</div><h2 className="mt-4 text-xl font-black">{c.name}</h2><p className="mt-2 text-sm leading-6 text-[#AEB0CB]">{c.desc}</p><p className="mt-4 border-t border-white/10 pt-4 text-xs font-semibold text-violet-300">{c.games}</p></article>)}</div>
    <Link to="/#games" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold">Browse all games <ArrowRight size={17}/></Link>
  </PageLayout>
}

export function HooksPage() {
  return <PageLayout title="Small features. More reasons to play." eyebrow="PLAYZO HOOKS" description="Hooks are the little gameplay touches that make a quick session satisfying. Here is what the current PLAYZO experience is designed to offer.">
    <div className="grid gap-4 md:grid-cols-2"><Panel icon={Zap} title="Instant-start gameplay">Launch a game directly from its page without a registration flow.</Panel><Panel icon={Trophy} title="Personal-best chasing">Where supported, your best score is stored in this browser using local storage.</Panel><Panel icon={Keyboard} title="Keyboard-friendly controls">Selected games support keyboard input alongside on-screen controls. Check each game's briefing for its controls.</Panel><Panel icon={Smartphone} title="Responsive play">Layouts and controls are designed to adapt to smaller screens, with touch-friendly buttons where available.</Panel><Panel icon={Target} title="Clear objectives">Each game presents a goal, score or completion condition so you know what you are aiming for.</Panel><Panel icon={Sparkles} title="Quick replay">Restart a round and try a different strategy without returning to the home page.</Panel></div>
    <p className="text-xs leading-6 text-[#777A99]">Feature availability varies by game. This page describes the current product direction; it does not promise online leaderboards, multiplayer accounts or cloud-synced progress.</p>
  </PageLayout>
}

export function LibrariesPage() {
  const libs = [{name:'React',desc:'Builds the interactive user interface.',tag:'UI'},{name:'TypeScript',desc:'Adds type checking to application code.',tag:'Language'},{name:'Vite',desc:'Powers local development and production builds.',tag:'Build tool'},{name:'Tailwind CSS',desc:'Provides utility-based responsive styling.',tag:'Styling'},{name:'Framer Motion',desc:'Adds interface and game-page animations.',tag:'Animation'},{name:'Lucide React',desc:'Provides the interface icon set.',tag:'Icons'},{name:'React Router',desc:'Handles page and game navigation.',tag:'Routing'}]
  return <PageLayout title="The tools behind the arcade" eyebrow="LIBRARIES & TECHNOLOGY" description="PLAYZO is built with a modern React-based frontend. These are the core libraries and tools used by the current interface.">
    <div className="grid gap-3 sm:grid-cols-2">{libs.map(lib=><article key={lib.name} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#191A35] p-5"><div><h2 className="font-extrabold">{lib.name}</h2><p className="mt-2 text-sm leading-6 text-[#AEB0CB]">{lib.desc}</p></div><span className="shrink-0 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] font-bold text-violet-300">{lib.tag}</span></article>)}</div>
    <Panel icon={Code2} title="Open-source projects">These libraries are maintained by their respective authors and communities. PLAYZO uses them as dependencies; their names and trademarks remain with their owners.</Panel>
  </PageLayout>
}

export function StorePage() {
  return <PageLayout title="The PLAYZO Store" eyebrow="COMING SOON" description="A place for optional themes, cosmetic upgrades and special arcade experiences is planned. The store is not active yet.">
    <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-900/40 via-[#222044] to-blue-950/40 p-8 sm:p-12"><ShoppingBag size={42} className="text-violet-300"/><h2 className="mt-5 text-2xl font-black">No purchases available right now</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#C3C4DC]">PLAYZO games in the current collection are free to play. There are no active coin packs, paid memberships or checkout options on this page.</p><span className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-violet-200">STORE IN DEVELOPMENT</span></div>
  </PageLayout>
}

export function StylesPage() {
  const styles = [{name:'Midnight Arcade',desc:'The default PLAYZO look: deep navy surfaces, violet highlights and bright game accents.',className:'from-[#101126] to-[#29204f]'},{name:'Neon Circuit',desc:'A concept direction with electric cyan and blue highlights.',className:'from-[#061b2b] to-[#064e6b]'},{name:'Sunset Pixel',desc:'A concept direction with warm orange, pink and purple accents.',className:'from-[#40152f] to-[#7c2d12]'}]
  return <PageLayout title="Choose your visual vibe" eyebrow="PLAYZO STYLES" description="Explore the visual directions planned for PLAYZO. The default Midnight Arcade theme is active; the other looks are previews, not working theme switches yet.">
    <div className="grid gap-4 md:grid-cols-3">{styles.map((s,i)=><article key={s.name} className="overflow-hidden rounded-2xl border border-white/10 bg-[#191A35]"><div className={`h-36 bg-gradient-to-br ${s.className} p-5`}><div className="flex h-full items-end"><span className="rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm font-black">PLAY<span className="text-violet-300">ZO</span></span></div></div><div className="p-5"><div className="flex items-center justify-between gap-2"><h2 className="font-extrabold">{s.name}</h2>{i===0&&<span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold text-violet-300">ACTIVE</span>}</div><p className="mt-2 text-sm leading-6 text-[#AEB0CB]">{s.desc}</p></div></article>)}</div>
  </PageLayout>
}

export function PrivacyPage() {
  return <PageLayout title="Privacy Policy" eyebrow="YOUR PRIVACY" description="This page explains the current intended privacy practices for PLAYZO. Review and update it before launch if you add analytics, advertising, accounts or other data-processing services.">
    <Panel icon={ShieldCheck} title="Information and accounts">The current PLAYZO experience does not require users to create an account or submit a profile to play the listed games. Do not enter sensitive personal information into game fields or feedback channels.</Panel>
    <Panel icon={Monitor} title="Local game records">Some games save personal-best scores in your browser's local storage. These records are stored on the device and browser you use; clearing browser site data may remove them. They are not a cloud-synchronised account record.</Panel>
    <Panel icon={Layers3} title="Cookies, analytics and advertising">This policy does not confirm that analytics or advertising services are currently active. If third-party analytics, Google AdSense or other advertising tools are enabled, this policy must be updated to identify the providers, explain cookies or similar technologies, and link to their privacy controls before launch.</Panel>
    <Panel icon={ShieldCheck} title="Third-party services">PLAYZO may be hosted by a third-party platform. Those providers may process technical information under their own privacy terms. Review the hosting provider's policy for details.</Panel>
    <Panel icon={Mail} title="Questions and updates">A verified contact address should be added here before the website is publicly launched. This policy should be reviewed whenever the website's features or service providers change.</Panel>
    <p className="text-xs text-[#777A99]">Last updated: 1 November 2026. This general information is not legal advice and should be checked against the site's actual deployment, cookies, advertising and analytics configuration.</p>
  </PageLayout>
}

export function TermsPage() {
  return <PageLayout title="Terms of Use" eyebrow="PLAY FAIR" description="By accessing PLAYZO, you agree to use the website responsibly and follow these basic terms. These terms should be reviewed for your jurisdiction before public launch.">
    <Panel icon={BookOpen} title="Using the website">PLAYZO provides browser-based games and related information for personal entertainment. You may use the games only for lawful purposes and must not attempt to disrupt, overload or compromise the website.</Panel>
    <Panel icon={Gamepad2} title="Game availability">Games and features may change, be updated or become temporarily unavailable. Scores saved in local browser storage may be lost if browser data is cleared or the site changes.</Panel>
    <Panel icon={ShieldCheck} title="Acceptable behaviour">Do not misuse the website, interfere with other visitors, upload harmful code, attempt unauthorised access or use the service in a way that violates applicable law.</Panel>
    <Panel icon={Code2} title="Intellectual property">PLAYZO branding, original site design and original code are protected by applicable intellectual-property laws. Third-party library names, logos and assets belong to their respective owners.</Panel>
    <Panel icon={Zap} title="No warranty">The website is provided on an “as available” basis. To the extent permitted by law, PLAYZO makes no guarantee that the service will always be uninterrupted, error-free or suitable for a particular purpose.</Panel>
    <Panel icon={BookOpen} title="Changes">These terms may be updated as the website develops. Continued use after an update means you accept the revised terms, subject to applicable law.</Panel>
    <p className="text-xs text-[#777A99]">Last updated: 1 November 2026. This is a starter terms page, not legal advice. Obtain an appropriate legal review before launch.</p>
  </PageLayout>
}

export function ContactPage() {
  return <PageLayout title="Let's talk" eyebrow="CONTACT PLAYZO" description="Found a bug, have a game suggestion or want to share feedback? We want to hear about it.">
    <div className="grid gap-4 md:grid-cols-2"><Panel icon={Mail} title="General feedback">Share the page or game name, what happened, and the steps needed to reproduce the issue. Avoid sending passwords, payment details or other sensitive information.</Panel><Panel icon={Gamepad2} title="Game suggestions">Tell us the game name, category and why you think it would be a good fit for the PLAYZO collection.</Panel></div>
    <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6"><h2 className="font-extrabold">Contact details need to be added</h2><p className="mt-2 text-sm leading-7 text-[#C3C4DC]">Before launch, add a real support email address or working contact form here. No unverified email address is displayed on this page.</p></div>
  </PageLayout>
}
