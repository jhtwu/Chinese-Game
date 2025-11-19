/**
 * TetrisGame - 遊戲主控制器
 * 整合 TetrisEngine、WordMatcher 和所有遊戲邏輯
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameInfo } from './GameInfo';
import { NextTetrominoPreview } from './NextTetrominoPreview';
import { TetrisEngine } from '@/game/core/TetrisEngine';
import { WordMatcher } from '@/game/word/WordMatcher';
import { createTetromino, assignCharactersToTetromino } from '@/game/core/Tetromino';
import { CollisionDetector } from '@/game/core/CollisionDetector';
import { clearFullLines, removeMatchedCells } from '@/game/core/Grid';
import { useKeyboard } from '@/hooks/useKeyboard';
import { GameStatus, Tetromino, Word } from '@/types';
import wordData from '@/data/words/hsk-1-sample.json';

// 遊戲配置
const INITIAL_LEVEL = 1;
const INITIAL_DROP_INTERVAL = 1000; // 1秒
const LEVEL_UP_LINES = 10; // 每10行升一級
const DROP_SPEED_INCREASE = 0.9; // 每級速度提升 10%

export function TetrisGame() {
  // 遊戲引擎和匹配器
  const [engine] = useState(() => new TetrisEngine());
  const [wordMatcher] = useState(() => new WordMatcher(wordData.words as Word[]));

  // 遊戲狀態
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [linesCleared, setLinesCleared] = useState(0);
  const [wordsMatched, setWordsMatched] = useState(0);
  const [combo, setCombo] = useState(0);
  const [nextTetromino, setNextTetromino] = useState<Tetromino | null>(null);
  const [ghostTetromino, setGhostTetromino] = useState<Tetromino | null>(null);

  // 定時器
  const dropIntervalRef = useRef<number>(INITIAL_DROP_INTERVAL);
  const lastDropTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number>();

  /**
   * 獲取隨機字符給方塊
   */
  const getRandomCharacters = useCallback((count: number): string[] => {
    const allCharacters = wordData.words.flatMap((w: any) => w.characters);
    const characters: string[] = [];

    for (let i = 0; i < count; i++) {
      const randomChar =
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
      characters.push(randomChar);
    }

    return characters;
  }, []);

  /**
   * 創建新方塊（帶字符）
   */
  const createNewTetromino = useCallback(() => {
    const tetromino = createTetromino();
    const charCount = tetromino.shape.flat().filter(v => v === 1).length;
    const characters = getRandomCharacters(charCount);
    return assignCharactersToTetromino(tetromino, characters);
  }, [getRandomCharacters]);

  /**
   * 計算幽靈方塊位置
   */
  const calculateGhostPosition = useCallback(() => {
    if (!engine.currentTetromino) {
      setGhostTetromino(null);
      return;
    }

    const distance = CollisionDetector.getHardDropDistance(
      engine.currentTetromino,
      engine.grid
    );

    if (distance > 0) {
      setGhostTetromino({
        ...engine.currentTetromino,
        position: {
          ...engine.currentTetromino.position,
          y: engine.currentTetromino.position.y + distance,
        },
      });
    } else {
      setGhostTetromino(null);
    }
  }, [engine]);

  /**
   * 處理詞語匹配和消除
   */
  const handleWordMatching = useCallback(() => {
    const matches = wordMatcher.findMatches(engine.grid);

    if (matches.length > 0) {
      console.log('🎯 找到詞語:', matches.map(m => m.word.word).join(', '));

      // 計算分數
      let matchScore = 0;
      matches.forEach(match => {
        matchScore += match.score;
      });

      // 連擊加成
      const newCombo = matches.length;
      const comboBonus = newCombo > 1 ? matchScore * (newCombo - 1) * 0.5 : 0;

      setScore(prev => prev + matchScore + comboBonus);
      setWordsMatched(prev => prev + matches.length);
      setCombo(newCombo);

      // 移除匹配的方塊
      matches.forEach(match => {
        engine.grid = removeMatchedCells(engine.grid, match.positions);
      });

      // TODO: 播放音效和動畫
    } else {
      setCombo(0);
    }
  }, [engine, wordMatcher]);

  /**
   * 鎖定方塊後的處理
   */
  const handleTetrominoLocked = useCallback(() => {
    // 1. 檢查詞語匹配
    handleWordMatching();

    // 2. 清除完整行
    const { newGrid, clearedLines } = clearFullLines(engine.grid);
    engine.grid = newGrid;

    if (clearedLines > 0) {
      console.log('📏 清除行數:', clearedLines);
      const lineScore = clearedLines * 100 * level;
      setScore(prev => prev + lineScore);
      setLinesCleared(prev => {
        const newTotal = prev + clearedLines;

        // 檢查是否升級
        if (Math.floor(newTotal / LEVEL_UP_LINES) > level - 1) {
          setLevel(prevLevel => {
            const newLevel = prevLevel + 1;
            dropIntervalRef.current = Math.floor(
              INITIAL_DROP_INTERVAL * Math.pow(DROP_SPEED_INCREASE, newLevel - 1)
            );
            console.log(`🎊 升級到 Level ${newLevel}! 速度: ${dropIntervalRef.current}ms`);
            return newLevel;
          });
        }

        return newTotal;
      });
    }

    // 3. 生成新方塊
    engine.currentTetromino = nextTetromino;
    setNextTetromino(createNewTetromino());

    // 4. 檢查遊戲結束
    if (engine.currentTetromino) {
      if (
        CollisionDetector.checkCollision(
          engine.currentTetromino,
          engine.grid
        )
      ) {
        console.log('💀 遊戲結束!');
        setGameStatus(GameStatus.GAME_OVER);
      }
    }

    calculateGhostPosition();
  }, [
    engine,
    nextTetromino,
    level,
    handleWordMatching,
    createNewTetromino,
    calculateGhostPosition,
  ]);

  /**
   * 遊戲循環
   */
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameStatus !== GameStatus.PLAYING) {
        return;
      }

      // 自動下落
      if (timestamp - lastDropTimeRef.current >= dropIntervalRef.current) {
        const result = engine.tick();

        if (result.gameOver) {
          setGameStatus(GameStatus.GAME_OVER);
          return;
        }

        if (!result.success && result.message === 'Locked') {
          handleTetrominoLocked();
        }

        calculateGhostPosition();
        lastDropTimeRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [gameStatus, engine, handleTetrominoLocked, calculateGhostPosition]
  );

  /**
   * 開始遊戲
   */
  const startGame = useCallback(() => {
    console.log('🎮 遊戲開始!');
    engine.reset();
    setScore(0);
    setLevel(INITIAL_LEVEL);
    setLinesCleared(0);
    setWordsMatched(0);
    setCombo(0);
    dropIntervalRef.current = INITIAL_DROP_INTERVAL;

    // 創建初始方塊
    engine.currentTetromino = createNewTetromino();
    setNextTetromino(createNewTetromino());

    setGameStatus(GameStatus.PLAYING);
    lastDropTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    calculateGhostPosition();
  }, [engine, createNewTetromino, gameLoop, calculateGhostPosition]);

  /**
   * 暫停/繼續
   */
  const togglePause = useCallback(() => {
    if (gameStatus === GameStatus.PLAYING) {
      setGameStatus(GameStatus.PAUSED);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    } else if (gameStatus === GameStatus.PAUSED) {
      setGameStatus(GameStatus.PLAYING);
      lastDropTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameStatus, gameLoop]);

  /**
   * 鍵盤控制處理
   */
  useKeyboard(
    {
      onMoveLeft: () => {
        if (gameStatus === GameStatus.PLAYING) {
          engine.moveLeft();
          calculateGhostPosition();
        }
      },
      onMoveRight: () => {
        if (gameStatus === GameStatus.PLAYING) {
          engine.moveRight();
          calculateGhostPosition();
        }
      },
      onMoveDown: () => {
        if (gameStatus === GameStatus.PLAYING) {
          const result = engine.moveDown();
          if (!result.success && result.message === 'Locked') {
            handleTetrominoLocked();
          }
          calculateGhostPosition();
        }
      },
      onRotate: () => {
        if (gameStatus === GameStatus.PLAYING) {
          engine.rotate();
          calculateGhostPosition();
        }
      },
      onHardDrop: () => {
        if (gameStatus === GameStatus.PLAYING) {
          engine.hardDrop();
          handleTetrominoLocked();
        }
      },
      onPause: togglePause,
      onRestart: () => {
        if (gameStatus === GameStatus.GAME_OVER) {
          startGame();
        }
      },
    },
    gameStatus !== GameStatus.IDLE
  );

  // 清理定時器
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-black via-gray-900 to-ink-black flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* 標題 */}
        <h1 className="text-5xl font-chinese font-bold text-chinese-red mb-8 text-center drop-shadow-lg">
          🀄 中文學習俄羅斯方塊
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6 items-start">
          {/* 左側：遊戲信息 */}
          <div className="space-y-4">
            <GameInfo
              score={score}
              level={level}
              linesCleared={linesCleared}
              wordsMatched={wordsMatched}
              combo={combo}
              status={gameStatus}
            />
          </div>

          {/* 中間：遊戲畫面 */}
          <div className="flex flex-col items-center">
            <GameCanvas
              grid={engine.grid}
              currentTetromino={engine.currentTetromino}
              ghostTetromino={ghostTetromino}
            />

            {/* 開始/重新開始按鈕 */}
            {(gameStatus === GameStatus.IDLE ||
              gameStatus === GameStatus.GAME_OVER) && (
              <button
                onClick={startGame}
                className="mt-6 px-8 py-4 bg-chinese-red hover:bg-red-600 text-white font-chinese font-bold text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                {gameStatus === GameStatus.IDLE ? '🎮 開始遊戲' : '🔄 重新開始'}
              </button>
            )}

            {/* 操作說明 */}
            <div className="mt-6 bg-black/30 rounded-lg p-4 text-sm text-gray-400 font-chinese">
              <div className="grid grid-cols-2 gap-2">
                <div>← → : 左右移動</div>
                <div>↑ : 旋轉</div>
                <div>↓ : 加速下落</div>
                <div>空格 : 快速下落</div>
                <div>ESC : 暫停</div>
                <div>Ctrl+R : 重新開始</div>
              </div>
            </div>
          </div>

          {/* 右側：下一個方塊 */}
          <div className="space-y-4">
            <NextTetrominoPreview tetromino={nextTetromino} />

            {/* 詞語提示 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-xl border-2 border-gray-700">
              <h3 className="text-lg font-chinese font-bold text-gold mb-3 text-center">
                💡 詞語提示
              </h3>
              <div className="text-sm text-gray-300 space-y-1 font-chinese">
                <div>• 組合字符形成詞語</div>
                <div>• 2字詞 +10分</div>
                <div>• 3字詞 +20分</div>
                <div>• 4字詞 +40分</div>
                <div>• 連擊有額外加成！</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
