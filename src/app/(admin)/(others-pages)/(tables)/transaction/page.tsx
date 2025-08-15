'use client';


import GenericTable from "@/components/tables/GenericTable";
import { TableCell } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { TransactionDetailModal } from "./component/TransactionDetailModal";
import { formatRupiah } from "@/app/helper/formatNumber";
import TransactionFormModal from "./component/TransactionFormModal";
import qs from 'query-string';
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import DateRangePickerComponent from "@/components/calendar/DateRangePicker";
import ToggleSwitch from "./component/ToggleSwitch";

const headers = ["ID", "Customer Name", "Date", "Total", "Action"];

interface Order {
  id: number;
  customerName: string;
  total: number;
  date: string;
  details: any[]
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [showNested, setShowNested] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    search: '',
    startDate: new Date(),
    endDate: new Date()
  })
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        search: searchInput,
        page: 1, // reset ke page 1 saat search berubah
      }));
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const query = qs.stringify({
        page: filter.page,
        size: filter.size,
        search: filter.search,
        startDate: formatDateOnly(filter.startDate),
        endDate: formatDateOnly(filter.endDate),
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/transactions?${query}`);
      const json = await res.json();
      const raw = json.data ?? [];

      const formatted: Order[] = raw.map((trx: any) => ({
        id: trx.transaction.transaction_id,
        customerName: trx.transaction.customer_name,
        total: trx.transaction.total,
        date: new Date(trx.transaction.transaction_date).toLocaleDateString("id-ID"),
        details: trx.detail_transactions
      }));
      setTotalPage(json.meta_data?.count)
      setOrders(formatted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };


  const onSubmit = async (payload: any) => {
    try {
      let url, method = '';

      if (selectedOrder != null) {
        url = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/transactions/${selectedOrder?.id}`
        method = 'PUT'
      } else {
        url = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/transactions`
        method = 'POST'
      }
      const res = await fetch(
        url, {
        body: JSON.stringify(payload),
        method: method
      }
      );
      const result = await res.json()
      if (res.status == 200 || res.status) {
        fetchOrders();
      }

    } catch (err) {

    }
  }

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const formatDateOnly = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleOpenEdit = (order: Order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const onSearch = (val: any) => {
    setSearchInput(val?.target?.value);
  }
  return (
    <>
      <ComponentCard title="Transaction">
        <div className="flex flex-col gap-3 mt-2 md:flex-row md:flex-wrap md:items-center md:justify-between w-full">
          <div className="w-full sm:w-auto">
            <DateRangePickerComponent
              startDate={filter.startDate}
              endDate={filter.endDate}
              onChange={(start, end) =>
                setFilter((prev) => ({
                  ...prev,
                  startDate: start,
                  endDate: end,
                  page: 1,
                }))
              }
            />
          </div>
          <div className="w-full md:flex-1 md:max-w-[500px] md:mx-auto">
            <div className="relative w-fulls">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>
              <input
                ref={inputRef}
                onChange={onSearch}
                type="text"
                placeholder="Search ..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-50 dark:bg-white/[0.03] dark:text-gray-400 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
                Search
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToggleSwitch onChange={setShowNested} />
            <span className="text-sm text-gray-700">Perlihatkan Detail</span>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={() => {
                const query = qs.stringify({
                  page: filter.page,
                  size: filter.size,
                  search: filter.search,
                  startDate: formatDateOnly(filter.startDate),
                  endDate: formatDateOnly(filter.endDate),
                });
                window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/transactions/export?${query}`, '_blank');
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full sm:w-auto"
            >
              Export Excel
            </button>
            <button
              onClick={() => {
                setSelectedOrder(null);
                setShowEditModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
            >
              Add
            </button>
          </div>
        </div>

        <GenericTable
          data={orders}
          headers={headers}
          renderRow={(order, index) => (
            <>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{index + 1}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.customerName}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.date}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{formatRupiah(order.total)}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400 space-x-2">
                {!showNested && (
                  <button
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    onClick={() => handleOpenDetail(order)}
                  >
                    Detail
                  </button>
                )}
                <button
                  className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                  onClick={() => handleOpenEdit(order)}
                >
                  Edit
                </button>
              </TableCell>

            </>
          )}

        expandedRow= {(order, index) =>
            !showNested ? undefined : <tr key={`details-${order.id}`}>
            <td colSpan={headers.length}>
              <div className="p-4 bg-gray-50 dark:bg-black rounded-md w-full flex justify-center">
                <ul>
                  <table className="w-200  justify-center text-sm">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">No</th>
                        <th className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">Product</th>
                        <th className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">Qty</th>
                        <th className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{index + 1}</td>
                          <td className="py-2">
                            <div className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{item.product_name}</div>
                          </td>
                          <td className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{item.quantity}</td>
                          <td className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{item.unit_price_label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ul>
              </div>
            </td>
          </tr>
          }
        />
        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Pagination
            currentPage={filter.page}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            totalPages={Math.ceil(totalPage / 10)}
          />
        </div>
        {showDetailModal && selectedOrder && (
          <TransactionDetailModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            items={selectedOrder?.details || []}
          />
        )}

        {showEditModal && (
          <TransactionFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSubmit={(data) => {
              const cleaned = data.details.map(({ detail_id, transaction_id, created_at, ...rest }) => rest);
              const payload = {
                customer_name: data.customerName,
                details: cleaned
              }
              onSubmit(payload)
              setShowEditModal(false);
            }}
            initialData={selectedOrder!}
          />
        )}
      </ComponentCard>
    </>
  );

}
