/**
 * CollisionDetector 碰撞檢測器
 * 檢測方塊與網格、邊界的碰撞
 */

import { Grid, Tetromino, Position } from '@/types';
import { getTetrominoBlocks } from './Tetromino';
import { isValidPosition, isCellOccupied, GRID_WIDTH, GRID_HEIGHT } from './Grid';

/**
 * 碰撞檢測器類
 */
export class CollisionDetector {
  /**
   * 檢測方塊是否與網格或邊界發生碰撞
   * @param tetromino 方塊
   * @param grid 網格
   * @param offset 偏移量（可選，用於預測移動後的碰撞）
   * @returns 是否發生碰撞
   */
  static checkCollision(
    tetromino: Tetromino,
    grid: Grid,
    offset: Position = { x: 0, y: 0 }
  ): boolean {
    const blocks = getTetrominoBlocks(tetromino);

    for (const block of blocks) {
      const newX = block.x + offset.x;
      const newY = block.y + offset.y;
      const newPosition = { x: newX, y: newY };

      // 檢查邊界碰撞
      if (!isValidPosition(newPosition)) {
        return true;
      }

      // 檢查與已鎖定方塊的碰撞
      if (isCellOccupied(grid, newPosition)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 檢測方塊是否到達底部
   * @param tetromino 方塊
   * @param grid 網格
   * @returns 是否到達底部
   */
  static isAtBottom(tetromino: Tetromino, grid: Grid): boolean {
    return this.checkCollision(tetromino, grid, { x: 0, y: 1 });
  }

  /**
   * 檢測方塊是否可以向左移動
   * @param tetromino 方塊
   * @param grid 網格
   * @returns 是否可以向左移動
   */
  static canMoveLeft(tetromino: Tetromino, grid: Grid): boolean {
    return !this.checkCollision(tetromino, grid, { x: -1, y: 0 });
  }

  /**
   * 檢測方塊是否可以向右移動
   * @param tetromino 方塊
   * @param grid 網格
   * @returns 是否可以向右移動
   */
  static canMoveRight(tetromino: Tetromino, grid: Grid): boolean {
    return !this.checkCollision(tetromino, grid, { x: 1, y: 0 });
  }

  /**
   * 檢測方塊是否可以向下移動
   * @param tetromino 方塊
   * @param grid 網格
   * @returns 是否可以向下移動
   */
  static canMoveDown(tetromino: Tetromino, grid: Grid): boolean {
    return !this.checkCollision(tetromino, grid, { x: 0, y: 1 });
  }

  /**
   * 檢測方塊是否可以旋轉
   * @param rotatedTetromino 旋轉後的方塊
   * @param grid 網格
   * @returns 是否可以旋轉
   */
  static canRotate(rotatedTetromino: Tetromino, grid: Grid): boolean {
    return !this.checkCollision(rotatedTetromino, grid);
  }

  /**
   * 計算方塊可以下落的最大距離（硬降落）
   * @param tetromino 方塊
   * @param grid 網格
   * @returns 可以下落的格數
   */
  static getHardDropDistance(tetromino: Tetromino, grid: Grid): number {
    let distance = 0;

    while (!this.checkCollision(tetromino, grid, { x: 0, y: distance + 1 })) {
      distance++;
    }

    return distance;
  }

  /**
   * 檢測方塊是否超出上邊界（遊戲結束條件）
   * @param tetromino 方塊
   * @returns 是否超出上邊界
   */
  static isAboveGrid(tetromino: Tetromino): boolean {
    const blocks = getTetrominoBlocks(tetromino);
    return blocks.some((block) => block.y < 0);
  }

  /**
   * 檢測方塊是否超出左邊界
   * @param tetromino 方塊
   * @returns 是否超出左邊界
   */
  static isBeyondLeftBoundary(tetromino: Tetromino): boolean {
    const blocks = getTetrominoBlocks(tetromino);
    return blocks.some((block) => block.x < 0);
  }

  /**
   * 檢測方塊是否超出右邊界
   * @param tetromino 方塊
   * @returns 是否超出右邊界
   */
  static isBeyondRightBoundary(tetromino: Tetromino): boolean {
    const blocks = getTetrominoBlocks(tetromino);
    return blocks.some((block) => block.x >= GRID_WIDTH);
  }

  /**
   * 檢測方塊是否超出下邊界
   * @param tetromino 方塊
   * @returns 是否超出下邊界
   */
  static isBeyondBottomBoundary(tetromino: Tetromino): boolean {
    const blocks = getTetrominoBlocks(tetromino);
    return blocks.some((block) => block.y >= GRID_HEIGHT);
  }

  /**
   * 獲取旋轉後的牆踢（Wall Kick）調整
   * SRS（Super Rotation System）的簡化版本
   * @param tetromino 原方塊
   * @param rotatedTetromino 旋轉後的方塊
   * @param grid 網格
   * @returns 調整後的方塊，如果無法旋轉則返回 null
   */
  static getWallKickAdjustment(
    tetromino: Tetromino,
    rotatedTetromino: Tetromino,
    grid: Grid
  ): Tetromino | null {
    // 嘗試的偏移量順序（向右、向左、向上）
    const offsets: Position[] = [
      { x: 0, y: 0 },   // 原位置
      { x: 1, y: 0 },   // 右移 1 格
      { x: -1, y: 0 },  // 左移 1 格
      { x: 2, y: 0 },   // 右移 2 格（I 型方塊）
      { x: -2, y: 0 },  // 左移 2 格（I 型方塊）
      { x: 0, y: -1 },  // 上移 1 格
    ];

    for (const offset of offsets) {
      const adjustedTetromino: Tetromino = {
        ...rotatedTetromino,
        position: {
          x: rotatedTetromino.position.x + offset.x,
          y: rotatedTetromino.position.y + offset.y,
        },
      };

      if (!this.checkCollision(adjustedTetromino, grid)) {
        return adjustedTetromino;
      }
    }

    return null; // 無法旋轉
  }

  /**
   * 檢測兩個方塊是否重疊
   * @param tetromino1 方塊 1
   * @param tetromino2 方塊 2
   * @returns 是否重疊
   */
  static doTetrominosOverlap(
    tetromino1: Tetromino,
    tetromino2: Tetromino
  ): boolean {
    const blocks1 = getTetrominoBlocks(tetromino1);
    const blocks2 = getTetrominoBlocks(tetromino2);

    for (const block1 of blocks1) {
      for (const block2 of blocks2) {
        if (block1.x === block2.x && block1.y === block2.y) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * 便捷函數：檢查碰撞
 */
export function checkCollision(
  tetromino: Tetromino,
  grid: Grid,
  offset?: Position
): boolean {
  return CollisionDetector.checkCollision(tetromino, grid, offset);
}

/**
 * 便捷函數：檢查是否到達底部
 */
export function isAtBottom(tetromino: Tetromino, grid: Grid): boolean {
  return CollisionDetector.isAtBottom(tetromino, grid);
}

/**
 * 便捷函數：獲取硬降落距離
 */
export function getHardDropDistance(tetromino: Tetromino, grid: Grid): number {
  return CollisionDetector.getHardDropDistance(tetromino, grid);
}
