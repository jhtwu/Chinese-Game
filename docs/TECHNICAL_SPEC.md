# 中文學習俄羅斯方塊 - 技術規格文檔

## 版本歷史
| 版本 | 日期 | 作者 | 變更說明 |
|------|------|------|----------|
| 1.0  | 2025-11-18 | Initial | 初始技術規格 |

---

## 1. 技術棧

### 1.1 前端框架與工具

| 技術 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **React** | 18.3+ | UI 框架 | 組件化、生態系統豐富 |
| **TypeScript** | 5.3+ | 開發語言 | 類型安全、IDE 支持 |
| **Vite** | 5.0+ | 構建工具 | 快速 HMR、現代化 |
| **Tailwind CSS** | 3.4+ | 樣式方案 | 快速開發、響應式 |
| **Zustand** | 4.5+ | 狀態管理 | 輕量、簡單 API |
| **Konva.js** | 9.3+ | Canvas 渲染 | 高性能 2D 圖形 |
| **React-Konva** | 18.2+ | React 綁定 | 聲明式 Canvas |

### 1.2 測試工具

| 工具 | 用途 |
|------|------|
| **Vitest** | 單元測試、集成測試 |
| **Testing Library** | React 組件測試 |
| **Playwright** | E2E 測試 |
| **MSW** | API Mock（未來） |

### 1.3 開發工具

| 工具 | 用途 |
|------|------|
| **ESLint** | 代碼檢查 |
| **Prettier** | 代碼格式化 |
| **Husky** | Git Hooks |
| **Lint-staged** | 暫存區檢查 |
| **Commitlint** | Commit 訊息規範 |

### 1.4 部署與 CI/CD

| 服務 | 用途 |
|------|------|
| **GitHub Pages** | 靜態網站託管 |
| **GitHub Actions** | CI/CD 流程 |
| **Vercel**（可選）| 替代部署方案 |

---

## 2. 系統架構

### 2.1 整體架構圖

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌───────────────────────────────────────────────┐  │
│  │           React Application (SPA)             │  │
│  │                                               │  │
│  │  ┌─────────────┐  ┌──────────────────────┐   │  │
│  │  │ UI Layer    │  │   Game Engine        │   │  │
│  │  │             │  │                      │   │  │
│  │  │ - Menu      │  │ - Tetris Core       │   │  │
│  │  │ - HUD       │  │ - Word Matcher      │   │  │
│  │  │ - Settings  │  │ - Collision Detect  │   │  │
│  │  │ - Tutorial  │  │ - Scoring Engine    │   │  │
│  │  └─────────────┘  └──────────────────────┘   │  │
│  │         │                    │                │  │
│  │         └────────┬───────────┘                │  │
│  │                  │                            │  │
│  │         ┌────────▼────────┐                   │  │
│  │         │  State Manager  │                   │  │
│  │         │    (Zustand)    │                   │  │
│  │         └────────┬────────┘                   │  │
│  │                  │                            │  │
│  │    ┌─────────────┴─────────────┐              │  │
│  │    │                           │              │  │
│  │ ┌──▼────────┐         ┌────────▼─────┐        │  │
│  │ │ Renderer  │         │ Data Layer   │        │  │
│  │ │ (Canvas)  │         │              │        │  │
│  │ │           │         │ - Word DB    │        │  │
│  │ │ - Konva   │         │ - LocalStore │        │  │
│  │ │ - WebGL   │         │ - Settings   │        │  │
│  │ └───────────┘         └──────────────┘        │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2.2 模塊劃分

#### 2.2.1 核心遊戲模塊 (`src/game/`)

```
src/game/
├── core/
│   ├── TetrisEngine.ts        # 俄羅斯方塊核心邏輯
│   ├── Grid.ts                # 遊戲網格
│   ├── Tetromino.ts           # 方塊類型和旋轉
│   └── GameLoop.ts            # 遊戲循環控制
├── word/
│   ├── WordMatcher.ts         # 詞語匹配算法
│   ├── WordDatabase.ts        # 詞庫管理
│   └── CharacterGenerator.ts  # 字符生成邏輯
├── scoring/
│   ├── ScoreCalculator.ts     # 計分系統
│   └── ComboTracker.ts        # 連擊追蹤
└── physics/
    ├── CollisionDetector.ts   # 碰撞檢測
    └── GravitySystem.ts       # 重力系統
```

#### 2.2.2 UI 組件模塊 (`src/components/`)

```
src/components/
├── Game/
│   ├── GameBoard.tsx          # 遊戲主畫面
│   ├── NextPiece.tsx          # 下一個方塊預覽
│   ├── HUD.tsx                # 遊戲 HUD
│   └── GameOver.tsx           # 遊戲結束畫面
├── Menu/
│   ├── MainMenu.tsx           # 主選單
│   ├── ModeSelect.tsx         # 模式選擇
│   └── Settings.tsx           # 設定畫面
├── Learning/
│   ├── WordDisplay.tsx        # 詞語顯示
│   ├── HintSystem.tsx         # 提示系統
│   └── ProgressTracker.tsx    # 進度追蹤
└── Common/
    ├── Button.tsx             # 通用按鈕
    ├── Modal.tsx              # 模態框
    └── Toast.tsx              # 提示訊息
```

#### 2.2.3 渲染模塊 (`src/renderer/`)

```
src/renderer/
├── CanvasRenderer.ts          # Canvas 渲染器基礎類
├── TetrominoRenderer.ts       # 方塊渲染
├── GridRenderer.ts            # 網格渲染
├── EffectRenderer.ts          # 特效渲染（粒子、動畫）
└── TextRenderer.ts            # 中文字渲染
```

#### 2.2.4 工具模塊 (`src/utils/`)

```
src/utils/
├── storageManager.ts          # 本地存儲管理
├── audioManager.ts            # 音效管理
├── i18n.ts                    # 國際化
├── constants.ts               # 常數定義
└── helpers.ts                 # 通用輔助函數
```

---

## 3. 數據模型

### 3.1 核心數據結構

#### 3.1.1 方塊 (Tetromino)

```typescript
enum TetrominoType {
  I = 'I',
  O = 'O',
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L'
}

interface Position {
  x: number;
  y: number;
}

interface Tetromino {
  type: TetrominoType;
  rotation: 0 | 1 | 2 | 3;              // 旋轉狀態（0°, 90°, 180°, 270°）
  position: Position;                   // 當前位置
  shape: number[][];                    // 形狀矩陣（1 表示有方塊）
  characters: (string | null)[][];      // 中文字矩陣
  color: string;                        // 顏色
}
```

#### 3.1.2 遊戲網格 (Grid)

```typescript
interface Cell {
  occupied: boolean;                    // 是否被佔用
  character: string | null;             // 中文字（如有）
  color: string | null;                 // 顏色
  locked: boolean;                      // 是否已固定
}

type Grid = Cell[][];                   // 10×20 的二維陣列
```

#### 3.1.3 詞語數據 (Word)

```typescript
interface Word {
  id: string;                           // 唯一 ID
  word: string;                         // 完整詞語（如："學習"）
  characters: string[];                 // 字符陣列（["學", "習"]）
  pinyin: string;                       // 拼音（"xué xí"）
  pinyinArray: string[];                // 拼音陣列（["xué", "xí"]）
  hskLevel: 1 | 2 | 3 | 4 | 5 | 6;     // HSK 級別
  category: string;                     // 分類（如："education"）
  definition: {                         // 定義（多語言）
    en: string;
    zh: string;
  };
  example?: string;                     // 例句
  frequency: number;                    // 使用頻率（0-1）
  isIdiom: boolean;                     // 是否為成語
}
```

#### 3.1.4 詞庫 (WordDatabase)

```typescript
interface WordDatabase {
  version: string;                      // 版本號
  lastUpdated: string;                  // 最後更新時間
  words: Word[];                        // 詞語列表
  index: {                              // 索引（加速查找）
    byHSK: Map<number, Word[]>;
    byCategory: Map<string, Word[]>;
    byLength: Map<number, Word[]>;
    byCharacter: Map<string, Word[]>;   // 某字開頭的所有詞
  };
}
```

#### 3.1.5 遊戲狀態 (GameState)

```typescript
enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_UP = 'LEVEL_UP'
}

interface GameState {
  status: GameStatus;
  mode: 'classic' | 'timeAttack' | 'learning' | 'theme';
  score: number;
  level: number;
  linesCleared: number;
  wordsMatched: number;
  combo: number;
  currentTetromino: Tetromino | null;
  nextTetromino: Tetromino | null;
  grid: Grid;
  elapsedTime: number;                  // 遊戲時間（秒）
  isPaused: boolean;
  settings: GameSettings;
}
```

#### 3.1.6 玩家數據 (PlayerData)

```typescript
interface PlayerData {
  id: string;
  username: string;
  statistics: {
    totalGamesPlayed: number;
    highScore: number;
    totalWordsMatched: number;
    totalPlayTime: number;              // 秒
    averageScore: number;
    longestCombo: number;
  };
  learningProgress: {
    currentHSKLevel: number;
    learnedWords: Set<string>;          // 已學詞語 ID
    masteredWords: Set<string>;         // 熟練詞語 ID
    weakWords: Set<string>;             // 薄弱詞語 ID
    wordStats: Map<string, {            // 每個詞的統計
      appearances: number;
      successRate: number;
      lastSeen: Date;
    }>;
  };
  achievements: Achievement[];
  settings: PlayerSettings;
}
```

#### 3.1.7 設定 (Settings)

```typescript
interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  hskLevels: number[];                  // 選擇的 HSK 級別（如 [1, 2]）
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;                       // 0-100
  language: 'zh-CN' | 'zh-TW' | 'en';
  showHints: boolean;
  showPinyin: boolean;
  showDefinition: boolean;
}

interface PlayerSettings extends GameSettings {
  theme: 'light' | 'dark' | 'auto';
  keyBindings: KeyBindings;
}

interface KeyBindings {
  moveLeft: string;                     // 預設: 'ArrowLeft'
  moveRight: string;                    // 預設: 'ArrowRight'
  moveDown: string;                     // 預設: 'ArrowDown'
  rotate: string;                       // 預設: 'ArrowUp'
  hardDrop: string;                     // 預設: 'Space'
  pause: string;                        // 預設: 'Escape'
  hint: string;                         // 預設: 'h'
}
```

---

## 4. 核心算法

### 4.1 詞語匹配算法

#### 4.1.1 算法概述

**目標**：在遊戲網格中檢測所有有效的中文詞語（橫向和縱向）

**時間複雜度要求**：< 100ms（每次方塊固定後）

#### 4.1.2 算法實現

```typescript
/**
 * 詞語匹配器 - 核心算法
 */
class WordMatcher {
  private wordDatabase: WordDatabase;
  private trie: Trie;  // 字典樹（加速查找）

  constructor(wordDatabase: WordDatabase) {
    this.wordDatabase = wordDatabase;
    this.trie = this.buildTrie(wordDatabase.words);
  }

  /**
   * 主函數：查找網格中所有匹配的詞語
   */
  findMatches(grid: Grid): Match[] {
    const matches: Match[] = [];

    // 1. 橫向掃描
    for (let row = 0; row < grid.length; row++) {
      matches.push(...this.scanRow(grid, row));
    }

    // 2. 縱向掃描
    for (let col = 0; col < grid[0].length; col++) {
      matches.push(...this.scanColumn(grid, col));
    }

    // 3. 去重和優先級排序
    return this.deduplicateAndSort(matches);
  }

  /**
   * 掃描一行
   */
  private scanRow(grid: Grid, row: number): Match[] {
    const matches: Match[] = [];
    const rowCells = grid[row];
    const characters: string[] = [];

    // 提取該行所有字符
    for (let col = 0; col < rowCells.length; col++) {
      if (rowCells[col].occupied && rowCells[col].character) {
        characters.push(rowCells[col].character!);
      } else {
        characters.push(''); // 空格
      }
    }

    // 使用滑動窗口查找詞語（2-4 字）
    for (let start = 0; start < characters.length; start++) {
      if (!characters[start]) continue;

      for (let length = 2; length <= 4; length++) {
        if (start + length > characters.length) break;

        const substring = characters.slice(start, start + length);
        if (substring.includes('')) continue; // 包含空格，跳過

        const word = substring.join('');
        const wordData = this.trie.search(word);

        if (wordData) {
          matches.push({
            word: wordData,
            positions: this.getPositions(row, start, length, 'horizontal'),
            direction: 'horizontal',
            score: this.calculateScore(wordData)
          });
        }
      }
    }

    return matches;
  }

  /**
   * 掃描一列（類似 scanRow）
   */
  private scanColumn(grid: Grid, col: number): Match[] {
    // 實現類似 scanRow，方向改為 vertical
    // ...
  }

  /**
   * 去重和排序
   * 策略：
   * 1. 優先選擇長詞（4字 > 3字 > 2字）
   * 2. 同長度優先選擇高分詞
   * 3. 去除重疊的詞（貪心算法）
   */
  private deduplicateAndSort(matches: Match[]): Match[] {
    // 按分數排序
    matches.sort((a, b) => b.score - a.score);

    const selected: Match[] = [];
    const occupiedPositions = new Set<string>();

    for (const match of matches) {
      // 檢查是否與已選詞語重疊
      const hasOverlap = match.positions.some(pos =>
        occupiedPositions.has(`${pos.x},${pos.y}`)
      );

      if (!hasOverlap) {
        selected.push(match);
        match.positions.forEach(pos =>
          occupiedPositions.add(`${pos.x},${pos.y}`)
        );
      }
    }

    return selected;
  }

  /**
   * 構建字典樹（Trie）
   * 用於快速查找詞語是否存在
   */
  private buildTrie(words: Word[]): Trie {
    const trie = new Trie();
    words.forEach(word => trie.insert(word.word, word));
    return trie;
  }
}

/**
 * 字典樹實現
 */
class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string, data: Word): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
    node.data = data;
  }

  search(word: string): Word | null {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    return node.isEnd ? node.data : null;
  }
}

class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
  data: Word | null;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.data = null;
  }
}
```

#### 4.1.3 性能優化

1. **字典樹（Trie）**：O(L) 查找時間，L 為詞長
2. **滑動窗口**：只檢查 2-4 字長度
3. **剪枝**：遇到空格立即跳過
4. **索引緩存**：常用詞語預加載

**預期性能：**
- 10×20 網格 → ~50-100 次查找
- 每次查找 < 1ms
- 總時間 < 100ms ✓

---

### 4.2 字符生成算法

#### 4.2.1 智能字符生成

**目標**：生成有高概率能組成詞語的中文字

```typescript
class CharacterGenerator {
  private wordDatabase: WordDatabase;
  private hskLevel: number;
  private characterPool: Map<string, number>; // 字符 → 權重

  constructor(wordDatabase: WordDatabase, hskLevel: number) {
    this.wordDatabase = wordDatabase;
    this.hskLevel = hskLevel;
    this.characterPool = this.buildCharacterPool();
  }

  /**
   * 構建字符池（基於詞庫統計）
   */
  private buildCharacterPool(): Map<string, number> {
    const pool = new Map<string, number>();
    const words = this.wordDatabase.index.byHSK.get(this.hskLevel) || [];

    words.forEach(word => {
      word.characters.forEach(char => {
        const weight = pool.get(char) || 0;
        // 權重 = 該字能組成的詞數 × 詞頻
        pool.set(char, weight + word.frequency);
      });
    });

    return pool;
  }

  /**
   * 生成一個字符（加權隨機）
   */
  generateCharacter(): string {
    const totalWeight = Array.from(this.characterPool.values())
      .reduce((sum, w) => sum + w, 0);

    let random = Math.random() * totalWeight;

    for (const [char, weight] of this.characterPool.entries()) {
      random -= weight;
      if (random <= 0) {
        return char;
      }
    }

    // 備用：返回最常見字
    return '的';
  }

  /**
   * 為方塊生成字符矩陣
   */
  generateForTetromino(tetromino: Tetromino): (string | null)[][] {
    const shape = tetromino.shape;
    const characters: (string | null)[][] = [];

    for (let row = 0; row < shape.length; row++) {
      characters[row] = [];
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          characters[row][col] = this.generateCharacter();
        } else {
          characters[row][col] = null;
        }
      }
    }

    return characters;
  }
}
```

---

### 4.3 碰撞檢測

```typescript
class CollisionDetector {
  /**
   * 檢測方塊是否與網格碰撞
   */
  static checkCollision(
    tetromino: Tetromino,
    grid: Grid,
    offset: Position = { x: 0, y: 0 }
  ): boolean {
    const { shape, position } = tetromino;
    const newX = position.x + offset.x;
    const newY = position.y + offset.y;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const gridX = newX + col;
          const gridY = newY + row;

          // 邊界檢查
          if (gridX < 0 || gridX >= grid[0].length || gridY >= grid.length) {
            return true;
          }

          // 網格佔用檢查
          if (gridY >= 0 && grid[gridY][gridX].occupied) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 檢測是否到達底部
   */
  static isAtBottom(tetromino: Tetromino, grid: Grid): boolean {
    return this.checkCollision(tetromino, grid, { x: 0, y: 1 });
  }
}
```

---

## 5. 狀態管理

### 5.1 Zustand Store 設計

```typescript
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GameStore {
  // 狀態
  gameState: GameState;
  playerData: PlayerData;
  wordDatabase: WordDatabase;

  // Actions
  startGame: (mode: GameMode) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  updateScore: (points: number) => void;
  matchWords: (matches: Match[]) => void;
  moveTetromino: (direction: 'left' | 'right' | 'down') => void;
  rotateTetromino: () => void;
  hardDrop: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始狀態
        gameState: initialGameState,
        playerData: loadPlayerData(),
        wordDatabase: loadWordDatabase(),

        // Actions 實現
        startGame: (mode) => {
          set((state) => ({
            gameState: {
              ...initialGameState,
              mode,
              status: GameStatus.PLAYING,
              currentTetromino: generateTetromino(),
              nextTetromino: generateTetromino(),
            }
          }));
        },

        moveTetromino: (direction) => {
          const state = get();
          const { currentTetromino, grid } = state.gameState;

          if (!currentTetromino) return;

          const offset = {
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
          }[direction];

          if (!CollisionDetector.checkCollision(currentTetromino, grid, offset)) {
            set((state) => ({
              gameState: {
                ...state.gameState,
                currentTetromino: {
                  ...currentTetromino,
                  position: {
                    x: currentTetromino.position.x + offset.x,
                    y: currentTetromino.position.y + offset.y,
                  }
                }
              }
            }));
          } else if (direction === 'down') {
            // 到底了，鎖定方塊
            get().lockTetromino();
          }
        },

        // ... 其他 actions
      }),
      {
        name: 'chinese-tetris-storage',
        partialize: (state) => ({
          playerData: state.playerData,
          settings: state.gameState.settings,
        })
      }
    )
  )
);
```

---

## 6. 渲染系統

### 6.1 Canvas 渲染架構

```typescript
class GameRenderer {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private gridRenderer: GridRenderer;
  private tetrominoRenderer: TetrominoRenderer;
  private effectRenderer: EffectRenderer;

  constructor(container: HTMLDivElement, width: number, height: number) {
    this.stage = new Konva.Stage({
      container,
      width,
      height
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.gridRenderer = new GridRenderer(this.layer);
    this.tetrominoRenderer = new TetrominoRenderer(this.layer);
    this.effectRenderer = new EffectRenderer(this.layer);
  }

  render(gameState: GameState): void {
    this.layer.destroyChildren(); // 清空

    // 渲染順序
    this.gridRenderer.render(gameState.grid);
    this.tetrominoRenderer.render(gameState.currentTetromino);
    this.effectRenderer.render(gameState.effects);

    this.layer.batchDraw(); // 批次渲染
  }
}

class TetrominoRenderer {
  private layer: Konva.Layer;
  private readonly CELL_SIZE = 30;

  render(tetromino: Tetromino | null): void {
    if (!tetromino) return;

    const { shape, position, characters, color } = tetromino;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const x = (position.x + col) * this.CELL_SIZE;
          const y = (position.y + row) * this.CELL_SIZE;

          // 繪製方塊
          const rect = new Konva.Rect({
            x,
            y,
            width: this.CELL_SIZE,
            height: this.CELL_SIZE,
            fill: color,
            stroke: '#000',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.5,
          });

          // 繪製中文字
          const char = characters[row][col];
          if (char) {
            const text = new Konva.Text({
              x,
              y,
              width: this.CELL_SIZE,
              height: this.CELL_SIZE,
              text: char,
              fontSize: 20,
              fontFamily: 'Noto Sans TC',
              fill: '#fff',
              align: 'center',
              verticalAlign: 'middle',
            });

            this.layer.add(rect, text);
          }
        }
      }
    }
  }
}
```

### 6.2 性能優化策略

1. **批次渲染**：使用 `layer.batchDraw()` 減少重繪次數
2. **對象池**：復用 Konva 對象
3. **局部更新**：只更新變化的部分
4. **降級策略**：低端設備關閉粒子效果
5. **RequestAnimationFrame**：保持 60 FPS

---

## 7. 數據持久化

### 7.1 LocalStorage 方案

```typescript
class StorageManager {
  private static readonly KEYS = {
    PLAYER_DATA: 'player_data',
    SETTINGS: 'settings',
    HIGH_SCORES: 'high_scores',
    LEARNING_PROGRESS: 'learning_progress',
  };

  static savePlayerData(data: PlayerData): void {
    try {
      const serialized = JSON.stringify(data, this.replacer);
      localStorage.setItem(this.KEYS.PLAYER_DATA, serialized);
    } catch (error) {
      console.error('Failed to save player data:', error);
    }
  }

  static loadPlayerData(): PlayerData | null {
    try {
      const serialized = localStorage.getItem(this.KEYS.PLAYER_DATA);
      if (!serialized) return null;
      return JSON.parse(serialized, this.reviver);
    } catch (error) {
      console.error('Failed to load player data:', error);
      return null;
    }
  }

  // 處理 Set、Map 等特殊類型的序列化
  private static replacer(key: string, value: any): any {
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value) };
    }
    if (value instanceof Map) {
      return { __type: 'Map', value: Array.from(value.entries()) };
    }
    return value;
  }

  private static reviver(key: string, value: any): any {
    if (value && value.__type === 'Set') {
      return new Set(value.value);
    }
    if (value && value.__type === 'Map') {
      return new Map(value.value);
    }
    return value;
  }
}
```

---

## 8. 音效系統

### 8.1 Web Audio API

```typescript
class AudioManager {
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer>;
  private bgMusic: AudioBufferSourceNode | null;
  private volume: number = 0.7;

  constructor() {
    this.context = new AudioContext();
    this.sounds = new Map();
    this.loadSounds();
  }

  async loadSounds(): Promise<void> {
    const soundFiles = {
      move: '/assets/sounds/move.mp3',
      rotate: '/assets/sounds/rotate.mp3',
      land: '/assets/sounds/land.mp3',
      match: '/assets/sounds/match.mp3',
      combo: '/assets/sounds/combo.mp3',
      gameOver: '/assets/sounds/gameover.mp3',
    };

    for (const [key, path] of Object.entries(soundFiles)) {
      const buffer = await this.loadSound(path);
      this.sounds.set(key, buffer);
    }
  }

  private async loadSound(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  play(soundName: string): void {
    const buffer = this.sounds.get(soundName);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    gainNode.gain.value = this.volume;

    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    source.start(0);
  }

  // TTS 朗讀詞語（使用 Web Speech API）
  speakWord(word: string, pinyin: string): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
}
```

---

## 9. 性能指標與監控

### 9.1 性能目標

| 指標 | 目標值 | 測量方法 |
|------|--------|----------|
| FPS | ≥ 60 | RequestAnimationFrame |
| 詞語檢測時間 | < 100ms | Performance API |
| 首屏加載 | < 3s | Lighthouse |
| Bundle Size | < 500KB (gzip) | Webpack Bundle Analyzer |
| 記憶體使用 | < 100MB | Chrome DevTools |

### 9.2 監控方案

```typescript
class PerformanceMonitor {
  private metrics: Map<string, number[]>;

  measureWordMatching(fn: () => Match[]): Match[] {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    const duration = end - start;
    this.recordMetric('wordMatching', duration);

    if (duration > 100) {
      console.warn(`Word matching took ${duration}ms (> 100ms threshold)`);
    }

    return result;
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}
```

---

## 10. 安全與隱私

### 10.1 安全考量

- **XSS 防護**：使用 React 自動轉義，避免 `dangerouslySetInnerHTML`
- **數據驗證**：LocalStorage 數據讀取時驗證格式
- **CSP 設定**：Content Security Policy 防止惡意腳本

### 10.2 隱私保護

- **本地優先**：所有數據存儲在本地，不上傳服務器
- **匿名統計**：如未來添加分析，使用匿名 ID
- **GDPR 合規**：提供數據導出和刪除功能

---

## 11. 部署與 CI/CD

### 11.1 GitHub Actions 工作流

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 12. 擴展性設計

### 12.1 插件系統（未來）

```typescript
interface GamePlugin {
  name: string;
  version: string;
  onGameStart?: (state: GameState) => void;
  onWordMatch?: (match: Match) => void;
  onGameEnd?: (finalScore: number) => void;
}

class PluginManager {
  private plugins: GamePlugin[] = [];

  register(plugin: GamePlugin): void {
    this.plugins.push(plugin);
  }

  trigger(event: string, ...args: any[]): void {
    this.plugins.forEach(plugin => {
      const handler = (plugin as any)[`on${event}`];
      if (handler) handler(...args);
    });
  }
}
```

### 12.2 後端 API（未來）

```typescript
// 未來可能的後端端點設計
interface API {
  // 排行榜
  GET: '/api/leaderboard?mode=classic&limit=100'
  POST: '/api/leaderboard/submit'

  // 同步進度
  GET: '/api/user/progress'
  POST: '/api/user/progress/sync'

  // 詞庫更新
  GET: '/api/words/version'
  GET: '/api/words/delta?from=1.0.0'
}
```

---

## 13. 技術債務追蹤

| 項目 | 優先級 | 預計時間 | 狀態 |
|------|--------|----------|------|
| 實現對象池優化渲染 | 中 | 2 天 | Planned |
| 添加 E2E 測試 | 高 | 3 天 | Planned |
| 性能 Profiling 和優化 | 中 | 1 週 | Planned |
| 無障礙設計（a11y） | 低 | 3 天 | Backlog |

---

## 附錄：開發環境設置

### 必需工具

- Node.js ≥ 20.x
- npm ≥ 10.x 或 pnpm ≥ 8.x
- Git
- VS Code（推薦）

### VS Code 擴展

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

---

**文檔結束**

> 本文檔將隨技術選型和實現細節持續更新。
