
"use client";
import { formatRupiah, parseRupiah } from "@/app/helper/formatNumber";
import { Modal } from "@/components/ui/modal";
import React, { useState, useEffect } from "react";

interface Item {
    id: number;
    detail_id: number;
    product_id: number;
    transaction_id: number;
    product_name: string;
    approval: boolean;
    approved: boolean;
    qty: number;
    price: number;
    created_at: string;
}

interface Deal {
    id: number | null;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
    address: string;
    needs: string;
    items: any[];
    action: string
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: Deal) => void;
    initialData?: Deal;
}

interface Product {
    id: number;
    duration: number;
    speed: string;
    name: string;
    price: number;
}


export default function DealFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("qualified");
    const [id, setId] = useState<number | null>(null);
    const [needs, setNeeds] = useState("");
    const [action, setAction] = useState("");
    const [dealItemId, setDealItemId] = useState(0)
    const [products, setProducts] = useState<Product[]>([]);


    const [items, setItems] = useState<Item[]>([
        {
            id: 0,
            product_name: "",
            qty: 1,
            price: 0,
            detail_id: 0,
            created_at: "",
            approval: false,
            approved: false,
            transaction_id: 0,
            product_id: 0
        },
    ]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setName(initialData.name);
            setPhone(initialData.phone);
            setStatus(initialData.status || "qualified");
            setItems(initialData.items || []);
            setCompany(initialData.company)
            setNeeds(initialData.needs)
            setEmail(initialData.email)
        } else {
            setName("");
            setPhone("");
            setStatus("qualified");
            setCompany("");
            setNeeds("")
            setItems([

            ]);
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
            tempTotal += item.qty * item.price;
        });
        setTotal(tempTotal);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                id: 0,
                product_name: "",
                qty: 1,
                price: 0,
                detail_id: 0,
                approval: false,
                approved: false,
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

    const handleProductSelect = (index: number, productId: number) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
            handleItemChange(index, "product_id", product.id);
            handleItemChange(index, "product_name", product.name);
            handleItemChange(index, "price", product.price);
        }
    };

    useEffect(() => {
        fetch(`/api/proxy/v1/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data.data))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let detail_items: any[] = [];
        items.forEach((item) => {
            detail_items.push({
                product_id: item.product_id,
                qty: item.qty,
                price: item.price,
                approved: item.approved,
                approval: item.approval,
                deal_item_id: dealItemId
            })
        })
        onSubmit({
            name, phone, status, items: detail_items, address, company, email: email, id: id, needs: needs, action: action
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-5 text-gray-500 dark:text-gray-400">
                    {initialData ? "Edit Lead" : "Create Lead"}
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
                        Phone
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Company
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Needs
                    </label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={needs}
                        onChange={(e) => setNeeds(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                    </label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Deal["status"])}
                    >
                        <option value="qualified">Qualified</option>
                        <option value="proposal_send">Proposal Send</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Items
                    </label>
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={item.product_id || ""}
                                onChange={(e) => handleProductSelect(index, Number(e.target.value))}
                            >
                                <option value="">Pilih Produk</option>
                                {products?.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} {product.speed} {product.duration}/Hari
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                inputMode="numeric"
                                className="w-30 border px-2 py-1 rounded"
                                value={formatRupiah(item.price)}
                                onChange={(e) =>
                                    handleItemChange(index, "price", parseRupiah(e.target.value))
                                }
                                required
                            />

                            <input
                                type="number"
                                min={1}
                                className="w-15 border px-2 py-1 rounded"
                                value={item.qty}
                                onChange={(e) =>
                                    handleItemChange(index, "qty", parseInt(e.target.value))
                                }
                                required
                            />

                            {item.approval && (
                                <button
                                    type="submit"
                                    onClick={() => {
                                        if (!item.approved) {
                                            setDealItemId(item.id)
                                            setItems(prevItems =>
                                                prevItems.map((it, i) =>
                                                    i === index ? { ...it, approved: true } : it
                                                )
                                            );
                                            setAction("approve")
                                        }
                                    }}
                                    color="red"
                                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    {!item.approved ? 'Need Approval' : 'Approved'}
                                </button>
                            )}

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
                        <span className="text-base font-semibold">
                            {formatRupiah(total)}
                        </span>
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
                        onClick={() => setAction("save")}
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                    {initialData?.status == 'negotiation' && initialData?.items.some(item => item.approved) && (
                        <button
                            type="submit"
                            onClick={() => setAction("process_order")}
                            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                            Process Order & Request Installation
                        </button>
                    )}
                </div>
            </form>
        </Modal>

    );
}
