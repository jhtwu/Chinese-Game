/**
 * 俄羅斯方塊形狀定義
 * 每個方塊有 4 種旋轉狀態（0°, 90°, 180°, 270°）
 */

import { TetrominoType } from '@/types';

/**
 * 方塊形狀數據結構
 * 1 表示有方塊，0 表示空
 */
export type ShapeMatrix = number[][];

/**
 * 每種方塊的 4 種旋轉狀態
 */
export type RotationStates = [ShapeMatrix, ShapeMatrix, ShapeMatrix, ShapeMatrix];

/**
 * 方塊顏色配置
 */
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  [TetrominoType.I]: '#00F0F0', // 青色
  [TetrominoType.O]: '#F0F000', // 黃色
  [TetrominoType.T]: '#A000F0', // 紫色
  [TetrominoType.S]: '#00F000', // 綠色
  [TetrominoType.Z]: '#F00000', // 紅色
  [TetrominoType.J]: '#0000F0', // 藍色
  [TetrominoType.L]: '#F0A000', // 橙色
};

/**
 * 所有方塊的旋轉狀態定義
 */
export const TETROMINO_SHAPES: Record<TetrominoType, RotationStates> = {
  // I 型 - 直線方塊
  [TetrominoType.I]: [
    // 0° - 橫向
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // 90° - 縱向
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    // 180° - 橫向（同 0°）
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    // 270° - 縱向（同 90°）
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],

  // O 型 - 正方形
  [TetrominoType.O]: [
    // 0° - 所有旋轉狀態相同
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],

  // T 型 - T 形方塊
  [TetrominoType.T]: [
    // 0° - T 向上
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - T 向右
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // 180° - T 向下
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    // 270° - T 向左
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],

  // S 型 - S 形方塊
  [TetrominoType.S]: [
    // 0° - 橫向
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    // 90° - 縱向
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    // 180° - 橫向（同 0°）
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    // 270° - 縱向（同 90°）
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],

  // Z 型 - Z 形方塊
  [TetrominoType.Z]: [
    // 0° - 橫向
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    // 90° - 縱向
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // 180° - 橫向（同 0°）
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    // 270° - 縱向（同 90°）
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],

  // J 型 - J 形方塊
  [TetrominoType.J]: [
    // 0° - J 向右
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - J 向下
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    // 180° - J 向左
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    // 270° - J 向上
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],

  // L 型 - L 形方塊
  [TetrominoType.L]: [
    // 0° - L 向右
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - L 向下
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    // 180° - L 向左
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    // 270° - L 向上
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

/**
 * 獲取指定方塊類型和旋轉角度的形狀
 */
export function getTetrominoShape(
  type: TetrominoType,
  rotation: 0 | 1 | 2 | 3
): ShapeMatrix {
  return TETROMINO_SHAPES[type][rotation];
}

/**
 * 獲取方塊顏色
 */
export function getTetrominoColor(type: TetrominoType): string {
  return TETROMINO_COLORS[type];
}

/**
 * 獲取下一個旋轉狀態
 */
export function getNextRotation(currentRotation: 0 | 1 | 2 | 3): 0 | 1 | 2 | 3 {
  return ((currentRotation + 1) % 4) as 0 | 1 | 2 | 3;
}

/**
 * 獲取所有方塊類型
 */
export function getAllTetrominoTypes(): TetrominoType[] {
  return Object.values(TetrominoType);
}

/**
 * 隨機獲取一個方塊類型
 */
export function getRandomTetrominoType(): TetrominoType {
  const types = getAllTetrominoTypes();
  return types[Math.floor(Math.random() * types.length)];
}
