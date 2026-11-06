"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pedir } from "@/lib/pedir";
import { botonLinea, panel } from "@/lib/estilos";
import { Cargando, MensajeError, Etiqueta } from "@/components/Estado";
import { nombrePropio } from "@/lib/texto";

export default function Mias() {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    pedir("/api/tutorias/mias").then((r) => {
      if (r.status === 401) return router.replace("/login");
      if (r.ok) setDatos(r.datos);
      else setError(r.datos.error);
    });
  }, [router, version]);

  async function responder(id, estado) {
    const r = await pedir(`/api/tutorias/solicitudes/${id}`, { method: "PATCH", body: { estado } });
    if (!r.ok) setError(r.datos.error);
    setVersion((v) => v + 1);
  }

  if (error) return <MensajeError texto={error} />;
  if (!datos) return <Cargando />;

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <section>
        <h2 className="font-display text-2xl font-bold">Asesorías que pediste</h2>
        {datos.pedi.length === 0 ? (
          <p className="mt-3 text-gris">Aún no pides ninguna. Búscala en la pestaña Buscar asesor.</p>
        ) : (
          <ul className={`${panel} mt-3 px-5 sm:px-6`}>
            {datos.pedi.map((s) => (
              <li key={s.id} className="border-b border-linea last:border-b-0 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium">{s.asesores.nombre_materia}</p>
                  <Etiqueta estado={s.estado} />
                </div>
                <p className="text-sm text-gris">Con {nombrePropio(s.asesores.nombre)}</p>
                <p className="mt-2 text-sm">“{s.mensaje}”</p>
                {s.asesores.email && (
                  <p className="mt-3 text-sm">
                    Escríbele a{" "}
                    <a href={`mailto:${s.asesores.email}`} className="font-medium text-azul underline">
                      {s.asesores.email}
                    </a>
                    . Disponible: {s.asesores.disponibilidad}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">Materias en las que das asesoría</h2>
        {datos.ofrezco.length === 0 ? (
          <p className="mt-3 text-gris">No te has registrado como asesor.</p>
        ) : (
          <ul className={`${panel} mt-3 px-5 sm:px-6`}>
            {datos.ofrezco.map((a) => (
              <li key={a.id} className="border-b border-linea last:border-b-0 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-medium">{a.nombre_materia}</p>
                  <Etiqueta estado={a.estado} />
                </div>
                <p className="text-sm text-gris">{a.disponibilidad}</p>

                {a.solicitudes.length === 0 ? (
                  <p className="mt-3 text-sm text-gris">Sin solicitudes por ahora.</p>
                ) : (
                  <ul className="mt-3 space-y-3 border-l border-linea pl-4">
                    {a.solicitudes.map((s) => (
                      <li key={s.id}>
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-sm font-medium">{nombrePropio(s.nombre)}</p>
                          <Etiqueta estado={s.estado} />
                        </div>
                        <p className="text-sm text-gris">“{s.mensaje}”</p>
                        {s.estado === "pendiente" && (
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => responder(s.id, "aceptada")} className={botonLinea}>
                              Aceptar
                            </button>
                            <button
                              onClick={() => responder(s.id, "rechazada")}
                              className="h-9 px-2 text-sm text-gris hover:text-tinta"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                        {s.email && (
                          <a href={`mailto:${s.email}`} className="mt-1 inline-block text-sm text-azul underline">
                            {s.email}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
