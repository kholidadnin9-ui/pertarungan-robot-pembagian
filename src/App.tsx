import { useCallback, useEffect, useState } from "react";
import { Stage } from "./components/Stage";
import { TitleScreen } from "./components/TitleScreen";
import { RobotSelect } from "./components/RobotSelect";
import { LevelSelect } from "./components/LevelSelect";
import { Battle, type BattleResult } from "./components/Battle";
import { LEVELS } from "./game/levels";
import { ROBOTS, getRobot, type RobotId } from "./game/robots";
import { preloadKeyed } from "./game/chroma";
import { isMuted, setMuted, unlockAudio } from "./game/audio";
import { clearProgress, defaultProgress, loadProgress, saveProgress, type Progress } from "./game/storage";

type Screen = "title" | "select" | "levels" | "battle";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [players, setPlayers] = useState<1 | 2>(1);
  const [robots, setRobots] = useState<[RobotId, RobotId]>(["yellow", "blue"]);
  const [levelId, setLevelId] = useState(1);
  const [battleKey, setBattleKey] = useState(0);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  // Siapkan gambar robot (hapus latar) sejak awal
  useEffect(() => {
    preloadKeyed(ROBOTS.map((r) => r.image));
  }, []);

  // Aktifkan audio pada interaksi pertama
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  }, []);

  const updateProgress = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const handleFinished = useCallback(
    (r: BattleResult) => {
      updateProgress((p) => {
        const idx = r.levelId - 1;
        const won = r.players === 1 ? r.winner === 0 : r.winner !== null;
        const stars = [...p.stars];
        if (r.players === 1) stars[idx] = Math.max(stars[idx] ?? 0, r.stars);
        return {
          ...p,
          unlocked: won ? Math.max(p.unlocked, Math.min(LEVELS.length, r.levelId + 1)) : p.unlocked,
          stars,
          coins: p.coins + r.coins,
          bestScore: Math.max(p.bestScore, r.score),
          wins: p.wins + (won ? 1 : 0),
        };
      });
    },
    [updateProgress]
  );

  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];

  return (
    <Stage>
      {screen === "title" && (
        <TitleScreen
          progress={progress}
          muted={muted}
          onToggleMute={toggleMute}
          onStart={(n) => {
            setPlayers(n);
            setScreen("select");
          }}
        />
      )}
      {screen === "select" && (
        <RobotSelect
          players={players}
          onBack={() => setScreen("title")}
          onConfirm={(r) => {
            setRobots(r);
            setScreen("levels");
          }}
        />
      )}
      {screen === "levels" && (
        <LevelSelect
          progress={progress}
          players={players}
          robots={robots}
          onBack={() => setScreen("select")}
          onPick={(id) => {
            setLevelId(id);
            setBattleKey((k) => k + 1);
            setScreen("battle");
          }}
          onReset={() => {
            clearProgress();
            setProgress(defaultProgress());
          }}
        />
      )}
      {screen === "battle" && (
        <Battle
          key={`${battleKey}-${levelId}`}
          players={players}
          robots={[getRobot(robots[0]), getRobot(robots[1])]}
          level={level}
          hasNext={levelId < LEVELS.length}
          muted={muted}
          onToggleMute={toggleMute}
          onExit={() => setScreen("title")}
          onLevels={() => setScreen("levels")}
          onRetry={() => setBattleKey((k) => k + 1)}
          onNext={() => {
            setLevelId((id) => Math.min(LEVELS.length, id + 1));
            setBattleKey((k) => k + 1);
          }}
          onFinished={handleFinished}
        />
      )}
    </Stage>
  );
}
