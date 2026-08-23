"use client";

import {
  IoChevronDownOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { updateUserRoleAction } from "../actions/update-user-role-action";

interface Props {
  initialRole: string;
  userId: string;
}

export const RoleSelector = ({ initialRole, userId }: Props) => {
  const onChangeRole = async (newRol: string) => {
    await updateUserRoleAction(userId, newRol);
  };

  const isAdmin = initialRole === "ADMIN";

  return (
    <div className="relative inline-flex items-center">
      <span
        className={`pointer-events-none absolute left-3 inline-flex items-center ${
          isAdmin ? "text-indigo-700" : "text-slate-600"
        }`}
      >
        {isAdmin ? (
          <IoShieldCheckmarkOutline size={14} />
        ) : (
          <IoPersonOutline size={14} />
        )}
      </span>
      <span
        className={`pointer-events-none absolute right-3 inline-flex items-center transition-colors ${
          isAdmin ? "text-indigo-700" : "text-slate-600"
        }`}
      >
        <IoChevronDownOutline size={14} />
      </span>
      <select
        value={initialRole}
        onChange={(event) =>
          onChangeRole(event.target.value as "ADMIN" | "USER")
        }
        aria-label="Rol del usuario"
        className={`inline-flex cursor-pointer appearance-none rounded-full py-1 pl-9 pr-8 text-xs font-semibold ring-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
          isAdmin
            ? "bg-indigo-50 text-indigo-700 ring-indigo-200 hover:bg-indigo-100"
            : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200"
        }`}
      >
        <option value="ADMIN" className="bg-white text-slate-900">
          ADMIN
        </option>
        <option value="USER" className="bg-white text-slate-900">
          USER
        </option>
      </select>
    </div>
  );
};
