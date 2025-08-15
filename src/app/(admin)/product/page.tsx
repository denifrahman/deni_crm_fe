'use client';


import GenericTable from "@/components/tables/GenericTable";
import { TableCell } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import qs from 'query-string';
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import DateRangePickerComponent from "@/components/calendar/DateRangePicker";
import LeadFormModal from "./component/ProductFormModal";

const headers = ["ID", "Name", "Speed", "Duration", "Status", "Hpp", "Price", "Date", "Action"];

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


export default function OrderTable() {
  const [customers, setCustomers] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Product | null>(null);
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
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const query = qs.stringify({
        page: filter.page,
        size: filter.size,
        search: filter.search,
        startDate: formatDateOnly(filter.startDate),
        endDate: formatDateOnly(filter.endDate),
      });
      const res = await fetch(`/api/proxy/v1/products?${query}`);
      const json = await res.json();
      const raw = json.data ?? [];

      const formatted: Product[] = raw.map((c: any) => ({
        id: c.id,
        name: c.name,
        duration: c.duration,
        hpp: c.hpp,
        margin: c.margin,
        status: c.status,
        price: c.price,
        speed: c.speed,
        date: new Date(c.created_at).toLocaleDateString("id-ID"),
      }));

      setTotalPage(json?.count || 0);
      setCustomers(formatted);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };


  const onSubmit = async (payload: any) => {
    try {
      let url, method = '';
      if (selectedOrder != null) {
        if (payload.status == 'qualified') {
          url = `/api/proxy/v1/products/process/${selectedOrder?.id}`
          method = 'POST'
        } else {
          url = `/api/proxy/v1/products/${selectedOrder?.id}`
          method = 'PUT'
        }
      } else {
        url = `/api/proxy/v1/products`
        method = 'POST'
      }
      const res = await fetch(
        url, {
        body: JSON.stringify(payload),
        method: method
      }
      );
      fetchData();
      setShowEditModal(false)

    } catch (err) {

    }
  }

  const formatDateOnly = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleOpenEdit = (order: Product) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const onSearch = (val: any) => {
    setSearchInput(val?.target?.value);
  }
  return (
    <>
      <ComponentCard title="Products">
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
                placeholder="Search by name"
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-50 dark:bg-white/[0.03] dark:text-gray-400 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
                Search
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={async () => {
                const query = qs.stringify({
                  page: filter.page,
                  size: filter.size,
                  search: filter.search,
                  startDate: formatDateOnly(filter.startDate),
                  endDate: formatDateOnly(filter.endDate),
                });
                const token = document.cookie
                  .split('; ')
                  .find(row => row.startsWith('token='))
                  ?.split('=')[1];
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/product/export?${query}`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                })
                  .then(res => {
                    if (!res.ok) {
                      throw new Error('Failed to download file');
                    }
                    return res.blob();
                  })
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lead_' + new Date().toISOString() + '.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  })
                  .catch(err => console.error(err));
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
          data={customers}
          headers={headers}
          renderRow={(order, index) => (
            <>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start  dark:text-gray-400">{index + 1}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.name}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.speed}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.duration}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.status}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.hpp}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.price}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.date}</TableCell>
              <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400 space-x-2">
                {order?.status != "qualified" && (
                  <button
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded"
                    onClick={() => handleOpenEdit(order)}
                  >
                    Edit
                  </button>
                )}
              </TableCell>

            </>
          )}
        />
        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Pagination
            currentPage={filter.page}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            totalPages={Math.ceil(totalPage / 10)}
          />
        </div>

        <LeadFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onSubmit}
          initialData={selectedOrder ?? undefined}
        />
      </ComponentCard>
    </>
  );

}
