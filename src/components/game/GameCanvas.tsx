/**
 * GameCanvas - 使用 Konva 渲染遊戲畫面
 */

import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Grid, Tetromino } from '@/types';
import { GRID_WIDTH, GRID_HEIGHT } from '@/game/core/Grid';

interface GameCanvasProps {
  grid: Grid;
  currentTetromino: Tetromino | null;
  ghostTetromino?: Tetromino | null;
  cellSize?: number;
}

const DEFAULT_CELL_SIZE = 30;

export function GameCanvas({
  grid,
  currentTetromino,
  ghostTetromino,
  cellSize = DEFAULT_CELL_SIZE,
}: GameCanvasProps) {
  const stageWidth = GRID_WIDTH * cellSize;
  const stageHeight = GRID_HEIGHT * cellSize;

  /**
   * 渲染網格背景
   */
  const renderGrid = () => {
    const gridLines = [];

    // 垂直線
    for (let i = 0; i <= GRID_WIDTH; i++) {
      gridLines.push(
        <Rect
          key={`v-${i}`}
          x={i * cellSize}
          y={0}
          width={1}
          height={stageHeight}
          fill="#333333"
        />
      );
    }

    // 水平線
    for (let i = 0; i <= GRID_HEIGHT; i++) {
      gridLines.push(
        <Rect
          key={`h-${i}`}
          x={0}
          y={i * cellSize}
          width={stageWidth}
          height={1}
          fill="#333333"
        />
      );
    }

    return gridLines;
  };

  /**
   * 渲染鎖定的方塊
   */
  const renderLockedCells = () => {
    const cells = [];

    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        const cell = grid[row][col];

        if (cell.locked && cell.occupied) {
          cells.push(
            <Group key={`locked-${row}-${col}`}>
              {/* 方塊背景 */}
              <Rect
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={cell.color || '#666666'}
                stroke="#000000"
                strokeWidth={1}
              />
              {/* 中文字符 */}
              {cell.character && (
                <Text
                  x={col * cellSize}
                  y={row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  text={cell.character}
                  fontSize={cellSize * 0.6}
                  fontFamily="Noto Sans TC, sans-serif"
                  fill="#FFFFFF"
                  align="center"
                  verticalAlign="middle"
                  shadowColor="black"
                  shadowBlur={2}
                  shadowOffset={{ x: 1, y: 1 }}
                  shadowOpacity={0.5}
                />
              )}
            </Group>
          );
        }
      }
    }

    return cells;
  };

  /**
   * 渲染幽靈方塊（半透明預覽落點）
   */
  const renderGhostTetromino = () => {
    if (!ghostTetromino) return null;

    const cells = [];
    const { shape, position, color } = ghostTetromino;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = (position.x + col) * cellSize;
          const y = (position.y + row) * cellSize;

          cells.push(
            <Rect
              key={`ghost-${row}-${col}`}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill={color}
              opacity={0.2}
              stroke="#FFFFFF"
              strokeWidth={1}
              dash={[5, 5]}
            />
          );
        }
      }
    }

    return cells;
  };

  /**
   * 渲染當前下落的方塊
   */
  const renderCurrentTetromino = () => {
    if (!currentTetromino) return null;

    const cells = [];
    const { shape, position, color, characters } = currentTetromino;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = (position.x + col) * cellSize;
          const y = (position.y + row) * cellSize;

          cells.push(
            <Group key={`current-${row}-${col}`}>
              {/* 方塊背景 */}
              <Rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={color}
                stroke="#000000"
                strokeWidth={2}
                shadowColor="black"
                shadowBlur={5}
                shadowOpacity={0.3}
              />
              {/* 中文字符 */}
              {characters[row][col] && (
                <Text
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  text={characters[row][col]!}
                  fontSize={cellSize * 0.6}
                  fontFamily="Noto Sans TC, sans-serif"
                  fill="#FFFFFF"
                  align="center"
                  verticalAlign="middle"
                  shadowColor="black"
                  shadowBlur={3}
                  shadowOffset={{ x: 1, y: 1 }}
                  shadowOpacity={0.7}
                />
              )}
            </Group>
          );
        }
      }
    }

    return cells;
  };

  return (
    <div className="inline-block border-4 border-chinese-red rounded-lg overflow-hidden shadow-2xl">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* 背景 */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill="#1a1a1a"
          />

          {/* 網格線 */}
          {renderGrid()}

          {/* 鎖定的方塊 */}
          {renderLockedCells()}

          {/* 幽靈方塊 */}
          {renderGhostTetromino()}

          {/* 當前方塊 */}
          {renderCurrentTetromino()}
        </Layer>
      </Stage>
    </div>
  );
}
