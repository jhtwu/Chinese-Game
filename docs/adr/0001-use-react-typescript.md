# ADR-0001: 使用 React + TypeScript 作為前端框架

## 狀態
✅ 接受

## 背景

我們需要選擇一個前端框架來構建中文學習俄羅斯方塊遊戲。

**問題陳述**：
- 需要高效的 UI 組件系統
- 需要類型安全，減少運行時錯誤
- 需要良好的開發者體驗和工具支持
- 需要與 Canvas 渲染庫良好集成
- 未來可能需要擴展到移動端（React Native）

**限制條件**：
- 需要支持現代瀏覽器（Chrome, Firefox, Safari, Edge）
- Bundle 大小需控制（< 500KB gzip）
- 開發團隊對技術棧的熟悉度

## 決策

我們決定採用 **React 18.3+ 配合 TypeScript 5.3+**。

**理由**：

1. **組件化開發**
   - React 的組件模型非常適合遊戲 UI（菜單、HUD、設定等）
   - 聲明式編程降低複雜度
   - Hooks API 提供靈活的狀態管理

2. **TypeScript 類型安全**
   - 遊戲邏輯複雜（詞語匹配、碰撞檢測），類型安全可減少 bug
   - 自動補全和 IDE 支持提升開發效率
   - 接口定義清晰（Word, Tetromino, GameState 等）

3. **生態系統豐富**
   - React-Konva 提供 React 綁定
   - 大量測試工具（Vitest, Testing Library）
   - 豐富的第三方庫和社區支持

4. **性能優化**
   - Virtual DOM 對非 Canvas 部分很高效
   - React.memo、useMemo 可優化重渲染
   - Concurrent Features（未來可用）

5. **擴展性**
   - 未來可使用 React Native 開發移動版
   - 可輕鬆集成 PWA 功能
   - SSR 支持（如需要）

## 後果

### 正面影響
- ✅ 開發速度快，組件復用率高
- ✅ 類型安全減少運行時錯誤
- ✅ 優秀的開發工具鏈（React DevTools, TypeScript）
- ✅ 豐富的學習資源和社區支持
- ✅ 與 Konva.js 集成良好（react-konva）

### 負面影響
- ⚠️ **Bundle 大小**：React + ReactDOM ~45KB (gzip)
  - **緩解**：使用 Tree Shaking、Code Splitting
- ⚠️ **學習曲線**：TypeScript 需要額外學習
  - **緩解**：提供清晰的類型定義和文檔
- ⚠️ **運行時開銷**：Virtual DOM 有一定性能損耗
  - **緩解**：Canvas 部分直接操作，不經過 Virtual DOM

### 風險
- **過度依賴 React**：如未來需要純 JS 版本，重構成本高
  - **應對**：遊戲邏輯層獨立於 UI 層，核心算法不依賴 React
- **版本升級**：React 版本更新可能帶來破壞性變更
  - **應對**：鎖定版本，定期評估升級

## 替代方案

### 方案 A：Vue 3 + TypeScript
- **優點**：
  - 更小的 Bundle (~34KB gzip)
  - 模板語法更直觀
  - Composition API 類似 React Hooks
- **缺點**：
  - 與 Canvas 庫集成不如 React 成熟
  - 遊戲開發社區較小
- **為何未選擇**：React 在遊戲開發中的案例和庫更多

### 方案 B：Svelte + TypeScript
- **優點**：
  - 編譯時框架，Bundle 極小
  - 性能優異
  - 語法簡潔
- **缺點**：
  - 生態系統較小
  - Canvas 庫支持有限
  - 團隊不熟悉
- **為何未選擇**：生態系統不夠成熟，風險較高

### 方案 C：純 JavaScript + Canvas
- **優點**：
  - 最小 Bundle，性能最優
  - 完全控制
- **缺點**：
  - UI 開發效率低
  - 狀態管理複雜
  - 缺少類型安全
  - 可維護性差
- **為何未選擇**：開發效率和可維護性不足

## 參考資料
- [React 官方文檔](https://react.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [React-Konva](https://konvajs.org/docs/react/)
- [React 性能優化最佳實踐](https://react.dev/learn/render-and-commit)

---

**決策者**：開發團隊
**決策日期**：2025-11-18
**最後更新**：2025-11-18
