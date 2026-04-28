import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION: Point = { x: 1, y: 0 }; // Right

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const isPlayingRef = useRef(isPlaying);
  const boardRef = useRef<HTMLDivElement>(null);
  const lastProcessedDirRef = useRef(direction);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Load high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem('neonSnakeHighScore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const updateHighScore = useCallback((currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('neonSnakeHighScore', currentScore.toString());
    }
  }, [highScore]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space when game is in focus/playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (isPlayingRef.current || document.activeElement === boardRef.current) {
          e.preventDefault();
        }
      }

      if (!isPlayingRef.current) return;

      const lastDir = lastProcessedDirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Ensure food doesn't spawn on the snake
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Speed increases slightly as score goes up
    const baseSpeed = 150;
    const speed = Math.max(60, baseSpeed - Math.floor(score / 50) * 10);

    const loop = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        lastProcessedDirRef.current = dir;

        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Checks Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          updateHighScore(score);
          return prevSnake;
        }

        // Checks Self collision
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          updateHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food eaten
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => s + 10);
          spawnFood(newSnake);
        } else {
          // If no food eaten, remove tail
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(loop);
  }, [isPlaying, isGameOver, score, spawnFood, updateHighScore]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastProcessedDirRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnFood(INITIAL_SNAKE);
    boardRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center max-w-2xl w-full mx-auto">
      {/* Score Header */}
      <div className="w-full flex justify-between items-center mb-6 bg-gray-900 border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50">
            <LayoutGrid className="text-cyan-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-cyan-500/70 font-mono tracking-widest uppercase">Current Score</p>
            <p className="text-2xl font-bold text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {score.toString().padStart(4, '0')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-xs text-fuchsia-500/70 font-mono tracking-widest uppercase">High Score</p>
            <p className="text-2xl font-bold text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {highScore.toString().padStart(4, '0')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/50">
            <Trophy className="text-fuchsia-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative">
        <div 
          ref={boardRef}
          className="bg-gray-950/80 border-2 border-slate-800 rounded-xl p-2 outline-none relative shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
          tabIndex={0}
        >
          {/* Neon Border Glow container */}
          <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none ${isPlaying ? 'opacity-100 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'opacity-0'}`}></div>
          
          <div 
            className="grid bg-gray-900 overflow-hidden rounded-lg mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: 'min(90vw, 400px)',
              height: 'min(90vw, 400px)'
            }}
          >
            {/* Grid cells aren't explicitly rendered to save performance, we just place items by calculating styles or mapping */}
            {/* We will render items absolutely inside the grid relative to a 100% container, or just as cell items */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              
              const isFood = food.x === x && food.y === y;
              const snakeIndex = snake.findIndex(p => p.x === x && p.y === y);
              const isSnake = snakeIndex !== -1;
              const isHead = snakeIndex === 0;

              return (
                <div 
                  key={i} 
                  className="w-full h-full border-[0.5px] border-slate-800/30"
                >
                  {isFood && (
                    <div className="w-full h-full p-1">
                      <div className="w-full h-full bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse"></div>
                    </div>
                  )}
                  {isSnake && (
                    <div className="w-full h-full p-0.5">
                      <div className={`w-full h-full ${
                        isHead 
                          ? 'bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,1)] scale-110 z-10 relative'
                          : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                      } ${snakeIndex === snake.length - 1 ? 'rounded-lg' : 'rounded-sm'} transition-all`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        <AnimatePresence>
          {(!isPlaying || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm rounded-xl border border-gray-800"
            >
              <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] tracking-tighter">
                {isGameOver ? 'SYSTEM FAILURE' : 'INITIALIZE SEQUENCE'}
              </h2>
              {isGameOver && (
               <p className="text-gray-300 font-mono mb-6 text-sm">
                 FINAL SCORE: <span className="text-cyan-400 font-bold">{score}</span>
               </p>
              )}
              
              <button 
                onClick={startGame}
                className="mt-4 flex items-center justify-center gap-2 group relative px-8 py-3 bg-gray-900 border border-fuchsia-500 text-white font-mono tracking-widest uppercase rounded cursor-pointer overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]"
              >
                <div className="absolute inset-0 w-0 bg-fuchsia-500 transition-all duration-300 ease-out group-hover:w-full opacity-20"></div>
                {isGameOver ? (
                  <>
                    <RotateCcw className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" /> 
                    <span className="relative z-10">Reboot System</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-cyan-400 text-cyan-400 group-hover:text-white group-hover:fill-white transition-colors" />
                    <span className="relative z-10">Start Game</span>
                  </>
                )}
              </button>
              
              <div className="mt-8 flex gap-4 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1"><span className="w-4 h-4 border border-gray-700 flex items-center justify-center rounded uppercase pb-0.5">W</span> move</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 border border-gray-700 flex items-center justify-center rounded uppercase pb-0.5">A</span></span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 border border-gray-700 flex items-center justify-center rounded uppercase pb-0.5">S</span></span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 border border-gray-700 flex items-center justify-center rounded uppercase pb-0.5">D</span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
