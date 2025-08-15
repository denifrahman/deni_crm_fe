import React from "react";
import { Modal } from "@/components/ui/modal";

interface DetailItem {
  product_name: string;
  quantity: number;
  unit_price_label: string;
  sku_code?: string;
}

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DetailItem[];
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const total = items.reduce((sum, item) => {
    const numeric = Number(item.unit_price_label.replace(/[^\d]/g, ""));
    return sum + numeric * item.quantity;
  }, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 w-[500px]">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-400">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 dark:text-gray-400">Product</th>
              <th className="py-2 text-center dark:text-gray-400">Qty</th>
              <th className="py-2 text-right dark:text-gray-400">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">
                  <div className="font-medium dark:text-gray-400">{item.product_name}</div>
                </td>
                <td className="py-2 text-center dark:text-gray-400">{item.quantity}</td>
                <td className="py-2 text-right text-blue-600 dark:text-gray-400">{item.unit_price_label}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end font-semibold">
          Total:{" "}
          <span className="ml-2 text-blue-600">
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
