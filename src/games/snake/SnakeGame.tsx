
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Gamepad2,
} from 'lucide-react'

type Point = {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

type GameStatus = 'ready' | 'playing' | 'paused' | 'over' | 'won'

const BOARD_SIZE = 18

const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
]

const INITIAL_DIRECTION: Direction = 'RIGHT'
const INITIAL_FOOD: Point = { x: 12, y: 9 }

const MOVEMENT: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

function randomFood(snake: Point[]): Point | null {
  const available: Point[] = []

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const occupied = snake.some(
        (part) => part.x === x && part.y === y,
      )

      if (!occupied) {
        available.push({ x, y })
      }
    }
  }

  if (available.length === 0) return null

  return available[Math.floor(Math.random() * available.length)]
}

function getSavedHighScore(): number {
  try {
    return Number(
      localStorage.getItem('playzo-snake-high-score'),
    ) || 0
  } catch {
    return 0
  }
}

function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Point | null>(INITIAL_FOOD)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(getSavedHighScore)
  const [status, setStatus] = useState<GameStatus>('ready')

  // Keep the live status in a ref so an interval cannot move the snake
  // after Pause or Restart is clicked but before React cleans it up.
  const statusRef = useRef<GameStatus>('ready')

  const snakeRef = useRef(snake)
  const foodRef = useRef(food)
  const directionRef = useRef<Direction>(INITIAL_DIRECTION)
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION)
  const scoreRef = useRef(0)

  // SAVE HIGH SCORE

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((previous) => {
      if (newScore <= previous) return previous

      try {
        localStorage.setItem(
          'playzo-snake-high-score',
          String(newScore),
        )
      } catch {
        // The game continues if local storage is unavailable.
      }

      return newScore
    })
  }, [])

  // CHANGE DIRECTION

  const changeDirection = useCallback((newDirection: Direction) => {
    const currentDirection = nextDirectionRef.current

    if (OPPOSITE[currentDirection] === newDirection) return

    nextDirectionRef.current = newDirection
  }, [])

  // RESET GAME

  const resetGame = useCallback(() => {
    const newSnake = [...INITIAL_SNAKE]
    const newFood = randomFood(newSnake)

    snakeRef.current = newSnake
    foodRef.current = newFood

    directionRef.current = INITIAL_DIRECTION
    nextDirectionRef.current = INITIAL_DIRECTION

    scoreRef.current = 0

    setSnake(newSnake)
    setFood(newFood)
    setScore(0)
    statusRef.current = newFood ? 'ready' : 'won'
    setStatus(newFood ? 'ready' : 'won')
  }, [])

  // Start only after the board has been reset. Keeping Restart separate
  // means the initial snake position remains visible until the player starts.
  const startGame = useCallback(() => {
    resetGame()
    statusRef.current = 'playing'
    setStatus('playing')
  }, [resetGame])

  // PAUSE / RESUME

  const togglePause = () => {
    if (status === 'playing') {
      statusRef.current = 'paused'
      setStatus('paused')
    } else if (status === 'paused') {
      statusRef.current = 'playing'
      setStatus('playing')
    }
  }

  // KEYBOARD CONTROLS

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      const keyDirections: Record<string, Direction> = {
        arrowup: 'UP',
        w: 'UP',
        arrowdown: 'DOWN',
        s: 'DOWN',
        arrowleft: 'LEFT',
        a: 'LEFT',
        arrowright: 'RIGHT',
        d: 'RIGHT',
      }

      const requestedDirection = keyDirections[key]

      if (requestedDirection) {
        if (statusRef.current === 'playing') {
          event.preventDefault()
          changeDirection(requestedDirection)
        }
      }

      if (key === ' ' || key === 'escape') {
        if (status === 'playing') {
          event.preventDefault()
          statusRef.current = 'paused'
          setStatus('paused')
        } else if (status === 'paused') {
          event.preventDefault()
          statusRef.current = 'playing'
          setStatus('playing')
        }
      }

      if (
        key === 'enter' &&
        (status === 'ready' || status === 'over' || status === 'won')
      ) {
        startGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [status, changeDirection, startGame])

  // GAME LOOP

  useEffect(() => {
    if (status !== 'playing') return

    const speed = Math.max(75, 155 - score * 3)

    const interval = window.setInterval(() => {
      // Ignore any queued tick after pause/restart.
      if (statusRef.current !== 'playing') return

      const currentSnake = snakeRef.current
      const currentDirection = nextDirectionRef.current
      const movement = MOVEMENT[currentDirection]
      const head = currentSnake[0]

      const newHead: Point = {
        x: head.x + movement.x,
        y: head.y + movement.y,
      }

      const currentFood = foodRef.current

      const ateFood =
        currentFood !== null &&
        newHead.x === currentFood.x &&
        newHead.y === currentFood.y

      const bodyToCheck = ateFood
        ? currentSnake
        : currentSnake.slice(0, -1)

      const hitWall =
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE

      const hitSelf = bodyToCheck.some(
        (part) =>
          part.x === newHead.x &&
          part.y === newHead.y,
      )

      if (hitWall || hitSelf) {
        statusRef.current = 'over'
        setStatus('over')
        updateHighScore(scoreRef.current)
        return
      }

      const newSnake = [newHead, ...currentSnake]

      if (!ateFood) {
        newSnake.pop()
      }

      snakeRef.current = newSnake
      directionRef.current = currentDirection

      setSnake(newSnake)

      if (ateFood) {
        const newScore = scoreRef.current + 10

        scoreRef.current = newScore
        setScore(newScore)
        updateHighScore(newScore)

        const newFood = randomFood(newSnake)

        foodRef.current = newFood
        setFood(newFood)

        if (!newFood) {
          statusRef.current = 'won'
          setStatus('won')
        }
      }
    }, speed)

    return () => {
      window.clearInterval(interval)
    }
  }, [status, score, updateHighScore])

  // BOARD CELL HELPERS

  const isSnakeHead = (x: number, y: number) =>
    snake[0]?.x === x && snake[0]?.y === y

  const isSnakeBody = (x: number, y: number) =>
    snake.slice(1).some(
      (part) => part.x === x && part.y === y,
    )

  const isFood = (x: number, y: number) =>
    food?.x === x && food?.y === y

  const getCellClass = (x: number, y: number) => {
    if (isSnakeHead(x, y)) {
      return 'rounded-md bg-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.7)] z-10'
    }

    if (isSnakeBody(x, y)) {
      return 'rounded-sm bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.35)]'
    }

    if (isFood(x, y)) {
      return 'scale-75 rounded-full bg-pink-500 shadow-[0_0_13px_rgba(236,72,153,0.8)]'
    }

    return 'bg-white/[0.025]'
  }

  // MOBILE DIRECTION BUTTON HELPER
  // This is a function, not a component created during render.

  const renderDirectionButton = (
    value: Direction,
    icon: ReactNode,
  ) => (
    <button
      type="button"
      onClick={() => changeDirection(value)}
      disabled={status !== 'playing'}
      aria-label={`Move ${value.toLowerCase()}`}
      className="flex h-12 w-12 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition hover:border-violet-400/50 hover:bg-violet-500/20 active:scale-90 disabled:opacity-40"
    >
      {icon}
    </button>
  )

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 text-white sm:px-6">

      {/* GAME HEADER */}

      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-bold text-lime-300">
          <Gamepad2 size={15} />
          PLAYZO ORIGINAL GAME
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          SNAKE <span className="text-lime-400">ARENA</span>
        </h1>

        <p className="mt-3 text-sm text-[#9295B5] sm:text-base">
          Eat the food. Grow longer. Beat your high score.
        </p>
      </div>

      {/* SCOREBOARD */}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
            Score
          </p>
          <p className="mt-1 text-3xl font-black text-lime-400">
            {score}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
            <Trophy size={13} />
            Best
          </p>
          <p className="mt-1 text-3xl font-black text-yellow-400">
            {highScore}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-white/10 bg-[#191A35] p-4 text-center sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9295B5]">
            Snake Length
          </p>
          <p className="mt-1 text-3xl font-black text-violet-400">
            {snake.length}
          </p>
        </div>
      </div>

      {/* GAME BOARD */}

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#17182F] p-2 shadow-2xl shadow-black/30 sm:p-4">
        <div
          className="relative mx-auto grid aspect-square w-full max-w-[540px] gap-[2px] overflow-hidden rounded-xl border border-white/5 bg-[#111225] p-1"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from(
            { length: BOARD_SIZE * BOARD_SIZE },
            (_, index) => {
              const x = index % BOARD_SIZE
              const y = Math.floor(index / BOARD_SIZE)

              return (
                <div
                  key={index}
                  className={`min-h-0 min-w-0 transition-colors duration-75 ${getCellClass(x, y)}`}
                />
              )
            },
          )}

          {/* GAME STATUS OVERLAY */}

          {status !== 'playing' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#101126]/85 p-5 backdrop-blur-sm">
              <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#1D1E3B] p-6 text-center shadow-2xl">

                {status === 'ready' && (
                  <>
                    <div className="mb-4 text-5xl">🐍</div>
                    <h2 className="text-2xl font-black">
                      READY TO PLAY?
                    </h2>
                    <p className="mt-2 text-sm text-[#9295B5]">
                      Collect food and avoid hitting the walls or yourself.
                    </p>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <div className="mb-4 text-5xl">⏸️</div>
                    <h2 className="text-2xl font-black">
                      GAME PAUSED
                    </h2>
                    <p className="mt-2 text-sm text-[#9295B5]">
                      Your snake is waiting. Resume when ready.
                    </p>
                  </>
                )}

                {status === 'over' && (
                  <>
                    <div className="mb-4 text-5xl">💥</div>
                    <h2 className="text-2xl font-black">
                      GAME OVER
                    </h2>
                    <p className="mt-2 text-sm text-[#9295B5]">
                      You scored
                      <span className="font-bold text-lime-400">
                        {' '}{score} points
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[#9295B5]">
                      {score >= highScore && score > 0
                        ? 'New high score!'
                        : 'Try again and beat your record.'}
                    </p>
                  </>
                )}

                {status === 'won' && (
                  <>
                    <div className="mb-4 text-5xl">🏆</div>
                    <h2 className="text-2xl font-black text-lime-400">
                      YOU WON!
                    </h2>
                    <p className="mt-2 text-sm text-[#9295B5]">
                      Amazing! You filled the entire board.
                    </p>
                    <p className="mt-2 font-bold text-yellow-400">
                      Final score: {score}
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={startGame}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 font-bold transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  <Play size={17} />
                  {status === 'ready' ? 'Start Game' : 'Play Again'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GAME CONTROLS */}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePause}
          disabled={status === 'ready' || status === 'over' || status === 'won'}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#191A35] px-5 py-3 text-sm font-bold transition hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'paused' ? (
            <Play size={16} />
          ) : (
            <Pause size={16} />
          )}
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>

        <button
          type="button"
          onClick={resetGame}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#191A35] px-5 py-3 text-sm font-bold transition hover:border-violet-400/50"
        >
          <RotateCcw size={16} />
          Restart
        </button>
      </div>

      {/* MOBILE TOUCH CONTROLS */}

      <div className="mx-auto mt-8 max-w-xs sm:hidden">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[#9295B5]">
          Touch controls
        </p>

        <div className="grid grid-cols-3 justify-items-center gap-2">
          <div />
          {renderDirectionButton('UP', <ArrowUp size={21} />)}
          <div />

          {renderDirectionButton('LEFT', <ArrowLeft size={21} />)}
          {renderDirectionButton('DOWN', <ArrowDown size={21} />)}
          {renderDirectionButton('RIGHT', <ArrowRight size={21} />)}
        </div>
      </div>

      {/* INSTRUCTIONS */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#191A35] p-5">
        <h3 className="mb-3 font-bold">
          How to play
        </h3>

        <div className="grid gap-3 text-sm text-[#9295B5] sm:grid-cols-2">
          <p>⌨️ Use Arrow keys or WASD to move.</p>
          <p>📱 Use the on-screen buttons on mobile.</p>
          <p>🍎 Collect pink food to earn 10 points.</p>
          <p>⚡ Your snake gets faster as your score increases.</p>
          <p>⏸️ Press Space or Escape to pause/resume.</p>
          <p>🏆 Your best score is saved in this browser.</p>
        </div>
      </div>
    </section>
  )
}

export default SnakeGame
