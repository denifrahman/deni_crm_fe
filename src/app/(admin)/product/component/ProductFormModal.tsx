"use client";
import { formatRupiah, parseRupiah } from "@/app/helper/formatNumber";
import { Modal } from "@/components/ui/modal";
import React, { useState, useEffect } from "react";

interface Item {
    detail_id: number;
    product_id: number;
    transaction_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    duration: number;
    hpp: number;
    margin: number;
    status: string;
    price: string;
    speed: string;
    date: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: Product) => void;
    initialData?: Product;
}


export default function LeadFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: Props) {
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [duration, setDuration] = useState<number>(0);
    const [hpp, setHpp] = useState<number>(0);
    const [margin, setMargin] = useState<number>(0);
    const [status, setStatus] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [speed, setSpeed] = useState<string>("");
    const [date, setDate] = useState<string>("");



    const [items, setItems] = useState<Item[]>([
        {
            product_name: "",
            quantity: 1,
            unit_price: 0,
            detail_id: 0,
            created_at: "",
            transaction_id: 0,
            product_id: 0
        },
    ]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setName(initialData.name);
            setDuration(initialData.duration);
            setHpp(initialData.hpp);
            setMargin(initialData.margin);
            setStatus(initialData.status);
            setPrice(initialData.price);
            setSpeed(initialData.speed);
            setDate(initialData.date);
        } else {
            setId(0);
            setName("");
            setDuration(0);
            setHpp(0);
            setMargin(0);
            setStatus("");
            setPrice("");
            setSpeed("");
            setDate("");
        }
    }, [initialData, isOpen]);


    useEffect(() => {
        calculate();
    }, [items]);

    const handleItemChange = <K extends keyof Item>(
        index: number,
        key: K,
        value: Item[K]
    ) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setItems(newItems);
    };

    const calculate = () => {
        let tempTotal = 0;
        items.forEach((item) => {
            tempTotal += item.quantity * item.unit_price;
        });
        setTotal(tempTotal);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                product_name: "",
                quantity: 1,
                unit_price: 0,
                detail_id: 0,
                created_at: "",
                transaction_id: 0,
                product_id: 0
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let detail_items: any[] = [];
        items.forEach((item) => {
            detail_items.push({
                product_id: item.product_id,
                qty: item.quantity,
                price: item.unit_price
            })
        })
        onSubmit({
            name, duration, status, hpp, margin, price, speed, id,
            date: ""
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-5 text-gray-500 dark:text-gray-400">
                    {initialData ? "Edit Product" : "Create Product"}
                </h2>


                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Duration
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        HPP
                    </label>
                    <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        value={hpp}
                        onChange={(e) => setHpp(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Margin
                    </label>
                    <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Price
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-500 text-white border border-gray-500 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                        value={price}
                        disabled
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Speed
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                    />
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
