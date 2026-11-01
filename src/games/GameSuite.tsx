
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Gamepad2,
  Zap,
  Target,
  Heart,
} from 'lucide-react'

import SnakeGame from './snake/SnakeGame'
import Game2048 from './2048/Game2048'

type Status = 'ready' | 'playing' | 'paused' | 'over' | 'won'

type Props = {
  slug: string
}

type ShellProps = {
  title: string
  accent: string
  subtitle: string
  score: number
  best: number
  status: Status
  onStart: () => void
  onPause?: () => void
  onRestart: () => void
  children: ReactNode
  instructions: string[]
  extraStat?: { label: string; value: string | number }
  winMessage?: string
}

type Bullet = {
  id: number
  x: number
  y: number
}

type Invader = {
  id: number
  x: number
  y: number
}

type Ball = {
  x: number
  y: number
  dx: number
  dy: number
}

const panel =
  'rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center'

const action =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#191A35] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/60 hover:bg-violet-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40'

const primary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[.98]'

const sudokuPuzzle = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
]

const sudokuSolution = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
]

function readBest(key: string) {
  try {
    return Number(localStorage.getItem(key)) || 0
  } catch {
    return 0
  }
}

function saveBest(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // Local storage may be unavailable.
  }
}

function useRecord(key: string) {
  const [best, setBest] = useState(() => readBest(key))

  const record = useCallback(
    (score: number) => {
      setBest((old) => {
        if (score > old) {
          saveBest(key, score)
          return score
        }
        return old
      })
    },
    [key],
  )

  return [best, record] as const
}

function Shell({
  title,
  accent,
  subtitle,
  score,
  best,
  status,
  onStart,
  onPause,
  onRestart,
  children,
  instructions,
  extraStat,
  winMessage,
}: ShellProps) {
  const overlay = status !== 'playing'

  const statusTitle =
    status === 'ready'
      ? 'READY TO PLAY?'
      : status === 'paused'
        ? 'GAME PAUSED'
        : status === 'won'
          ? 'YOU WON!'
          : 'GAME OVER'

  const statusIcon =
    status === 'ready'
      ? '🎮'
      : status === 'paused'
        ? '⏸️'
        : status === 'won'
          ? '🏆'
          : '💥'

  return (
    <section
      data-accent={accent}
      className="mx-auto w-full max-w-[1400px] px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold text-violet-300">
          <Gamepad2 size={15} />
          PLAYZO ORIGINAL GAME
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-[#9295B5] sm:text-base">
          {subtitle}
        </p>
      </motion.header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div
            className={`mb-4 grid grid-cols-2 gap-3 ${
              extraStat ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            <motion.div whileHover={{ y: -2 }} className={panel}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
                Score
              </p>
              <motion.p
                key={score}
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                className="mt-1 text-3xl font-black text-violet-300"
              >
                {score}
              </motion.p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className={panel}>
              <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
                <Trophy size={13} />
                Best
              </p>
              <p className="mt-1 text-3xl font-black text-yellow-400">
                {best}
              </p>
            </motion.div>

            {extraStat && (
              <motion.div
                whileHover={{ y: -2 }}
                className={`${panel} col-span-2 sm:col-span-1`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
                  {extraStat.label}
                </p>
                <p className="mt-1 text-3xl font-black text-cyan-300">
                  {extraStat.value}
                </p>
              </motion.div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#17182F] p-2 shadow-2xl shadow-black/30 sm:p-4">
            <div className="relative mx-auto min-h-[360px] w-full overflow-hidden rounded-xl border border-white/5 bg-[#080D20] p-3 sm:p-4">
              {children}

              <AnimatePresence>
                {overlay && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-[#080D20]/85 p-5 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 22,
                      }}
                      className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#1D1E3B] p-6 text-center shadow-2xl"
                    >
                      <motion.div
                        animate={
                          status === 'won'
                            ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }
                            : { y: [0, -5, 0] }
                        }
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mb-4 text-5xl"
                      >
                        {statusIcon}
                      </motion.div>

                      <h2 className="text-2xl font-black">
                        {statusTitle}
                      </h2>

                      <p className="mt-2 text-sm text-[#9295B5]">
                        {status === 'ready'
                          ? subtitle
                          : status === 'paused'
                            ? 'Your game is waiting. Resume when ready.'
                            : status === 'won'
                              ? winMessage || 'Amazing performance!'
                              : `You scored ${score} points. Try again!`}
                      </p>

                      {status !== 'ready' && status !== 'paused' && (
                        <p className="mt-2 text-xs font-bold text-yellow-400">
                          {score >= best && score > 0
                            ? 'NEW HIGH SCORE!'
                            : `PERSONAL BEST: ${best}`}
                        </p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={
                          status === 'paused'
                            ? onPause || onStart
                            : onStart
                        }
                        className={`${primary} mt-6 w-full`}
                      >
                        <Play size={17} />
                        {status === 'ready'
                          ? 'Start Game'
                          : status === 'paused'
                            ? 'Resume Game'
                            : 'Play Again'}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {onPause && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onPause}
                disabled={status === 'ready' || status === 'over' || status === 'won'}
                className={action}
              >
                {status === 'paused' ? <Play size={16} /> : <Pause size={16} />}
                {status === 'paused' ? 'Resume' : 'Pause'}
              </motion.button>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRestart}
              className={action}
            >
              <RotateCcw size={16} />
              Restart
            </motion.button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#191A35] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target size={18} className="text-violet-300" />
              <h3 className="font-bold">Mission briefing</h3>
            </div>
            <div className="space-y-3 text-sm text-[#A4A6C1]">
              {instructions.map((item) => (
                <p key={item} className="leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-blue-600/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Zap size={18} className="text-yellow-300" />
              <h3 className="font-bold">PLAYZO tip</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#C3C4DC]">
              Focus, improve your timing and beat your personal best. Every
              round is a new opportunity!
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-300">
              <Trophy size={14} />
              CHALLENGE YOURSELF
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#191A35] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart size={17} className="text-pink-400" />
              <h3 className="font-bold">Arcade status</h3>
            </div>
            <p className="text-sm text-[#9295B5]">
              {status === 'playing'
                ? 'Game in progress. Good luck!'
                : status === 'paused'
                  ? 'Game paused. Continue whenever you are ready.'
                  : status === 'won'
                    ? 'Mission accomplished. Fantastic performance!'
                    : status === 'over'
                      ? 'Round complete. Another attempt awaits.'
                      : 'Your next arcade adventure is ready.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

/* ---------------- FLAPPY CHALLENGE ---------------- */

function FlappyGame() {
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, record] = useRecord('playzo-flappy-best')
  const [bird, setBird] = useState(48)
  const [pipe, setPipe] = useState(90)
  const [gap, setGap] = useState(42)

  const birdRef = useRef(48)
  const pipeRef = useRef(90)
  const gapRef = useRef(42)
  const statusRef = useRef<Status>('ready')
  const scoreRef = useRef(0)

  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { birdRef.current = bird }, [bird])
  useEffect(() => { pipeRef.current = pipe }, [pipe])
  useEffect(() => { gapRef.current = gap }, [gap])
  useEffect(() => { scoreRef.current = score }, [score])

  const end = useCallback(() => {
    if (statusRef.current !== 'playing') return
    statusRef.current = 'over'
    setStatus('over')
    record(scoreRef.current)
  }, [record])

  const start = () => {
    birdRef.current = 48
    pipeRef.current = 90
    gapRef.current = 42
    scoreRef.current = 0
    setBird(48)
    setPipe(90)
    setGap(42)
    setScore(0)
    statusRef.current = 'playing'
    setStatus('playing')
  }

  const restart = () => {
    statusRef.current = 'ready'
    setStatus('ready')
    setScore(0)
    setBird(48)
    setPipe(90)
    setGap(42)
  }

  const flap = () => {
    if (statusRef.current !== 'playing') return
    const next = Math.max(5, birdRef.current - 13)
    birdRef.current = next
    setBird(next)
  }

  useEffect(() => {
    if (status !== 'playing') return

    const timer = window.setInterval(() => {
      const nextBird = birdRef.current + 2.8
      const nextPipe = pipeRef.current - 2.5

      if (nextBird >= 90 || nextBird <= 0) {
        end()
        return
      }

      birdRef.current = nextBird
      setBird(nextBird)

      if (nextPipe > 15 && nextPipe < 25) {
        if (
          nextBird < gapRef.current - 8 ||
          nextBird > gapRef.current + 17
        ) {
          end()
          return
        }
      }

      if (nextPipe < -10) {
        const newGap = 20 + Math.random() * 48
        pipeRef.current = 105
        gapRef.current = newGap
        setPipe(105)
        setGap(newGap)

        scoreRef.current += 1
        setScore(scoreRef.current)
        record(scoreRef.current)
      } else {
        pipeRef.current = nextPipe
        setPipe(nextPipe)
      }
    }, 45)

    return () => window.clearInterval(timer)
  }, [status, end, record])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (statusRef.current === 'ready') start()
        else flap()
      }
    }

    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  return (
    <Shell
      title="Flappy Challenge"
      accent="sky"
      subtitle="Fly through the gaps and avoid the obstacles."
      score={score}
      best={best}
      status={status}
      onStart={start}
      onPause={() =>
        setStatus((s) => s === 'playing' ? 'paused' : 'playing')
      }
      onRestart={restart}
      instructions={[
        'Click or tap to fly upward.',
        'Press SPACE to flap.',
        'Avoid the moving pipes.',
        'Pass obstacles to earn points.',
      ]}
    >
      <button
        aria-label="Flap"
        onClick={() => {
          if (status === 'ready') start()
          else flap()
        }}
        className="relative h-[360px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-sky-500/30 via-indigo-950 to-[#080d20]"
      >
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-emerald-800 to-emerald-500" />

        <motion.div
          animate={{ top: `${bird}%`, rotate: bird > 55 ? 25 : -15 }}
          className="absolute left-[24%] z-10 text-4xl"
        >
          🐤
        </motion.div>

        <div
          style={{ left: `${pipe}%`, height: `${gap}%` }}
          className="absolute top-0 w-10 rounded-b-lg border-x-2 border-emerald-300/50 bg-gradient-to-r from-green-700 via-lime-400 to-green-600"
        />

        <div
          style={{
            left: `${pipe}%`,
            top: `${gap + 23}%`,
            height: `${77 - gap}%`,
          }}
          className="absolute w-10 rounded-t-lg border-x-2 border-emerald-300/50 bg-gradient-to-r from-green-700 via-lime-400 to-green-600"
        />

        <span className="absolute inset-x-0 top-4 text-center text-xs font-black uppercase tracking-widest text-white/80">
          Tap to flap
        </span>
      </button>
    </Shell>
  )
}

/* ---------------- TIC TAC TOE ---------------- */

function TicTacToeGame() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, record] = useRecord('playzo-tictactoe-best')

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const winner = wins.some(
    ([a, b, c]) => Boolean(board[a]) && board[a] === board[b] && board[b] === board[c],
  )

  const reset = () => {
    setBoard(Array(9).fill(''))
    setTurn('X')
    setScore(0)
    setStatus('ready')
  }

  const start = () => {
    setBoard(Array(9).fill(''))
    setTurn('X')
    setScore(0)
    setStatus('playing')
  }

  const play = (i: number) => {
    if (status !== 'playing' || board[i] || winner) return

    const next = board.map((v, j) => j === i ? turn : v)
    setBoard(next)

    const won = wins.some(
      ([a, b, c]) => Boolean(next[a]) && next[a] === next[b] && next[b] === next[c],
    )

    if (won) {
      const n = score + 1
      setScore(n)
      record(n)
      setStatus('won')
    } else if (next.every(Boolean)) {
      setStatus('over')
    } else {
      setTurn(turn === 'X' ? 'O' : 'X')
    }
  }

  return (
    <Shell
      title="Tic Tac Toe"
      accent="violet"
      subtitle="Outsmart your opponent. Get three in a row!"
      score={score}
      best={best}
      status={status}
      onStart={start}
      onRestart={reset}
      instructions={[
        'You play as X. O is the second player.',
        'Get three symbols in a row to win.',
        'Rows, columns and diagonals count.',
        'Challenge a friend to a match.',
      ]}
      extraStat={{ label: 'Current Turn', value: turn }}
    >
      <div className="mx-auto grid max-w-[390px] grid-cols-3 gap-3 py-5">
        {board.map((v, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => play(i)}
            className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-[#25284D] to-[#15172F] text-5xl font-black shadow-lg sm:text-6xl"
          >
            {v && (
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                className={v === 'X' ? 'text-violet-300' : 'text-pink-300'}
              >
                {v}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-[#9295B5]">
        {winner ? `${turn} wins!` : board.every(Boolean) ? 'Draw game' : `${turn}'s turn`}
      </p>
    </Shell>
  )
}

/* ---------------- MEMORY MATCH ---------------- */

function MemoryGame() {
  const symbols = ['🍒', '🚀', '🐼', '🎮', '⭐', '🍕', '🐸', '💎']
  const makeCards = () =>
    [...symbols, ...symbols].sort(() => Math.random() - 0.5)

  const [cards, setCards] = useState(makeCards)
  const [opened, setOpened] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, record] = useRecord('playzo-memory-best')

  const timeoutRef = useRef<number | null>(null)

  const clearFlipTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const start = () => {
    clearFlipTimer()
    setCards(makeCards())
    setOpened([])
    setMatched([])
    setMoves(0)
    setScore(0)
    setStatus('playing')
  }

  const reset = () => {
    clearFlipTimer()
    setCards(makeCards())
    setOpened([])
    setMatched([])
    setMoves(0)
    setScore(0)
    setStatus('ready')
  }

  const flip = (i: number) => {
    if (
      status !== 'playing' ||
      opened.length === 2 ||
      opened.includes(i) ||
      matched.includes(i)
    ) return

    const next = [...opened, i]
    setOpened(next)

    if (next.length !== 2) return

    setMoves((v) => v + 1)

    if (cards[next[0]] === cards[next[1]]) {
      const newMatched = [...matched, ...next]
      const newScore = score + 100

      setMatched(newMatched)
      setOpened([])
      setScore(newScore)

      if (newMatched.length === 16) {
        record(newScore)
        setStatus('won')
      }
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setOpened([])
        timeoutRef.current = null
      }, 750)
    }
  }

  return (
    <Shell
      title="Memory Match"
      accent="pink"
      subtitle="Find every matching pair using your memory."
      score={score}
      best={best}
      status={status}
      onStart={start}
      onRestart={reset}
      instructions={[
        'Flip two cards to find a matching pair.',
        'Matching cards stay face up.',
        'Complete all eight pairs to win.',
        'Try to finish using fewer moves.',
      ]}
      extraStat={{ label: 'Moves', value: moves }}
    >
      <div className="mx-auto grid max-w-[440px] grid-cols-4 gap-2 py-3 sm:gap-3">
        {cards.map((card, i) => {
          const visible = opened.includes(i) || matched.includes(i)

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9, rotateY: 12 }}
              onClick={() => flip(i)}
              className={`flex aspect-square items-center justify-center rounded-xl border text-3xl transition-colors sm:text-4xl ${
                visible
                  ? 'border-violet-300/40 bg-violet-500/25'
                  : 'border-white/10 bg-gradient-to-br from-[#292C52] to-[#171932]'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={visible ? card : 'back'}
                  initial={{ opacity: 0, scale: 0.4, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  {visible ? card : '?'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </Shell>
  )
}

/* ---------------- SPACE SHOOTER ---------------- */

function SpaceShooterGame() {
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, record] = useRecord('playzo-space-best')
  const [ship, setShip] = useState(50)
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [enemies, setEnemies] = useState<Invader[]>([])
  const [wave, setWave] = useState(1)
  const [lives, setLives] = useState(3)
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number }[]>([])

  const idRef = useRef(0)
  const statusRef = useRef<Status>('ready')
  const shipRef = useRef(50)
  const bulletsRef = useRef<Bullet[]>([])
  const enemiesRef = useRef<Invader[]>([])
  const waveRef = useRef(1)
  const livesRef = useRef(3)
  const scoreRef = useRef(0)
  const fireRef = useRef(0)

  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { shipRef.current = ship }, [ship])
  useEffect(() => { bulletsRef.current = bullets }, [bullets])
  useEffect(() => { enemiesRef.current = enemies }, [enemies])
  useEffect(() => { waveRef.current = wave }, [wave])
  useEffect(() => { livesRef.current = lives }, [lives])
  useEffect(() => { scoreRef.current = score }, [score])

  const spawnWave = (level: number): Invader[] =>
    Array.from({ length: Math.min(10, 4 + level) }, (_, i) => ({
      id: ++idRef.current,
      x: 12 + (i % 5) * 19,
      y: 13 + Math.floor(i / 5) * 13,
    }))

  const start = () => {
    const firstWave = spawnWave(1)
    statusRef.current = 'playing'
    shipRef.current = 50
    bulletsRef.current = []
    enemiesRef.current = firstWave
    waveRef.current = 1
    livesRef.current = 3
    scoreRef.current = 0

    setStatus('playing')
    setShip(50)
    setBullets([])
    setEnemies(firstWave)
    setWave(1)
    setLives(3)
    setScore(0)
    setExplosions([])
  }

  const reset = () => {
    statusRef.current = 'ready'
    bulletsRef.current = []
    enemiesRef.current = []
    setStatus('ready')
    setBullets([])
    setEnemies([])
    setScore(0)
    setShip(50)
    setWave(1)
    setLives(3)
    setExplosions([])
  }

  const moveShip = (direction: number) => {
    const next = Math.max(5, Math.min(95, shipRef.current + direction))
    shipRef.current = next
    setShip(next)
  }

  const shoot = useCallback(() => {
    if (statusRef.current !== 'playing') return

    const now = Date.now()
    if (now - fireRef.current < 230) return
    fireRef.current = now

    const bullet = {
      id: ++idRef.current,
      x: shipRef.current,
      y: 83,
    }

    bulletsRef.current = [...bulletsRef.current, bullet]
    setBullets(bulletsRef.current)
  }, [])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault()
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') moveShip(-5)
      if (e.code === 'ArrowRight' || e.code === 'KeyD') moveShip(5)
      if (e.code === 'Space') shoot()
    }

    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [shoot])

  useEffect(() => {
    if (status !== 'playing') return

    const timer = window.setInterval(() => {
      const movedBullets = bulletsRef.current
        .map((b) => ({ ...b, y: b.y - 3.2 }))
        .filter((b) => b.y > 0)

      const movedEnemies = enemiesRef.current.map((e) => ({
        ...e,
        y: e.y + 0.10 + waveRef.current * 0.025,
        x: e.x + Math.sin(Date.now() / 600 + e.id) * 0.12,
      }))

      const hitBullets = new Set<number>()
      const hitEnemies = new Set<number>()
      const newExplosions: { id: number; x: number; y: number }[] = []
      let gained = 0

      for (const bullet of movedBullets) {
        const target = movedEnemies.find(
          (enemy) =>
            !hitEnemies.has(enemy.id) &&
            Math.abs(enemy.x - bullet.x) < 5 &&
            Math.abs(enemy.y - bullet.y) < 5,
        )

        if (target) {
          hitBullets.add(bullet.id)
          hitEnemies.add(target.id)
          gained += 100
          newExplosions.push({
            id: ++idRef.current,
            x: target.x,
            y: target.y,
          })
        }
      }

      const remainingBullets = movedBullets.filter(
        (b) => !hitBullets.has(b.id),
      )

      const remainingEnemies = movedEnemies.filter(
        (e) => !hitEnemies.has(e.id),
      )

      const escaped = remainingEnemies.filter((e) => e.y > 84)
      let nextEnemies = remainingEnemies.filter((e) => e.y <= 84)
      let nextLives = livesRef.current - escaped.length
      let nextWave = waveRef.current
      let nextStatus: Status = 'playing'

      if (gained > 0) {
        scoreRef.current += gained
        setScore(scoreRef.current)
        record(scoreRef.current)
      }

      if (escaped.length > 0) {
        livesRef.current = Math.max(0, nextLives)
        nextLives = livesRef.current
        setLives(nextLives)
      }

      if (nextLives <= 0) {
        nextStatus = 'over'
        statusRef.current = 'over'
        setStatus('over')
        record(scoreRef.current)
      } else if (nextEnemies.length === 0) {
        if (nextWave >= 4) {
          nextStatus = 'won'
          statusRef.current = 'won'
          setStatus('won')
          record(scoreRef.current)
        } else {
          nextWave += 1
          nextWave = Math.min(nextWave, 4)
          nextEnemies = spawnWave(nextWave)
          waveRef.current = nextWave
          setWave(nextWave)
        }
      }

      bulletsRef.current = remainingBullets
      enemiesRef.current = nextEnemies

      setBullets(remainingBullets)
      setEnemies(nextEnemies)

      if (newExplosions.length > 0) {
        setExplosions((old) => [...old, ...newExplosions])

        window.setTimeout(() => {
          const ids = new Set(newExplosions.map((e) => e.id))
          setExplosions((old) => old.filter((e) => !ids.has(e.id)))
        }, 400)
      }

      if (nextStatus !== 'playing') {
        bulletsRef.current = []
        setBullets([])
      }
    }, 35)

    return () => window.clearInterval(timer)
  }, [status, record])

  return (
    <Shell
      title="Space Shooter"
      accent="cyan"
      subtitle="Defend the sector. Destroy the incoming fleet."
      score={score}
      best={best}
      status={status}
      onStart={start}
      onPause={() => setStatus((s) => s === 'playing' ? 'paused' : 'playing')}
      onRestart={reset}
      instructions={[
        'Use A / D or arrow keys to pilot your spacecraft.',
        'Press SPACE or FIRE to launch energy bolts.',
        'Projectiles destroy enemies when they collide.',
        'Survive four waves. You have three lives.',
      ]}
      extraStat={{ label: 'Wave / Lives', value: `${wave} / ${lives}` }}
    >
      <div
        className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#030716] shadow-[inset_0_0_80px_rgba(22,78,140,.25)] sm:h-[500px]"
        onPointerMove={(e) => {
          if (statusRef.current !== 'playing') return
          const rect = e.currentTarget.getBoundingClientRect()
          const next = Math.max(
            5,
            Math.min(95, ((e.clientX - rect.left) / rect.width) * 100),
          )
          shipRef.current = next
          setShip(next)
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(37,99,235,.18),transparent_65%)]" />

        {Array.from({ length: 45 }, (_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.5 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: (i % 7) * 0.2,
            }}
            className="absolute h-1 w-1 rounded-full bg-cyan-100"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
            }}
          />
        ))}

        <div className="absolute inset-x-0 top-3 z-10 flex justify-between px-4 text-[10px] font-black uppercase tracking-[.25em] text-cyan-100/70">
          <span>Sector 07</span>
          <span>Wave {wave} · {lives} hulls</span>
        </div>

        {enemies.map((enemy, i) => (
          <motion.div
            key={enemy.id}
            className="absolute z-10"
            style={{
              left: `${enemy.x}%`,
              top: `${enemy.y}%`,
              transform: 'translate(-50%,-50%)',
            }}
            animate={{ x: [-5, 5, -5], rotate: [-3, 3, -3] }}
            transition={{
              duration: 2 + i * 0.13,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg viewBox="0 0 64 48" className="h-9 w-11 drop-shadow-[0_0_12px_rgba(244,63,94,.65)] sm:h-11 sm:w-14">
              <defs>
                <linearGradient id={`alien-${enemy.id}`} x1="0" x2="1">
                  <stop stopColor="#fb7185" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
              </defs>
              <path
                d="M32 3 43 15 60 20 52 31 46 27 43 43 32 36 21 43 18 27 12 31 4 20 21 15Z"
                fill={`url(#alien-${enemy.id})`}
                stroke="#ffd0dc"
                strokeWidth="2"
              />
              <path d="M23 19h7v5h-7zm12 0h7v5h-7z" fill="#fff" />
              <path d="M26 31h12" stroke="#7f173c" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        ))}

        {bullets.map((bullet) => (
          <motion.div
            key={bullet.id}
            className="absolute z-20 h-7 w-1.5 rounded-full bg-cyan-100 shadow-[0_0_12px_5px_rgba(34,211,238,.75)]"
            style={{
              left: `${bullet.x}%`,
              top: `${bullet.y}%`,
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}

        {explosions.map((explosion) => (
          <motion.div
            key={explosion.id}
            initial={{ opacity: 1, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2.5 }}
            className="pointer-events-none absolute z-30 text-2xl"
            style={{
              left: `${explosion.x}%`,
              top: `${explosion.y}%`,
              transform: 'translate(-50%,-50%)',
            }}
          >
            💥
          </motion.div>
        ))}

        <motion.div
          className="absolute z-20"
          animate={{ left: `${ship}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{ bottom: '8px', transform: 'translateX(-50%)' }}
        >
          <svg viewBox="0 0 80 92" className="h-16 w-14 drop-shadow-[0_0_18px_rgba(34,211,238,.8)] sm:h-20 sm:w-16">
            <defs>
              <linearGradient id="playzoShipMetal" x1="0" x2="1">
                <stop stopColor="#67e8f9" />
                <stop offset=".5" stopColor="#f8fafc" />
                <stop offset="1" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="playzoEngine" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="#fff7ae" />
                <stop offset="1" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <path
              d="M40 3 51 37 73 68 53 64 47 82 40 75 33 82 27 64 7 68 29 37Z"
              fill="url(#playzoShipMetal)"
              stroke="#cffafe"
              strokeWidth="2"
            />
            <path d="M40 17 47 43 40 53 33 43Z" fill="#0e7490" />
            <path d="M35 74h10l-5 16Z" fill="url(#playzoEngine)" />
            <path d="M15 64 29 58 25 72Z M65 64 51 58 55 72Z" fill="#f97316" />
          </svg>
        </motion.div>

        {status === 'playing' && (
          <div className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-widest text-cyan-100/45">
            Drag to steer · Space to fire
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          className={action}
          onClick={() => moveShip(-8)}
          aria-label="Move ship left"
        >
          <ArrowLeft />
        </button>

        <button
          className={primary}
          onClick={shoot}
          disabled={status !== 'playing'}
        >
          <Zap size={17} />
          FIRE
        </button>

        <button
          className={action}
          onClick={() => moveShip(8)}
          aria-label="Move ship right"
        >
          <ArrowRight />
        </button>
      </div>
    </Shell>
  )
}

/* ---------------- BRICK BREAKER ---------------- */

function BrickBreakerGame() {
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, record] = useRecord('playzo-brick-best')
  const [bricks, setBricks] = useState<boolean[]>(Array(24).fill(true))
  const [paddle, setPaddle] = useState(50)
  const [ball, setBall] = useState<Ball>({
    x: 50,
    y: 75,
    dx: 1.3,
    dy: -1.5,
  })

  const statusRef = useRef<Status>('ready')
  const ballRef = useRef<Ball>(ball)
  const paddleRef = useRef(50)
  const bricksRef = useRef<boolean[]>(bricks)
  const scoreRef = useRef(0)

  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { ballRef.current = ball }, [ball])
  useEffect(() => { paddleRef.current = paddle }, [paddle])
  useEffect(() => { bricksRef.current = bricks }, [bricks])
  useEffect(() => { scoreRef.current = score }, [score])

  const start = () => {
    const newBall = { x: 50, y: 75, dx: 1.3, dy: -1.5 }
    const newBricks = Array(24).fill(true)

    statusRef.current = 'playing'
    ballRef.current = newBall
    bricksRef.current = newBricks
    scoreRef.current = 0
    paddleRef.current = 50

    setStatus('playing')
    setScore(0)
    setBricks(newBricks)
    setPaddle(50)
    setBall(newBall)
  }

  const reset = () => {
    const newBall = { x: 50, y: 75, dx: 1.3, dy: -1.5 }
    const newBricks = Array(24).fill(true)

    statusRef.current = 'ready'
    ballRef.current = newBall
    bricksRef.current = newBricks
    scoreRef.current = 0
    paddleRef.current = 50

    setStatus('ready')
    setScore(0)
    setBricks(newBricks)
    setPaddle(50)
    setBall(newBall)
  }

  const movePaddle = (value: number) => {
    const next = Math.max(10, Math.min(90, value))
    paddleRef.current = next
    setPaddle(next)
  }

  useEffect(() => {
    if (status !== 'playing') return

    const timer = window.setInterval(() => {
      const old = ballRef.current
      const x = old.x + old.dx
      const y = old.y + old.dy
      let dx = old.dx
      let dy = old.dy

      if (x < 2 || x > 98) dx = -dx
      if (y < 3) dy = Math.abs(dy)

      if (y > 88 && Math.abs(x - paddleRef.current) < 17 && dy > 0) {
        dy = -Math.abs(dy)
        dx += (x - paddleRef.current) * 0.04
      }

      if (y > 99) {
        statusRef.current = 'over'
        setStatus('over')
        record(scoreRef.current)
        return
      }

      const nextBricks = [...bricksRef.current]

      if (y < 38) {
        const col = Math.min(5, Math.max(0, Math.floor(x / 17)))
        const row = Math.min(3, Math.max(0, Math.floor(y / 9)))
        const index = row * 6 + col

        if (nextBricks[index]) {
          nextBricks[index] = false
          bricksRef.current = nextBricks
          setBricks(nextBricks)
          dy = Math.abs(dy)

          scoreRef.current += 10
          setScore(scoreRef.current)
          record(scoreRef.current)
        }
      }

      const nextBall = {
        x: Math.max(1, Math.min(99, x)),
        y: Math.max(1, Math.min(99, y)),
        dx,
        dy,
      }

      ballRef.current = nextBall
      setBall(nextBall)

      if (nextBricks.every((v) => !v)) {
        statusRef.current = 'won'
        setStatus('won')
        record(scoreRef.current)
      }
    }, 25)

    return () => window.clearInterval(timer)
  }, [status, record])

  return (
    <Shell
      title="Brick Breaker"
      accent="orange"
      subtitle="Control the paddle. Keep the ball alive. Smash every brick."
      score={score}
      best={best}
      status={status}
      onStart={start}
      onRestart={reset}
      instructions={[
        'Break bricks to earn points.',
        'Move your mouse or use the controls to move the paddle.',
        'Keep the ball from falling below the paddle.',
        'Clear every brick to win.',
      ]}
    >
      <div
        className="relative h-[360px] overflow-hidden rounded-xl border border-orange-300/10 bg-gradient-to-b from-[#17162F] to-[#080D20]"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          movePaddle(((e.clientX - rect.left) / rect.width) * 100)
        }}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {bricks.map((alive, i) => (
            <div
              key={i}
              className={`h-7 rounded-md transition-opacity ${
                alive
                  ? `bg-gradient-to-r ${
                      i % 3 === 0
                        ? 'from-orange-500 to-pink-500'
                        : i % 3 === 1
                          ? 'from-violet-500 to-blue-500'
                          : 'from-cyan-500 to-teal-400'
                    } shadow-md`
                  : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <motion.div
          animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,255,255,.7)]"
        />

        <motion.div
          animate={{ left: `${paddle}%` }}
          className="absolute bottom-3 h-3 w-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 via-cyan-300 to-blue-500 shadow-lg shadow-cyan-400/40 sm:w-24"
        />
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          className={action}
          onClick={() => movePaddle(paddleRef.current - 8)}
          aria-label="Move paddle left"
        >
          <ArrowLeft />
        </button>

        <button
          className={action}
          onClick={() => movePaddle(paddleRef.current + 8)}
          aria-label="Move paddle right"
        >
          <ArrowRight />
        </button>
      </div>
    </Shell>
  )
}

/* ---------------- SUDOKU ---------------- */

function SudokuGame() {
  const [values, setValues] = useState<number[]>([...sudokuPuzzle])
  const [status, setStatus] = useState<Status>('ready')
  const [best, setBest] = useState(() => readBest('playzo-sudoku-best'))
  const [seconds, setSeconds] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  const statusRef = useRef<Status>('ready')
  const secondsRef = useRef(0)

  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { secondsRef.current = seconds }, [seconds])

  const start = () => {
    setValues([...sudokuPuzzle])
    setSeconds(0)
    setMistakes(0)
    statusRef.current = 'playing'
    setStatus('playing')
  }

  const reset = () => {
    setValues([...sudokuPuzzle])
    setSeconds(0)
    setMistakes(0)
    statusRef.current = 'ready'
    setStatus('ready')
  }

  useEffect(() => {
    if (status !== 'playing') return

    const timer = window.setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [status])

  const update = (i: number, value: string) => {
    if (statusRef.current !== 'playing' || sudokuPuzzle[i] !== 0) return

    if (value !== '' && !/^[1-9]$/.test(value)) return

    const number = value === '' ? 0 : Number(value)
    const next = values.map((v, j) => j === i ? number : v)

    setValues(next)

    if (number !== 0 && number !== sudokuSolution[i]) {
      setMistakes((m) => m + 1)
    }

    if (next.every((v, j) => v === sudokuSolution[j])) {
      statusRef.current = 'won'
      setStatus('won')

      const completionTime = Math.max(1, secondsRef.current)
      const previous = readBest('playzo-sudoku-best')

      if (previous === 0 || completionTime < previous) {
        saveBest('playzo-sudoku-best', completionTime)
        setBest(completionTime)
      }
    }
  }

  const formattedBest = best
    ? `${Math.floor(best / 60)}:${String(best % 60).padStart(2, '0')}`
    : '—'

  return (
    <Shell
      title="Sudoku Master"
      accent="lime"
      subtitle="Fill the grid. Think logically. Complete the puzzle."
      score={Math.max(0, 1000 - seconds * 2 - mistakes * 25)}
      best={best}
      status={status}
      onStart={start}
      onRestart={reset}
      instructions={[
        'Fill each row and column with numbers 1–9.',
        'Each 3×3 box must contain every number once.',
        'Finish faster to improve your personal best.',
        'Complete every cell correctly to win.',
      ]}
      extraStat={{
        label: 'Time',
        value: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
      }}
      winMessage="Perfect! You solved the Sudoku puzzle."
    >
      <div className="mx-auto grid max-w-[440px] grid-cols-9 border-l border-t border-white/30">
        {values.map((v, i) => (
          <input
            key={i}
            aria-label={`Sudoku cell ${i + 1}`}
            value={v || ''}
            readOnly={sudokuPuzzle[i] !== 0}
            maxLength={1}
            inputMode="numeric"
            onChange={(e) => update(i, e.target.value)}
            className={`aspect-square min-w-0 border-b border-r border-white/20 bg-white/5 text-center text-sm font-bold text-white outline-none focus:bg-violet-500/30 sm:text-lg ${
              sudokuPuzzle[i]
                ? 'bg-violet-500/10 text-violet-200'
                : ''
            } ${
              Math.floor(i / 9) % 3 === 2
                ? 'border-b-2 border-b-violet-300/60'
                : ''
            } ${
              i % 9 % 3 === 2
                ? 'border-r-2 border-r-violet-300/60'
                : ''
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-[#9295B5]">
        <span>Mistakes: {mistakes}</span>
        <span>Personal best time: {formattedBest}</span>
        <span>Enter digits 1–9</span>
      </div>
    </Shell>
  )
}

/* ---------------- GAME ROUTER ---------------- */

export default function GameSuite({ slug }: Props) {
  switch (slug) {
    case 'snake':
      return <SnakeGame />

    case '2048':
      return <Game2048 />

    case 'flappy':
      return <FlappyGame />

    case 'tic-tac-toe':
      return <TicTacToeGame />

    case 'memory-match':
      return <MemoryGame />

    case 'space-shooter':
      return <SpaceShooterGame />

    case 'brick-breaker':
      return <BrickBreakerGame />

    case 'sudoku':
      return <SudokuGame />

    default:
      return (
        <div className="mx-auto max-w-4xl px-5 py-24 text-center text-white">
          Game not found.
        </div>
      )
  }
}
