# ADR-0002: 使用 Konva.js 作為 Canvas 渲染引擎

## 狀態
✅ 接受

## 背景

俄羅斯方塊遊戲需要高性能的 2D 圖形渲染，包括：
- 方塊繪製（含中文字）
- 動畫效果（下落、消除、粒子特效）
- 60 FPS 穩定幀率
- 中文字體渲染

**問題陳述**：
- 原生 Canvas API 過於底層，開發效率低
- 需要處理複雜的圖形對象（方塊、文字、特效）
- 需要事件處理（未來可能的觸控支持）
- 需要與 React 良好集成

**限制條件**：
- 必須支持中文字體渲染
- 性能要求：10×20 網格 + 動畫，保持 60 FPS
- Bundle 大小需合理

## 決策

我們決定採用 **Konva.js 9.3+** 配合 **react-konva 18.2+**。

**理由**：

1. **豐富的 API**
   - 提供高級圖形對象（Rect, Text, Group, Layer）
   - 內建動畫系統（Tween, Animation）
   - 事件處理系統

2. **性能優異**
   - 基於原生 Canvas，性能接近原生
   - 支持批次渲染（batchDraw）
   - 對象緩存和懶渲染

3. **React 集成**
   - react-konva 提供聲明式 API
   - 與 React 組件模型完美契合
   - 支持 Hooks

4. **中文字體支持**
   - 完美支持 Unicode 字符
   - 可使用 Web Fonts（Noto Sans TC）
   - 文字居中、陰影等高級功能

5. **開發體驗**
   - 清晰的文檔和示例
   - 活躍的社區
   - TypeScript 類型定義完善

## 後果

### 正面影響
- ✅ 開發效率高，減少底層繪圖代碼
- ✅ 聲明式 API 易於維護
- ✅ 內建動畫系統，減少自定義代碼
- ✅ 事件系統完善，未來擴展方便
- ✅ 性能滿足需求（60 FPS 穩定）

### 負面影響
- ⚠️ **Bundle 大小**：Konva ~130KB (gzip)
  - **緩解**：可接受，性價比高
- ⚠️ **學習曲線**：需要學習 Konva API
  - **緩解**：文檔完善，示例豐富
- ⚠️ **抽象層開銷**：比原生 Canvas 稍慢
  - **緩解**：使用對象池和緩存優化

### 風險
- **性能瓶頸**：複雜特效可能影響幀率
  - **應對**：性能測試 + 降級策略（關閉特效）
- **依賴維護**：Konva 更新可能帶來問題
  - **應對**：鎖定版本，定期評估

## 替代方案

### 方案 A：原生 Canvas API
- **優點**：
  - 最小 Bundle（0KB）
  - 最佳性能
  - 完全控制
- **缺點**：
  - 開發效率極低
  - 需自實現動畫、事件系統
  - 代碼量大，難維護
- **為何未選擇**：開發成本過高

### 方案 B：PixiJS
- **優點**：
  - 性能更強（WebGL 加速）
  - 適合複雜遊戲
  - 粒子系統強大
- **缺點**：
  - 更重（~200KB gzip）
  - 對簡單 2D 遊戲過度設計
  - React 集成不如 Konva 成熟
  - 文字渲染較複雜
- **為何未選擇**：俄羅斯方塊不需要 WebGL，Konva 足夠

### 方案 C：Phaser 3
- **優點**：
  - 完整的遊戲引擎
  - 物理引擎、碰撞檢測內建
  - 遊戲開發專用
- **缺點**：
  - 過於重量級（~600KB）
  - 與 React 集成困難
  - 學習曲線陡峭
  - 對本遊戲功能過剩
- **為何未選擇**：功能過剩，不適合簡單遊戲

### 方案 D：Paper.js
- **優點**：
  - 向量圖形優秀
  - 優雅的 API
- **缺點**：
  - 主要用於向量繪圖，非遊戲
  - 性能不如 Konva
  - React 集成差
- **為何未選擇**：不適合像素遊戲

## 實現細節

### 基本使用示例

```tsx
import { Stage, Layer, Rect, Text } from 'react-konva';

function GameBoard() {
  return (
    <Stage width={300} height={600}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={30}
          height={30}
          fill="red"
          stroke="black"
        />
        <Text
          x={0}
          y={0}
          width={30}
          height={30}
          text="學"
          fontSize={20}
          fontFamily="Noto Sans TC"
          fill="white"
          align="center"
          verticalAlign="middle"
        />
      </Layer>
    </Stage>
  );
}
```

### 性能優化策略

1. **批次渲染**
   ```typescript
   layer.batchDraw(); // 一次性渲染所有變更
   ```

2. **對象緩存**
   ```typescript
   node.cache(); // 緩存複雜圖形
   ```

3. **懶加載**
   ```typescript
   layer.listening(false); // 非交互層關閉事件
   ```

## 參考資料
- [Konva.js 官方文檔](https://konvajs.org/)
- [React-Konva 文檔](https://konvajs.org/docs/react/)
- [Konva 性能優化指南](https://konvajs.org/docs/performance/All_Performance_Tips.html)

---

**決策者**：開發團隊
**決策日期**：2025-11-18
**最後更新**：2025-11-18
