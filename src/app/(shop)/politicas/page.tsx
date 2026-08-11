import type { Metadata } from "next";
import Link from "next/link";
import { Title } from "../../../../ui";

export const metadata: Metadata = {
  title: "Políticas",
  description:
    "Conoce nuestras políticas de privacidad y el tratamiento de tus datos personales.",
};

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

export default function PoliticasPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-0">
      <div className="flex w-full max-w-3xl flex-col text-left">
        <Title
          title="Política de Privacidad"
          subTitle="Tratamiento de datos personales · Habeas data · Última actualización · agosto de 2026"
        />

        <div className="legal-card overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-4 sm:px-10">
            <p className="text-xs uppercase leading-relaxed tracking-[0.18em] text-slate-400">
              Protección de datos personales · República de Colombia
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <ol className="space-y-10">
              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="pt-0.5 font-mono text-sm font-semibold text-primary/60">01</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Responsable del tratamiento</h2>
                  <p className={pClass}>
                    El sitio web es operado por{" "}
                    <span className="font-medium text-slate-800">
                      Teslo Shop Colombia S.A.S.
                    </span>
                    , responsable del tratamiento de los datos personales
                    suministrados a través de este canal.
                    <span className={lawClass}>Ley 1581 / 2012 · Decreto 1377 / 2013</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">02</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Principios del tratamiento</h2>
                  <p className={pClass}>
                    Todos los datos se tratan conforme a los principios de
                    legalidad, finalidad, libertad, veracidad, transparencia,
                    acceso y circulación restringida, seguridad y
                    confidencialidad.
                    <span className={lawClass}>Art. 4 · Ley 1581 de 2012</span>
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">03</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Datos recopilados</h2>
                  <p className={pClass}>
                    Recopilamos únicamente los datos necesarios para concretar
                    la venta: nombres, apellidos, correo electrónico, teléfono,
                    dirección de entrega, ciudad, país y código postal. Los
                    pagos se procesan a través de la pasarela de pagos, sin que
                    la tienda almacene información de tarjetas.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">04</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Finalidad del uso de los datos</h2>
                  <p className={pClass}>Los datos personales se utilizan para:</p>
                  <DotList
                    items={[
                      "Procesar, facturar y entregar las órdenes de compra.",
                      "Gestionar devoluciones, cambios y garantías.",
                      "Atención al cliente y soporte posventa.",
                      "Cumplir con obligaciones fiscales y contables actuales.",
                    ]}
                  />
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">05</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Derechos del titular</h2>
                  <p className={pClass}>
                    Como titular de los datos, usted puede ejercer sus derechos
                    de manera gratuita en cualquier momento:
                  </p>
                  <DotList
                    items={[
                      "Conocer, actualizar y rectificar sus datos personales.",
                      "Solicitar la supresión cuando se hayan tratado sin autorización.",
                      "Solicitar prueba de la autorización otorgada.",
                      "Presentar quejas ante la autoridad competente.",
                    ]}
                  />
                  <span className={lawClass}>Art. 8 · Ley 1581 de 2012</span>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">06</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Seguridad y confidencialidad</h2>
                  <p className={pClass}>
                    La información reposa en servidores con medidas de
                    seguridad técnicas y organizativas adecuadas. Su
                    información no se venderá ni cederá a terceros, salvo a
                    operadores logísticos o pasarelas de pago estrictamente
                    necesarios para la venta, o por mandato judicial o legal.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">07</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Derecho de Habeas Data</h2>
                  <p className={pClass}>
                    Si usted considera que su información ha sido tratada de
                    forma incorrecta o que las bases de datos contienen datos
                    inexactos, puede presentar queja ante la{" "}
                    <strong className="font-semibold text-slate-800">
                      Superintendencia de Industria y Comercio (SIC)
                    </strong>{" "}
                    — autoridad nacional de protección de datos — dentro de los
                    términos previstos por la ley.
                  </p>
                </div>
              </li>

              <li className="legal-section grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-sm font-semibold text-primary/60">08</span>
                <div className="space-y-2">
                  <h2 className={h2Class}>Consulta, supresión o reclamación</h2>
                  <p className={pClass}>
                    Para ejercer cualquiera de sus derechos, escríbanos a{" "}
                    <span className="font-medium text-primary">
                      privacidad@tesloshop.co
                    </span>
                    . Las consultas se responderán en máximo diez (10) días
                    hábiles y las reclamaciones en quince (15) días hábiles,
                    prorrogables conforme a la ley.
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
            <div className="mt-4 flex items-center gap-3">
              <Link href="/terminos" className="btn-secondary inline-flex w-fit justify-center text-center">
                Terminos y Condiciones
              </Link>
              <Link href="/checkout" className="btn-primary inline-flex w-fit justify-center text-center">
                Volver al checkout
              </Link>
            </div>
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