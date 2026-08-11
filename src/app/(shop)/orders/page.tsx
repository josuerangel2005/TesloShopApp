import type { Metadata } from "next";
import Link from "next/link";
import {
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { Title } from "../../../../ui";

export const metadata: Metadata = {
  title: "Mis órdenes",
  description: "Consulta el historial de tus órdenes de compra.",
};

const orders = [
  {
    id: "TS-10293",
    name: "Mark",
    paid: true,
  },
  {
    id: "TS-10294",
    name: "Mark",
    paid: false,
  },
];

export default function () {
  return (
    <div className="mb-20 flex flex-col items-center px-4 sm:px-0">
      <div className="flex w-full max-w-[900px] flex-col">
        <Title title="Mis Órdenes" subTitle="Historial de tus compras" />

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
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark hover:underline"
                    >
                      Ver orden
                      <IoChevronForwardOutline size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
