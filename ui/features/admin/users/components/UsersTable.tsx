import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { RoleSelector } from "./RoleSelector";
import { UserResponse } from "../interfaces/user-response";
import { Pagination } from "../../../../components/pagination/Pagination";

interface Props {
  users: UserResponse[];
  totalUsers: number;
}

const ROWS_PER_PAGE = 6;

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-sky-400 to-blue-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-amber-400 to-orange-600",
  "bg-gradient-to-br from-fuchsia-400 to-purple-600",
  "bg-gradient-to-br from-rose-400 to-red-600",
  "bg-gradient-to-br from-indigo-400 to-blue-700",
  "bg-gradient-to-br from-teal-400 to-cyan-600",
  "bg-gradient-to-br from-violet-400 to-indigo-600",
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const UsersTable = ({ users, totalUsers }: Props) => {
  const emptyRows = Math.max(0, ROWS_PER_PAGE - users.length);
  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Usuario
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Rol
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Verificado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="bg-white transition-colors duration-300 hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                        AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                      }`}
                    >
                      {getInitials(user.name)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {user.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <RoleSelector initialRole={user.role} userId={user.id} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <IoCheckmarkCircleOutline size={14} />
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      <IoCloseCircleOutline size={14} />
                      Pendiente
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="px-6 py-4" colSpan={4}>
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination take={6} totalElements={totalUsers} />
    </>
  );
};
