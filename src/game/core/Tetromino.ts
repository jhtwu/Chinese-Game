/**
 * Tetromino 方塊類
 * 表示一個俄羅斯方塊，包含其類型、位置、旋轉狀態等
 */

import { Tetromino, TetrominoType, Position } from '@/types';
import {
  getTetrominoShape,
  getTetrominoColor,
  getNextRotation,
  getRandomTetrominoType,
} from './tetrominoShapes';

/**
 * 創建一個新的方塊
 * @param type 方塊類型
 * @param position 初始位置（可選，默認在頂部中央）
 * @returns Tetromino 對象
 */
export function createTetromino(
  type?: TetrominoType,
  position?: Position
): Tetromino {
  const tetrominoType = type || getRandomTetrominoType();
  const initialRotation: 0 | 1 | 2 | 3 = 0;

  // 默認位置：頂部中央（x=3, y=0）
  const initialPosition: Position = position || { x: 3, y: 0 };

  const tetromino: Tetromino = {
    type: tetrominoType,
    rotation: initialRotation,
    position: initialPosition,
    shape: getTetrominoShape(tetrominoType, initialRotation),
    characters: createEmptyCharacterMatrix(
      getTetrominoShape(tetrominoType, initialRotation)
    ),
    color: getTetrominoColor(tetrominoType),
  };

  return tetromino;
}

/**
 * 創建空的字符矩陣（與方塊形狀對應）
 * @param shape 方塊形狀矩陣
 * @returns 字符矩陣
 */
function createEmptyCharacterMatrix(shape: number[][]): (string | null)[][] {
  return shape.map((row) => row.map((cell) => (cell === 1 ? null : null)));
}

/**
 * 旋轉方塊
 * @param tetromino 當前方塊
 * @returns 旋轉後的新方塊
 */
export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const newRotation = getNextRotation(tetromino.rotation);
  const newShape = getTetrominoShape(tetromino.type, newRotation);

  return {
    ...tetromino,
    rotation: newRotation,
    shape: newShape,
    // 保留原有的字符，但需要相應旋轉（暫時創建新的空矩陣）
    characters: createEmptyCharacterMatrix(newShape),
  };
}

/**
 * 移動方塊
 * @param tetromino 當前方塊
 * @param offset 偏移量 {x, y}
 * @returns 移動後的新方塊
 */
export function moveTetromino(
  tetromino: Tetromino,
  offset: Position
): Tetromino {
  return {
    ...tetromino,
    position: {
      x: tetromino.position.x + offset.x,
      y: tetromino.position.y + offset.y,
    },
  };
}

/**
 * 為方塊分配中文字符
 * @param tetromino 方塊
 * @param characters 字符陣列
 * @returns 帶字符的新方塊
 */
export function assignCharactersToTetromino(
  tetromino: Tetromino,
  characters: string[]
): Tetromino {
  const characterMatrix: (string | null)[][] = [];
  let charIndex = 0;

  for (let row = 0; row < tetromino.shape.length; row++) {
    characterMatrix[row] = [];
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        characterMatrix[row][col] = characters[charIndex] || null;
        charIndex++;
      } else {
        characterMatrix[row][col] = null;
      }
    }
  }

  return {
    ...tetromino,
    characters: characterMatrix,
  };
}

/**
 * 獲取方塊的所有佔用位置（絕對坐標）
 * @param tetromino 方塊
 * @returns 所有佔用的格子坐標
 */
export function getTetrominoBlocks(tetromino: Tetromino): Position[] {
  const blocks: Position[] = [];

  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[row].length; col++) {
      if (tetromino.shape[row][col] === 1) {
        blocks.push({
          x: tetromino.position.x + col,
          y: tetromino.position.y + row,
        });
      }
    }
  }

  return blocks;
}

/**
 * 獲取方塊的邊界框
 * @param tetromino 方塊
 * @returns 邊界框 {minX, maxX, minY, maxY}
 */
export function getTetrominoBounds(tetromino: Tetromino) {
  const blocks = getTetrominoBlocks(tetromino);

  if (blocks.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  const xs = blocks.map((b) => b.x);
  const ys = blocks.map((b) => b.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/**
 * 克隆方塊（深拷貝）
 * @param tetromino 原方塊
 * @returns 新方塊
 */
export function cloneTetromino(tetromino: Tetromino): Tetromino {
  return {
    ...tetromino,
    position: { ...tetromino.position },
    shape: tetromino.shape.map((row) => [...row]),
    characters: tetromino.characters.map((row) => [...row]),
  };
}
