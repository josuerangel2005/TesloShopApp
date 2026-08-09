import Link from "next/link";
import { Title } from "../../../../ui";

const h2Class = "text-base font-semibold tracking-tight text-slate-800";
const pClass = "text-sm leading-relaxed text-slate-600";
const lawClass =
  "mt-1.5 inline-block rounded-md bg-primary/5 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-primary";

const DotList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/60" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function TerminosPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-0">
      <div className="flex w-full max-w-3xl flex-col text-left">
        <Title title="Términos y Condiciones" subTitle="Última actualización · agosto de 2026" />

        <div className="legal-card overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-4 sm:px-10">
            <p className="text-xs uppercase leading-relaxed tracking-[0.18em] text-slate-400">
              Documento normativo · Aplicable en la República de Colombia
            </p>
          </div>

          <div className="legal-section px-6 py-8 sm:px-10 sm:py-10">
            <ol className="space-y-10">
              <li className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="pt-0.5 font-mono text-sm font-semibold text-primary/60">01</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Aceptación y ámbito de aplicación</h2>
                  <p className={pClass}>
                    El acceso y uso de este sitio web implican la aceptación
                    plena de los presentes términos. Los mensajes de datos
                    generados en la compra tienen plena validez jurídica.
                    <span className={lawClass}>Ley 527 de 1999 · Comercio electrónico</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="flex items-start gap-3">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-primary/60">02</span>
                  </span>
                </span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Información, publicidad y derecho del consumidor</h2>
                  <p className={pClass}>
                    La información exhibida en las fichas de producto constituye
                    los medios de publicidad de la tienda y hace parte del
                    contrato de compraventa. Está prohibida la publicidad
                    engañosa y el uso de datos inexactos o incompletos.
                    <span className={lawClass}>Ley 1480 / 2011 · Estatuto del Consumidor</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">03</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Precios, cobros e impuestos</h2>
                  <p className={pClass}>
                    Los precios se expresan en dólares estadounidenses (USD) e
                    incluyen los tributos aplicables a la venta. La confirmación
                    del pedido no genera cobro alguno hasta que el resumen de la
                    orden sea aceptado por usted.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">04</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Derecho de retracto</h2>
                  <p className={pClass}>
                    De acuerdo con el artículo 47 del Estatuto del Consumidor,
                    usted puede ejercer el derecho de retracto dentro de los
                    <strong className="font-semibold text-slate-800"> cinco (5) días hábiles </strong>
                    siguientes a la entrega del producto en su estado original,
                    con sus etiquetas y sin uso. Quedan excluidos los productos
                    personalizados o elaborados a la medida.
                    <span className={lawClass}>Art. 47 · Ley 1480 / 2011</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">05</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Garantía de los productos</h2>
                  <p className={pClass}>
                    Los productos ofrecidos gozan de la garantía legal prevista
                    en el ordenamiento jurídico colombiano. La tienda responderá
                    por los defectos de calidad, idoneidad o conformidad
                    certificados dentro de los términos señalados por la ley.
                    <span className={lawClass}>Art. 11 · Ley 1480 / 2011</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">06</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Envíos y entrega</h2>
                  <p className={pClass}>
                    Los tiempos de entrega estimados se comunican al confirmar
                    la orden y dependen de la operadora logística de la región
                    de destino en Colombia. La tienda responderá por la pérdida
                    o el daño del producto hasta su entrega.
                    <span className={lawClass}>Art. 21 · Ley 1480 / 2011</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">07</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Propiedad intelectual</h2>
                  <p className={pClass}>
                    Los textos, logotipos y la disposición general del sitio web
                    son propiedad de sus titulares. Su reproducción total o
                    parcial requiere autorización previa y escrita.
                    <span className={lawClass}>Decisión 351 / 1993 · Régimen Andino</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">08</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Limitación de responsabilidad</h2>
                  <p className={pClass}>
                    La tienda actúa como canal de comercialización y no asume
                    responsabilidad por el uso indebido de los productos, daños
                    indirectos o indisponibilidad del sitio. En ningún caso la
                    responsabilidad excederá del valor pagado por la orden.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">09</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Ley aplicable y jurisdicción</h2>
                  <p className={pClass}>
                    Estos términos se rigen por la legislación de la República
                    de Colombia. Las controversias serán tramitadas ante la
                    <strong className="font-semibold text-slate-800"> Superintendencia de Industria y Comercio (SIC) </strong>
                    o la jurisdicción ordinaria colombiana, a elección del
                    consumidor.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">10</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Contacto</h2>
                  <p className={pClass}>
                    Escríbanos a{" "}
                    <span className="font-medium text-primary">contacto@tesloshop.co</span>{" "}
                    y atenderemos su petición dentro de los quince (15) días
                    hábiles siguientes. Para consultas de privacidad, consulte
                    nuestra{" "}
                    <Link href="/politicas" className="font-medium text-primary hover:underline">
                      Política de Privacidad
                    </Link>
                    .
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5 sm:px-10">
            <p className="text-xs leading-relaxed text-slate-400">
              Proyecto académico de demostración: los textos son ilustrativos y
              no constituyen asesoría legal.
            </p>
            <Link
              href="/checkout"
              className="btn-primary mt-4 inline-flex w-fit justify-center text-center"
            >
              Volver al checkout
            </Link>
          </div>
        </div>

        <style>{`
          .legal-card { animation: legalFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
          @keyframes legalFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .legal-card { opacity: 1; animation: none; }
          }
        `}</style>
      </div>
    </div>
  );
}