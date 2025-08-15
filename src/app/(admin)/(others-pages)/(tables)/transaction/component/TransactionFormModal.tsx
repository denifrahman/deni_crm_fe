"use client";
import { formatRupiah, parseRupiah } from "@/app/helper/formatNumber";
import { Modal } from "@/components/ui/modal";
import React, { useState, useEffect } from "react";

interface Product {
    id: number;
    name: string;
}

interface Item {
    detail_id: number;
    transaction_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    created_at: string
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: { customerName: string; details: Item[] }) => void;
    initialData?: { customerName: string; details: Item[] };
}

export default function TransactionFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData
}: Props) {
    const [customerName, setCustomerName] = useState("");
    const [items, setItems] = useState<Item[]>([{ product_name: "", quantity: 1, unit_price: 0, detail_id: 0, created_at: '', transaction_id: 0 }]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        if (initialData) {
            console.log(initialData)
            setCustomerName(initialData.customerName);
            setItems(initialData.details);
        } else {
            setCustomerName("");
            setItems([{ product_name: "", quantity: 1, unit_price: 0, detail_id: 0, created_at: '', transaction_id: 0 }]);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        caclculate()
    }, [items]);

    const handleItemChange = <K extends keyof Item>(index: number, key: K, value: Item[K]) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setItems(newItems);
        caclculate()
    };

    const caclculate = () => {
        let tempTotal = 0;
        console.log(items)
        items.forEach((item) => {
            tempTotal += item.quantity * item.unit_price
        })
        setTotal(tempTotal);
    }

    const addItem = () => {
        setItems([...items, { product_name: "", quantity: 1, unit_price: 0, created_at: '', detail_id: 0, transaction_id: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const updated = items.filter((_, i) => i !== index);
            setItems(updated);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ customerName, details: items });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-2 mb-5 text-gray-500 text-start  dark:text-gray-400">{initialData == null ? "Add Transaction" : "Edit Transaction"}</h2>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 text-start  dark:text-gray-400">Customer Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded text-gray-500 text-start  dark:text-gray-400"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-500 text-start  dark:text-gray-400">Items</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="text"
                                min={1}
                                className="w-60 border px-2 py-1 rounded text-gray-500 text-start  dark:text-gray-400"
                                value={item.product_name}
                                onChange={(e) => handleItemChange(index, "product_name", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                className="w-30 border px-2 py-1 rounded text-gray-500 text-start  dark:text-gray-400"
                                value={formatRupiah(item.unit_price)}
                                onChange={(e) => handleItemChange(index, "unit_price", parseRupiah(e.target.value))}
                                required
                            />
                            <input
                                type="number"
                                min={1}
                                className="w-15 border px-2 py-1 rounded text-gray-500 text-start dark:text-gray-400"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <div className="flex items-center justify-between mt-4">

                        <button
                            type="button"
                            onClick={addItem}
                            className="text-sm text-blue-500"
                        >
                            + Add Item
                        </button>
                        <span className="text-base font-semibold text-gray-500 text-start  dark:text-gray-400">{formatRupiah(total)}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}
