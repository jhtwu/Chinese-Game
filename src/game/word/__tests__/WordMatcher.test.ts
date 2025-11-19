/**
 * WordMatcher 詞語匹配器測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { WordMatcher } from '../WordMatcher';
import { createEmptyGrid } from '../../core/Grid';
import { Word, Grid } from '@/types';

describe('WordMatcher', () => {
  let wordMatcher: WordMatcher;
  let testWords: Word[];

  beforeEach(() => {
    // 準備測試詞庫
    testWords = [
      {
        id: 'xuéxí',
        word: '學習',
        characters: ['學', '習'],
        pinyin: 'xué xí',
        pinyinArray: ['xué', 'xí'],
        hskLevel: 1,
        category: 'education',
        definition: { en: 'to study', zh: '學習' },
        frequency: 0.95,
        isIdiom: false,
      },
      {
        id: 'xuéxiào',
        word: '學校',
        characters: ['學', '校'],
        pinyin: 'xué xiào',
        pinyinArray: ['xué', 'xiào'],
        hskLevel: 1,
        category: 'education',
        definition: { en: 'school', zh: '學校' },
        frequency: 0.92,
        isIdiom: false,
      },
      {
        id: 'túshūguǎn',
        word: '圖書館',
        characters: ['圖', '書', '館'],
        pinyin: 'tú shū guǎn',
        pinyinArray: ['tú', 'shū', 'guǎn'],
        hskLevel: 2,
        category: 'education',
        definition: { en: 'library', zh: '圖書館' },
        frequency: 0.85,
        isIdiom: false,
      },
      {
        id: 'yīxīnyīyì',
        word: '一心一意',
        characters: ['一', '心', '一', '意'],
        pinyin: 'yī xīn yī yì',
        pinyinArray: ['yī', 'xīn', 'yī', 'yì'],
        hskLevel: 4,
        category: 'emotion',
        definition: { en: 'wholeheartedly', zh: '一心一意' },
        frequency: 0.75,
        isIdiom: true,
      },
      {
        id: 'shēnghuó',
        word: '生活',
        characters: ['生', '活'],
        pinyin: 'shēng huó',
        pinyinArray: ['shēng', 'huó'],
        hskLevel: 1,
        category: 'other',
        definition: { en: 'life', zh: '生活' },
        frequency: 0.9,
        isIdiom: false,
      },
    ];

    wordMatcher = new WordMatcher(testWords);
  });

  describe('constructor', () => {
    it('should create word matcher with words', () => {
      expect(wordMatcher).toBeDefined();
      expect(wordMatcher.getWordCount()).toBe(5);
    });

    it('should create empty word matcher', () => {
      const emptyMatcher = new WordMatcher([]);
      expect(emptyMatcher.getWordCount()).toBe(0);
    });

    it('should accept custom config', () => {
      const customMatcher = new WordMatcher(testWords, {
        minWordLength: 3,
        maxWordLength: 5,
      });
      expect(customMatcher).toBeDefined();
    });
  });

  describe('findMatches - horizontal', () => {
    it('should find horizontal 2-character word', () => {
      const grid = createEmptyGrid();

      // 在第一行放置 "學習"
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '習';
      grid[0][1].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('學習');
      expect(matches[0].direction).toBe('horizontal');
      expect(matches[0].positions).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ]);
    });

    it('should find horizontal 3-character word', () => {
      const grid = createEmptyGrid();

      // 在第一行放置 "圖書館"
      grid[0][0].occupied = true;
      grid[0][0].character = '圖';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '書';
      grid[0][1].locked = true;

      grid[0][2].occupied = true;
      grid[0][2].character = '館';
      grid[0][2].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('圖書館');
      expect(matches[0].direction).toBe('horizontal');
      expect(matches[0].positions).toHaveLength(3);
    });

    it('should find horizontal 4-character word (idiom)', () => {
      const grid = createEmptyGrid();

      // 在第一行放置 "一心一意"
      const chars = ['一', '心', '一', '意'];
      chars.forEach((char, index) => {
        grid[0][index].occupied = true;
        grid[0][index].character = char;
        grid[0][index].locked = true;
      });

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('一心一意');
      expect(matches[0].word.isIdiom).toBe(true);
      expect(matches[0].direction).toBe('horizontal');
    });

    it('should find multiple horizontal words in same row', () => {
      const grid = createEmptyGrid();

      // 放置 "學習" (0-1) 和 "生活" (3-4)，中間空一格
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '習';
      grid[0][1].locked = true;

      grid[0][3].occupied = true;
      grid[0][3].character = '生';
      grid[0][3].locked = true;

      grid[0][4].occupied = true;
      grid[0][4].character = '活';
      grid[0][4].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(2);
      const words = matches.map(m => m.word.word).sort();
      expect(words).toEqual(['學習', '生活'].sort());
    });

    it('should not find word interrupted by empty cell', () => {
      const grid = createEmptyGrid();

      // 放置 "學" 和 "習"，但中間有空格
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][2].occupied = true;
      grid[0][2].character = '習';
      grid[0][2].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(0);
    });
  });

  describe('findMatches - vertical', () => {
    it('should find vertical 2-character word', () => {
      const grid = createEmptyGrid();

      // 在第一列放置 "學習"
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[1][0].occupied = true;
      grid[1][0].character = '習';
      grid[1][0].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('學習');
      expect(matches[0].direction).toBe('vertical');
      expect(matches[0].positions).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ]);
    });

    it('should find vertical 3-character word', () => {
      const grid = createEmptyGrid();

      // 在第一列放置 "圖書館"
      const chars = ['圖', '書', '館'];
      chars.forEach((char, index) => {
        grid[index][0].occupied = true;
        grid[index][0].character = char;
        grid[index][0].locked = true;
      });

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('圖書館');
      expect(matches[0].direction).toBe('vertical');
    });

    it('should not find word interrupted by empty cell vertically', () => {
      const grid = createEmptyGrid();

      // 放置 "學" 和 "習"，但中間有空格
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[2][0].occupied = true;
      grid[2][0].character = '習';
      grid[2][0].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(0);
    });
  });

  describe('findMatches - mixed directions', () => {
    it('should find both horizontal and vertical words', () => {
      const grid = createEmptyGrid();

      // 橫向放置 "學習" 在 (0, 0)
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '習';
      grid[0][1].locked = true;

      // 縱向放置 "生活" 在 (3, 0)
      grid[0][3].occupied = true;
      grid[0][3].character = '生';
      grid[0][3].locked = true;

      grid[1][3].occupied = true;
      grid[1][3].character = '活';
      grid[1][3].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(2);
      expect(matches.some(m => m.direction === 'horizontal')).toBe(true);
      expect(matches.some(m => m.direction === 'vertical')).toBe(true);
    });
  });

  describe('deduplication and sorting', () => {
    it('should prefer longer words over shorter ones', () => {
      // 添加更多測試詞
      const extendedWords = [
        ...testWords,
        {
          id: 'xué',
          word: '學',
          characters: ['學'],
          pinyin: 'xué',
          pinyinArray: ['xué'],
          hskLevel: 1,
          category: 'education',
          definition: { en: 'study', zh: '學' },
          frequency: 0.8,
          isIdiom: false,
        },
      ];

      const matcher = new WordMatcher(extendedWords);
      const grid = createEmptyGrid();

      // 放置 "學習"，這樣 "學" 和 "學習" 都能匹配
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '習';
      grid[0][1].locked = true;

      const matches = matcher.findMatches(grid);

      // 應該優先選擇較長的 "學習" 而非 "學"
      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('學習');
    });

    it('should handle overlapping words correctly', () => {
      const grid = createEmptyGrid();

      // 創建一個場景：學校習
      // 可能的匹配：學校(0-1), 校習(如果存在)
      // 只有學校存在，所以應該只匹配學校
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '校';
      grid[0][1].locked = true;

      grid[0][2].occupied = true;
      grid[0][2].character = '習';
      grid[0][2].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('學校');
    });
  });

  describe('score calculation', () => {
    it('should calculate correct scores for different word lengths', () => {
      const grid = createEmptyGrid();

      // 2字詞：學習 (基礎分 10 + HSK1*2 = 12)
      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '習';
      grid[0][1].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches[0].score).toBe(12); // 10 + 1*2
    });

    it('should give bonus for idioms', () => {
      const grid = createEmptyGrid();

      // 4字成語：一心一意 (基礎分 40 + 成語獎勵 20 + HSK4*2 = 68)
      const chars = ['一', '心', '一', '意'];
      chars.forEach((char, index) => {
        grid[0][index].occupied = true;
        grid[0][index].character = char;
        grid[0][index].locked = true;
      });

      const matches = wordMatcher.findMatches(grid);

      expect(matches[0].score).toBe(68); // 40 + 20 + 4*2
    });
  });

  describe('reload', () => {
    it('should reload with new words', () => {
      expect(wordMatcher.getWordCount()).toBe(5);

      const newWords = testWords.slice(0, 2);
      wordMatcher.reload(newWords);

      expect(wordMatcher.getWordCount()).toBe(2);
    });

    it('should find new words after reload', () => {
      const newWord: Word = {
        id: 'zhōngwén',
        word: '中文',
        characters: ['中', '文'],
        pinyin: 'zhōng wén',
        pinyinArray: ['zhōng', 'wén'],
        hskLevel: 1,
        category: 'language',
        definition: { en: 'Chinese', zh: '中文' },
        frequency: 0.98,
        isIdiom: false,
      };

      wordMatcher.reload([newWord]);

      const grid = createEmptyGrid();
      grid[0][0].occupied = true;
      grid[0][0].character = '中';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = '文';
      grid[0][1].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(1);
      expect(matches[0].word.word).toBe('中文');
    });
  });

  describe('edge cases', () => {
    it('should handle empty grid', () => {
      const grid = createEmptyGrid();
      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(0);
    });

    it('should handle grid with no valid words', () => {
      const grid = createEmptyGrid();

      // 放置一些隨機字符（不構成詞語）
      grid[0][0].occupied = true;
      grid[0][0].character = 'X';
      grid[0][0].locked = true;

      grid[0][1].occupied = true;
      grid[0][1].character = 'Y';
      grid[0][1].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(0);
    });

    it('should handle single character (too short)', () => {
      const grid = createEmptyGrid();

      grid[0][0].occupied = true;
      grid[0][0].character = '學';
      grid[0][0].locked = true;

      const matches = wordMatcher.findMatches(grid);

      expect(matches).toHaveLength(0);
    });

    it('should handle full grid', () => {
      const grid = createEmptyGrid();

      // 填滿整個網格，但只有部分區域形成詞語
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          grid[row][col].occupied = true;
          grid[row][col].character = 'X';
          grid[row][col].locked = true;
        }
      }

      // 在某處放置真正的詞語
      grid[2][2].character = '學';
      grid[2][3].character = '習';

      const matches = wordMatcher.findMatches(grid);

      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(matches.some(m => m.word.word === '學習')).toBe(true);
    });
  });
});
