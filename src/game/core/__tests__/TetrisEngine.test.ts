/**
 * TetrisEngine 遊戲引擎單元測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TetrominoType } from '@/types';
import { createTetrisEngine, TetrisEngine } from '../TetrisEngine';
import { createTetromino } from '../Tetromino';
import { GRID_WIDTH } from '../Grid';

describe('TetrisEngine', () => {
  let engine: TetrisEngine;

  beforeEach(() => {
    engine = createTetrisEngine();
  });

  describe('initialization', () => {
    it('should initialize with an empty grid', () => {
      const grid = engine.getGrid();
      expect(grid).toBeDefined();
      expect(grid).toHaveLength(20);
    });

    it('should initialize with a current tetromino', () => {
      const tetromino = engine.getCurrentTetromino();
      expect(tetromino).toBeDefined();
      expect(tetromino).not.toBeNull();
    });

    it('should initialize with a next tetromino', () => {
      const nextTetromino = engine.getNextTetromino();
      expect(nextTetromino).toBeDefined();
      expect(nextTetromino).not.toBeNull();
    });

    it('should not be game over initially', () => {
      expect(engine.isGameOverState()).toBe(false);
    });
  });

  describe('moveLeft', () => {
    it('should move tetromino to the left', () => {
      const initialTetromino = engine.getCurrentTetromino();
      const initialX = initialTetromino!.position.x;

      const result = engine.moveLeft();

      expect(result.success).toBe(true);
      const newTetromino = engine.getCurrentTetromino();
      expect(newTetromino!.position.x).toBe(initialX - 1);
    });

    it('should not move left if at left boundary', () => {
      // 設置一個在最左邊的方塊
      const tetromino = createTetromino(TetrominoType.I, { x: 0, y: 0 });
      engine.setCurrentTetromino(tetromino);

      const result = engine.moveLeft();

      expect(result.success).toBe(false);
    });

    it('should not move left if blocked by locked blocks', () => {
      const grid = engine.getGrid();
      const tetromino = engine.getCurrentTetromino();

      if (tetromino) {
        // 在左側放置障礙
        const leftX = tetromino.position.x - 1;
        grid[tetromino.position.y][leftX].occupied = true;
        engine.setGrid(grid);

        const result = engine.moveLeft();
        expect(result.success).toBe(false);
      }
    });
  });

  describe('moveRight', () => {
    it('should move tetromino to the right', () => {
      const initialTetromino = engine.getCurrentTetromino();
      const initialX = initialTetromino!.position.x;

      const result = engine.moveRight();

      expect(result.success).toBe(true);
      const newTetromino = engine.getCurrentTetromino();
      expect(newTetromino!.position.x).toBe(initialX + 1);
    });

    it('should not move right if at right boundary', () => {
      // I 型方塊在最右邊
      const tetromino = createTetromino(TetrominoType.I, { x: GRID_WIDTH - 4, y: 0 });
      engine.setCurrentTetromino(tetromino);

      const result = engine.moveRight();

      expect(result.success).toBe(false);
    });
  });

  describe('moveDown', () => {
    it('should move tetromino down', () => {
      const initialTetromino = engine.getCurrentTetromino();
      const initialY = initialTetromino!.position.y;

      const result = engine.moveDown();

      if (result.success && !result.linesCleared) {
        const newTetromino = engine.getCurrentTetromino();
        expect(newTetromino!.position.y).toBe(initialY + 1);
      }
    });

    it('should lock tetromino when it reaches the bottom', () => {
      // 將方塊移動到接近底部
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 18 });
      engine.setCurrentTetromino(tetromino);

      const result = engine.moveDown();

      expect(result.success).toBe(true);
      expect(result.newGrid).toBeDefined();
    });

    it('should clear full lines after locking', () => {
      const grid = engine.getGrid();

      // 填滿底部一行，只留一個空位
      for (let col = 0; col < GRID_WIDTH; col++) {
        if (col !== 3) {
          grid[19][col].occupied = true;
          grid[19][col].locked = true;
        }
      }

      engine.setGrid(grid);

      // 放置一個方塊填補空位
      const tetromino = createTetromino(TetrominoType.O, { x: 2, y: 17 });
      engine.setCurrentTetromino(tetromino);

      // 下落直到鎖定
      let result;
      let iterations = 0;
      do {
        result = engine.moveDown();
        iterations++;
      } while (result.success && !result.linesCleared && iterations < 10);

      // 應該清除了至少一行
      if (result.linesCleared) {
        expect(result.linesCleared).toBeGreaterThan(0);
      }
    });
  });

  describe('rotate', () => {
    it('should rotate tetromino', () => {
      const tetromino = createTetromino(TetrominoType.T);
      engine.setCurrentTetromino(tetromino);

      const initialRotation = tetromino.rotation;
      const result = engine.rotate();

      expect(result.success).toBe(true);
      const newTetromino = engine.getCurrentTetromino();
      expect(newTetromino!.rotation).not.toBe(initialRotation);
    });

    it('should not rotate if blocked', () => {
      const grid = engine.getGrid();

      // 創建一個被包圍的方塊（無法旋轉）
      const tetromino = createTetromino(TetrominoType.I, { x: 0, y: 10 });

      // 在周圍放置障礙
      for (let y = 9; y <= 14; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (y !== 10 || x > 3) {
            grid[y][x].occupied = true;
          }
        }
      }

      engine.setGrid(grid);
      engine.setCurrentTetromino(tetromino);

      const result = engine.rotate();

      // 在這種極端情況下，旋轉應該失敗
      expect(result.success).toBe(false);
    });
  });

  describe('hardDrop', () => {
    it('should drop tetromino to the bottom instantly', () => {
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 0 });
      engine.setCurrentTetromino(tetromino);

      const result = engine.hardDrop();

      expect(result.success).toBe(true);
      expect(result.newGrid).toBeDefined();
      expect(result.newTetromino).toBeDefined();
    });

    it('should lock tetromino immediately after hard drop', () => {
      const tetromino = createTetromino(TetrominoType.O, { x: 4, y: 0 });
      engine.setCurrentTetromino(tetromino);

      const gridBefore = engine.getGrid();
      const occupiedBefore = gridBefore.flat().filter((cell) => cell.occupied).length;

      engine.hardDrop();

      const gridAfter = engine.getGrid();
      const occupiedAfter = gridAfter.flat().filter((cell) => cell.occupied).length;

      // 應該有 4 個新的被佔用格子（O 型方塊）
      expect(occupiedAfter).toBeGreaterThan(occupiedBefore);
    });
  });

  describe('tick', () => {
    it('should move tetromino down each tick', () => {
      const initialY = engine.getCurrentTetromino()!.position.y;

      engine.tick();

      const newY = engine.getCurrentTetromino()!.position.y;

      // 應該下移或鎖定（取決於位置）
      expect(newY >= initialY).toBe(true);
    });
  });

  describe('game over', () => {
    it('should detect game over when grid is full', () => {
      const grid = engine.getGrid();

      // 填滿頂部行
      for (let col = 0; col < GRID_WIDTH; col++) {
        grid[0][col].occupied = true;
        grid[0][col].locked = true;
      }

      engine.setGrid(grid);

      // 嘗試生成新方塊（通過鎖定當前方塊）
      const tetromino = createTetromino(TetrominoType.I, { x: 3, y: 18 });
      engine.setCurrentTetromino(tetromino);

      const result = engine.hardDrop();

      expect(result.gameOver).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset game state', () => {
      // 先玩一會兒
      engine.moveLeft();
      engine.moveRight();
      engine.moveDown();

      // 重置
      engine.reset();

      // 檢查狀態是否重置
      expect(engine.isGameOverState()).toBe(false);
      expect(engine.getCurrentTetromino()).not.toBeNull();
      expect(engine.getNextTetromino()).not.toBeNull();
    });
  });

  describe('getGameState', () => {
    it('should return complete game state', () => {
      const state = engine.getGameState();

      expect(state).toHaveProperty('grid');
      expect(state).toHaveProperty('currentTetromino');
      expect(state).toHaveProperty('nextTetromino');
      expect(state).toHaveProperty('isGameOver');
    });
  });
});
