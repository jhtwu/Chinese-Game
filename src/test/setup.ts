/**
 * Vitest 測試設置文件
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 每個測試後自動清理
afterEach(() => {
  cleanup();
});

// 自定義匹配器（可選）
expect.extend({
  // 可以添加自定義的測試匹配器
});
