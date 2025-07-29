import { useState } from 'react';
// App.tsxから型定義をインポートします。Inbound, Return, Sampleは在庫計算に必要です。
import type { Product, Outbound, Inbound, Return, Sample } from '../App'; 
import { useInventory } from '../hooks/useInventory'; // 在庫計算フックをインポート

// Appコンポーネントから渡されるProps（引数）の型を定義します
type Props = {
  products: Product[];
  outbounds: Outbound[];
  setOutbounds: (outbounds: Outbound[]) => void;
  // 在庫チェックのために全ての履歴データを受け取ります
  inventoryData: {
    inbounds: Inbound[];
    outbounds: Outbound[];
    returns: Return[];
    samples: Sample[];
  };
};

const OutboundForm = ({ products, outbounds, setOutbounds, inventoryData }: Props) => {
  // 在庫計算フックを利用して、在庫を計算する関数を取得します
  const { calculateStock } = useInventory(inventoryData);

  // フォーム入力用の状態（一時的なメモ帳）を定義します
  const [sku, setSku] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(1);

  // 「登録」ボタンが押されたときの処理
  const handleAdd = () => {
    // SKUが選択されていない、または数量が0以下の場合は処理を中断
    if (!sku || quantity < 1) {
      alert('SKUを選択し、数量を1以上入力してください。');
      return;
    }

    // --- ここからが追加された在庫チェック処理 ---
    // 選択された商品の現在の在庫数を計算します
    const currentStock = calculateStock(sku);
    // もし現在の在庫数が出荷したい数量より少ない場合
    if (currentStock < quantity) {
      // エラーメッセージを表示して処理を中断します
      alert(`在庫が不足しています。現在の在庫数: ${currentStock}`);
      return;
    }
    // --- 在庫チェック処理ここまで ---

    // Appから渡されたsetOutbounds関数を使って、親コンポーネントの状態を更新します
    setOutbounds([...outbounds, { sku, date, quantity }]);
    
    // フォームの入力内容を初期状態に戻します
    setSku('');
    setQuantity(1);
  };

  // SKUコードから商品名を探して返すための補助関数
  const getName = (sku: string) => {
    const match = products.find(p => p.sku === sku);
    return match?.name || '未登録SKU';
  };

  // 画面に表示する内容
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🚚 出荷登録</h2>
      {/* 入力フォーム */}
      <div className="flex gap-2 flex-wrap items-center">
        <select value={sku} onChange={e => setSku(e.target.value)} className="border p-2 rounded">
          <option value="">SKUを選択</option>
          {products.map(p => (
            <option key={p.sku} value={p.sku}>{p.sku}（{p.name}）</option>
          ))}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
        <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border p-2 rounded w-24" />
        <button onClick={handleAdd} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">登録</button>
      </div>

      {/* 出荷履歴テーブル */}
      <table className="w-full table-auto border-collapse border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="border border-gray-600 px-2 py-1">商品名</th>
            <th className="border border-gray-600 px-2 py-1">SKU</th>
            <th className="border border-gray-600 px-2 py-1">日付</th>
            <th className="border border-gray-600 px-2 py-1">数量</th>
          </tr>
        </thead>
        <tbody>
          {outbounds.map((h, idx) => (
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

export default OutboundForm;
