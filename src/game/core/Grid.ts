/**
 * Grid 遊戲網格類
 * 管理 10×20 的遊戲場地
 */

import { Grid, Cell, Position, Tetromino } from '@/types';
import { getTetrominoBlocks } from './Tetromino';

/**
 * 遊戲網格常數
 */
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

/**
 * 創建一個空的網格
 * @returns 10×20 的空網格
 */
export function createEmptyGrid(): Grid {
  const grid: Grid = [];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      grid[row][col] = createEmptyCell();
    }
  }

  return grid;
}

/**
 * 創建一個空格子
 * @returns Cell 對象
 */
export function createEmptyCell(): Cell {
  return {
    occupied: false,
    character: null,
    color: null,
    locked: false,
  };
}

/**
 * 檢查位置是否在網格範圍內
 * @param position 位置
 * @returns 是否有效
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.x >= 0 &&
    position.x < GRID_WIDTH &&
    position.y >= 0 &&
    position.y < GRID_HEIGHT
  );
}

/**
 * 檢查格子是否被佔用
 * @param grid 網格
 * @param position 位置
 * @returns 是否被佔用
 */
export function isCellOccupied(grid: Grid, position: Position): boolean {
  if (!isValidPosition(position)) {
    return true; // 超出邊界視為被佔用
  }
  return grid[position.y][position.x].occupied;
}

/**
 * 將方塊鎖定到網格中
 * @param grid 網格
 * @param tetromino 方塊
 * @returns 更新後的網格
 */
export function lockTetrominoToGrid(
  grid: Grid,
  tetromino: Tetromino
): Grid {
  const newGrid = cloneGrid(grid);

  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        const gridX = tetromino.position.x + col;
        const gridY = tetromino.position.y + row;

        if (isValidPosition({ x: gridX, y: gridY })) {
          newGrid[gridY][gridX] = {
            occupied: true,
            character: tetromino.characters[row][col],
            color: tetromino.color,
            locked: true,
          };
        }
      }
    }
  }

  return newGrid;
}

/**
 * 檢測並清除滿行
 * @param grid 網格
 * @returns {newGrid, clearedLines} 新網格和清除的行數
 */
export function clearFullLines(grid: Grid): {
  newGrid: Grid;
  clearedLines: number;
  clearedLineIndices: number[];
} {
  const clearedLineIndices: number[] = [];

  // 檢測滿行
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const isFullLine = grid[row].every((cell) => cell.occupied);
    if (isFullLine) {
      clearedLineIndices.push(row);
    }
  }

  if (clearedLineIndices.length === 0) {
    return { newGrid: grid, clearedLines: 0, clearedLineIndices: [] };
  }

  // 創建新網格
  const newGrid = cloneGrid(grid);

  // 移除滿行並在頂部添加空行
  for (const lineIndex of clearedLineIndices.sort((a, b) => b - a)) {
    // 從上往下處理，避免索引混亂
    newGrid.splice(lineIndex, 1); // 移除滿行
    newGrid.unshift(createEmptyRow()); // 在頂部添加空行
  }

  return {
    newGrid,
    clearedLines: clearedLineIndices.length,
    clearedLineIndices,
  };
}

/**
 * 創建一個空行
 * @returns 空行
 */
function createEmptyRow(): Cell[] {
  const row: Cell[] = [];
  for (let col = 0; col < GRID_WIDTH; col++) {
    row.push(createEmptyCell());
  }
  return row;
}

/**
 * 克隆網格（深拷貝）
 * @param grid 原網格
 * @returns 新網格
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * 獲取網格中的所有字符及其位置
 * @param grid 網格
 * @returns 字符位置陣列
 */
export function getGridCharacters(
  grid: Grid
): Array<{ character: string; position: Position }> {
  const characters: Array<{ character: string; position: Position }> = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].character) {
        characters.push({
          character: grid[row][col].character!,
          position: { x: col, y: row },
        });
      }
    }
  }

  return characters;
}

/**
 * 檢查網格是否已滿（遊戲結束條件）
 * @param grid 網格
 * @returns 是否已滿
 */
export function isGridFull(grid: Grid): boolean {
  // 檢查頂部幾行是否有被鎖定的方塊
  const topRows = 2; // 檢查前兩行
  for (let row = 0; row < topRows; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (grid[row][col].locked) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 獲取網格統計信息
 * @param grid 網格
 * @returns 統計信息
 */
export function getGridStats(grid: Grid) {
  let occupiedCells = 0;
  let charactersCount = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].occupied) {
        occupiedCells++;
      }
      if (grid[row][col].character) {
        charactersCount++;
      }
    }
  }

  return {
    totalCells: GRID_WIDTH * GRID_HEIGHT,
    occupiedCells,
    emptyCells: GRID_WIDTH * GRID_HEIGHT - occupiedCells,
    charactersCount,
    fillPercentage: (occupiedCells / (GRID_WIDTH * GRID_HEIGHT)) * 100,
  };
}

/**
 * 清空網格中指定位置的格子
 * @param grid 網格
 * @param positions 要清空的位置
 * @returns 新網格
 */
export function clearCells(grid: Grid, positions: Position[]): Grid {
  const newGrid = cloneGrid(grid);

  for (const pos of positions) {
    if (isValidPosition(pos)) {
      newGrid[pos.y][pos.x] = createEmptyCell();
    }
  }

  return newGrid;
}

/**
 * 檢查方塊是否可以放置在指定位置
 * @param grid 網格
 * @param tetromino 方塊
 * @returns 是否可以放置
 */
export function canPlaceTetromino(grid: Grid, tetromino: Tetromino): boolean {
  const blocks = getTetrominoBlocks(tetromino);

  for (const block of blocks) {
    // 檢查邊界
    if (!isValidPosition(block)) {
      return false;
    }

    // 檢查是否被佔用
    if (grid[block.y][block.x].occupied) {
      return false;
    }
  }

  return true;
}
