import React from "react";
import { Modal } from "@/components/ui/modal";

interface Product {
  name: string;
}

interface CustomerItem {
  id: number;
  qty: number;
  price: number;
  approval: boolean;
  approved: boolean;
  product: Product;
}

interface DealDetailModal {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export const DealDetailModal: React.FC<DealDetailModal> = ({
  isOpen,
  onClose,
  items,
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 w-[500px]">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-300">Detail Items</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="py-2 dark:text-gray-400">Produk</th>
              <th className="py-2 text-center dark:text-gray-400">Qty</th>
              <th className="py-2 text-right dark:text-gray-400">Harga</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-2">
                  <div className="font-medium dark:text-gray-300 flex items-center gap-2">
                    {item.product.name}
                    {item.approval && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                        Butuh Approval
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 text-center dark:text-gray-300">{item.qty}</td>
                <td className="py-2 text-right text-blue-600 dark:text-blue-400">
                  Rp {item.price.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end font-semibold text-gray-800 dark:text-gray-300">
          Total:
          <span className="ml-2 text-blue-600 dark:text-blue-400">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="mt-6 text-right">
          <button
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
