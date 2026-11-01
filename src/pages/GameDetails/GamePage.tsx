import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Keyboard, Lightbulb, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import GameSuite from '../../games/GameSuite'

type GameInfo = {
  title: string
  seoTitle: string
  description: string
  category: string
  tagline: string
  objective: string
  controls: string[]
  tip: string
  mission: string
  accent: string
}

const SITE_URL = 'https://playzo-eight.vercel.app'

const games: Record<string, GameInfo> = {
  snake: {
    title: 'Snake Arena',
    seoTitle: 'Play Snake Online Free | PLAYZO',
    description: 'Play Snake Arena online for free at PLAYZO. Guide the snake, collect food, grow longer and beat your high score. No downloads or registration required.',
    category: 'ARCADE CLASSIC',
    tagline: 'One wrong turn ends the run.',
    objective: 'Collect glowing food, grow longer and survive for the highest score.',
    controls: ['Arrow keys / WASD to steer', 'Mobile: use the direction pad', 'Space / Escape to pause'],
    tip: 'Plan your next turn before you reach a wall. Keep the centre open for escape routes.',
    mission: 'Collect 5 food items without crashing.',
    accent: 'lime',
  },
  '2048': {
    title: '2048',
    seoTitle: 'Play 2048 Online Free | PLAYZO',
    description: 'Play the 2048 number puzzle online for free. Merge matching tiles, plan your moves and work toward the 2048 tile. Play instantly on PLAYZO.',
    category: 'BRAIN & PUZZLE',
    tagline: 'Every move changes the board.',
    objective: 'Merge matching number tiles and build your way to 2048.',
    controls: ['Arrow keys / WASD to move', 'Swipe on touch screens', 'Use Undo to rethink a move'],
    tip: 'Keep your largest tile anchored in one corner and build a descending number chain beside it.',
    mission: 'Reach the 128 tile in your next run.',
    accent: 'orange',
  },
  flappy: {
    title: 'Flappy Challenge',
    seoTitle: 'Play Flappy Challenge Online | PLAYZO',
    description: 'Play Flappy Challenge online at PLAYZO. Tap or press space to fly through obstacles, improve your timing and beat your best score. Free browser game.',
    category: 'ARCADE SKILL',
    tagline: 'Find the rhythm. Own the sky.',
    objective: 'Fly through each opening and avoid the obstacles.',
    controls: ['Click / tap to flap', 'Space to flap', 'Avoid the top and bottom edges'],
    tip: 'Use small, deliberate taps. Repeated rapid tapping makes altitude harder to control.',
    mission: 'Pass 10 obstacles in one run.',
    accent: 'sky',
  },
  'tic-tac-toe': {
    title: 'Tic Tac Toe',
    seoTitle: 'Play Tic Tac Toe Online Free | PLAYZO',
    description: 'Play Tic Tac Toe online for free on PLAYZO. Place X and O, plan your moves and try to make three in a row in this classic strategy game.',
    category: 'STRATEGY DUEL',
    tagline: 'Three in a row. One clever move.',
    objective: 'Take turns placing X and O. Complete a line before your opponent.',
    controls: ['Click or tap an empty square', 'X moves first', 'Rows, columns and diagonals win'],
    tip: 'The centre square gives you the most possible winning lines. Take it when available.',
    mission: 'Win two rounds in a row.',
    accent: 'violet',
  },
  'memory-match': {
    title: 'Memory Match',
    seoTitle: 'Play Memory Match Online Free | PLAYZO',
    description: 'Play Memory Match online for free. Flip cards, remember their positions and find every matching pair in as few moves as possible on PLAYZO.',
    category: 'MEMORY LAB',
    tagline: 'Remember more. Move less.',
    objective: 'Reveal cards and find every matching pair in as few moves as possible.',
    controls: ['Click / tap to flip a card', 'Reveal two cards per turn', 'Matched pairs stay visible'],
    tip: 'Remember card positions by row. Scan the board in a consistent order.',
    mission: 'Finish the board in fewer than 20 moves.',
    accent: 'pink',
  },
  'space-shooter': {
    title: 'Space Shooter',
    seoTitle: 'Play Space Shooter Online Free | PLAYZO',
    description: 'Play Space Shooter online for free on PLAYZO. Pilot your fighter, fire energy bolts and defend the galaxy against incoming enemy waves.',
    category: 'GALACTIC COMBAT',
    tagline: 'Hold the line. Clear the sector.',
    objective: 'Pilot your fighter, fire energy bolts and stop the invader waves.',
    controls: ['A / D or ← / → to steer', 'Space or FIRE to shoot', 'Drag across the arena on touch'],
    tip: 'Keep moving while firing. Line up beneath enemy formations instead of chasing every target.',
    mission: 'Clear all four waves with at least one hull left.',
    accent: 'cyan',
  },
  'brick-breaker': {
    title: 'Brick Breaker',
    seoTitle: 'Play Brick Breaker Online Free | PLAYZO',
    description: 'Play Brick Breaker online for free at PLAYZO. Bounce the ball, smash every brick and keep it in play using your paddle. No download needed.',
    category: 'ARCADE REFLEX',
    tagline: 'Keep the ball in play.',
    objective: 'Bounce the ball into every brick without letting it pass your paddle.',
    controls: ['Move mouse / touch to steer', 'Use ← / → buttons', 'Keep the paddle beneath the ball'],
    tip: 'Watch the ball angle after each bounce. Position early rather than reacting at the last moment.',
    mission: 'Clear two full rows without losing the ball.',
    accent: 'orange',
  },
  sudoku: {
    title: 'Sudoku Master',
    seoTitle: 'Play Sudoku Online Free | PLAYZO',
    description: 'Play Sudoku online for free on PLAYZO. Complete the 9×9 number grid using logic, fill each row, column and box, and practise your puzzle skills.',
    category: 'LOGIC ARENA',
    tagline: 'Calm focus beats random guesses.',
    objective: 'Complete every row, column and 3×3 box with digits 1–9.',
    controls: ['Select an empty cell', 'Enter a digit from 1 to 9', 'Use the mistake counter to check progress'],
    tip: 'Start with rows, columns or boxes that already contain the most numbers.',
    mission: 'Complete the puzzle with no mistakes.',
    accent: 'lime',
  },
}

const accentStyles: Record<string, string> = {
  lime: 'text-lime-300 border-lime-300/20 bg-lime-300/10',
  orange: 'text-orange-300 border-orange-300/20 bg-orange-300/10',
  sky: 'text-sky-300 border-sky-300/20 bg-sky-300/10',
  violet: 'text-violet-300 border-violet-300/20 bg-violet-300/10',
  pink: 'text-pink-300 border-pink-300/20 bg-pink-300/10',
  cyan: 'text-cyan-300 border-cyan-300/20 bg-cyan-300/10',
}

function setMetaName(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }
  element.content = content
}

function setMetaProperty(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export default function GamePage() {
  const { slug = '' } = useParams()
  const game = games[slug]

  useEffect(() => {
    if (!game) {
      document.title = 'Game Not Found | PLAYZO'
      setMetaName('robots', 'noindex, follow')
      return
    }

    const pageUrl = `${SITE_URL}/games/${slug}`
    document.title = game.seoTitle
    setMetaName('description', game.description)
    setMetaName('robots', 'index, follow')
    setMetaName('twitter:card', 'summary')
    setMetaName('twitter:title', game.seoTitle)
    setMetaName('twitter:description', game.description)
    setMetaProperty('og:type', 'website')
    setMetaProperty('og:site_name', 'PLAYZO')
    setMetaProperty('og:title', game.seoTitle)
    setMetaProperty('og:description', game.description)
    setMetaProperty('og:url', pageUrl)
    setMetaProperty('og:image', `${SITE_URL}/social-preview.svg`)
    setCanonical(pageUrl)
  }, [game, slug])

  if (!game) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090b19] px-5 text-center text-white">
        <div>
          <h1 className="text-3xl font-black">Game not found</h1>
          <Link className="mt-5 inline-flex items-center gap-2 text-violet-300" to="/#games">
            <ArrowLeft size={16} /> Return to PLAYZO
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090b19] text-white selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_12%_5%,rgba(91,33,182,.2),transparent_35%),radial-gradient(ellipse_at_90%_38%,rgba(8,145,178,.12),transparent_32%)]" />

      <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#0b0d1d]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="PLAYZO home">
            <img
              src="/playzo-logo.svg"
              alt="PLAYZO — Click. Play. Repeat."
              className="h-9 w-auto drop-shadow-[0_0_14px_rgba(139,92,246,.4)] sm:h-10"
              width="140"
              height="36"
            />
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-[10px] font-extrabold tracking-[.22em] text-slate-400 md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            ARCADE ONLINE <span className="text-slate-600">·</span> NO DOWNLOADS
          </div>

          <Link to="/#games" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3.5 py-2.5 text-xs font-bold text-slate-200 transition hover:border-violet-400/50 hover:bg-violet-500/10 sm:px-4 sm:text-sm">
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">All Games</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1500px] px-3 pb-10 pt-5 sm:px-5 lg:px-8 lg:pt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/[.07] pb-5">
          <div>
            <div className={`mb-2 inline-flex rounded-full border px-3 py-1 text-[9px] font-black tracking-[.22em] ${accentStyles[game.accent]}`}>
              {game.category}
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{game.title}</h1>
            <p className="mt-1 text-sm text-slate-400">{game.tagline}</p>
          </div>
          <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500 lg:flex">
            <Sparkles size={14} className="text-violet-300" /> Play instantly · Save your best locally
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
          <section className="min-w-0 rounded-[26px] border border-white/[.08] bg-[#11152a]/80 p-2 shadow-[0_25px_90px_rgba(0,0,0,.38)] sm:p-4 lg:p-5 [&>section]:!my-0 [&>section]:!max-w-none [&>section]:!px-0 [&>section]:!py-2">
            <GameSuite slug={slug} />
          </section>

          <aside className="grid gap-4 sm:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1">
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#211b43] via-[#171a35] to-[#10182d] p-5">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/15 blur-2xl" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-[.2em] text-violet-200">MISSION CONTROL</span>
                  <Target size={17} className="text-violet-300" />
                </div>
                <h2 className="text-lg font-extrabold">Today's challenge</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{game.mission}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[18%] rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                </div>
                <p className="mt-2 text-[10px] font-semibold text-slate-500">Challenge progress is a fun reminder — not tracked yet.</p>
              </div>
            </motion.section>

            <section className="rounded-3xl border border-white/[.08] bg-[#14182d] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Keyboard size={16} className="text-cyan-300" />
                <h2 className="text-sm font-extrabold">Controls</h2>
              </div>
              <ul className="space-y-3">
                {game.controls.map((item, i) => (
                  <li key={item} className="flex gap-3 text-xs leading-5 text-slate-400">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-[9px] font-black text-slate-300">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-amber-300/10 bg-gradient-to-br from-[#282016] to-[#17182b] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-300" />
                <h2 className="text-sm font-extrabold">Pro tip</h2>
              </div>
              <p className="text-xs leading-6 text-slate-300">{game.tip}</p>
            </section>

            <section className="rounded-3xl border border-white/[.08] bg-[#14182d] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Zap size={16} className="text-fuchsia-300" />
                <h2 className="text-sm font-extrabold">PLAYZO boost</h2>
              </div>
              <p className="text-xs leading-6 text-slate-400">Take a short break between runs, try a new strategy and beat your personal best. Your records stay in this browser.</p>
              <Link to="/#games" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-violet-300 transition hover:text-cyan-200">
                Explore more games <ArrowUpRight size={14} />
              </Link>
            </section>

            <div className="hidden items-center justify-center gap-2 py-2 text-[9px] font-bold tracking-[.2em] text-slate-600 xl:flex">
              <Trophy size={13} /> PLAY · IMPROVE · REPEAT
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-3xl border border-white/[.08] bg-[#14182d]/80 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">About {game.title}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">{game.objective}</p>
          <h2 className="mt-6 text-lg font-extrabold">How to play</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
            Start a game and use the controls shown on this page. Build your strategy, learn from each attempt and try to improve your personal best. PLAYZO games run in your browser, so you can play without installing a separate game app.
          </p>
        </section>
      </div>

      <footer className="relative z-10 border-t border-white/[.07] bg-[#080a16]/80 px-5 py-6 text-center">
        <Link to="/" className="inline-flex items-center justify-center" aria-label="PLAYZO homepage">
          <img src="/playzo-logo.svg" alt="PLAYZO" className="h-7 w-auto" width="109" height="28" />
        </Link>
        <p className="mt-2 text-[10px] text-slate-600">© {new Date().getFullYear()} PLAYZO · CLICK. PLAY. REPEAT.</p>
      </footer>
    </main>
  )
}
