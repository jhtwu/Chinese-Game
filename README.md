# 🀄 中文學習俄羅斯方塊

> 在遊戲中學習中文詞彙！結合經典俄羅斯方塊玩法與中文詞語配對，讓學習變得有趣。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)

## ✨ 特色功能

- 🎮 **經典玩法**：保留俄羅斯方塊的核心機制
- 📚 **詞語學習**：組合中文詞語來消除方塊
- 🎯 **HSK 分級**：支持 HSK 1-6 級別詞彙
- 🎨 **精美設計**：中國風視覺設計
- 🔊 **語音朗讀**：詞語消除時自動朗讀
- 📊 **學習追蹤**：記錄學習進度和薄弱詞彙
- 🏆 **多種模式**：經典、限時、學習、主題挑戰

## 🎯 遊戲玩法

### 基礎規則

1. 控制帶有中文字的方塊下落
2. 將正確的字組合成詞語（橫向或縱向）
3. 詞語形成後自動消除並得分
4. 方塊堆滿頂部遊戲結束

### 詞語配對範例

```
學 + 習 → "學習" ✓ (+10分)
圖 + 書 + 館 → "圖書館" ✓ (+20分)
一 + 心 + 一 + 意 → "一心一意" ✓ (+40分)
```

### 遊戲模式

| 模式 | 說明 | 適合對象 |
|------|------|----------|
| 經典模式 | 無限遊戲，挑戰高分 | 所有玩家 |
| 限時模式 | 3 分鐘挑戰 | 進階玩家 |
| 學習模式 | 無壓力學習，提供提示 | 初學者 |
| 主題挑戰 | 特定主題詞彙 | 所有玩家 |

## 🚀 快速開始

### 前置需求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安裝

```bash
# 克隆專案
git clone https://github.com/jhtwu/Chinese-Game.git
cd Chinese-Game

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開啟瀏覽器訪問 http://localhost:3000

### 構建生產版本

```bash
npm run build
npm run preview
```

## 🛠️ 技術棧

### 核心技術

- **React 18.3** - UI 框架
- **TypeScript 5.3** - 類型安全
- **Vite 5.0** - 構建工具
- **Konva.js 9.3** - Canvas 渲染
- **Zustand 4.5** - 狀態管理
- **Tailwind CSS 3.4** - 樣式方案

### 開發工具

- **Vitest** - 單元測試
- **ESLint** - 代碼檢查
- **Prettier** - 代碼格式化
- **Husky** - Git Hooks

## 📁 專案結構

```
Chinese-Game/
├── docs/                    # 文檔
│   ├── GDD.md              # 遊戲設計文檔
│   ├── TECHNICAL_SPEC.md   # 技術規格
│   └── adr/                # 架構決策記錄
├── src/                    # 源代碼
│   ├── components/         # React 組件
│   ├── game/               # 遊戲邏輯
│   │   ├── core/          # 核心引擎
│   │   ├── word/          # 詞語系統
│   │   └── scoring/       # 計分系統
│   ├── utils/             # 工具函數
│   └── types/             # TypeScript 類型
├── data/                   # 數據文件
│   └── words/             # 詞庫
├── tests/                  # 測試文件
└── public/                 # 靜態資源
```

## 🎮 操作說明

| 按鍵 | 功能 |
|------|------|
| ← → | 左右移動 |
| ↑ | 旋轉方塊 |
| ↓ | 加速下落 |
| 空格 | 快速下落 |
| ESC | 暫停/繼續 |
| H | 提示 |

## 📚 文檔

- [遊戲設計文檔 (GDD)](docs/GDD.md)
- [技術規格文檔](docs/TECHNICAL_SPEC.md)
- [架構決策記錄 (ADR)](docs/adr/)

## 🧪 測試

```bash
# 運行測試
npm test

# 測試覆蓋率
npm run test:coverage

# UI 測試
npm run test:ui
```

## 🤝 開發流程

### Spec-Driven Development (SDD)

本專案採用規格驅動開發：

1. **設計階段**：撰寫 GDD 和技術規格
2. **測試階段**：撰寫 BDD 測試場景
3. **實現階段**：根據規格實現功能
4. **驗證階段**：確保測試通過

### 分支策略

```
main          # 生產分支
├── develop   # 開發分支
└── feature/* # 功能分支
```

### Commit 規範

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 新功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式
refactor: 重構
test: 測試相關
chore: 構建/工具相關
```

## 🗺️ 開發路線圖

### ✅ Phase 1：核心功能（當前）
- [x] 專案架構搭建
- [x] 規格文檔撰寫
- [x] 基礎俄羅斯方塊實現
- [x] 詞語匹配系統
- [ ] HSK 1-2 詞庫

### 🔄 Phase 2：完善功能
- [ ] 多遊戲模式
- [ ] 音效和動畫
- [ ] 學習追蹤系統
- [ ] HSK 3-6 詞庫

### 🔮 Phase 3：擴展功能
- [ ] 多人對戰
- [ ] 排行榜系統
- [ ] 移動端適配
- [ ] PWA 支持

## 🐛 問題回報

發現 bug？歡迎[提交 Issue](https://github.com/jhtwu/Chinese-Game/issues)

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權

## 🙏 致謝

- [HSK 官方詞表](http://www.chinesetest.cn/) - 詞彙來源
- [Tetris Wiki](https://tetris.wiki/) - 俄羅斯方塊設計參考
- 所有貢獻者和支持者

---

**開始學習中文，享受遊戲！** 🎮📚

如有任何問題或建議，歡迎聯繫我們。
