/**
 * useKeyboard - 鍵盤控制 Hook
 */

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardHandlers {
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onMoveDown?: () => void;
  onRotate?: () => void;
  onHardDrop?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
}

/**
 * 鍵盤控制 Hook
 * 處理遊戲鍵盤輸入
 */
export function useKeyboard(handlers: KeyboardHandlers, enabled: boolean = true) {
  const handlersRef = useRef(handlers);

  // 更新 handlers 引用（避免重複註冊監聽器）
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { current } = handlersRef;

      // 防止頁面滾動
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'ArrowLeft':
          current.onMoveLeft?.();
          break;

        case 'ArrowRight':
          current.onMoveRight?.();
          break;

        case 'ArrowDown':
          current.onMoveDown?.();
          break;

        case 'ArrowUp':
          current.onRotate?.();
          break;

        case 'Space':
          current.onHardDrop?.();
          break;

        case 'Escape':
        case 'KeyP':
          current.onPause?.();
          break;

        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            current.onRestart?.();
          }
          break;

        default:
          break;
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
