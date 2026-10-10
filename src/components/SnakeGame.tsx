import React, { useEffect, useRef } from "react";
import {
  useSnakeGame,
  GRID_SIZE,
  type Direction,
} from "./useSnakeGame";

const SWIPE_MIN_DISTANCE = 30;

// ----------------------------------------------------------
// CLASES REUTILIZABLES
// ----------------------------------------------------------

const BTN_BASE =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold " +
  "bg-slate-800 text-white shadow transition-colors hover:bg-slate-700 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 " +
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-800";

const STAT_CARD =
  "flex min-w-[90px] flex-col items-center rounded-xl border border-slate-700 " +
  "bg-slate-900/60 px-4 py-2 text-slate-300 backdrop-blur";

export const SnakeGame: React.FC = () => {
  const {
    snake,
    food,
    bonusFood,
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
  } = useSnakeGame();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // ----------------------------------------------------------
  // TECLADO
  // ----------------------------------------------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }

      if (e.key === " ") {
        if (status !== "GAME_OVER") togglePause();
        return;
      }

      if (status !== "PLAYING") return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        w: "UP",
        W: "UP",
        ArrowDown: "DOWN",
        s: "DOWN",
        S: "DOWN",
        ArrowLeft: "LEFT",
        a: "LEFT",
        A: "LEFT",
        ArrowRight: "RIGHT",
        d: "RIGHT",
        D: "RIGHT",
      };

      const dir = keyMap[e.key];
      if (dir) changeDirection(dir);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeDirection, togglePause, status]);

  // ----------------------------------------------------------
  // SWIPE
  // ----------------------------------------------------------
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || status !== "PLAYING") {
      touchStartRef.current = null;
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (
      Math.abs(dx) < SWIPE_MIN_DISTANCE &&
      Math.abs(dy) < SWIPE_MIN_DISTANCE
    ) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      changeDirection(dy > 0 ? "DOWN" : "UP");
    }
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div
      className="mx-auto flex w-full max-w-xl select-none flex-col gap-4 p-4 font-sans text-slate-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={STAT_CARD}>
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Puntuación
          </span>
          <strong className="text-lg text-white">{score}</strong>
        </div>

        <div className={STAT_CARD}>
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Récord
          </span>
          <strong className="text-lg text-yellow-300">{highScore}</strong>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Dificultad
          </span>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as typeof difficulty)
            }
            disabled={status === "PLAYING"}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5
                       text-sm text-white shadow-sm transition-colors
                       hover:border-slate-600 focus:border-blue-400 focus:outline-none
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="EASY">Fácil</option>
            <option value="MEDIUM">Medio</option>
            <option value="HARD">Difícil</option>
          </select>
        </div>
      </div>

      {/* ======================================================
          TABLERO
      ====================================================== */}
      <div
        className="relative grid aspect-square w-full overflow-hidden rounded-2xl
                   border border-slate-700 bg-slate-950 shadow-2xl
                   shadow-black/40"
        role="grid"
        aria-label="Tablero de Snake"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;
          const isBonus = bonusFood?.x === x && bonusFood?.y === y;

          // Base de cada celda: damero sutil para ver el grid
          const base =
            (x + y) % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20";

          let cell = `w-full h-full ${base} transition-colors duration-75`;

          if (isSnake) {
            cell += isHead
              ? " bg-emerald-400 rounded-sm shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              : " bg-emerald-600 rounded-sm";
          }

          if (isFood) {
            cell += " bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)]";
          }

          if (isBonus) {
            cell +=
              " bg-yellow-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.9)]";
          }

          return <div key={`${x}-${y}`} className={cell} />;
        })}

        {/* ---------------- Overlay IDLE ---------------- */}
        {status === "IDLE" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
            <h2 className="text-4xl font-black tracking-tight text-emerald-400">
              Snake
            </h2>
            <p className="text-slate-300">Presiona comenzar para jugar</p>
            <button onClick={resetGame} className={BTN_BASE}>
              Comenzar
            </button>
          </div>
        )}

        {/* ---------------- Overlay PAUSA ---------------- */}
        {status === "PAUSED" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
            <h2 className="text-4xl font-black tracking-tight text-blue-400">
              Pausa
            </h2>
            <button onClick={togglePause} className={BTN_BASE}>
              Continuar
            </button>
          </div>
        )}

        {/* ---------------- Overlay GAME OVER ---------------- */}
        {status === "GAME_OVER" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-black tracking-tight text-rose-500">
              Game Over
            </h2>
            <p className="text-lg text-slate-200">
              Puntuación: <strong>{score}</strong>
            </p>
            {score > 0 && score >= highScore && (
              <p className="text-sm font-semibold text-yellow-300">
                ¡Nuevo récord!
              </p>
            )}
            <button onClick={resetGame} className={BTN_BASE}>
              Jugar nuevamente
            </button>
          </div>
        )}
      </div>

      {/* ======================================================
          CONTROLES
      ====================================================== */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => changeDirection("UP")}
          disabled={status !== "PLAYING"}
          aria-label="Arriba"
          className={`${BTN_BASE} h-12 w-16 text-lg`}
        >
          ▲
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => changeDirection("LEFT")}
            disabled={status !== "PLAYING"}
            aria-label="Izquierda"
            className={`${BTN_BASE} h-12 w-16 text-lg`}
          >
            ◀
          </button>

          <button
            onClick={togglePause}
            aria-label="Pausar o continuar"
            className={`${BTN_BASE} h-12 w-16 text-lg`}
          >
            {status === "PLAYING" ? "Ⅱ" : "▶"}
          </button>

          <button
            onClick={() => changeDirection("RIGHT")}
            disabled={status !== "PLAYING"}
            aria-label="Derecha"
            className={`${BTN_BASE} h-12 w-16 text-lg`}
          >
            ▶
          </button>
        </div>

        <button
          onClick={() => changeDirection("DOWN")}
          disabled={status !== "PLAYING"}
          aria-label="Abajo"
          className={`${BTN_BASE} h-12 w-16 text-lg`}
        >
          ▼
        </button>
      </div>

      {/* ======================================================
          OPCIONES
      ====================================================== */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setSoundEnabled((p: boolean) => !p)}
          className={BTN_BASE}
        >
          {soundEnabled ? "🔊 Sonido" : "🔇 Silencio"}
        </button>

        <button onClick={resetGame} className={BTN_BASE}>
          Reiniciar
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;