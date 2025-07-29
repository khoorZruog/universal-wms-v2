import { useState } from 'react';
import type { Product, Inbound } from '../App'; // App.tsxから型定義をインポート

// Appコンポーネントから渡されるPropsの型を定義
type Props = {
  products: Product[];
  inbounds: Inbound[];
  setInbounds: (inbounds: Inbound[]) => void;
};

const InboundForm = ({ products, inbounds, setInbounds }: Props) => {
  // フォーム入力用の状態は、このコンポーネント内で管理
  const [sku, setSku] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(1);

  // 「登録」ボタンが押されたときの処理
  const handleAdd = () => {
    if (!sku || quantity < 1) {
      alert('SKUを選択し、数量を1以上入力してください。');
      return;
    }
    // Appから渡されたsetInbounds関数を使って、親の入荷履歴(inbounds)を更新
    setInbounds([...inbounds, { sku, date, quantity }]);
    // フォームを初期状態に戻す
    setSku('');
    setQuantity(1);
  };

  // SKUから商品名を取得するための補助関数
  const getName = (sku: string) => {
    const match = products.find(p => p.sku === sku);
    return match?.name || '未登録SKU';
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📦 入荷登録</h2>
      {/* 入力フォーム */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* 商品選択ドロップダウン */}
        <select value={sku} onChange={e => setSku(e.target.value)} className="border p-2 rounded">
          <option value="">SKUを選択</option>
          {products.map(p => (
            <option key={p.sku} value={p.sku}>{p.sku}（{p.name}）</option>
          ))}
        </select>
        {/* 日付ピッカー */}
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
        {/* 数量入力 */}
        <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border p-2 rounded w-24" />
        <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">登録</button>
      </div>

      {/* 入荷履歴テーブル */}
      <table className="w-full table-auto border-collapse border border-gray-700 mt-4">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="border border-gray-600 px-2 py-1">商品名</th>
            <th className="border border-gray-600 px-2 py-1">SKU</th>
            <th className="border border-gray-600 px-2 py-1">日付</th>
            <th className="border border-gray-600 px-2 py-1">数量</th>
          </tr>
        </thead>
        <tbody>
          {inbounds.map((h, idx) => (
            <tr key={idx} className="hover:bg-gray-700">
              <td className="border border-gray-600 px-2 py-1">{getName(h.sku)}</td>
              <td className="border border-gray-600 px-2 py-1">{h.sku}</td>
              <td className="border border-gray-600 px-2 py-1">{h.date}</td>
              <td className="border border-gray-600 px-2 py-1 text-right">{h.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InboundForm;
