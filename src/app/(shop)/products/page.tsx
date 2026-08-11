import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora todos los productos disponibles en la tienda.",
};

export default function () {
  return (
    <div>
      <h1>Products Page</h1>
    </div>
  );
}
