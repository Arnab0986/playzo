
import { Link } from 'react-router-dom'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import SnakeGame from '../../games/snake/SnakeGame'

function SnakePage() {
  return (
    <main className="min-h-screen bg-[#101126] text-white">
      <header className="border-b border-white/[0.07] bg-[#101126]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Gamepad2 size={23} />
            </div>
            <span className="text-2xl font-black">
              PLAY<span className="text-violet-400">ZO</span>
            </span>
          </Link>

          <Link
            to="/#games"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold transition hover:border-violet-400/50"
          >
            <ArrowLeft size={16} />
            Back to Games
          </Link>
        </div>
      </header>

      <SnakeGame />

      <footer className="border-t border-white/[0.07] bg-[#0C0D20] px-5 py-7 text-center text-xs text-[#777A99]">
        © {new Date().getFullYear()} PLAYZO. CLICK. PLAY. REPEAT.
      </footer>
    </main>
  )
}

export default SnakePage
