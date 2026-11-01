import { Route, Routes, useNavigate } from 'react-router-dom'
import GamePage from './pages/GameDetails/GamePage'
import {
  AboutPage, CategoriesPage, HooksPage, LibrariesPage, StorePage, StylesPage,
  PrivacyPage, TermsPage, ContactPage,
} from './pages/InfoPages'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Gamepad2,
  Trophy,
  Zap,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Flame,
  Puzzle,
  Brain,
  Target,
  Grid2X2,
  Star,
} from 'lucide-react'

type Game = {
  id: number
  title: string
  category: string
  description: string
  emoji: string
  gradient: string
  status: 'Playable' | 'Coming Soon'
  difficulty: string
}

const games: Game[] = [
  {
    id: 1,
    title: 'Snake',
    category: 'Arcade',
    description: 'Eat, grow and beat your highest score.',
    emoji: '🐍',
    gradient: 'from-green-500/30 to-emerald-900/60',
    status: 'Playable',
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: '2048',
    category: 'Puzzle',
    description: 'Combine numbers and reach the 2048 tile.',
    emoji: '🔢',
    gradient: 'from-orange-500/30 to-amber-900/60',
    status: 'Playable',
    difficulty: 'Medium',
  },
  {
    id: 3,
    title: 'Flappy Challenge',
    category: 'Arcade',
    description: 'Fly through obstacles without crashing.',
    emoji: '🐤',
    gradient: 'from-sky-500/30 to-blue-900/60',
    status: 'Playable',
    difficulty: 'Hard',
  },
  {
    id: 4,
    title: 'Tic Tac Toe',
    category: 'Strategy',
    description: 'Challenge your brain in this classic battle.',
    emoji: '⭕',
    gradient: 'from-violet-500/30 to-purple-900/60',
    status: 'Playable',
    difficulty: 'Easy',
  },
  {
    id: 5,
    title: 'Memory Match',
    category: 'Puzzle',
    description: 'Flip cards and test your memory.',
    emoji: '🧠',
    gradient: 'from-pink-500/30 to-rose-900/60',
    status: 'Playable',
    difficulty: 'Medium',
  },
  {
    id: 6,
    title: 'Space Shooter',
    category: 'Action',
    description: 'Defend the galaxy against incoming enemies.',
    emoji: '🚀',
    gradient: 'from-indigo-500/30 to-blue-950/60',
    status: 'Playable',
    difficulty: 'Hard',
  },
  {
    id: 7,
    title: 'Brick Breaker',
    category: 'Arcade',
    description: 'Smash bricks and keep the ball alive.',
    emoji: '🧱',
    gradient: 'from-red-500/30 to-orange-950/60',
    status: 'Playable',
    difficulty: 'Medium',
  },
  {
    id: 8,
    title: 'Sudoku',
    category: 'Brain',
    description: 'Fill the grid with logic and precision.',
    emoji: '🧩',
    gradient: 'from-cyan-500/30 to-teal-950/60',
    status: 'Playable',
    difficulty: 'Hard',
  },
]

const categories = [
  { name: 'All Games', icon: Grid2X2 },
  { name: 'Arcade', icon: Gamepad2 },
  { name: 'Puzzle', icon: Puzzle },
  { name: 'Strategy', icon: Target },
  { name: 'Brain', icon: Brain },
  { name: 'Action', icon: Zap },
]

function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Games')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const searchTerm = search.trim().toLowerCase()

      const matchesSearch =
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)

      const matchesCategory =
        activeCategory === 'All Games' ||
        game.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const scrollToGames = () => {
    document.getElementById('games')?.scrollIntoView({
      behavior: 'smooth',
    })
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#101126] text-white">

      {/* ================= NAVIGATION ================= */}

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#101126]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* BRAND */}

          <a
            href="#home"
            className="flex items-center"
            aria-label="PLAYZO homepage"
          >
            <img
              src="/playzo-logo.svg"
              alt="PLAYZO - Click. Play. Repeat."
              className="h-10 w-auto"
            />
          </a>

          {/* DESKTOP NAVIGATION */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm font-semibold text-[#B7B9D3] md:flex"
          >
            <a
              href="#home"
              className="text-white transition hover:text-violet-400"
            >
              Home
            </a>

            <a
              href="#games"
              className="transition hover:text-violet-400"
            >
              Explore Games
            </a>

            <a
              href="#categories"
              className="transition hover:text-violet-400"
            >
              Categories
            </a>

            <a
              href="#about"
              className="transition hover:text-violet-400"
            >
              About
            </a>
            <a href="/hooks" className="transition hover:text-violet-400">Hooks</a>
            <a href="/libraries" className="transition hover:text-violet-400">Libs</a>
            <a href="/store" className="transition hover:text-violet-400">Store</a>
          </nav>

          {/* DESKTOP CTA */}

          <div className="hidden md:block">
            <button
              onClick={scrollToGames}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-bold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/40"
            >
              Explore Games
              <ArrowRight size={16} />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-white/10 p-2 transition hover:border-violet-400/50 md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 text-sm font-semibold text-[#B7B9D3] md:hidden"
          >
            <a
              onClick={closeMobileMenu}
              href="#home"
              className="transition hover:text-violet-400"
            >
              Home
            </a>

            <a
              onClick={closeMobileMenu}
              href="#games"
              className="transition hover:text-violet-400"
            >
              Explore Games
            </a>

            <a
              onClick={closeMobileMenu}
              href="#categories"
              className="transition hover:text-violet-400"
            >
              Categories
            </a>

            <a
              onClick={closeMobileMenu}
              href="#about"
              className="transition hover:text-violet-400"
            >
              About
            </a>
            <a onClick={closeMobileMenu} href="/hooks" className="transition hover:text-violet-400">Hooks</a>
            <a onClick={closeMobileMenu} href="/libraries" className="transition hover:text-violet-400">Libraries</a>
            <a onClick={closeMobileMenu} href="/store" className="transition hover:text-violet-400">Store</a>
            <a onClick={closeMobileMenu} href="/styles" className="transition hover:text-violet-400">Styles</a>

            <button
              onClick={scrollToGames}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold text-white"
            >
              Explore Games
              <ArrowRight size={16} />
            </button>
          </nav>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}

      <section
        id="home"
        className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28"
      >

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          {/* HERO TEXT */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold tracking-wide text-violet-300">
              <Sparkles size={14} />
              YOUR FREE GAMING DESTINATION
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              YOUR NEXT
              <br />
              FAVOURITE GAME
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                STARTS HERE.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#B7B9D3] sm:text-lg">
              Discover exciting games, challenge your brain and beat your
              high scores. No downloads. No registration. Just click and play.
            </p>

            {/* HERO BUTTONS */}

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={scrollToGames}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 font-bold shadow-xl shadow-violet-600/25 transition hover:-translate-y-1 hover:shadow-violet-500/40"
              >
                Explore Games
                <ArrowRight size={18} />
              </button>

              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 font-bold transition hover:border-violet-400/50 hover:bg-white/[0.08]"
              >
                Browse Categories
              </a>
            </div>

            {/* HERO STATISTICS */}

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <div className="text-2xl font-black">100%</div>
                <div className="mt-1 text-xs text-[#9295B5]">
                  Free to play
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">0</div>
                <div className="mt-1 text-xs text-[#9295B5]">
                  Downloads needed
                </div>
              </div>

              <div>
                <div className="text-2xl font-black">24/7</div>
                <div className="mt-1 text-xs text-[#9295B5]">
                  Gaming access
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO GAME ARTWORK */}

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-8 rounded-full bg-violet-600/30 blur-[90px]" />

            <div className="relative grid aspect-square grid-cols-2 gap-4 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#24264D] to-[#17182F] p-5 shadow-2xl shadow-violet-950/40 sm:p-7">

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/30 to-purple-950/60 text-7xl shadow-lg sm:text-8xl"
              >
                🎮
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [3, -3, 3] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/25 to-blue-950/60 text-7xl shadow-lg sm:text-8xl"
              >
                🚀
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 5.5, repeat: Infinity }}
                className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/25 to-rose-950/60 text-7xl shadow-lg sm:text-8xl"
              >
                🧩
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5.8, repeat: Infinity }}
                className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/25 to-amber-950/60 text-7xl shadow-lg sm:text-8xl"
              >
                🏆
              </motion.div>

              {/* FLOATING LABEL */}

              <div className="absolute -right-4 top-1/2 rounded-2xl border border-violet-400/30 bg-[#252448] px-4 py-3 shadow-xl sm:-right-8">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Flame size={17} className="text-orange-400" />
                  LET'S PLAY!
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-white/10 bg-[#20213E] px-4 py-3 shadow-xl sm:-left-8">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Zap size={17} className="text-yellow-400" />
                  INSTANT FUN
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURE STRIP ================= */}

      <section className="border-y border-white/[0.07] bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:grid-cols-3 lg:px-8">
          {[
            {
              icon: Zap,
              title: 'Instant Play',
              desc: 'No installation required',
            },
            {
              icon: Trophy,
              title: 'Beat Your Best',
              desc: 'Challenge your own records',
            },
            {
              icon: Star,
              title: 'Free Entertainment',
              desc: 'Enjoy games without a fee',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <item.icon size={23} />
              </div>

              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-[#9295B5]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GAME DISCOVERY ================= */}

      <section
        id="games"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-violet-400">
              <Flame size={17} />
              THE PLAYGROUND
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              EXPLORE <span className="text-violet-400">GAMES</span>
            </h2>

            <p className="mt-3 text-[#9295B5]">
              Find your next favourite game.
            </p>
          </div>

          {/* GAME SEARCH */}

          <div className="relative w-full md:max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9295B5]"
              size={18}
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search games..."
              aria-label="Search games"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#777A99] focus:border-violet-500"
            />
          </div>
        </div>

        {/* CATEGORY FILTERS */}

        <div
          id="categories"
          className="mt-9 flex scroll-mt-28 flex-wrap gap-3"
        >
          {categories.map((category) => {
            const Icon = category.icon
            const active = activeCategory === category.name

            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'border-white/10 bg-white/[0.035] text-[#B7B9D3] hover:border-violet-400/50 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* GAME CARDS */}

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredGames.map((game, index) => (
            <motion.article
              key={game.id}
              role={game.id <= 8 ? 'link' : undefined}
              tabIndex={game.id <= 8 ? 0 : undefined}
              aria-label={
                game.id === 1
                  ? 'Play Snake game'
                  : game.id === 2
                    ? 'Play 2048 game'
                    : undefined
              }
              onClick={() => {
                if (game.id >= 1 && game.id <= 8) navigate(`/games/${['snake','2048','flappy','tic-tac-toe','memory-match','space-shooter','brick-breaker','sudoku'][game.id - 1]}`)
              }}
              onKeyDown={(event) => {
                if (
                  game.id <= 8 &&
                  (event.key === 'Enter' || event.key === ' ')
                ) {
                  event.preventDefault()
                  navigate(`/games/${['snake','2048','flappy','tic-tac-toe','memory-match','space-shooter','brick-breaker','sudoku'][game.id - 1]}`)
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className={`group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#191A35] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/30 ${
                game.id <= 8 ? 'cursor-pointer' : ''
              }`}
            >
              {/* GAME ART */}

              <div
                className={`relative flex aspect-[5/3] items-center justify-center bg-gradient-to-br ${game.gradient}`}
              >
                <span className="text-7xl transition duration-300 group-hover:scale-110">
                  {game.emoji}
                </span>

                <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-bold text-white/80 backdrop-blur">
                  {game.status}
                </span>
              </div>

              {/* GAME INFORMATION */}

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                    {game.category}
                  </span>

                  <span className="text-xs text-[#9295B5]">
                    {game.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold">
                  {game.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-[#9295B5]">
                  {game.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="text-xs font-semibold text-[#9295B5]">
                    {game.status === 'Playable' ? 'Play Now' : 'Coming soon'}
                  </span>

                  <span className="text-violet-400">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* EMPTY SEARCH RESULTS */}

        {filteredGames.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
            <Search
              className="mx-auto mb-4 text-[#9295B5]"
              size={32}
            />

            <h3 className="text-xl font-bold">
              No games found
            </h3>

            <p className="mt-2 text-sm text-[#9295B5]">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All Games')
              }}
              className="mt-5 font-bold text-violet-400 transition hover:text-violet-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ================= CTA SECTION ================= */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-900/50 via-[#25204B] to-blue-950/50 px-7 py-14 text-center sm:px-12">

          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />

          <div className="relative">
            <div className="mb-5 inline-flex rounded-full bg-white/10 p-4">
              <Gamepad2 size={30} className="text-violet-300" />
            </div>

            <h2 className="text-3xl font-black sm:text-4xl">
              READY TO PLAY?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#C5C6DC] sm:text-base">
              Your next gaming adventure is waiting. Explore the collection
              and get ready to challenge yourself.
            </p>

            <button
              onClick={scrollToGames}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-extrabold text-[#17152F] transition hover:-translate-y-1 hover:bg-violet-100"
            >
              Discover Games
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/[0.07] bg-[#0C0D20]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:flex-row sm:text-left lg:px-8">

          <a
            href="#home"
            className="flex flex-col items-center sm:items-start"
            aria-label="PLAYZO homepage"
          >
            <img
              src="/playzo-logo.svg"
              alt="PLAYZO - Click. Play. Repeat."
              className="h-9 w-auto"
            />
          </a>

          <p className="text-xs text-[#777A99]">
            © {new Date().getFullYear()} PLAYZO. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-semibold text-[#9295B5]">
            <a href="/about" className="transition hover:text-white">About</a>
            <a href="/categories" className="transition hover:text-white">Categories</a>
            <a href="/hooks" className="transition hover:text-white">Hooks</a>
            <a href="/libraries" className="transition hover:text-white">Libraries</a>
            <a href="/store" className="transition hover:text-white">Store</a>
            <a href="/styles" className="transition hover:text-white">Styles</a>
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href="/terms" className="transition hover:text-white">Terms</a>
            <a href="/contact" className="transition hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/:slug" element={<GamePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/hooks" element={<HooksPage />} />
      <Route path="/libraries" element={<LibrariesPage />} />
      <Route path="/libs" element={<LibrariesPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/styles" element={<StylesPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
