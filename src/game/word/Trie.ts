/**
 * Trie（字典樹）數據結構
 * 用於高效查找中文詞語
 * 時間複雜度：O(L) 其中 L 為詞語長度
 */

import { Word } from '@/types';

/**
 * Trie 節點
 */
export class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
  data: Word | null;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.data = null;
  }
}

/**
 * Trie 字典樹
 */
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * 插入詞語到字典樹
   * @param word - 詞語字符串
   * @param data - 詞語數據
   */
  insert(word: string, data: Word): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEnd = true;
    node.data = data;
  }

  /**
   * 查找詞語
   * @param word - 詞語字符串
   * @returns 詞語數據，如果不存在則返回 null
   */
  search(word: string): Word | null {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }

    return node.isEnd ? node.data : null;
  }

  /**
   * 檢查是否存在以指定前綴開頭的詞語
   * @param prefix - 前綴字符串
   * @returns 是否存在該前綴
   */
  startsWith(prefix: string): boolean {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return true;
  }

  /**
   * 獲取所有以指定前綴開頭的詞語
   * @param prefix - 前綴字符串
   * @returns 符合條件的詞語數組
   */
  getWordsWithPrefix(prefix: string): Word[] {
    const results: Word[] = [];
    let node = this.root;

    // 先找到前綴節點
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return results;
      }
      node = node.children.get(char)!;
    }

    // 從前綴節點開始 DFS 收集所有詞語
    this.collectWords(node, results);
    return results;
  }

  /**
   * DFS 收集所有詞語
   * @param node - 當前節點
   * @param results - 結果數組
   */
  private collectWords(node: TrieNode, results: Word[]): void {
    if (node.isEnd && node.data) {
      results.push(node.data);
    }

    for (const child of node.children.values()) {
      this.collectWords(child, results);
    }
  }

  /**
   * 清空字典樹
   */
  clear(): void {
    this.root = new TrieNode();
  }

  /**
   * 獲取字典樹中的詞語數量
   */
  size(): number {
    return this.countWords(this.root);
  }

  /**
   * 遞歸計算詞語數量
   */
  private countWords(node: TrieNode): number {
    let count = node.isEnd ? 1 : 0;

    for (const child of node.children.values()) {
      count += this.countWords(child);
    }

    return count;
  }
}
