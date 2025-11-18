/**
 * TetrisEngine 俄羅斯方塊遊戲引擎
 * 核心遊戲邏輯：移動、旋轉、下落、鎖定
 */

import { Grid, Tetromino, Position } from '@/types';
import {
  createTetromino,
  moveTetromino,
  rotateTetromino,
  cloneTetromino,
} from './Tetromino';
import {
  createEmptyGrid,
  lockTetrominoToGrid,
  clearFullLines,
  isGridFull,
  cloneGrid,
} from './Grid';
import { CollisionDetector } from './CollisionDetector';

/**
 * 遊戲引擎動作結果
 */
export interface GameActionResult {
  success: boolean;
  newTetromino?: Tetromino;
  newGrid?: Grid;
  linesCleared?: number;
  gameOver?: boolean;
  message?: string;
}

/**
 * 俄羅斯方塊遊戲引擎
 */
export class TetrisEngine {
  private grid: Grid;
  private currentTetromino: Tetromino | null;
  private nextTetromino: Tetromino | null;
  private isGameOver: boolean;

  constructor() {
    this.grid = createEmptyGrid();
    this.currentTetromino = null;
    this.nextTetromino = null;
    this.isGameOver = false;
  }

  /**
   * 初始化遊戲
   */
  initialize(): void {
    this.grid = createEmptyGrid();
    this.currentTetromino = createTetromino();
    this.nextTetromino = createTetromino();
    this.isGameOver = false;
  }

  /**
   * 獲取當前網格
   */
  getGrid(): Grid {
    return cloneGrid(this.grid);
  }

  /**
   * 獲取當前方塊
   */
  getCurrentTetromino(): Tetromino | null {
    return this.currentTetromino ? cloneTetromino(this.currentTetromino) : null;
  }

  /**
   * 獲取下一個方塊
   */
  getNextTetromino(): Tetromino | null {
    return this.nextTetromino ? cloneTetromino(this.nextTetromino) : null;
  }

  /**
   * 檢查遊戲是否結束
   */
  isGameOverState(): boolean {
    return this.isGameOver;
  }

  /**
   * 生成新方塊
   */
  private spawnNewTetromino(): GameActionResult {
    if (!this.nextTetromino) {
      this.nextTetromino = createTetromino();
    }

    this.currentTetromino = this.nextTetromino;
    this.nextTetromino = createTetromino();

    // 檢查是否可以放置新方塊（遊戲結束條件）
    if (
      this.currentTetromino &&
      CollisionDetector.checkCollision(this.currentTetromino, this.grid)
    ) {
      this.isGameOver = true;
      return {
        success: false,
        gameOver: true,
        message: 'Game Over: Cannot spawn new tetromino',
      };
    }

    return {
      success: true,
      newTetromino: this.currentTetromino,
    };
  }

  /**
   * 向左移動方塊
   */
  moveLeft(): GameActionResult {
    if (!this.currentTetromino || this.isGameOver) {
      return { success: false, message: 'No active tetromino or game over' };
    }

    const movedTetromino = moveTetromino(this.currentTetromino, { x: -1, y: 0 });

    if (!CollisionDetector.checkCollision(movedTetromino, this.grid)) {
      this.currentTetromino = movedTetromino;
      return { success: true, newTetromino: this.currentTetromino };
    }

    return { success: false, message: 'Cannot move left' };
  }

  /**
   * 向右移動方塊
   */
  moveRight(): GameActionResult {
    if (!this.currentTetromino || this.isGameOver) {
      return { success: false, message: 'No active tetromino or game over' };
    }

    const movedTetromino = moveTetromino(this.currentTetromino, { x: 1, y: 0 });

    if (!CollisionDetector.checkCollision(movedTetromino, this.grid)) {
      this.currentTetromino = movedTetromino;
      return { success: true, newTetromino: this.currentTetromino };
    }

    return { success: false, message: 'Cannot move right' };
  }

  /**
   * 向下移動方塊（軟降落）
   * @returns 動作結果，包含是否鎖定方塊
   */
  moveDown(): GameActionResult {
    if (!this.currentTetromino || this.isGameOver) {
      return { success: false, message: 'No active tetromino or game over' };
    }

    const movedTetromino = moveTetromino(this.currentTetromino, { x: 0, y: 1 });

    if (!CollisionDetector.checkCollision(movedTetromino, this.grid)) {
      this.currentTetromino = movedTetromino;
      return { success: true, newTetromino: this.currentTetromino };
    }

    // 無法下移，鎖定方塊
    return this.lockCurrentTetromino();
  }

  /**
   * 旋轉方塊
   */
  rotate(): GameActionResult {
    if (!this.currentTetromino || this.isGameOver) {
      return { success: false, message: 'No active tetromino or game over' };
    }

    const rotatedTetromino = rotateTetromino(this.currentTetromino);

    // 嘗試牆踢（Wall Kick）
    const adjustedTetromino = CollisionDetector.getWallKickAdjustment(
      this.currentTetromino,
      rotatedTetromino,
      this.grid
    );

    if (adjustedTetromino) {
      this.currentTetromino = adjustedTetromino;
      return { success: true, newTetromino: this.currentTetromino };
    }

    return { success: false, message: 'Cannot rotate' };
  }

  /**
   * 硬降落（直接降到底部）
   */
  hardDrop(): GameActionResult {
    if (!this.currentTetromino || this.isGameOver) {
      return { success: false, message: 'No active tetromino or game over' };
    }

    const dropDistance = CollisionDetector.getHardDropDistance(
      this.currentTetromino,
      this.grid
    );

    this.currentTetromino = moveTetromino(this.currentTetromino, {
      x: 0,
      y: dropDistance,
    });

    // 立即鎖定
    return this.lockCurrentTetromino();
  }

  /**
   * 鎖定當前方塊到網格
   */
  private lockCurrentTetromino(): GameActionResult {
    if (!this.currentTetromino) {
      return { success: false, message: 'No tetromino to lock' };
    }

    // 鎖定方塊到網格
    this.grid = lockTetrominoToGrid(this.grid, this.currentTetromino);

    // 清除滿行
    const { newGrid, clearedLines } = clearFullLines(this.grid);
    this.grid = newGrid;

    // 檢查遊戲結束
    if (isGridFull(this.grid)) {
      this.isGameOver = true;
      return {
        success: true,
        newGrid: this.grid,
        linesCleared: clearedLines,
        gameOver: true,
        message: 'Game Over: Grid is full',
      };
    }

    // 生成新方塊
    const spawnResult = this.spawnNewTetromino();

    return {
      success: true,
      newGrid: this.grid,
      newTetromino: this.currentTetromino,
      linesCleared: clearedLines,
      gameOver: spawnResult.gameOver,
    };
  }

  /**
   * 遊戲循環 - 自動下落
   * 應該由外部定時器調用（如每秒一次）
   */
  tick(): GameActionResult {
    return this.moveDown();
  }

  /**
   * 重置遊戲
   */
  reset(): void {
    this.initialize();
  }

  /**
   * 獲取遊戲狀態快照
   */
  getGameState() {
    return {
      grid: this.getGrid(),
      currentTetromino: this.getCurrentTetromino(),
      nextTetromino: this.getNextTetromino(),
      isGameOver: this.isGameOver,
    };
  }

  /**
   * 設置網格（用於測試或恢復遊戲狀態）
   */
  setGrid(grid: Grid): void {
    this.grid = cloneGrid(grid);
  }

  /**
   * 設置當前方塊（用於測試）
   */
  setCurrentTetromino(tetromino: Tetromino | null): void {
    this.currentTetromino = tetromino ? cloneTetromino(tetromino) : null;
  }
}

/**
 * 創建遊戲引擎實例
 */
export function createTetrisEngine(): TetrisEngine {
  const engine = new TetrisEngine();
  engine.initialize();
  return engine;
}
