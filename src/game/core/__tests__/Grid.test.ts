/**
 * Grid 網格單元測試
 */

import { describe, it, expect } from 'vitest';
import { TetrominoType } from '@/types';
import {
  createEmptyGrid,
  createEmptyCell,
  isValidPosition,
  isCellOccupied,
  lockTetrominoToGrid,
  clearFullLines,
  isGridFull,
  getGridStats,
  canPlaceTetromino,
  GRID_WIDTH,
  GRID_HEIGHT,
} from '../Grid';
import { createTetromino } from '../Tetromino';

describe('Grid', () => {
  describe('createEmptyGrid', () => {
    it('should create a grid with correct dimensions', () => {
      const grid = createEmptyGrid();

      expect(grid).toHaveLength(GRID_HEIGHT);
      expect(grid[0]).toHaveLength(GRID_WIDTH);
    });

    it('should create a grid with all empty cells', () => {
      const grid = createEmptyGrid();

      grid.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.occupied).toBe(false);
          expect(cell.character).toBeNull();
          expect(cell.color).toBeNull();
          expect(cell.locked).toBe(false);
        });
      });
    });
  });

  describe('createEmptyCell', () => {
    it('should create an empty cell', () => {
      const cell = createEmptyCell();

      expect(cell).toEqual({
        occupied: false,
        character: null,
        color: null,
        locked: false,
      });
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(isValidPosition({ x: 0, y: 0 })).toBe(true);
      expect(isValidPosition({ x: 5, y: 10 })).toBe(true);
      expect(isValidPosition({ x: 9, y: 19 })).toBe(true);
    });

    it('should return false for positions outside the grid', () => {
      expect(isValidPosition({ x: -1, y: 0 })).toBe(false);
      expect(isValidPosition({ x: 0, y: -1 })).toBe(false);
      expect(isValidPosition({ x: 10, y: 0 })).toBe(false);
      expect(isValidPosition({ x: 0, y: 20 })).toBe(false);
      expect(isValidPosition({ x: 15, y: 25 })).toBe(false);
    });
  });

  describe('isCellOccupied', () => {
    it('should return false for empty cell', () => {
      const grid = createEmptyGrid();
      expect(isCellOccupied(grid, { x: 0, y: 0 })).toBe(false);
    });

    it('should return true for occupied cell', () => {
      const grid = createEmptyGrid();
      grid[5][5].occupied = true;

      expect(isCellOccupied(grid, { x: 5, y: 5 })).toBe(true);
    });

    it('should return true for positions outside the grid', () => {
      const grid = createEmptyGrid();

      expect(isCellOccupied(grid, { x: -1, y: 0 })).toBe(true);
      expect(isCellOccupied(grid, { x: 10, y: 0 })).toBe(true);
    });
  });

  describe('lockTetrominoToGrid', () => {
    it('should lock an I-type tetromino to the grid', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.I, { x: 0, y: 0 });

      const newGrid = lockTetrominoToGrid(grid, tetromino);

      // I 型方塊在 (0, 0) 位置，第二行應該有 4 個被佔用的格子
      let occupiedCount = 0;
      for (let col = 0; col < 4; col++) {
        if (newGrid[1][col].occupied) {
          occupiedCount++;
        }
      }

      expect(occupiedCount).toBe(4);
    });

    it('should preserve tetromino color when locking', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.I, { x: 0, y: 0 });
      const tetrominoColor = tetromino.color;

      const newGrid = lockTetrominoToGrid(grid, tetromino);

      expect(newGrid[1][0].color).toBe(tetrominoColor);
    });

    it('should not modify the original grid', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.O, { x: 0, y: 0 });

      lockTetrominoToGrid(grid, tetromino);

      expect(grid[0][1].occupied).toBe(false);
    });
  });

  describe('clearFullLines', () => {
    it('should not clear any lines when grid is empty', () => {
      const grid = createEmptyGrid();
      const { newGrid, clearedLines } = clearFullLines(grid);

      expect(clearedLines).toBe(0);
      expect(newGrid).toEqual(grid);
    });

    it('should clear a full line', () => {
      const grid = createEmptyGrid();

      // 填滿第 19 行（底部）
      for (let col = 0; col < GRID_WIDTH; col++) {
        grid[19][col].occupied = true;
      }

      const { newGrid, clearedLines } = clearFullLines(grid);

      expect(clearedLines).toBe(1);
      expect(newGrid[19].every((cell) => !cell.occupied)).toBe(true);
      expect(newGrid[0].every((cell) => !cell.occupied)).toBe(true);
    });

    it('should clear multiple full lines', () => {
      const grid = createEmptyGrid();

      // 填滿第 18 和 19 行
      for (let row = 18; row < 20; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
          grid[row][col].occupied = true;
        }
      }

      const { newGrid, clearedLines } = clearFullLines(grid);

      expect(clearedLines).toBe(2);
    });

    it('should add empty lines at the top after clearing', () => {
      const grid = createEmptyGrid();

      // 填滿底部兩行
      for (let row = 18; row < 20; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
          grid[row][col].occupied = true;
        }
      }

      const { newGrid } = clearFullLines(grid);

      // 頂部應該是空行
      expect(newGrid[0].every((cell) => !cell.occupied)).toBe(true);
      expect(newGrid[1].every((cell) => !cell.occupied)).toBe(true);
    });
  });

  describe('isGridFull', () => {
    it('should return false for empty grid', () => {
      const grid = createEmptyGrid();
      expect(isGridFull(grid)).toBe(false);
    });

    it('should return true when top rows have locked blocks', () => {
      const grid = createEmptyGrid();
      grid[0][5].locked = true;
      grid[0][5].occupied = true;

      expect(isGridFull(grid)).toBe(true);
    });

    it('should return false when only middle rows are full', () => {
      const grid = createEmptyGrid();

      for (let col = 0; col < GRID_WIDTH; col++) {
        grid[10][col].locked = true;
        grid[10][col].occupied = true;
      }

      expect(isGridFull(grid)).toBe(false);
    });
  });

  describe('getGridStats', () => {
    it('should return correct stats for empty grid', () => {
      const grid = createEmptyGrid();
      const stats = getGridStats(grid);

      expect(stats.totalCells).toBe(200);
      expect(stats.occupiedCells).toBe(0);
      expect(stats.emptyCells).toBe(200);
      expect(stats.fillPercentage).toBe(0);
    });

    it('should return correct stats for partially filled grid', () => {
      const grid = createEmptyGrid();

      // 佔用 10 個格子
      for (let i = 0; i < 10; i++) {
        grid[19][i].occupied = true;
      }

      const stats = getGridStats(grid);

      expect(stats.occupiedCells).toBe(10);
      expect(stats.emptyCells).toBe(190);
      expect(stats.fillPercentage).toBe(5);
    });
  });

  describe('canPlaceTetromino', () => {
    it('should allow placing tetromino on empty grid', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });

      expect(canPlaceTetromino(grid, tetromino)).toBe(true);
    });

    it('should prevent placing tetromino on occupied cells', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.I, { x: 0, y: 0 });

      // 佔用一個方塊需要的位置
      grid[1][0].occupied = true;

      expect(canPlaceTetromino(grid, tetromino)).toBe(false);
    });

    it('should prevent placing tetromino outside boundaries', () => {
      const grid = createEmptyGrid();
      const tetromino = createTetromino(TetrominoType.I, { x: -1, y: 0 });

      expect(canPlaceTetromino(grid, tetromino)).toBe(false);
    });
  });
});
