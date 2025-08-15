// components/GenericTable.tsx
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Pagination from "./Pagination";
interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    projectName: string;
    team: {
        images: string[];
    };
    status: string;
    budget: string;
}

export interface GenericTableProps<T> {
    data: T[];
    headers: string[];
    renderRow: (item: T, index: number) => React.ReactNode;
    expandedRow?: (item: T, index: number) => React.ReactNode; // ✅ tambahkan ini
}

export default function GenericTable<T>({
    data,
    headers,
    renderRow,
    expandedRow
}: GenericTableProps<T>) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <tbody>
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        {renderRow(item, index)}
                                    </tr>
                                    {expandedRow && expandedRow(item, index)}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
