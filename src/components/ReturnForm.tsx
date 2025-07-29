import { useState } from 'react';
import type { Product, Return } from '../App'; // App.tsxから型定義をインポート

// Appコンポーネントから渡されるPropsの型を定義
type Props = {
  products: Product[];
  returns: Return[];
  setReturns: (returns: Return[]) => void;
};

const ReturnForm = ({ products, returns, setReturns }: Props) => {
  // フォーム入力用の状態は、このコンポーネント内で管理
  const [sku, setSku] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'Restock' | 'Dispose'>('Restock');

  // 「登録」ボタンが押されたときの処理
  const handleAdd = () => {
    if (!sku || quantity < 1 || !reason) {
      alert('SKU、数量、返品理由をすべて入力してください。');
      return;
    }
    // Appから渡されたsetReturns関数を使って、親の返品履歴(returns)を更新
    setReturns([...returns, { sku, date, quantity, reason, action }]);
    
    // フォームを初期状態に戻す
    setSku('');
    setQuantity(1);
    setReason('');
    setAction('Restock');
  };

  // SKUから商品名を取得するための補助関数
  const getName = (sku: string) => {
    const match = products.find(p => p.sku === sku);
    return match?.name || '未登録SKU';
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">↩️ 返品登録</h2>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap items-center">
          <select value={sku} onChange={e => setSku(e.target.value)} className="border p-2 rounded">
            <option value="">SKUを選択</option>
            {products.map(p => (
              <option key={p.sku} value={p.sku}>{p.sku}（{p.name}）</option>
            ))}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
          <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border p-2 rounded w-24" />
        </div>
        {/* 返品理由のテキストエリア */}
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="返品理由（例：パッケージ破損）"
          className="border p-2 rounded w-full"
          rows={3}
        />
        {/* 処理方法のラジオボタン */}
        <div className="flex items-center gap-4">
          <label>処理方法:</label>
          <label className="flex items-center gap-1">
            <input type="radio" value="Restock" checked={action === 'Restock'} onChange={() => setAction('Restock')} />
            再入荷
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" value="Dispose" checked={action === 'Dispose'} onChange={() => setAction('Dispose')} />
            廃棄
          </label>
        </div>
        <button onClick={handleAdd} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">登録</button>
      </div>

      {/* 返品履歴テーブル */}
      <table className="w-full table-auto border-collapse border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="border border-gray-600 px-2 py-1">商品名</th>
            <th className="border border-gray-600 px-2 py-1">日付</th>
            <th className="border border-gray-600 px-2 py-1">数量</th>
            <th className="border border-gray-600 px-2 py-1">理由</th>
            <th className="border border-gray-600 px-2 py-1">処理</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((h, idx) => (
            <tr key={idx} className="hover:bg-gray-700">
              <td className="border border-gray-600 px-2 py-1">{getName(h.sku)}</td>
              <td className="border border-gray-600 px-2 py-1">{h.date}</td>
              <td className="border border-gray-600 px-2 py-1 text-right">{h.quantity}</td>
              <td className="border border-gray-600 px-2 py-1">{h.reason}</td>
              <td className="border border-gray-600 px-2 py-1">{h.action === 'Restock' ? '再入荷' : '廃棄'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnForm;
