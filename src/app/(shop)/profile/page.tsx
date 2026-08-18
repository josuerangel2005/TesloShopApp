import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { Title, ProfileInfo } from "../../../../ui";
import { getUserOrdersAction } from "../../../../ui/features/orders/actions/get-user-orders-action";
import { getPendingOrdersCountAction } from "../../../../ui/features/orders/actions/get-pending-orders-count-action";
import { OrdersTable } from "../../../../ui/features/orders/components/OrdersTable";

export default async function ProfilePage() {
  const handleAuthUseCase = getHandleAuthUseCase();

  const user = await handleAuthUseCase.getCurrentUser();

  if (!user) redirect("/");

  const orders = await getUserOrdersAction();
  const pendingOrdersCount = await getPendingOrdersCountAction();

  return (
    <div>
      <Title title="Perfil" subTitle="Tu información y estado de cuenta" />
      <ProfileInfo
        profile={{
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole() as "USER" | "ADMIN",
          image: user.getImage(),
          emailVerified: user.getEmailVerified(),
        }}
      />
      {pendingOrdersCount > 0 && (
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
            <IoCardOutline size={22} />
          </span>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <p className="text-sm font-semibold text-red-800">
                {pendingOrdersCount === 1
                  ? "Tienes 1 orden pendiente de pago"
                  : `Tienes ${pendingOrdersCount} órdenes pendientes de pago`}
              </p>
              <p className="text-xs text-red-600">
                Completa el pago para confirmar tus órdenes
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-red-700 transition-colors hover:text-red-800 hover:underline"
            >
              Ver mis órdenes
            </Link>
          </div>
        </div>
      )}
      {!(user.getRole().toString() === "ADMIN") && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold text-slate-800">
            Mis Órdenes
          </h2>
          <OrdersTable orders={orders} />
        </section>
      )}
    </div>
  );
}
