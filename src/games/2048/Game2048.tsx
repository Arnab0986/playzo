
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  RotateCcw,
  Undo2,
  Trophy,
  Play,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

type Board = number[][]
type Direction = 'up' | 'down' | 'left' | 'right'
type GameStatus = 'ready' | 'playing' | 'won' | 'over'

type GameSnapshot = {
  board: Board
  score: number
}

const SIZE = 4
const STORAGE_KEY = 'playzo-2048-best-score'

const createEmptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0))

function addRandomTile(board: Board): Board {
  const empty: { row: number; col: number }[] = []

  board.forEach((line, row) => {
    line.forEach((value, col) => {
      if (value === 0) empty.push({ row, col })
    })
  })

  if (empty.length === 0) return board

  const next = board.map((line) => [...line])
  const position = empty[Math.floor(Math.random() * empty.length)]

  next[position.row][position.col] = Math.random() < 0.9 ? 2 : 4

  return next
}

function createNewBoard(): Board {
  let board = createEmptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}

function getSavedBest(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

function slideLine(line: number[]): {
  result: number[]
  points: number
} {
  const filtered = line.filter((value) => value !== 0)
  const result: number[] = []
  let points = 0

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2
      result.push(merged)
      points += merged
      i++
    } else {
      result.push(filtered[i])
    }
  }

  while (result.length < SIZE) result.push(0)

  return { result, points }
}

function moveBoard(
  board: Board,
  direction: Direction,
): { board: Board; points: number; changed: boolean } {
  const next = createEmptyBoard()
  let points = 0

  for (let i = 0; i < SIZE; i++) {
    let line: number[]

    if (direction === 'left' || direction === 'right') {
      line = [...board[i]]
    } else {
      line = board.map((row) => row[i])
    }

    if (direction === 'right' || direction === 'down') {
      line.reverse()
    }

    const moved = slideLine(line)
    points += moved.points

    let result = moved.result

    if (direction === 'right' || direction === 'down') {
      result = [...result].reverse()
    }

    for (let j = 0; j < SIZE; j++) {
      if (direction === 'left' || direction === 'right') {
        next[i][j] = result[j]
      } else {
        next[j][i] = result[j]
      }
    }
  }

  const changed = next.some((row, r) =>
    row.some((value, c) => value !== board[r][c]),
  )

  return { board: next, points, changed }
}

function hasMoves(board: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) return true

      if (
        col < SIZE - 1 &&
        board[row][col] === board[row][col + 1]
      ) return true

      if (
        row < SIZE - 1 &&
        board[row][col] === board[row + 1][col]
      ) return true
    }
  }

  return false
}

function getTileStyle(value: number): string {
  const styles: Record<number, string> = {
    0: 'bg-white/[0.045]',
    2: 'bg-[#EEE4DA] text-[#776E65]',
    4: 'bg-[#EDE0C8] text-[#776E65]',
    8: 'bg-[#F2B179] text-white',
    16: 'bg-[#F59563] text-white',
    32: 'bg-[#F67C5F] text-white',
    64: 'bg-[#F65E3B] text-white',
    128: 'bg-[#EDCF72] text-white',
    256: 'bg-[#EDCC61] text-white',
    512: 'bg-[#EDC850] text-white',
    1024: 'bg-[#EDC53F] text-white',
    2048: 'bg-[#EDC22E] text-white',
  }

  return styles[value] ?? 'bg-violet-600 text-white'
}

function Game2048() {
  const [board, setBoard] = useState<Board>(createNewBoard)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(getSavedBest)
  const [status, setStatus] = useState<GameStatus>('ready')
  const [canUndo, setCanUndo] = useState(false)

  const historyRef = useRef<GameSnapshot | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const statusRef = useRef<GameStatus>('ready')

  const changeStatus = (next: GameStatus) => {
    statusRef.current = next
    setStatus(next)
  }

  const startGame = () => {
    const newBoard = createNewBoard()

    setBoard(newBoard)
    setScore(0)
    historyRef.current = null
    setCanUndo(false)
    changeStatus('playing')
  }

  const resetGame = () => {
    startGame()
  }

  const move = useCallback((direction: Direction) => {
    if (statusRef.current !== 'playing') return

    setBoard((currentBoard) => {
      const moved = moveBoard(currentBoard, direction)

      if (!moved.changed) return currentBoard

      historyRef.current = {
        board: currentBoard.map((row) => [...row]),
        score,
      }
      setCanUndo(true)

      const nextBoard = addRandomTile(moved.board)
      const nextScore = score + moved.points

      setScore(nextScore)

      if (nextScore > best) {
        setBest(nextScore)

        try {
          localStorage.setItem(STORAGE_KEY, String(nextScore))
        } catch {
          // Continue playing if storage is unavailable.
        }
      }

      if (nextBoard.some((row) => row.includes(2048))) {
        changeStatus('won')
      } else if (!hasMoves(nextBoard)) {
        changeStatus('over')
      }

      return nextBoard
    })
  }, [score, best])

  const undoMove = () => {
    const previous = historyRef.current

    if (!previous || statusRef.current !== 'playing') return

    setBoard(previous.board.map((row) => [...row]))
    setScore(previous.score)
    historyRef.current = null
    setCanUndo(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: Record<string, Direction> = {
        arrowup: 'up',
        w: 'up',
        arrowdown: 'down',
        s: 'down',
        arrowleft: 'left',
        a: 'left',
        arrowright: 'right',
        d: 'right',
      }

      const direction = directions[event.key.toLowerCase()]

      if (direction && statusRef.current === 'playing') {
        event.preventDefault()
        move(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current
    if (!start) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y

    touchStartRef.current = null

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left')
    } else {
      move(dy > 0 ? 'down' : 'up')
    }
  }

  const getTileSize = (value: number) =>
    value >= 1024 ? 'text-xl sm:text-2xl' :
    value >= 128 ? 'text-2xl sm:text-3xl' :
    'text-3xl sm:text-4xl'

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 text-white sm:px-6">
      <header className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300">
          <Trophy size={15} />
          PLAYZO ORIGINAL GAME
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          2048 <span className="text-orange-400">CHALLENGE</span>
        </h1>

        <p className="mt-3 text-sm text-[#9295B5] sm:text-base">
          Merge the numbers. Reach 2048. Beat your best score.
        </p>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9295B5]">
            Score
          </p>
          <p className="mt-1 text-3xl font-black text-orange-400">{score}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-[#9295B5]">
            <Trophy size={13} /> Best
          </p>
          <p className="mt-1 text-3xl font-black text-yellow-400">{best}</p>
        </div>
      </div>

      <div
        className="relative mx-auto max-w-[520px] touch-none rounded-2xl border border-white/10 bg-[#25213A] p-3 shadow-2xl shadow-black/30 sm:p-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="2048 game board"
      >
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {board.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                layout
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.12 }}
                className={`flex aspect-square items-center justify-center rounded-lg font-black ${getTileStyle(value)} ${getTileSize(value)}`}
              >
                {value !== 0 ? value : ''}
              </motion.div>
            )),
          )}
        </div>

        {status !== 'playing' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[#101126]/85 p-5 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#1D1E3B] p-6 text-center shadow-2xl">
              <div className="mb-4 text-5xl">
                {status === 'won' ? '🏆' : status === 'over' ? '💥' : '🔢'}
              </div>

              <h2 className="text-2xl font-black">
                {status === 'ready' && 'READY TO PLAY?'}
                {status === 'won' && 'YOU REACHED 2048!'}
                {status === 'over' && 'NO MORE MOVES!'}
              </h2>

              <p className="mt-2 text-sm text-[#9295B5]">
                {status === 'ready' && 'Combine matching tiles to reach 2048.'}
                {status === 'won' && 'Amazing! You reached the target tile.'}
                {status === 'over' && 'The board is full. Give it another try!'}
              </p>

              <button
                type="button"
                onClick={startGame}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5"
              >
                <Play size={17} />
                {status === 'ready' ? 'Start Game' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={undoMove}
          disabled={!canUndo || status !== 'playing'}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#191A35] px-5 py-3 text-sm font-bold transition hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 size={16} />
          Undo
        </button>

        <button
          type="button"
          onClick={resetGame}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#191A35] px-5 py-3 text-sm font-bold transition hover:border-violet-400/50"
        >
          <RotateCcw size={16} />
          New Game
        </button>
      </div>

      <div className="mx-auto mt-7 max-w-sm sm:hidden">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#9295B5]">
          Touch controls
        </p>
        <div className="grid grid-cols-3 justify-items-center gap-2">
          <div />
          <button onClick={() => move('up')} disabled={status !== 'playing'} aria-label="Move up" className="rounded-xl border border-white/10 bg-[#191A35] p-3 disabled:opacity-40">
            <ArrowUp />
          </button>
          <div />
          <button onClick={() => move('left')} disabled={status !== 'playing'} aria-label="Move left" className="rounded-xl border border-white/10 bg-[#191A35] p-3 disabled:opacity-40">
            <ArrowLeft />
          </button>
          <button onClick={() => move('down')} disabled={status !== 'playing'} aria-label="Move down" className="rounded-xl border border-white/10 bg-[#191A35] p-3 disabled:opacity-40">
            <ArrowDown />
          </button>
          <button onClick={() => move('right')} disabled={status !== 'playing'} aria-label="Move right" className="rounded-xl border border-white/10 bg-[#191A35] p-3 disabled:opacity-40">
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#191A35] p-5">
        <h3 className="mb-3 font-bold">How to play</h3>
        <div className="grid gap-3 text-sm text-[#9295B5] sm:grid-cols-2">
          <p>⌨️ Use Arrow keys or WASD to move tiles.</p>
          <p>📱 Swipe or use touch buttons on mobile.</p>
          <p>🔢 Matching tiles merge into one.</p>
          <p>🏆 Reach the 2048 tile to win.</p>
          <p>↩️ Undo your previous move once.</p>
          <p>💾 Your best score is saved in this browser.</p>
        </div>
      </div>
    </section>
  )
}

export default Game2048
