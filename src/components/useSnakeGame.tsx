import { useState, useEffect, useCallback, useRef } from "react";
import { useSnakeAudio } from "./useSnakeAudio.tsx";

export type Position = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export const GRID_SIZE = 20;

const SPEED_MAP: Record = {
  EASY: 140,
  MEDIUM: 90,
  HARD: 50,
};

const POINTS = { FOOD: 10, BONUS: 30 };
const BONUS_CHANCE = 0.25;
const BONUS_LIFETIME_MS = 6000;
const HIGH_SCORE_KEY = "snake_high_score";

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const OPPOSITE: Record = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const MOVEMENT: Record = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const isSamePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y;
const toKey = (p: Position) => `\({p.x},\){p.y}`; // Corregido el template literal

const getRandomPosition = (exclude: Position[] = []): Position => {
  const excludeSet = new Set(exclude.map(toKey));
  const available: Position[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const pos = { x, y };
      if (!excludeSet.has(toKey(pos))) available.push(pos);
    }
  }

  if (available.length === 0) return { x: 0, y: 0 };
  return available[Math.floor(Math.random() * available.length)];
};

export function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => getRandomPosition(INITIAL_SNAKE));
  const [bonusFood, setBonusFood] = useState(null);
  const [direction, setDirection] = useState("UP");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState("IDLE");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useSnakeAudio(soundEnabled);

  const directionRef = useRef("UP");
  const foodRef = useRef(food);
  const bonusRef = useRef(bonusFood);
  const statusRef = useRef(status);

  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { bonusRef.current = bonusFood; }, [bonusFood]);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      if (saved) setHighScore(Number(saved) || 0);
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      if (newScore <= prev) return prev;
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(newScore));
      } catch {
        /* ignorar */
      }
      return newScore;
    });
  }, []);

  useEffect(() => {
    if (!bonusFood) return;
    const id = window.setTimeout(() => {
      setBonusFood((current) =>
        current && isSamePosition(current, bonusFood) ? null : current
      );
    }, BONUS_LIFETIME_MS);
    return () => window.clearTimeout(id);
  }, [bonusFood]);

  const changeDirection = useCallback((newDir: Direction) => {
    if (statusRef.current !== "PLAYING") return;
    if (OPPOSITE[directionRef.current] === newDir) return;

    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  const resetGame = useCallback(() => {
    const fresh = [...INITIAL_SNAKE];
    directionRef.current = "UP";
    setDirection("UP");
    setSnake(fresh);
    setFood(getRandomPosition(fresh));
    setBonusFood(null);
    setScore(0);
    setStatus("PLAYING");
  }, []);

  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === "PLAYING") return "PAUSED";
      if (prev === "PAUSED" || prev === "IDLE") return "PLAYING";
      return prev;
    });
  }, []);

  const tick = useCallback(() => {
    if (statusRef.current !== "PLAYING") return;

    setSnake((current) => {
      const head = current[0];
      const velocity = MOVEMENT[directionRef.current];
      const newHead: Position = {
        x: head.x + velocity.x,
        y: head.y + velocity.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setStatus("GAME_OVER");
        playSound("gameover");
        return current;
      }

      const currentFood = foodRef.current;
      const currentBonus = bonusRef.current;
      const ateFood = isSamePosition(newHead, currentFood);
      const ateBonus = currentBonus !== null && isSamePosition(newHead, currentBonus);

      const bodyToCheck = ateFood || ateBonus ? current : current.slice(0, -1);
      if (bodyToCheck.some((s) => isSamePosition(s, newHead))) {
        setStatus("GAME_OVER");
        playSound("gameover");
        return current;
      }

      if (ateFood) {
        setScore((s) => {
          const next = s + POINTS.FOOD;
          updateHighScore(next);
          return next;
        });
        playSound("eat");

        const newSnake = [newHead, ...current];
        const nextFood = getRandomPosition(newSnake);
        setFood(nextFood);

        if (!currentBonus && Math.random() < BONUS_CHANCE) {
          setBonusFood(getRandomPosition([...newSnake, nextFood]));
        }
        return newSnake;
      }

      if (ateBonus) {
        setScore((s) => {
          const next = s + POINTS.BONUS;
          updateHighScore(next);
          return next;
        });
        playSound("bonus");
        setBonusFood(null);
        return [newHead, ...current];
      }

      return [newHead, ...current.slice(0, -1)];
    });
  }, [updateHighScore, playSound]);

  useEffect(() => {
    if (status !== "PLAYING") return;
    const interval = window.setInterval(tick, SPEED_MAP[difficulty]);
    return () => window.clearInterval(interval);
  }, [status, difficulty, tick]);

  return {
    snake,
    food,
    bonusFood,
    direction,
    difficulty,
    score,
    highScore,
    status,
    soundEnabled,
    setDifficulty,
    setSoundEnabled,
    changeDirection,
    resetGame,
    togglePause,
  };
}