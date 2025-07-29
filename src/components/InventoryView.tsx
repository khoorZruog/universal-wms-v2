import { useInventory } from '../hooks/useInventory';
import type { Product, Inbound, Outbound, Return, Sample } from '../App';

// Appコンポーネントから渡されるPropsの型を定義
type Props = {
  products: Product[];
  inbounds: Inbound[];
  outbounds: Outbound[];
  returns: Return[];
  samples: Sample[];
};

const InventoryView = (props: Props) => {
  // ★★★ useInventoryフックから計算関数を取得するように修正 ★★★
  const { calculateStock } = useInventory(props);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📊 在庫一覧</h2>
      <table className="w-full table-auto border-collapse border border-gray-700 mt-4">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="border border-gray-600 px-2 py-1">商品名</th>
            <th className="border border-gray-600 px-2 py-1">SKU</th>
            <th className="border border-gray-600 px-2 py-1">現在在庫数</th>
          </tr>
        </thead>
        <tbody>
          {props.products.map((p) => (
            <tr key={p.sku} className="hover:bg-gray-700">
              <td className="border border-gray-600 px-2 py-1">{p.name}</td>
              <td className="border border-gray-600 px-2 py-1">{p.sku}</td>
              <td className="border border-gray-600 px-2 py-1 text-right">
                {/* ★★★ フックから取得した関数を正しく呼び出すように修正 ★★★ */}
                {calculateStock(p.sku)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryView;
