/**
 * Tetromino 方塊單元測試
 */

import { describe, it, expect } from 'vitest';
import { TetrominoType } from '@/types';
import {
  createTetromino,
  rotateTetromino,
  moveTetromino,
  assignCharactersToTetromino,
  getTetrominoBlocks,
  getTetrominoBounds,
} from '../Tetromino';
import { getTetrominoShape, getRandomTetrominoType } from '../tetrominoShapes';

describe('Tetromino', () => {
  describe('createTetromino', () => {
    it('should create a tetromino with default parameters', () => {
      const tetromino = createTetromino();

      expect(tetromino).toBeDefined();
      expect(tetromino.type).toBeDefined();
      expect(tetromino.rotation).toBe(0);
      expect(tetromino.position).toEqual({ x: 3, y: 0 });
      expect(tetromino.shape).toBeDefined();
      expect(tetromino.color).toBeDefined();
    });

    it('should create an I-type tetromino', () => {
      const tetromino = createTetromino(TetrominoType.I);

      expect(tetromino.type).toBe(TetrominoType.I);
      expect(tetromino.color).toBe('#00F0F0');
    });

    it('should create a tetromino at custom position', () => {
      const customPos = { x: 5, y: 10 };
      const tetromino = createTetromino(TetrominoType.O, customPos);

      expect(tetromino.position).toEqual(customPos);
    });

    it('should create all 7 tetromino types', () => {
      const types = Object.values(TetrominoType);

      types.forEach((type) => {
        const tetromino = createTetromino(type);
        expect(tetromino.type).toBe(type);
      });
    });
  });

  describe('rotateTetromino', () => {
    it('should rotate I-type tetromino from horizontal to vertical', () => {
      const tetromino = createTetromino(TetrominoType.I);
      expect(tetromino.rotation).toBe(0);

      const rotated = rotateTetromino(tetromino);
      expect(rotated.rotation).toBe(1);
      expect(rotated.shape).toEqual(getTetrominoShape(TetrominoType.I, 1));
    });

    it('should rotate through all 4 states', () => {
      let tetromino = createTetromino(TetrominoType.T);

      for (let i = 1; i <= 4; i++) {
        tetromino = rotateTetromino(tetromino);
        expect(tetromino.rotation).toBe(i % 4);
      }
    });

    it('should keep O-type tetromino unchanged when rotating', () => {
      const tetromino = createTetromino(TetrominoType.O);
      const originalShape = tetromino.shape;

      const rotated = rotateTetromino(tetromino);
      expect(rotated.shape).toEqual(originalShape);
    });
  });

  describe('moveTetromino', () => {
    it('should move tetromino to the right', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const moved = moveTetromino(tetromino, { x: 1, y: 0 });

      expect(moved.position).toEqual({ x: 4, y: 0 });
    });

    it('should move tetromino to the left', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const moved = moveTetromino(tetromino, { x: -1, y: 0 });

      expect(moved.position).toEqual({ x: 2, y: 0 });
    });

    it('should move tetromino down', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const moved = moveTetromino(tetromino, { x: 0, y: 1 });

      expect(moved.position).toEqual({ x: 3, y: 1 });
    });

    it('should not modify original tetromino', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const originalPos = { ...tetromino.position };

      moveTetromino(tetromino, { x: 5, y: 5 });

      expect(tetromino.position).toEqual(originalPos);
    });
  });

  describe('assignCharactersToTetromino', () => {
    it('should assign characters to I-type tetromino', () => {
      const tetromino = createTetromino(TetrominoType.I);
      const characters = ['學', '習', '中', '文'];

      const withChars = assignCharactersToTetromino(tetromino, characters);

      let charCount = 0;
      for (let row = 0; row < withChars.characters.length; row++) {
        for (let col = 0; col < withChars.characters[row].length; col++) {
          if (withChars.characters[row][col]) {
            charCount++;
          }
        }
      }

      expect(charCount).toBe(4);
    });

    it('should assign characters to O-type tetromino', () => {
      const tetromino = createTetromino(TetrominoType.O);
      const characters = ['你', '好', '世', '界'];

      const withChars = assignCharactersToTetromino(tetromino, characters);

      const chars = withChars.characters
        .flat()
        .filter((c): c is string => c !== null);

      expect(chars).toHaveLength(4);
      expect(new Set(chars)).toEqual(new Set(['你']));
    });
  });

  describe('getTetrominoBlocks', () => {
    it('should get all blocks of I-type tetromino at position (3, 0)', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const blocks = getTetrominoBlocks(tetromino);

      expect(blocks).toHaveLength(4);
      expect(blocks).toContainEqual({ x: 3, y: 1 });
      expect(blocks).toContainEqual({ x: 4, y: 1 });
      expect(blocks).toContainEqual({ x: 5, y: 1 });
      expect(blocks).toContainEqual({ x: 6, y: 1 });
    });

    it('should get all blocks of O-type tetromino', () => {
      const tetromino = createTetromino(TetrominoType.O, { x: 0, y: 0 });
      const blocks = getTetrominoBlocks(tetromino);

      expect(blocks).toHaveLength(4);
    });
  });

  describe('getTetrominoBounds', () => {
    it('should calculate bounds for I-type tetromino', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      const bounds = getTetrominoBounds(tetromino);

      expect(bounds.minX).toBe(3);
      expect(bounds.maxX).toBe(6);
      expect(bounds.minY).toBe(1);
      expect(bounds.maxY).toBe(1);
    });
  });

  describe('getRandomTetrominoType', () => {
    it('should return a valid tetromino type', () => {
      const type = getRandomTetrominoType();
      const validTypes = Object.values(TetrominoType);

      expect(validTypes).toContain(type);
    });

    it('should generate different types over multiple calls', () => {
      const types = new Set();

      for (let i = 0; i < 50; i++) {
        types.add(getRandomTetrominoType());
      }

      // 50 次隨機應該至少生成 3 種不同的類型
      expect(types.size).toBeGreaterThanOrEqual(3);
    });
  });
});
