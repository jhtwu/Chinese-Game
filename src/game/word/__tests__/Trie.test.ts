/**
 * Trie 字典樹測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Trie } from '../Trie';
import { Word } from '@/types';

describe('Trie', () => {
  let trie: Trie;

  // 測試數據
  const word1: Word = {
    id: 'xuéxí',
    word: '學習',
    characters: ['學', '習'],
    pinyin: 'xué xí',
    pinyinArray: ['xué', 'xí'],
    hskLevel: 1,
    category: 'education',
    definition: {
      en: 'to study, to learn',
      zh: '學習知識或技能',
    },
    frequency: 0.95,
    isIdiom: false,
  };

  const word2: Word = {
    id: 'xuéxiào',
    word: '學校',
    characters: ['學', '校'],
    pinyin: 'xué xiào',
    pinyinArray: ['xué', 'xiào'],
    hskLevel: 1,
    category: 'education',
    definition: {
      en: 'school',
      zh: '教育機構',
    },
    frequency: 0.92,
    isIdiom: false,
  };

  const word3: Word = {
    id: 'túshūguǎn',
    word: '圖書館',
    characters: ['圖', '書', '館'],
    pinyin: 'tú shū guǎn',
    pinyinArray: ['tú', 'shū', 'guǎn'],
    hskLevel: 2,
    category: 'education',
    definition: {
      en: 'library',
      zh: '收藏圖書的地方',
    },
    frequency: 0.85,
    isIdiom: false,
  };

  beforeEach(() => {
    trie = new Trie();
  });

  describe('constructor', () => {
    it('should create an empty trie', () => {
      expect(trie).toBeDefined();
      expect(trie.size()).toBe(0);
    });
  });

  describe('insert and search', () => {
    it('should insert and find a word', () => {
      trie.insert('學習', word1);
      const result = trie.search('學習');

      expect(result).toBeDefined();
      expect(result?.word).toBe('學習');
      expect(result?.id).toBe('xuéxí');
    });

    it('should return null for non-existent word', () => {
      trie.insert('學習', word1);
      const result = trie.search('學校');

      expect(result).toBeNull();
    });

    it('should handle multiple words with same prefix', () => {
      trie.insert('學習', word1);
      trie.insert('學校', word2);

      const result1 = trie.search('學習');
      const result2 = trie.search('學校');

      expect(result1?.word).toBe('學習');
      expect(result2?.word).toBe('學校');
    });

    it('should handle three-character words', () => {
      trie.insert('圖書館', word3);
      const result = trie.search('圖書館');

      expect(result).toBeDefined();
      expect(result?.word).toBe('圖書館');
      expect(result?.characters).toEqual(['圖', '書', '館']);
    });

    it('should not find partial matches', () => {
      trie.insert('圖書館', word3);

      expect(trie.search('圖')).toBeNull();
      expect(trie.search('圖書')).toBeNull();
    });

    it('should overwrite existing word', () => {
      const modifiedWord1 = { ...word1, frequency: 0.99 };

      trie.insert('學習', word1);
      trie.insert('學習', modifiedWord1);

      const result = trie.search('學習');
      expect(result?.frequency).toBe(0.99);
    });
  });

  describe('startsWith', () => {
    beforeEach(() => {
      trie.insert('學習', word1);
      trie.insert('學校', word2);
      trie.insert('圖書館', word3);
    });

    it('should return true for valid prefix', () => {
      expect(trie.startsWith('學')).toBe(true);
      expect(trie.startsWith('圖')).toBe(true);
      expect(trie.startsWith('圖書')).toBe(true);
    });

    it('should return false for invalid prefix', () => {
      expect(trie.startsWith('中')).toBe(false);
      expect(trie.startsWith('書')).toBe(false);
    });

    it('should return true for complete word', () => {
      expect(trie.startsWith('學習')).toBe(true);
      expect(trie.startsWith('圖書館')).toBe(true);
    });
  });

  describe('getWordsWithPrefix', () => {
    beforeEach(() => {
      trie.insert('學習', word1);
      trie.insert('學校', word2);
      trie.insert('圖書館', word3);
    });

    it('should return all words with given prefix', () => {
      const results = trie.getWordsWithPrefix('學');

      expect(results).toHaveLength(2);
      expect(results.map(w => w.word)).toContain('學習');
      expect(results.map(w => w.word)).toContain('學校');
    });

    it('should return empty array for non-existent prefix', () => {
      const results = trie.getWordsWithPrefix('中');

      expect(results).toHaveLength(0);
    });

    it('should return single word when prefix is complete word', () => {
      const results = trie.getWordsWithPrefix('學習');

      expect(results).toHaveLength(1);
      expect(results[0].word).toBe('學習');
    });

    it('should return empty array when prefix is substring but not complete', () => {
      const results = trie.getWordsWithPrefix('圖書');

      expect(results).toHaveLength(1);
      expect(results[0].word).toBe('圖書館');
    });
  });

  describe('size', () => {
    it('should return 0 for empty trie', () => {
      expect(trie.size()).toBe(0);
    });

    it('should return correct count after insertions', () => {
      trie.insert('學習', word1);
      expect(trie.size()).toBe(1);

      trie.insert('學校', word2);
      expect(trie.size()).toBe(2);

      trie.insert('圖書館', word3);
      expect(trie.size()).toBe(3);
    });

    it('should not increase count when overwriting', () => {
      trie.insert('學習', word1);
      trie.insert('學習', word1);

      expect(trie.size()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all words', () => {
      trie.insert('學習', word1);
      trie.insert('學校', word2);

      expect(trie.size()).toBe(2);

      trie.clear();

      expect(trie.size()).toBe(0);
      expect(trie.search('學習')).toBeNull();
      expect(trie.search('學校')).toBeNull();
    });

    it('should allow inserting after clear', () => {
      trie.insert('學習', word1);
      trie.clear();
      trie.insert('學校', word2);

      expect(trie.size()).toBe(1);
      expect(trie.search('學校')).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty string search', () => {
      trie.insert('學習', word1);
      const result = trie.search('');

      expect(result).toBeNull();
    });

    it('should handle single character word', () => {
      const singleCharWord: Word = {
        ...word1,
        word: '我',
        characters: ['我'],
      };

      trie.insert('我', singleCharWord);
      const result = trie.search('我');

      expect(result).toBeDefined();
      expect(result?.word).toBe('我');
    });

    it('should handle very long word', () => {
      const longWord: Word = {
        ...word1,
        word: '一心一意',
        characters: ['一', '心', '一', '意'],
      };

      trie.insert('一心一意', longWord);
      const result = trie.search('一心一意');

      expect(result).toBeDefined();
      expect(result?.word).toBe('一心一意');
    });
  });
});
