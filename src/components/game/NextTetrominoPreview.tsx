/**
 * NextTetrominoPreview - 顯示下一個方塊預覽
 */

import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Tetromino } from '@/types';

interface NextTetrominoPreviewProps {
  tetromino: Tetromino | null;
  cellSize?: number;
}

const DEFAULT_CELL_SIZE = 25;

export function NextTetrominoPreview({
  tetromino,
  cellSize = DEFAULT_CELL_SIZE,
}: NextTetrominoPreviewProps) {
  if (!tetromino) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-xl border-2 border-gray-700">
        <h3 className="text-lg font-chinese font-bold text-gold mb-3 text-center">
          下一個
        </h3>
        <div className="flex items-center justify-center h-24">
          <div className="text-gray-500 font-chinese">準備中...</div>
        </div>
      </div>
    );
  }

  const { shape, color, characters } = tetromino;
  const stageWidth = 4 * cellSize + 20;
  const stageHeight = 4 * cellSize + 20;

  // 計算方塊在預覽框中的偏移（居中）
  const offsetX = (4 - shape[0].length) * cellSize / 2 + 10;
  const offsetY = (4 - shape.length) * cellSize / 2 + 10;

  const renderTetromino = () => {
    const cells = [];
    let blockIndex = 0;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = offsetX + col * cellSize;
          const y = offsetY + row * cellSize;
          const char =
            characters[row]?.[col] ??
            tetromino.blockCharacters?.[blockIndex] ??
            null;
          blockIndex++;

          cells.push(
            <Group key={`preview-${row}-${col}`}>
              {/* 方塊背景 */}
              <Rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={color}
                stroke="#000000"
                strokeWidth={1}
                shadowColor="black"
                shadowBlur={3}
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

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-xl border-2 border-gray-700">
      <h3 className="text-lg font-chinese font-bold text-gold mb-3 text-center">
        下一個
      </h3>
      <div className="flex items-center justify-center bg-black/30 rounded">
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill="#0a0a0a"
            />
            {renderTetromino()}
          </Layer>
        </Stage>
      </div>
      {tetromino.blockCharacters.length > 0 && (
        <div className="mt-3 text-center text-sm text-gray-200 font-chinese">
          {tetromino.blockCharacters.filter(Boolean).join(' ')}
        </div>
      )}
    </div>
  );
}
