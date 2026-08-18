import Link from "next/link";
import {
  IoCheckmarkCircleOutline,
  IoCardOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { OrdersResponse } from "../interfaces/orders-response";
import { DeleteOrderButton } from "./DeleteOrderButton";

interface Props {
  orders: OrdersResponse[];
}

export const OrdersTable = ({ orders }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              #ID
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Nombre completo
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Estado
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Opciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="bg-white transition-colors duration-300 hover:bg-slate-50/70"
            >
              <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-slate-900">
                {order.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {order.name}
              </td>
              <td className="px-6 py-4">
                {order.paid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <IoCheckmarkCircleOutline size={14} />
                    Pagada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                    <IoCardOutline size={14} />
                    Pendiente
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex flex-col items-end gap-1">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark hover:underline"
                  >
                    Ver orden
                    <IoChevronForwardOutline size={14} />
                  </Link>
                  {!order.paid && <DeleteOrderButton orderId={order.id} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
