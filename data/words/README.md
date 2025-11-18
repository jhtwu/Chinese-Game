# 詞庫數據文件

本目錄包含遊戲使用的中文詞庫數據。

## 文件結構

```
words/
├── README.md           # 本文件
├── schema.json         # JSON Schema 驗證規則
├── hsk-1-sample.json   # HSK 1 級別詞庫（示例）
├── hsk-2.json          # HSK 2 級別詞庫（待添加）
├── hsk-3.json          # HSK 3 級別詞庫（待添加）
├── hsk-4.json          # HSK 4 級別詞庫（待添加）
├── hsk-5.json          # HSK 5 級別詞庫（待添加）
└── hsk-6.json          # HSK 6 級別詞庫（待添加）
```

## 數據格式

每個詞庫文件都遵循統一的 JSON 格式：

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-18",
  "hskLevel": 1,
  "totalWords": 20,
  "words": [
    {
      "id": "xuéxí",
      "word": "學習",
      "characters": ["學", "習"],
      "pinyin": "xué xí",
      "pinyinArray": ["xué", "xí"],
      "hskLevel": 1,
      "category": "education",
      "definition": {
        "en": "to study, to learn",
        "zh": "學習知識或技能"
      },
      "example": "我每天學習中文。",
      "frequency": 0.95,
      "isIdiom": false
    }
  ]
}
```

## 字段說明

### 文件級別

| 字段 | 類型 | 必需 | 說明 |
|------|------|------|------|
| `version` | string | ✓ | 版本號（語義化版本） |
| `lastUpdated` | string | ✓ | 最後更新日期（YYYY-MM-DD） |
| `hskLevel` | number | ✓ | HSK 級別（1-6） |
| `totalWords` | number | ✓ | 詞語總數 |
| `words` | array | ✓ | 詞語列表 |

### 詞語級別

| 字段 | 類型 | 必需 | 說明 |
|------|------|------|------|
| `id` | string | ✓ | 唯一標識符（通常為拼音） |
| `word` | string | ✓ | 完整詞語 |
| `characters` | array | ✓ | 字符陣列（2-4 個字） |
| `pinyin` | string | ✓ | 拼音（帶聲調，空格分隔） |
| `pinyinArray` | array | ✓ | 拼音陣列（每個字一個） |
| `hskLevel` | number | ✓ | HSK 級別 |
| `category` | string | ✓ | 分類（見下方列表） |
| `definition` | object | ✓ | 定義（en, zh） |
| `example` | string | - | 例句 |
| `frequency` | number | ✓ | 使用頻率（0-1） |
| `isIdiom` | boolean | ✓ | 是否為成語 |

### 分類列表

- `education` - 教育
- `relationship` - 人際關係
- `country` - 國家/地區
- `language` - 語言
- `object` - 物品
- `food` - 食物/飲料
- `time` - 時間
- `emotion` - 情感
- `action` - 動作
- `nature` - 自然
- `body` - 身體
- `color` - 顏色
- `number` - 數字
- `direction` - 方向
- `animal` - 動物
- `plant` - 植物
- `weather` - 天氣
- `transport` - 交通
- `work` - 工作
- `health` - 健康
- `other` - 其他

## 添加新詞語

### 1. 手動編輯 JSON

直接編輯對應的 HSK 級別文件，按照格式添加新詞條。

### 2. 驗證數據

```bash
npm run validate-words
```

這會檢查：
- JSON 格式是否正確
- 是否符合 Schema
- 字符陣列與詞語是否匹配
- 拼音陣列長度是否正確

### 3. 提交變更

```bash
git add data/words/hsk-*.json
git commit -m "feat: add 10 new HSK-1 words"
```

## 數據來源

- **主要來源**：[HSK 官方詞表](http://www.chinesetest.cn/)
- **輔助來源**：
  - [現代漢語詞典](https://www.zdic.net/)
  - [MDBG 中英詞典](https://www.mdbg.net/)
  - [Pleco 字典](https://www.pleco.com/)

## 詞語選擇標準

### 包含標準

1. **HSK 官方詞表**中的詞語優先
2. **2-4 個字**的詞語（遊戲機制限制）
3. **常用詞彙**（frequency >= 0.7）
4. **能組成多個詞**的字優先（如「學」可組成學習、學校、學生）

### 排除標準

1. ❌ 單字詞（如：我、你、他）
2. ❌ 超過 4 個字的詞
3. ❌ 極少使用的專業術語
4. ❌ 同義詞過多導致混淆

## 詞庫統計

### 目標詞彙量

| HSK 級別 | 目標詞數 | 當前進度 |
|----------|----------|----------|
| HSK 1    | 150      | 20 (13%) |
| HSK 2    | 150      | 0 (0%)   |
| HSK 3    | 300      | 0 (0%)   |
| HSK 4    | 300      | 0 (0%)   |
| HSK 5    | 600      | 0 (0%)   |
| HSK 6    | 600      | 0 (0%)   |
| **總計** | **2100** | **20**   |

### 字符覆蓋率

確保常用字能組成多個詞語：

- 學：學習、學校、學生 ✓
- 國：中國、美國、國家 ✓
- 人：家人、朋友、人們 ✓

## 常見問題

### Q: 為什麼只有 2-4 字的詞？

A: 遊戲機制限制。單字無法「組合」，超過 4 字在方塊上難以排列。

### Q: 如何確定 frequency 值？

A: 基於詞頻統計和 HSK 級別：
- HSK 1-2：0.8-1.0
- HSK 3-4：0.6-0.8
- HSK 5-6：0.4-0.6

### Q: 成語如何處理？

A: 四字成語標記 `isIdiom: true`，並獲得額外分數獎勵。

### Q: 是否支持繁體字？

A: 當前使用簡體字。未來版本可能添加繁簡切換功能。

## 維護清單

- [ ] 完成 HSK 1 詞庫（150 詞）
- [ ] 完成 HSK 2 詞庫（150 詞）
- [ ] 添加自動化測試
- [ ] 建立 CSV → JSON 轉換工具
- [ ] 添加拼音自動標注
- [ ] 校對所有例句

## 貢獻指南

歡迎貢獻詞庫！請遵循：

1. 確保詞語來自權威來源
2. 提供準確的拼音和定義
3. 例句簡單易懂
4. 通過驗證測試

詳見 [貢獻指南](../../.github/ISSUE_TEMPLATE/word_database.md)
