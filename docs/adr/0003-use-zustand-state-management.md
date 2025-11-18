# ADR-0003: 使用 Zustand 作為狀態管理方案

## 狀態
✅ 接受

## 背景

遊戲需要管理複雜的狀態：
- 遊戲狀態（分數、等級、網格、當前方塊）
- 玩家數據（學習進度、統計、設定）
- UI 狀態（菜單、暫停、提示）

**問題陳述**：
- React useState 對複雜狀態管理力不從心
- 需要跨組件共享狀態
- 需要狀態持久化（LocalStorage）
- 需要 DevTools 支持調試
- 需要良好的 TypeScript 支持

**限制條件**：
- Bundle 大小敏感
- 性能要求高（60 FPS 遊戲循環）
- 開發者體驗要好

## 決策

我們決定採用 **Zustand 4.5+**。

**理由**：

1. **極簡 API**
   ```typescript
   const useStore = create((set) => ({
     score: 0,
     incrementScore: (points) => set((state) => ({
       score: state.score + points
     }))
   }));
   ```
   - 無 Provider 包裹，直接使用
   - API 簡單直觀
   - 學習成本低

2. **極小 Bundle**
   - 僅 ~3KB (gzip)
   - 比 Redux Toolkit (~12KB) 小 4 倍

3. **性能優異**
   - 基於訂閱模式，精確更新
   - 無 Context API 的性能問題
   - 支持選擇器優化

4. **TypeScript 完美支持**
   ```typescript
   interface GameStore {
     score: number;
     incrementScore: (points: number) => void;
   }
   const useGameStore = create<GameStore>()(...);
   ```

5. **內建中間件**
   - `persist`：狀態持久化
   - `devtools`：Redux DevTools 支持
   - `immer`：不可變數據簡化

6. **無樣板代碼**
   - 不需要 actions、reducers、types
   - 直接在 store 中定義邏輯

## 後果

### 正面影響
- ✅ 開發效率高，代碼簡潔
- ✅ Bundle 極小，幾乎無開銷
- ✅ 性能優秀，無不必要的重渲染
- ✅ TypeScript 支持完善
- ✅ DevTools 調試方便
- ✅ 狀態持久化開箱即用

### 負面影響
- ⚠️ **社區相對較小**（比 Redux）
  - **緩解**：官方文檔完善，API 簡單
- ⚠️ **時間旅行調試**不如 Redux 強大
  - **緩解**：遊戲不需要複雜的時間旅行
- ⚠️ **缺少嚴格的數據流約束**
  - **緩解**：通過代碼規範約束

### 風險
- **狀態設計混亂**：自由度高可能導致狀態散亂
  - **應對**：定義清晰的 Store 接口，模塊化設計
- **過度使用全局狀態**：所有狀態都放 Zustand
  - **應對**：僅共享狀態用 Zustand，局部狀態用 useState

## 替代方案

### 方案 A：Redux Toolkit
- **優點**：
  - 生態系統最成熟
  - Redux DevTools 強大
  - 中間件豐富
  - 時間旅行調試
- **缺點**：
  - Bundle 更大（~12KB）
  - 樣板代碼多（slice, actions, reducers）
  - 學習曲線陡峭
  - 對簡單遊戲過度設計
- **為何未選擇**：對本項目功能過剩

### 方案 B：Jotai
- **優點**：
  - 原子化狀態，靈活
  - Bundle 小（~3KB）
  - 類似 Recoil
- **缺點**：
  - 概念較抽象（atoms）
  - 學習成本較高
  - 文檔不如 Zustand 清晰
- **為何未選擇**：API 不夠直觀

### 方案 C：Valtio
- **優點**：
  - 代理模式，像操作普通對象
  - Bundle 小
  - 與 Zustand 同作者
- **缺點**：
  - 代理模式有學習成本
  - TypeScript 支持不如 Zustand
- **為何未選擇**：Zustand 更成熟穩定

### 方案 D：React Context + useReducer
- **優點**：
  - 無額外依賴（0KB）
  - React 原生
- **缺點**：
  - 樣板代碼多
  - 性能問題（Provider 重渲染）
  - 無 DevTools
  - 無持久化支持
- **為何未選擇**：對複雜狀態力不從心

## 實現細節

### Store 設計

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GameStore {
  // 狀態
  gameState: GameState;
  playerData: PlayerData;

  // Actions
  startGame: (mode: GameMode) => void;
  updateScore: (points: number) => void;
  // ...
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        gameState: initialGameState,
        playerData: loadPlayerData(),

        startGame: (mode) => {
          set({
            gameState: {
              ...initialGameState,
              mode,
              status: 'PLAYING'
            }
          });
        },

        updateScore: (points) => {
          set((state) => ({
            gameState: {
              ...state.gameState,
              score: state.gameState.score + points
            }
          }));
        }
      }),
      {
        name: 'chinese-tetris-storage',
        partialize: (state) => ({
          playerData: state.playerData
        })
      }
    )
  )
);
```

### 使用示例

```tsx
function ScoreDisplay() {
  const score = useGameStore((state) => state.gameState.score);
  return <div>Score: {score}</div>;
}

function GameControls() {
  const startGame = useGameStore((state) => state.startGame);
  return <button onClick={() => startGame('classic')}>Start</button>;
}
```

### 性能優化

```typescript
// ✅ 好：選擇器精確訂閱
const score = useGameStore((state) => state.gameState.score);

// ❌ 壞：訂閱整個 state，導致不必要的重渲染
const state = useGameStore();
```

## 參考資料
- [Zustand 官方文檔](https://docs.pmnd.rs/zustand/)
- [Zustand vs Redux](https://docs.pmnd.rs/zustand/getting-started/comparison)
- [Zustand TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)

---

**決策者**：開發團隊
**決策日期**：2025-11-18
**最後更新**：2025-11-18
