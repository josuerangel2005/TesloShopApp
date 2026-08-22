import type { Metadata } from "next";
import {
  getAllUsersAction,
  getTotalCountUsersAction,
  Title,
  UsersTable,
} from "../../../../../ui";

export const metadata: Metadata = {
  title: "Usuarios",
  description: "Administración de usuarios de la tienda.",
};

interface Props {
  searchParams: Promise<{ page: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const page = +(await searchParams).page;
  const users = await getAllUsersAction({ page });
  const totalUsersCount = await getTotalCountUsersAction();

  return (
    <div className="mb-20 flex flex-col items-center px-4 sm:px-0">
      <div className="flex w-full max-w-[1000px] flex-col">
        <Title title="Usuarios" subTitle="Administración de cuentas y roles" />

        <UsersTable users={users} totalUsers={totalUsersCount} />
      </div>
    </div>
  );
}
