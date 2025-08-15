'use client';

import { Toaster, toast } from 'sonner';
import GenericTable from "@/components/tables/GenericTable";
import { TableCell } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import qs from 'query-string';
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import DateRangePickerComponent from "@/components/calendar/DateRangePicker";
import ToggleSwitch from "./component/ToggleSwitch";
import { DndContext, useDroppable, useDraggable, closestCorners, PointerSensor, useSensors, useSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
import { DealDetailModal } from "./component/DealDetailModal";
import DealFormModal from "./component/DealFormModal";

const headers = ["ID", "Deal Name", "Phone", "Needs", "Status", "Company", "Date", "Action"];
const STATUSES: Deal['status'][] = ['qualified', 'proposal_send', 'negotiation', 'won', 'lost', 'done'];

interface Deal {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'qualified' | 'proposal_send' | 'negotiation' | 'won' | 'lost' | 'done';
  address: string;
  user_id: number;
  needs: string;
  items: any[]
  date: string;
  action: string
}

export default function OrderTable() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectDeal, setSelectDeal] = useState<Deal | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    search: '',
    startDate: new Date(),
    endDate: new Date()
  });
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showKanban, setShowKanban] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const fetchData = async () => {
    try {
      const query = qs.stringify({
        page: filter.page,
        size: filter.size,
        search: filter.search,
        startDate: formatDateOnly(filter.startDate),
        endDate: formatDateOnly(filter.endDate),
      });
      const res = await fetch(`/api/proxy/v1/deals?${query}`);
      const json = await res.json();
      const raw = json.data ?? [];

      const formatted: Deal[] = raw.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        status: c.status_deal,
        needs: c.needs,
        items: c.items,
        date: new Date(c.created_at).toLocaleDateString("id-ID"),
      }));

      setTotalPage(json?.count || 0);
      setDeals(formatted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const formatDateOnly = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const onSearch = (val: any) => {
    setSearchInput(val?.target?.value);
  };

  const handleOpenDetail = (order: Deal) => {
    setSelectDeal(order);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (order: Deal) => {
    setSelectDeal(order);
    setShowEditModal(true);
  };

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


  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const targetColumn = over.id;
    if (!STATUSES.includes(targetColumn)) return;

    setDeals((prev) => {
      prev.map((i) => {
        const delayDebounce = setTimeout(async () => {
          if (i.id === active.id) {
            i.status = targetColumn
            var url = `/api/proxy/v1/deals/${i?.id}`
            var method = 'PUT'
            const res = await fetch(
              url, {
              body: JSON.stringify(i),
              method: method
            })
          }
        }, 500);
        return () => clearTimeout(delayDebounce);
      })
      return prev.map(c => (c.id === active.id ? { ...c, status: targetColumn } : c))
    }
    );
  };



  const KanbanColumn = ({ status, deals }: { status: Deal['status']; deals: Deal[] }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
      <div
        ref={setNodeRef}
        className={`kanban-column flex-1 p-4 rounded-lg shadow-md min-h-[300px] transition
        ${isOver ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        <h3 className="text-lg font-bold capitalize">{status.replace('_', ' ')}</h3>
        <div className="mt-4 space-y-2">
          {deals.map((customer) => (
            <KanbanItem key={customer.id} customer={customer} />
          ))}
        </div>
      </div>
    );
  };

  const KanbanItem = ({ customer }: { customer: Deal & { items?: any[] } }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id: customer.id });

    const style = {
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.6 : 1,
    } as React.CSSProperties;

    return (
      <div
        onClick={() => {
          setSelectDeal(customer)
          setShowEditModal(true)
        }}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="kanban-item bg-white p-4 mb-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing"
      >
        <h4 className="font-semibold">{customer.name}</h4>
        <p className="text-sm text-gray-600">{customer.phone}</p>

        {customer.items && customer.items.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500 font-semibold mb-1">Items:</p>
            <ul className="space-y-2">
              {customer.items.map((item) => (
                <li
                  key={item.id}
                  className="text-xs text-gray-700 flex justify-between"
                >
                  <div>
                    <span className="block font-medium">{item.product?.name} x {item.qty}</span>
                    {item.approval && !item.approved && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Butuh Approval
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">
                    Rp {item.price?.toLocaleString('id-ID')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const onSubmit = async (payload: any) => {
    try {
      if (payload.action == 'save') {
        let url, method = '';
        if (selectDeal != null) {
          url = `/api/proxy/v1/deals/${selectDeal?.id}`
          method = 'PUT'
        } else {
          url = `/api/proxy/v1/deals`
          method = 'POST'
        }
        const res = await fetch(
          url, {
          body: JSON.stringify(payload),
          method: method
        }
        );
        var result = await res.json()
        if (res.ok) {
          toast.info(result.data)
          fetchData();
        } else {
          toast.error(result.message)
        }
        setShowEditModal(false)
      } else if (payload.action == 'process_order') {
        const body = {
          "deal_id": payload.id,
          "location": payload.address
        }



        const res = await fetch(
          '/api/proxy/v1/orders', {
          body: JSON.stringify(body),
          method: "POST"
        }
        )
        var result = await res.json();
        if (res.ok) {
          toast.success("process deals success")
          fetchData();
        } else {
          toast.error(result.message)
          setShowEditModal(false)
          fetchData();
        }
      } else if (payload.action == 'approve') {
        var body: any[] = [];
        var id = 0;
        console.log(payload)
        payload?.items.forEach((data: any) => {
          if (data.deal_item_id > 0) {
            body.push({
              approved: data.approved
            })
            id = data.deal_item_id
          }
        });

        const res = await fetch(
          '/api/proxy/v1/deals/approve/' + id, {
          body: JSON.stringify(body[0]),
          method: "PUT"
        }
        )
        var result = await res.json();
        if (res.ok) {
          toast.success("approved success")
          fetchData();
        } else {
          toast.error(result.message)
          setShowEditModal(false)
          fetchData();
        }
      }
    } catch (err) {

    }
  }

  const groupeddeals = deals.reduce((acc, customer) => {
    const status = customer.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(customer);
    return acc;
  }, {} as Record<string, Deal[]>);

  return (
    <>
      <ComponentCard title="Deals">
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
            <ToggleSwitch onChange={setShowKanban} />
            <span className="text-sm text-gray-700">Preview Kanban</span>
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
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/deals/export?${query}`, {
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
                    a.download = 'deals_' + new Date().toISOString() + '.xlsx';
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

          </div>
        </div>

        <DealDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          items={selectDeal?.items ?? []}
        />

        {!showKanban && (
          <GenericTable
            data={deals}
            headers={headers}
            renderRow={(order, index) => (
              <>
                <TableCell className="px-4 py-3 text-start text-gray-500">{index + 1}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500">{order.name}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500">{order.phone}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.needs}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500 text-start dark:text-gray-400">{order.status}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500">{order.company}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500">{order.date}</TableCell>
                <TableCell className="px-4 py-3 text-start text-gray-500 space-x-2">
                  {!showKanban && (
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
          />
        )}

        {showKanban && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="kanban-container mt-6 flex gap-4">
              {STATUSES.map((status) => (
                <KanbanColumn key={status} status={status} deals={groupeddeals[status] || []} />
              ))}
            </div>
          </DndContext>
        )}

        <DealFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onSubmit}
          initialData={selectDeal ?? undefined}
        />
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            classNames: {
              error: "bg-red-500 text-white",
              success: "bg-green-500 text-white",
              warning: "bg-yellow-500 text-black",
              info: "bg-blue-500 text-white",
            },
          }}
        />
        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Pagination
            currentPage={filter.page}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            totalPages={Math.ceil(totalPage / 10)}
          />
        </div>
      </ComponentCard>
    </>
  );
}

