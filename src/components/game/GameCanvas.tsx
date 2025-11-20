/**
 * GameCanvas - 使用 Konva 渲染遊戲畫面
 */

import { useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Grid, Tetromino, HighlightedMatch } from '@/types';
import { GRID_WIDTH, GRID_HEIGHT } from '@/game/core/Grid';

interface GameCanvasProps {
  grid: Grid;
  currentTetromino: Tetromino | null;
  ghostTetromino?: Tetromino | null;
  cellSize?: number;
  highlightedMatches?: HighlightedMatch[];
  highlightFlashOn?: boolean;
}

const DEFAULT_CELL_SIZE = 30;

export function GameCanvas({
  grid,
  currentTetromino,
  ghostTetromino,
  cellSize = DEFAULT_CELL_SIZE,
  highlightedMatches = [],
  highlightFlashOn = false,
}: GameCanvasProps) {
  const stageWidth = GRID_WIDTH * cellSize;
  const stageHeight = GRID_HEIGHT * cellSize;
  const highlightedCells = useMemo(() => {
    const map = new Map<string, HighlightedMatch>();
    highlightedMatches.forEach(match => {
      match.positions.forEach(pos => {
        map.set(`${pos.x}-${pos.y}`, match);
      });
    });
    return map;
  }, [highlightedMatches]);
  const highlightFill = highlightFlashOn
    ? 'rgba(255, 215, 0, 0.85)'
    : 'rgba(255, 215, 0, 0.35)';

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
        const highlightKey = `${col}-${row}`;
        const highlightMatch = highlightedCells.get(highlightKey);

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
              {highlightMatch && (
                <Rect
                  x={col * cellSize}
                  y={row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={highlightFill}
                  stroke="#FFD700"
                  strokeWidth={2}
                />
              )}
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
    const { shape, position, color, blockCharacters, characters } = ghostTetromino;
    let blockIndex = 0;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = (position.x + col) * cellSize;
          const y = (position.y + row) * cellSize;
          const char =
            characters[row]?.[col] ?? blockCharacters?.[blockIndex] ?? null;
          blockIndex++;

          cells.push(
            <Group key={`ghost-${row}-${col}`}>
              <Rect
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
              {char && (
                <Text
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  text={char}
                  fontSize={cellSize * 0.6}
                  fontFamily="Noto Sans TC, sans-serif"
                  fill="rgba(255,255,255,0.7)"
                  align="center"
                  verticalAlign="middle"
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
   * 渲染當前下落的方塊
   */
  const renderCurrentTetromino = () => {
    if (!currentTetromino) return null;

    const cells = [];
    const { shape, position, color, characters } = currentTetromino;
    let blockIndex = 0;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = (position.x + col) * cellSize;
          const y = (position.y + row) * cellSize;
          const char =
            characters[row]?.[col] ??
            currentTetromino.blockCharacters?.[blockIndex] ??
            null;
          blockIndex++;
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
              {char && (
                <Text
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  text={char}
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

  const renderHighlightBoxes = () => {
    if (!highlightedMatches.length) return null;

    return highlightedMatches.map((match, index) => {
      const xs = match.positions.map(pos => pos.x);
      const ys = match.positions.map(pos => pos.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      return (
        <Group key={`highlight-box-${index}`}>
          <Rect
            x={minX * cellSize - 2}
            y={minY * cellSize - 2}
            width={(maxX - minX + 1) * cellSize + 4}
            height={(maxY - minY + 1) * cellSize + 4}
            stroke="#FFD700"
            strokeWidth={3}
            cornerRadius={6}
            dash={[8, 4]}
            shadowColor="#FFD700"
            shadowBlur={12}
            shadowOpacity={0.8}
          />
        </Group>
      );
    });
  };

  const renderHighlightLabels = () => {
    if (!highlightedMatches.length) return null;

    return highlightedMatches.map((match, index) => {
      const center = match.positions.reduce(
        (acc, pos) => {
          acc.x += pos.x;
          acc.y += pos.y;
          return acc;
        },
        { x: 0, y: 0 }
      );
      center.x /= match.positions.length;
      center.y /= match.positions.length;

      return (
        <Group key={`highlight-label-${index}`}>
          <Text
            x={center.x * cellSize}
            y={center.y * cellSize - cellSize * 0.8}
            text={`${match.word} +${match.score}`}
            fontSize={cellSize * 0.5}
            fontFamily="Noto Sans TC, sans-serif"
            fill="#FFD700"
            stroke="#000000"
            strokeWidth={0.5}
            align="center"
            width={cellSize * 3}
            offsetX={cellSize}
            shadowColor="rgba(0,0,0,0.8)"
            shadowBlur={5}
          />
        </Group>
      );
    });
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

          {/* 高亮框 */}
          {renderHighlightBoxes()}

          {/* 高亮詞語標籤 */}
          {renderHighlightLabels()}
        </Layer>
      </Stage>
    </div>
  );
}
