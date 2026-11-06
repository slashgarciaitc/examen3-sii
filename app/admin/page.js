"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pedir } from "@/lib/pedir";
import { th, td, botonLinea, panel, contenedor } from "@/lib/estilos";
import Encabezado from "@/components/Encabezado";
import Sello from "@/components/Sello";
import { nombrePropio } from "@/lib/texto";
import { Cargando, MensajeError, Etiqueta } from "@/components/Estado";

const FILTROS = [
  ["pendiente", "Por revisar"],
  ["aprobado", "Aprobados"],
  ["rechazado", "Rechazados"],
  ["todos", "Todos"],
];

function Dato({ titulo, valor, destacado }) {
  return (
    <div className="sm:border-l sm:border-white/15 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
      <dt className="text-sm text-white/60">{titulo}</dt>
      <dd className={`mt-1 font-display text-3xl font-bold tabular-nums sm:text-4xl ${destacado ? "text-oro" : ""}`}>
        {valor}
      </dd>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("pendiente");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    pedir("/api/admin/tutorias").then((r) => {
      if (r.status === 401) return router.replace("/admin/login");
      if (r.ok) setDatos(r.datos);
      else setError(r.datos.error);
    });
  }, [router, version]);

  const cargar = () => setVersion((v) => v + 1);

  async function cambiarEstado(id, estado) {
    const r = await pedir(`/api/admin/asesores/${id}`, { method: "PATCH", body: { estado } });
    if (!r.ok) setError(r.datos.error);
    cargar();
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar este asesor y sus solicitudes?")) return;
    const r = await pedir(`/api/admin/asesores/${id}`, { method: "DELETE" });
    if (!r.ok) setError(r.datos.error);
    cargar();
  }

  async function salir() {
    await pedir("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  let resumen = null;
  if (datos) {
    const { asesores, solicitudes } = datos;
    resumen = (
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        <Dato titulo="Asesores por revisar" valor={asesores.filter((a) => a.estado === "pendiente").length} destacado />
        <Dato titulo="Asesores activos" valor={asesores.filter((a) => a.estado === "aprobado").length} />
        <Dato titulo="Solicitudes" valor={solicitudes.length} />
        <Dato titulo="Asesorías aceptadas" valor={solicitudes.filter((s) => s.estado === "aceptada").length} />
      </dl>
    );
  }

  let contenido;
  if (error) contenido = <MensajeError texto={error} />;
  else if (!datos) contenido = <Cargando />;
  else {
    const { asesores, solicitudes } = datos;
    const visibles = filtro === "todos" ? asesores : asesores.filter((a) => a.estado === filtro);

    contenido = (
      <>
        <section>
          <h2 className="font-display text-2xl font-bold">Asesores</h2>
          <div className="mt-3 flex gap-6 overflow-x-auto border-b border-linea">
            {FILTROS.map(([valor, texto]) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                aria-pressed={filtro === valor}
                className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm ${
                  filtro === valor
                    ? "border-oro font-medium text-tinta"
                    : "border-transparent text-gris hover:text-tinta"
                }`}
              >
                {texto}
              </button>
            ))}
          </div>

          <div className={`${panel} mt-4 overflow-x-auto px-5 sm:px-6`}>
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-linea">
                <tr>
                  <th className={th}>Alumno</th>
                  <th className={th}>Materia</th>
                  <th className={`${th} text-right`}>Calif.</th>
                  <th className={th}>Disponibilidad</th>
                  <th className={th}>Estado</th>
                  <th className={`${th} pr-0`} />
                </tr>
              </thead>
              <tbody>
                {visibles.map((a) => (
                  <tr key={a.id} className="border-b border-linea last:border-b-0">
                    <td className={td}>
                      <p className="font-medium">{nombrePropio(a.nombre)}</p>
                      <p className="text-sm tabular-nums text-gris">{a.numero_control}</p>
                    </td>
                    <td className={td}>{a.nombre_materia}</td>
                    <td className={`${td} py-2 text-right`}>
                      <Sello calif={a.calificacion} chico />
                    </td>
                    <td className={`${td} max-w-56 text-sm text-gris`}>{a.disponibilidad}</td>
                    <td className={td}>
                      <Etiqueta estado={a.estado} />
                    </td>
                    <td className={`${td} whitespace-nowrap pr-0 text-right`}>
                      {a.estado !== "aprobado" && (
                        <button onClick={() => cambiarEstado(a.id, "aprobado")} className={botonLinea}>
                          Aprobar
                        </button>
                      )}
                      {a.estado !== "rechazado" && (
                        <button
                          onClick={() => cambiarEstado(a.id, "rechazado")}
                          className="ml-2 h-9 px-2 text-sm text-gris hover:text-tinta"
                        >
                          Rechazar
                        </button>
                      )}
                      <button
                        onClick={() => eliminar(a.id)}
                        className="ml-2 h-9 px-2 text-sm text-bajo hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibles.length === 0 && <p className="py-8 text-gris">No hay asesores en esta lista.</p>}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">Solicitudes</h2>
          <div className={`${panel} mt-3 overflow-x-auto px-5 sm:px-6`}>
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-linea">
                <tr>
                  <th className={th}>Alumno</th>
                  <th className={th}>Asesor</th>
                  <th className={th}>Materia</th>
                  <th className={th}>Mensaje</th>
                  <th className={th}>Estado</th>
                  <th className={`${th} pr-0 text-right`}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id} className="border-b border-linea last:border-b-0">
                    <td className={td}>{nombrePropio(s.nombre)}</td>
                    <td className={td}>{s.asesores && nombrePropio(s.asesores.nombre)}</td>
                    <td className={td}>{s.asesores?.nombre_materia}</td>
                    <td className={`${td} max-w-64 text-sm text-gris`}>{s.mensaje}</td>
                    <td className={td}>
                      <Etiqueta estado={s.estado} />
                    </td>
                    <td className={`${td} whitespace-nowrap pr-0 text-right text-sm tabular-nums text-gris`}>
                      {new Date(s.creado).toLocaleDateString("es-MX")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {solicitudes.length === 0 && <p className="py-8 text-gris">Todavía no hay solicitudes.</p>}
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-white/10 bg-noche text-white">
        <div className={`${contenedor} flex h-16 items-center justify-between`}>
          <p className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-oro font-display text-sm font-bold text-noche">
              IT
            </span>
            <span className="font-display font-bold">SII Celaya</span>
            <span className="ml-1 text-sm text-white/60">Administración</span>
          </p>
          <button onClick={salir} className="text-sm text-white/65 hover:text-white">
            Salir
          </button>
        </div>
      </header>
      <Encabezado titulo="Tutorías" detalle="Revisa a los asesores y da seguimiento a las solicitudes.">
        {resumen}
      </Encabezado>
      <main className={`${contenedor} flex-1 pb-20 pt-10`}>{contenido}</main>
    </div>
  );
}
