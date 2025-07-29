import { useState } from 'react';
import type { Product } from '../App'; // App.tsxから型定義をインポート

// Appコンポーネントから渡されるPropsの型を定義
type Props = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

const ProductList = ({ products, setProducts }: Props) => {
  // フォーム入力用の状態は、このコンポーネント内で管理
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [jan, setJan] = useState('');

  const handleAdd = () => {
    if (!name || !sku || !jan) return;
    if (products.find(p => p.sku === sku)) {
      alert('SKUが重複しています');
      return;
    }
    // Appから渡されたsetProducts関数を使って、親の状態を更新
    setProducts([...products, { name, sku, jan }]);
    setName(''); setSku(''); setJan('');
  };

  const handleDelete = (skuToDelete: string) => {
    setProducts(products.filter(p => p.sku !== skuToDelete));
  };

  return (
    // JSX（見た目）の部分は変更なし
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🛒 商品マスタ登録</h2>
      <div className="flex gap-2 flex-wrap items-center">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="商品名 *" className="border p-2 rounded" />
        <input value={sku} onChange={e => setSku(e.target.value)} placeholder="SKUコード *" className="border p-2 rounded" />
        <input value={jan} onChange={e => setJan(e.target.value)} placeholder="JANコード *" className="border p-2 rounded" />
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">登録</button>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="border border-gray-600 px-2 py-1">商品名</th>
            <th className="border border-gray-600 px-2 py-1">SKU</th>
            <th className="border border-gray-600 px-2 py-1">JAN</th>
            <th className="border border-gray-600 px-2 py-1">削除</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.sku} className="hover:bg-gray-700">
              <td className="border border-gray-600 px-2 py-1">{p.name}</td>
              <td className="border border-gray-600 px-2 py-1">{p.sku}</td>
              <td className="border border-gray-600 px-2 py-1">{p.jan}</td>
              <td className="border border-gray-600 px-2 py-1 text-center">
                <button onClick={() => handleDelete(p.sku)} className="text-red-500 hover:text-red-400">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
