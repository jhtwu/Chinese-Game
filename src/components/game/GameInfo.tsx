/**
 * GameInfo - 顯示遊戲信息（分數、等級、連擊等）
 */

import { GameStatus, ScoreEvent } from '@/types';

interface GameInfoProps {
  score: number;
  level: number;
  linesCleared: number;
  wordsMatched: number;
  combo: number;
  status: GameStatus;
  scoreEvents: ScoreEvent[];
  activeScoreEventId?: string | null;
}

export function GameInfo({
  score,
  level,
  linesCleared,
  wordsMatched,
  combo,
  status,
  scoreEvents,
  activeScoreEventId,
}: GameInfoProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-xl border-2 border-gray-700">
      <h2 className="text-2xl font-chinese font-bold text-gold mb-4 text-center">
        遊戲信息
      </h2>

      <div className="space-y-4">
        {/* 分數 */}
        <div className="bg-black/30 rounded p-3">
          <div className="text-gray-400 text-sm font-chinese">分數</div>
          <div className="text-3xl font-bold text-white font-mono">
            {score.toLocaleString()}
          </div>
        </div>

        {/* 等級 */}
        <div className="bg-black/30 rounded p-3">
          <div className="text-gray-400 text-sm font-chinese">等級</div>
          <div className="text-2xl font-bold text-blue-400">Level {level}</div>
        </div>

        {/* 連擊 */}
        {combo > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded p-3 border-2 border-yellow-500 animate-pulse">
            <div className="text-yellow-400 text-sm font-chinese font-bold">
              連擊！
            </div>
            <div className="text-2xl font-bold text-yellow-300">
              {combo}x COMBO
            </div>
          </div>
        )}

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-400 text-xs font-chinese">行數</div>
            <div className="text-lg font-bold text-white">{linesCleared}</div>
          </div>
          <div className="bg-black/30 rounded p-2">
            <div className="text-gray-400 text-xs font-chinese">詞語</div>
            <div className="text-lg font-bold text-green-400">
              {wordsMatched}
            </div>
          </div>
        </div>

        {/* 得分詳情 */}
        {scoreEvents.length > 0 && (
          <div className="bg-black/40 rounded p-3 border border-gray-700">
            <div className="text-gray-200 text-sm font-chinese mb-2">
              得分明細
            </div>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {scoreEvents.map(event => (
                <div
                  key={event.id}
                  className={`rounded p-2 text-sm font-chinese border ${
                    activeScoreEventId === event.id
                      ? 'bg-yellow-500/10 border-yellow-400 shadow-md'
                      : 'bg-gray-900/40 border-transparent'
                  }`}
                >
                  {event.type === 'word' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-green-300 font-bold">
                        <span>詞語加分</span>
                        <span>+{event.totalScore}</span>
                      </div>
                      <ul className="text-gray-100 text-xs space-y-1">
                        {event.words.map(word => (
                          <li
                            key={`${event.id}-${word.text}`}
                            className="flex justify-between"
                          >
                            <span>• {word.text}</span>
                            <span className="text-green-400 font-mono">
                              +{word.score}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {event.comboBonus > 0 && (
                        <div className="text-yellow-300 text-xs font-bold text-right">
                          連擊加成 +{event.comboBonus}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-blue-300 font-bold">
                      <span>消除 {event.lines} 行</span>
                      <span>+{event.score}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 遊戲狀態 */}
        {status === GameStatus.PAUSED && (
          <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded p-3 text-center">
            <div className="text-yellow-300 font-chinese font-bold">
              ⏸ 暫停中
            </div>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded p-3 text-center animate-pulse">
            <div className="text-red-300 font-chinese font-bold text-lg">
              💀 遊戲結束
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
