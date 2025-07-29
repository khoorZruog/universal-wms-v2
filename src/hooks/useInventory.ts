import { useMemo } from 'react';
// ★★★ 不要だった 'Product' のインポートを削除しました ★★★
import type { Inbound, Outbound, Return, Sample } from '../App';

// 在庫計算に必要なデータの型
export type InventoryData = {
  inbounds: Inbound[];
  outbounds: Outbound[];
  returns: Return[];
  samples: Sample[];
};

// 在庫計算ロジックをまとめたカスタムフック
export const useInventory = (data: InventoryData) => {
  // useMemoを使って、データが変更されたときだけ再計算する
  const calculateStock = useMemo(() => {
    return (sku: string) => {
      const inboundTotal = data.inbounds
        .filter(i => i.sku === sku)
        .reduce((sum, i) => sum + i.quantity, 0);

      const outboundTotal = data.outbounds
        .filter(o => o.sku === sku)
        .reduce((sum, o) => sum + o.quantity, 0);

      const returnTotal = data.returns
        .filter(r => r.sku === sku && r.action === 'Restock')
        .reduce((sum, r) => sum + r.quantity, 0);

      const sampleTotal = data.samples
        .filter(s => s.sku === sku)
        .reduce((sum, s) => sum + s.quantity, 0);

      return inboundTotal - outboundTotal + returnTotal - sampleTotal;
    };
  }, [data.inbounds, data.outbounds, data.returns, data.samples]);

  return { calculateStock };
};
