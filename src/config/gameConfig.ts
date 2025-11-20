/**
 * 遊戲配置文件
 * 所有可調整的遊戲參數集中管理
 */

export interface GameConfig {
  // 難度設定
  initialLevel: number;
  initialDropInterval: number; // 毫秒
  levelUpLines: number; // 每 N 行升級
  dropSpeedIncrease: number; // 每級速度倍率 (0.9 = 快 10%)

  // 視覺效果
  matchHighlightDuration: number; // 詞語高亮時長（毫秒）
  highlightFlashInterval: number; // 閃爍間隔（毫秒）
  wordRemovalDelay: number; // 詞語消除後延遲（毫秒）
  gravityApplyDelay: number; // 應用重力前延遲（毫秒）

  // 分數設定
  twoCharWordScore: number;
  threeCharWordScore: number;
  fourCharWordScore: number;
  idiomBonus: number;
  hskLevelBonus: number; // 每個 HSK 級別的加分
  lineScore: number; // 每行基礎分數
  comboMultiplier: number; // 連擊倍率

  // UI 設定
  cellSize: number; // 方塊大小（像素）
  maxScoreEvents: number; // 最多顯示的得分事件數
  maxDebugLogs: number; // 最多顯示的 debug 日誌數

  // 遊戲設定
  gridWidth: number;
  gridHeight: number;
  enableGhostPiece: boolean; // 是否顯示幽靈方塊
  enableDebugMode: boolean; // 是否顯示 debug 面板
}

/**
 * 預設配置 - 平衡的遊戲體驗
 */
export const DEFAULT_CONFIG: GameConfig = {
  // 難度設定
  initialLevel: 1,
  initialDropInterval: 1000,
  levelUpLines: 10,
  dropSpeedIncrease: 0.9,

  // 視覺效果
  matchHighlightDuration: 3000,
  highlightFlashInterval: 180,
  wordRemovalDelay: 0,
  gravityApplyDelay: 1000,

  // 分數設定
  twoCharWordScore: 10,
  threeCharWordScore: 20,
  fourCharWordScore: 40,
  idiomBonus: 20,
  hskLevelBonus: 2,
  lineScore: 100,
  comboMultiplier: 0.5,

  // UI 設定
  cellSize: 30,
  maxScoreEvents: 5,
  maxDebugLogs: 8,

  // 遊戲設定
  gridWidth: 10,
  gridHeight: 20,
  enableGhostPiece: true,
  enableDebugMode: true,
};

/**
 * 簡易模式 - 適合初學者
 */
export const EASY_CONFIG: GameConfig = {
  ...DEFAULT_CONFIG,
  initialDropInterval: 1500, // 更慢
  dropSpeedIncrease: 0.95, // 速度增長更緩慢
  matchHighlightDuration: 5000, // 更長的高亮時間
};

/**
 * 困難模式 - 適合高手
 */
export const HARD_CONFIG: GameConfig = {
  ...DEFAULT_CONFIG,
  initialDropInterval: 700, // 更快
  levelUpLines: 5, // 更快升級
  dropSpeedIncrease: 0.85, // 速度增長更快
  matchHighlightDuration: 2000, // 更短的高亮時間
};

/**
 * 學習模式 - 專注於詞語學習
 */
export const LEARNING_CONFIG: GameConfig = {
  ...DEFAULT_CONFIG,
  initialDropInterval: 2000, // 很慢，有時間思考
  matchHighlightDuration: 6000, // 很長的高亮時間
  enableDebugMode: true,
  twoCharWordScore: 20, // 雙倍分數鼓勵
  threeCharWordScore: 40,
  fourCharWordScore: 80,
};

/**
 * 快速模式 - 快節奏遊戲
 */
export const SPEED_CONFIG: GameConfig = {
  ...DEFAULT_CONFIG,
  initialDropInterval: 500,
  matchHighlightDuration: 1500,
  wordRemovalDelay: 0,
  gravityApplyDelay: 500,
};
