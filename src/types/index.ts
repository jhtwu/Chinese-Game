/**
 * 中文學習俄羅斯方塊 - TypeScript 類型定義
 */

// ============================================================================
// 方塊相關類型
// ============================================================================

export enum TetrominoType {
  I = 'I',
  O = 'O',
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L',
}

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  rotation: 0 | 1 | 2 | 3;
  position: Position;
  shape: number[][];
  characters: (string | null)[][];
  color: string;
  blockCharacters: (string | null)[];
}

// ============================================================================
// 網格相關類型
// ============================================================================

export interface Cell {
  occupied: boolean;
  character: string | null;
  color: string | null;
  locked: boolean;
}

export type Grid = Cell[][];

// ============================================================================
// 詞語相關類型
// ============================================================================

export interface Word {
  id: string;
  word: string;
  characters: string[];
  pinyin: string;
  pinyinArray: string[];
  hskLevel: 1 | 2 | 3 | 4 | 5 | 6;
  category: WordCategory;
  definition: {
    en: string;
    zh: string;
  };
  example?: string;
  frequency: number;
  isIdiom: boolean;
}

export type WordCategory =
  | 'education'
  | 'relationship'
  | 'country'
  | 'language'
  | 'object'
  | 'food'
  | 'time'
  | 'emotion'
  | 'action'
  | 'nature'
  | 'body'
  | 'color'
  | 'number'
  | 'direction'
  | 'animal'
  | 'plant'
  | 'weather'
  | 'transport'
  | 'work'
  | 'health'
  | 'other';

export interface WordDatabase {
  version: string;
  lastUpdated: string;
  words: Word[];
  index: {
    byHSK: Map<number, Word[]>;
    byCategory: Map<string, Word[]>;
    byLength: Map<number, Word[]>;
    byCharacter: Map<string, Word[]>;
  };
}

// ============================================================================
// 遊戲狀態相關類型
// ============================================================================

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_UP = 'LEVEL_UP',
}

export type GameMode = 'classic' | 'timeAttack' | 'learning' | 'theme';

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  score: number;
  level: number;
  linesCleared: number;
  wordsMatched: number;
  combo: number;
  currentTetromino: Tetromino | null;
  nextTetromino: Tetromino | null;
  grid: Grid;
  elapsedTime: number;
  isPaused: boolean;
  settings: GameSettings;
}

// ============================================================================
// 設定相關類型
// ============================================================================

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  hskLevels: number[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  language: 'zh-CN' | 'zh-TW' | 'en';
  showHints: boolean;
  showPinyin: boolean;
  showDefinition: boolean;
}

export interface PlayerSettings extends GameSettings {
  theme: 'light' | 'dark' | 'auto';
  keyBindings: KeyBindings;
}

export interface KeyBindings {
  moveLeft: string;
  moveRight: string;
  moveDown: string;
  rotate: string;
  hardDrop: string;
  pause: string;
  hint: string;
}

// ============================================================================
// 玩家數據相關類型
// ============================================================================

export interface PlayerData {
  id: string;
  username: string;
  statistics: PlayerStatistics;
  learningProgress: LearningProgress;
  achievements: Achievement[];
  settings: PlayerSettings;
}

export interface PlayerStatistics {
  totalGamesPlayed: number;
  highScore: number;
  totalWordsMatched: number;
  totalPlayTime: number;
  averageScore: number;
  longestCombo: number;
}

export interface LearningProgress {
  currentHSKLevel: number;
  learnedWords: Set<string>;
  masteredWords: Set<string>;
  weakWords: Set<string>;
  wordStats: Map<
    string,
    {
      appearances: number;
      successRate: number;
      lastSeen: Date;
    }
  >;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// ============================================================================
// 匹配相關類型
// ============================================================================

export interface Match {
  word: Word;
  positions: Position[];
  direction: 'horizontal' | 'vertical';
  score: number;
}

export interface HighlightedMatch {
  word: string;
  score: number;
  positions: Position[];
}

// ============================================================================
// 效果相關類型
// ============================================================================

export interface Effect {
  id: string;
  type: 'particle' | 'text' | 'animation';
  position: Position;
  data: unknown;
  duration: number;
}

// ============================================================================
// 分數事件（UI 顯示用）
// ============================================================================

export type ScoreEvent =
  | {
      id: string;
      type: 'word';
      words: Array<{ text: string; score: number }>;
      comboBonus: number;
      totalScore: number;
    }
  | {
      id: string;
      type: 'line';
      lines: number;
      score: number;
    };
