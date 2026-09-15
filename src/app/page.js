"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

const DIRECTIONS = ["Left", "Center", "Right"];
const MAX_SHOTS = 5;

function randomUnit() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] / 4294967296;
}

function randomDirection() {
  return DIRECTIONS[Math.floor(randomUnit() * DIRECTIONS.length)];
}

export default function Home() {
  const [shotsTaken, setShotsTaken] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [lastRound, setLastRound] = useState("");

  const isFinished = shotsTaken >= MAX_SHOTS;

  const resultText = useMemo(() => {
    if (!isFinished) {
      return `Choose your shot direction. Round ${shotsTaken + 1} of ${MAX_SHOTS}.`;
    }

    if (playerScore > cpuScore) return "You win the shootout! 🏆";
    if (cpuScore > playerScore) return "CPU wins the shootout!";
    return "It's a draw after 5 shots each!";
  }, [cpuScore, isFinished, playerScore, shotsTaken]);

  const playRound = (shotDirection) => {
    if (isFinished) return;

    const cpuGoalie = randomDirection();
    const playerScored =
      shotDirection !== cpuGoalie ? randomUnit() < 0.85 : randomUnit() < 0.15;

    const cpuShot = randomDirection();
    const yourGoalie = randomDirection();
    const cpuScored =
      cpuShot !== yourGoalie ? randomUnit() < 0.75 : randomUnit() < 0.1;

    setPlayerScore((score) => score + (playerScored ? 1 : 0));
    setCpuScore((score) => score + (cpuScored ? 1 : 0));
    setShotsTaken((value) => value + 1);

    setLastRound(
      `You shot ${shotDirection} (${playerScored ? "GOAL" : "SAVED by CPU diving " + cpuGoalie}). CPU shot ${cpuShot} (${cpuScored ? "GOAL" : "SAVED"}).`
    );
  };

  const reset = () => {
    setShotsTaken(0);
    setPlayerScore(0);
    setCpuScore(0);
    setLastRound("");
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1>Bandy Shootout</h1>
        <p className={styles.subtitle}>Best of 5 shots each</p>

        <div className={styles.scoreboard}>
          <p>You: {playerScore}</p>
          <p>CPU: {cpuScore}</p>
          <p>
            Shots: {shotsTaken}/{MAX_SHOTS}
          </p>
        </div>

        <p className={styles.status}>{resultText}</p>
        {lastRound && <p className={styles.round}>{lastRound}</p>}

        <div className={styles.actions}>
          {DIRECTIONS.map((direction) => (
            <button
              key={direction}
              onClick={() => playRound(direction)}
              disabled={isFinished}
            >
              Shoot {direction}
            </button>
          ))}
        </div>

        <button className={styles.reset} onClick={reset}>
          Restart Game
        </button>
      </section>
    </main>
  );
}
