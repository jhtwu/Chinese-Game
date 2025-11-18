#!/usr/bin/env node

/**
 * 詞庫驗證腳本
 * 驗證詞庫 JSON 文件的格式和內容
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function validateWordFile(filePath) {
  log(colors.blue, `\n📖 驗證文件: ${path.basename(filePath)}`);

  let data;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch (error) {
    log(colors.red, `❌ JSON 解析失敗: ${error.message}`);
    return false;
  }

  let errors = 0;
  let warnings = 0;

  // 檢查必需字段
  const requiredFields = ['version', 'lastUpdated', 'hskLevel', 'totalWords', 'words'];
  for (const field of requiredFields) {
    if (!data[field]) {
      log(colors.red, `❌ 缺少必需字段: ${field}`);
      errors++;
    }
  }

  // 檢查版本格式
  if (data.version && !/^\d+\.\d+\.\d+$/.test(data.version)) {
    log(colors.red, `❌ 版本號格式錯誤: ${data.version}（應為 x.y.z）`);
    errors++;
  }

  // 檢查日期格式
  if (data.lastUpdated && !/^\d{4}-\d{2}-\d{2}$/.test(data.lastUpdated)) {
    log(colors.red, `❌ 日期格式錯誤: ${data.lastUpdated}（應為 YYYY-MM-DD）`);
    errors++;
  }

  // 檢查 HSK 級別
  if (data.hskLevel && (data.hskLevel < 1 || data.hskLevel > 6)) {
    log(colors.red, `❌ HSK 級別無效: ${data.hskLevel}（應為 1-6）`);
    errors++;
  }

  // 檢查詞語數量
  if (data.totalWords !== data.words?.length) {
    log(
      colors.yellow,
      `⚠️  totalWords (${data.totalWords}) 與實際詞語數量 (${data.words?.length}) 不符`
    );
    warnings++;
  }

  // 驗證每個詞語
  if (Array.isArray(data.words)) {
    const ids = new Set();

    data.words.forEach((word, index) => {
      const prefix = `詞語 #${index + 1} (${word.word || 'unknown'})`;

      // 必需字段
      const wordRequiredFields = [
        'id',
        'word',
        'characters',
        'pinyin',
        'pinyinArray',
        'hskLevel',
        'category',
        'definition',
        'frequency',
        'isIdiom',
      ];

      for (const field of wordRequiredFields) {
        if (word[field] === undefined || word[field] === null) {
          log(colors.red, `❌ ${prefix}: 缺少字段 ${field}`);
          errors++;
        }
      }

      // ID 唯一性
      if (word.id) {
        if (ids.has(word.id)) {
          log(colors.red, `❌ ${prefix}: ID 重複 "${word.id}"`);
          errors++;
        }
        ids.add(word.id);
      }

      // 字符陣列驗證
      if (word.characters && word.word) {
        const joined = word.characters.join('');
        if (joined !== word.word) {
          log(
            colors.red,
            `❌ ${prefix}: characters 組合 "${joined}" 不等於 word "${word.word}"`
          );
          errors++;
        }

        if (word.characters.length < 2 || word.characters.length > 4) {
          log(
            colors.yellow,
            `⚠️  ${prefix}: 字符數量 ${word.characters.length} 不在 2-4 範圍內`
          );
          warnings++;
        }
      }

      // 拼音陣列驗證
      if (word.pinyinArray && word.characters) {
        if (word.pinyinArray.length !== word.characters.length) {
          log(
            colors.red,
            `❌ ${prefix}: pinyinArray 長度 (${word.pinyinArray.length}) 不等於 characters 長度 (${word.characters.length})`
          );
          errors++;
        }
      }

      // HSK 級別驗證
      if (word.hskLevel && (word.hskLevel < 1 || word.hskLevel > 6)) {
        log(colors.red, `❌ ${prefix}: HSK 級別無效 ${word.hskLevel}`);
        errors++;
      }

      // 文件級 HSK 與詞語 HSK 一致性
      if (word.hskLevel && data.hskLevel && word.hskLevel !== data.hskLevel) {
        log(
          colors.yellow,
          `⚠️  ${prefix}: HSK 級別 ${word.hskLevel} 與文件級別 ${data.hskLevel} 不一致`
        );
        warnings++;
      }

      // 頻率範圍
      if (word.frequency !== undefined && (word.frequency < 0 || word.frequency > 1)) {
        log(colors.red, `❌ ${prefix}: frequency ${word.frequency} 不在 0-1 範圍內`);
        errors++;
      }

      // 定義驗證
      if (word.definition) {
        if (!word.definition.en || !word.definition.zh) {
          log(colors.red, `❌ ${prefix}: definition 缺少 en 或 zh 字段`);
          errors++;
        }
      }

      // 例句建議
      if (!word.example) {
        log(colors.yellow, `⚠️  ${prefix}: 建議添加例句 (example)`);
        warnings++;
      }
    });
  }

  // 輸出結果
  console.log('\n' + '='.repeat(60));
  if (errors === 0 && warnings === 0) {
    log(colors.green, `✅ 驗證通過！無錯誤，無警告。`);
    return true;
  } else if (errors === 0) {
    log(colors.yellow, `⚠️  驗證通過，但有 ${warnings} 個警告。`);
    return true;
  } else {
    log(colors.red, `❌ 驗證失敗！${errors} 個錯誤，${warnings} 個警告。`);
    return false;
  }
}

// 主函數
function main() {
  log(colors.blue, '\n🔍 開始驗證詞庫文件...\n');

  const wordsDir = path.join(__dirname, '../data/words');
  const files = fs.readdirSync(wordsDir).filter((f) => f.endsWith('.json') && f !== 'schema.json');

  if (files.length === 0) {
    log(colors.yellow, '⚠️  未找到詞庫文件。');
    process.exit(0);
  }

  let allPassed = true;

  for (const file of files) {
    const filePath = path.join(wordsDir, file);
    const passed = validateWordFile(filePath);
    if (!passed) {
      allPassed = false;
    }
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log(colors.green, '\n✅ 所有文件驗證通過！\n');
    process.exit(0);
  } else {
    log(colors.red, '\n❌ 部分文件驗證失敗，請修復後再試。\n');
    process.exit(1);
  }
}

main();
