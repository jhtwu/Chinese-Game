import { useState } from 'react';

function App() {
  const [message] = useState('中文學習俄羅斯方塊');

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-chinese font-bold text-chinese-red mb-4">
          🀄 {message}
        </h1>
        <p className="text-2xl text-gold mb-8 font-chinese">
          在遊戲中學習中文詞彙
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl">
          <p className="text-white text-lg mb-4 font-chinese">
            歡迎來到中文學習俄羅斯方塊！
          </p>
          <p className="text-gray-300 mb-6 font-chinese">
            專案架構已完成，開發即將開始...
          </p>
          <div className="grid grid-cols-2 gap-4 text-left text-sm">
            <div className="bg-green-500/20 p-4 rounded">
              <p className="text-green-400 font-bold mb-2">✅ 已完成</p>
              <ul className="text-gray-300 space-y-1 font-chinese">
                <li>• 專案結構</li>
                <li>• GDD 設計文檔</li>
                <li>• 技術規格</li>
                <li>• ADR 決策記錄</li>
              </ul>
            </div>
            <div className="bg-blue-500/20 p-4 rounded">
              <p className="text-blue-400 font-bold mb-2">🔄 開發中</p>
              <ul className="text-gray-300 space-y-1 font-chinese">
                <li>• 俄羅斯方塊核心</li>
                <li>• 詞語匹配系統</li>
                <li>• UI 組件</li>
                <li>• 遊戲邏輯</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-gray-500 font-chinese">
          Built with React + TypeScript + Vite
        </p>
      </div>
    </div>
  );
}

export default App;
