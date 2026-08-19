import type { Metadata } from "next";
import { OrdersItems, Title } from "../../../../../ui";

export const metadata: Metadata = {
  title: "Detalle de la orden",
  description: "Consulta el detalle de tu orden de compra.",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mb-20 flex justify-center items-center px-4 sm:px-0">
      <div className="flex w-full max-w-[1000px] flex-col">
        <Title title={`Orden #${id}`} subTitle="Detalle de tu compra" />
        <OrdersItems id={id} />
      </div>
    </div>
  );
}
