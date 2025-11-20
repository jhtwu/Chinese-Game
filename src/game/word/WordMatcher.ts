/**
 * WordMatcher - 詞語匹配器
 * 在遊戲網格中檢測所有有效的中文詞語（橫向和縱向）
 * 時間複雜度：O(W * H * L) 其中 W=寬度, H=高度, L=最大詞長(4)
 */

import { Word, Grid, Match, Position } from '@/types';
import { Trie } from './Trie';
import { GRID_WIDTH, GRID_HEIGHT } from '../core/Grid';

/**
 * 詞語匹配器配置
 */
export interface WordMatcherConfig {
  minWordLength: number; // 最小詞長
  maxWordLength: number; // 最大詞長
  twoCharWordScore?: number; // 2字詞分數
  threeCharWordScore?: number; // 3字詞分數
  fourCharWordScore?: number; // 4字詞分數
  idiomBonus?: number; // 成語額外獎勵
  hskLevelBonus?: number; // HSK級別加成
}

/**
 * 默認配置
 */
const DEFAULT_CONFIG: WordMatcherConfig = {
  minWordLength: 2,
  maxWordLength: 4,
  twoCharWordScore: 10,
  threeCharWordScore: 20,
  fourCharWordScore: 40,
  idiomBonus: 20,
  hskLevelBonus: 2,
};

/**
 * 詞語匹配器類
 */
export class WordMatcher {
  private trie: Trie;
  private config: WordMatcherConfig;

  constructor(words: Word[], config: Partial<WordMatcherConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.trie = new Trie();

    // 構建字典樹
    words.forEach(word => {
      this.trie.insert(word.word, word);
    });
  }

  /**
   * 查找網格中所有匹配的詞語
   * @param grid - 遊戲網格
   * @returns 匹配的詞語數組（已去重和排序）
   */
  findMatches(grid: Grid): Match[] {
    const matches: Match[] = [];

    // 1. 橫向掃描
    for (let row = 0; row < GRID_HEIGHT; row++) {
      matches.push(...this.scanRow(grid, row));
    }

    // 2. 縱向掃描
    for (let col = 0; col < GRID_WIDTH; col++) {
      matches.push(...this.scanColumn(grid, col));
    }

    // 3. 去重和優先級排序
    return this.deduplicateAndSort(matches);
  }

  /**
   * 掃描一行查找詞語
   * @param grid - 遊戲網格
   * @param row - 行索引
   * @returns 該行找到的所有匹配
   */
  private scanRow(grid: Grid, row: number): Match[] {
    const matches: Match[] = [];
    const rowCells = grid[row];

    // 提取該行所有字符
    const characters: (string | null)[] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (rowCells[col].occupied && rowCells[col].character) {
        characters.push(rowCells[col].character);
      } else {
        characters.push(null);
      }
    }

    // 使用滑動窗口查找詞語
    for (let start = 0; start < characters.length; start++) {
      if (!characters[start]) continue;

      for (
        let length = this.config.minWordLength;
        length <= this.config.maxWordLength;
        length++
      ) {
        if (start + length > characters.length) break;

        const substring = characters.slice(start, start + length);

        // 包含 null（空格），跳過
        if (substring.includes(null)) continue;

        const wordString = substring.join('');
        const wordData = this.trie.search(wordString);

        if (wordData) {
          matches.push({
            word: wordData,
            positions: this.getHorizontalPositions(row, start, length),
            direction: 'horizontal',
            score: this.calculateScore(wordData),
          });
        }
      }
    }

    return matches;
  }

  /**
   * 掃描一列查找詞語
   * @param grid - 遊戲網格
   * @param col - 列索引
   * @returns 該列找到的所有匹配
   */
  private scanColumn(grid: Grid, col: number): Match[] {
    const matches: Match[] = [];

    // 提取該列所有字符
    const characters: (string | null)[] = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      if (grid[row][col].occupied && grid[row][col].character) {
        characters.push(grid[row][col].character);
      } else {
        characters.push(null);
      }
    }

    // 使用滑動窗口查找詞語
    for (let start = 0; start < characters.length; start++) {
      if (!characters[start]) continue;

      for (
        let length = this.config.minWordLength;
        length <= this.config.maxWordLength;
        length++
      ) {
        if (start + length > characters.length) break;

        const substring = characters.slice(start, start + length);

        // 包含 null（空格），跳過
        if (substring.includes(null)) continue;

        const wordString = substring.join('');
        const wordData = this.trie.search(wordString);

        if (wordData) {
          matches.push({
            word: wordData,
            positions: this.getVerticalPositions(col, start, length),
            direction: 'vertical',
            score: this.calculateScore(wordData),
          });
        }
      }
    }

    return matches;
  }

  /**
   * 獲取橫向位置數組
   */
  private getHorizontalPositions(
    row: number,
    startCol: number,
    length: number
  ): Position[] {
    const positions: Position[] = [];
    for (let i = 0; i < length; i++) {
      positions.push({ x: startCol + i, y: row });
    }
    return positions;
  }

  /**
   * 獲取縱向位置數組
   */
  private getVerticalPositions(
    col: number,
    startRow: number,
    length: number
  ): Position[] {
    const positions: Position[] = [];
    for (let i = 0; i < length; i++) {
      positions.push({ x: col, y: startRow + i });
    }
    return positions;
  }

  /**
   * 計算詞語分數
   * @param word - 詞語數據
   * @returns 分數
   */
  private calculateScore(word: Word): number {
    const length = word.characters.length;
    let baseScore = 0;

    // 根據詞長計算基礎分數
    switch (length) {
      case 2:
        baseScore = this.config.twoCharWordScore!;
        break;
      case 3:
        baseScore = this.config.threeCharWordScore!;
        break;
      case 4:
        baseScore = this.config.fourCharWordScore!;
        break;
      default:
        baseScore = length * 5;
    }

    // 成語額外獎勵
    if (word.isIdiom) {
      baseScore += this.config.idiomBonus!;
    }

    // HSK 級別加成（高級別詞彙給予額外分數）
    const hskBonus = word.hskLevel * this.config.hskLevelBonus!;

    return baseScore + hskBonus;
  }

  /**
   * 去重和排序
   * 策略：
   * 1. 優先選擇長詞（4字 > 3字 > 2字）
   * 2. 同長度優先選擇高分詞
   * 3. 去除重疊的詞（貪心算法）
   *
   * @param matches - 所有匹配的詞語
   * @returns 去重後的詞語數組
   */
  private deduplicateAndSort(matches: Match[]): Match[] {
    // 按分數降序排序（長詞和高分詞優先）
    matches.sort((a, b) => {
      // 先按詞長排序
      const lengthDiff =
        b.word.characters.length - a.word.characters.length;
      if (lengthDiff !== 0) return lengthDiff;

      // 詞長相同，按分數排序
      return b.score - a.score;
    });

    const selected: Match[] = [];
    const occupiedPositions = new Set<string>();

    for (const match of matches) {
      // 檢查是否與已選詞語重疊
      const hasOverlap = match.positions.some(pos =>
        occupiedPositions.has(`${pos.x},${pos.y}`)
      );

      if (!hasOverlap) {
        selected.push(match);
        // 標記這些位置已被佔用
        match.positions.forEach(pos =>
          occupiedPositions.add(`${pos.x},${pos.y}`)
        );
      }
    }

    return selected;
  }

  /**
   * 重新加載詞庫
   * @param words - 新的詞語數組
   */
  reload(words: Word[]): void {
    this.trie.clear();
    words.forEach(word => {
      this.trie.insert(word.word, word);
    });
  }

  /**
   * 獲取詞庫大小
   */
  getWordCount(): number {
    return this.trie.size();
  }
}
