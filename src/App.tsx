import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import ProductList from './components/ProductList';
import InboundForm from './components/InboundForm';
import OutboundForm from './components/OutboundForm';
import ReturnForm from './components/ReturnForm';
import SampleForm from './components/SampleForm';
import InventoryView from './components/InventoryView';

// 型定義
export type Product = { name: string; sku: string; jan: string };
export type Inbound = { sku: string; date: string; quantity: number };
export type Outbound = { sku:string; date: string; quantity: number };
export type Return = { sku: string; date: string; quantity: number; reason: string; action: 'Restock' | 'Dispose' };
export type Sample = { sku: string; date: string; quantity: number; destination: string };

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [inbounds, setInbounds] = useLocalStorage<Inbound[]>('inbound', []);
  const [outbounds, setOutbounds] = useLocalStorage<Outbound[]>('outbound', []);
  const [returns, setReturns] = useLocalStorage<Return[]>('returns', []);
  const [samples, setSamples] = useLocalStorage<Sample[]>('samples', []);

  // 在庫計算に必要な全てのデータをまとめる
  const inventoryData = { products, inbounds, outbounds, returns, samples };

  return (
    <BrowserRouter basename="/tools/universal-wms-v1"> {/* ← ここに basename を追加 */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Minimum WMS Template</h1>
        <nav className="mb-4 pb-2 border-b space-x-4">
          <Link to="/inventory" className="text-blue-500 hover:underline">📊 在庫一覧</Link>
          <Link to="/" className="text-blue-500 hover:underline">🛒 商品マスタ</Link>
          <Link to="/inbound" className="text-blue-500 hover:underline">📦 入荷</Link>
          <Link to="/outbound" className="text-blue-500 hover:underline">🚚 出荷</Link>
          <Link to="/return" className="text-blue-500 hover:underline">↩️ 返品</Link>
          <Link to="/sample" className="text-blue-500 hover:underline">🎁 サンプル</Link>
        </nav>

        <Routes>
          {/* 在庫ビュー用のルート - ★★★ ここの変数名を修正しました ★★★ */}
          <Route path="/inventory" element={<InventoryView {...inventoryData} />} />
          <Route path="/" element={<ProductList products={products} setProducts={setProducts} />} />
          <Route path="/inbound" element={<InboundForm products={products} inbounds={inbounds} setInbounds={setInbounds} />} />
          <Route path="/outbound" element={<OutboundForm products={products} outbounds={outbounds} setOutbounds={setOutbounds} inventoryData={inventoryData} />} />
          <Route path="/return" element={<ReturnForm products={products} returns={returns} setReturns={setReturns} />} />
          <Route path="/sample" element={<SampleForm products={products} samples={samples} setSamples={setSamples} inventoryData={inventoryData} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
