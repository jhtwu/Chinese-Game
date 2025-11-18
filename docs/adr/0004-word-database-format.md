# ADR-0004: 詞庫數據格式與存儲方案

## 狀態
✅ 接受

## 背景

遊戲核心依賴中文詞庫，需要存儲和快速查詢數千個詞語。

**問題陳述**：
- 需要存儲 1200+ 詞語（HSK 1-6）
- 需要支持多維度查詢（HSK 級別、分類、字符）
- 需要快速加載（< 1s）
- 需要易於維護和擴展
- 需要支持離線使用

**限制條件**：
- 瀏覽器環境，無後端數據庫
- 數據大小需合理（< 200KB）
- 查詢性能要求高（< 10ms）

## 決策

我們決定採用 **JSON 格式 + 內存索引** 方案。

**數據格式**：
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-18",
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

**存儲方式**：
- 靜態 JSON 文件（`data/words/hsk-{level}.json`）
- 構建時合併為單一文件（可選分級加載）
- 內存中構建索引（Trie + Map）

**理由**：

1. **JSON 格式優勢**
   - 人類可讀，易於維護
   - JavaScript 原生支持
   - 工具鏈完善（校驗、格式化）
   - 可版本控制（Git friendly）

2. **靜態文件優勢**
   - 無需後端，純前端
   - 可 CDN 加速
   - 瀏覽器緩存友好
   - 支持離線（PWA）

3. **性能考量**
   - 1200 詞 × 200 字節/詞 ≈ 240KB（可接受）
   - Gzip 壓縮後 ~60-80KB
   - 一次加載，內存緩存
   - 索引構建 < 100ms

4. **查詢優化**
   - 字典樹（Trie）：O(L) 查詢
   - Map 索引：O(1) 查詢
   - 支持多維度索引

## 後果

### 正面影響
- ✅ 開發體驗好，易於編輯和維護
- ✅ 無需後端，降低複雜度
- ✅ 性能滿足需求
- ✅ 支持離線使用
- ✅ 可版本控制，協作友好
- ✅ 擴展方便（添加新詞）

### 負面影響
- ⚠️ **數據更新需要重新部署**
  - **緩解**：未來可添加增量更新機制
- ⚠️ **大詞庫可能影響首次加載**
  - **緩解**：分級加載（按 HSK 級別）
- ⚠️ **無法動態用戶詞庫**（短期）
  - **緩解**：V2 可添加用戶自定義詞庫

### 風險
- **數據一致性**：手動編輯可能出錯
  - **應對**：JSON Schema 校驗 + 單元測試
- **性能瓶頸**：詞庫持續增長
  - **應對**：監控 Bundle 大小，必要時分片加載

## 替代方案

### 方案 A：SQLite (sql.js)
- **優點**：
  - 關係型數據庫，查詢強大
  - 支持 SQL
  - 索引高效
- **缺點**：
  - Bundle 大（~500KB）
  - 配置複雜
  - 對簡單查詢過度設計
  - 瀏覽器支持有限
- **為何未選擇**：過於重量級

### 方案 B：IndexedDB
- **優點**：
  - 瀏覽器原生
  - 存儲容量大
  - 異步 API
- **缺點**：
  - API 複雜
  - 需要異步加載
  - 跨瀏覽器兼容性問題
  - 對靜態數據過度設計
- **為何未選擇**：不適合靜態只讀數據

### 方案 C：CSV 格式
- **優點**：
  - 文件更小
  - Excel 可編輯
- **缺點**：
  - 不支持嵌套結構
  - 需要解析庫
  - 不支持多語言定義
  - 可讀性差
- **為何未選擇**：功能不足

### 方案 D：後端 API
- **優點**：
  - 動態更新
  - 無限擴展
  - 支持用戶詞庫
- **缺點**：
  - 需要後端服務器
  - 網絡依賴
  - 成本增加
  - 延遲問題
- **為何未選擇**：階段 1 無需後端

## 實現細節

### 數據校驗（JSON Schema）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "lastUpdated", "words"],
  "properties": {
    "words": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "word", "characters", "pinyin", "hskLevel"],
        "properties": {
          "hskLevel": {
            "type": "integer",
            "minimum": 1,
            "maximum": 6
          }
        }
      }
    }
  }
}
```

### 索引構建

```typescript
class WordDatabase {
  private words: Word[];
  private trie: Trie;
  private indexByHSK: Map<number, Word[]>;
  private indexByCategory: Map<string, Word[]>;
  private indexByChar: Map<string, Word[]>;

  async load(): Promise<void> {
    const response = await fetch('/data/words/all.json');
    const data = await response.json();
    this.words = data.words;
    this.buildIndexes();
  }

  private buildIndexes(): void {
    // 字典樹索引
    this.trie = new Trie();
    this.words.forEach(word => this.trie.insert(word.word, word));

    // HSK 級別索引
    this.indexByHSK = new Map();
    this.words.forEach(word => {
      if (!this.indexByHSK.has(word.hskLevel)) {
        this.indexByHSK.set(word.hskLevel, []);
      }
      this.indexByHSK.get(word.hskLevel)!.push(word);
    });

    // 字符索引
    this.indexByChar = new Map();
    this.words.forEach(word => {
      word.characters.forEach(char => {
        if (!this.indexByChar.has(char)) {
          this.indexByChar.set(char, []);
        }
        this.indexByChar.get(char)!.push(word);
      });
    });
  }

  search(text: string): Word | null {
    return this.trie.search(text);
  }

  getByHSK(level: number): Word[] {
    return this.indexByHSK.get(level) || [];
  }

  getWordsWithChar(char: string): Word[] {
    return this.indexByChar.get(char) || [];
  }
}
```

### 分級加載（可選優化）

```typescript
// 按需加載不同 HSK 級別
async function loadWordsByHSK(levels: number[]): Promise<Word[]> {
  const promises = levels.map(level =>
    fetch(`/data/words/hsk-${level}.json`).then(r => r.json())
  );
  const results = await Promise.all(promises);
  return results.flatMap(r => r.words);
}
```

### 數據更新工作流

```bash
# 1. 編輯 CSV（易於批量編輯）
vim data/source/hsk-1.csv

# 2. 轉換為 JSON
npm run convert-words

# 3. 校驗數據
npm run validate-words

# 4. 提交
git add data/words/*.json
git commit -m "feat: add 10 new HSK-1 words"
```

## 數據來源

- **主要**：[HSK 官方詞表](http://www.chinesetest.cn/)
- **輔助**：常用漢語詞典
- **校驗**：人工審核 + 自動化測試

## 未來擴展

### V2：用戶自定義詞庫
```typescript
interface CustomWordDatabase {
  words: Word[];
  source: 'official' | 'user';
}

// 合併官方和用戶詞庫
const allWords = [...officialWords, ...userWords];
```

### V3：增量更新
```typescript
// 檢查版本
if (localVersion < remoteVersion) {
  const delta = await fetch(`/api/words/delta?from=${localVersion}`);
  applyDelta(delta);
}
```

## 參考資料
- [HSK 詞表下載](http://www.chinesetest.cn/)
- [JSON Schema 規範](https://json-schema.org/)
- [字典樹（Trie）算法](https://en.wikipedia.org/wiki/Trie)

---

**決策者**：開發團隊
**決策日期**：2025-11-18
**最後更新**：2025-11-18
