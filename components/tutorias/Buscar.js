"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pedir } from "@/lib/pedir";
import { useSii } from "@/lib/useSii";
import { campo, areaTexto, boton, botonLinea, panel } from "@/lib/estilos";
import { Cargando, MensajeError } from "@/components/Estado";
import Sello from "@/components/Sello";
import { nombrePropio, nombreMateria } from "@/lib/texto";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function Buscar() {
  const router = useRouter();
  const kardex = useSii("kardex");
  const [asesores, setAsesores] = useState(null);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    pedir("/api/tutorias/asesores").then(({ ok, status, datos }) => {
      if (status === 401) return router.replace("/login");
      if (ok) setAsesores(datos);
      else setError(datos.error);
    });
  }, [router]);

  async function enviar(asesorId) {
    const { ok, datos } = await pedir("/api/tutorias/solicitudes", {
      method: "POST",
      body: { asesor_id: asesorId, mensaje },
    });
    setAviso({ ok, texto: ok ? "Solicitud enviada. Su respuesta aparece en Mis tutorías." : datos.error });
    if (ok) {
      setAbierto(null);
      setMensaje("");
    }
  }

  if (error) return <MensajeError texto={error} />;
  if (!asesores || kardex.cargando) return <Cargando />;

  // materias que el alumno reprobó alguna vez, para sugerirlas
  const complicadas = [
    ...new Set(
      (kardex.datos?.data?.kardex || [])
        .filter((m) => Number(m.calificacion) < 70)
        .map((m) => nombreMateria(m.nombre_materia)),
    ),
  ];

  const texto = normalizar(busqueda);
  const visibles = asesores.filter((a) => normalizar(a.nombre_materia).includes(texto));

  return (
    <div>
      <input
        type="search"
        aria-label="Buscar asesor por materia"
        placeholder="Buscar por materia"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={`${campo} max-w-sm`}
      />

      {complicadas.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gris">Has reprobado:</span>
          {complicadas.map((m) => (
            <button
              key={m}
              onClick={() => setBusqueda(m)}
              className="rounded-full border border-bajo/30 bg-bajo/5 px-3 py-1 text-bajo hover:bg-bajo/10"
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {aviso && (
        <p role="status" className={`mt-6 text-sm ${aviso.ok ? "text-alto" : "text-bajo"}`}>
          {aviso.texto}
        </p>
      )}

      {visibles.length === 0 ? (
        <p className="mt-10 text-gris">
          {busqueda ? "Nadie da asesoría en esa materia todavía." : "Todavía no hay asesores registrados."}
        </p>
      ) : (
        <ul className={`${panel} mt-8 px-5 sm:px-6`}>
          {visibles.map((a) => (
            <li key={a.id} className="border-b border-linea last:border-b-0 py-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8">
                <div className="flex gap-4">
                  <Sello calif={a.calificacion} />
                  <div>
                    <p className="font-display text-lg font-bold leading-snug">{nombreMateria(a.nombre_materia)}</p>
                    <p className="mt-0.5 text-sm text-gris">Con {nombrePropio(a.nombre)}</p>
                    <p className="mt-2 text-sm">{a.disponibilidad}</p>
                  </div>
                </div>
                {abierto !== a.id && (
                  <button
                    onClick={() => {
                      setAbierto(a.id);
                      setAviso(null);
                    }}
                    className={botonLinea}
                  >
                    Solicitar asesoría
                  </button>
                )}
              </div>

              {abierto === a.id && (
                <div className="mt-4 max-w-xl">
                  <label className="mb-1.5 block text-sm font-medium" htmlFor={`msg-${a.id}`}>
                    ¿Con qué tema necesitas ayuda?
                  </label>
                  <textarea
                    id={`msg-${a.id}`}
                    rows={3}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className={areaTexto}
                  />
                  <div className="mt-3 flex gap-3">
                    <button onClick={() => enviar(a.id)} disabled={!mensaje.trim()} className={`${boton} h-9 text-sm`}>
                      Enviar solicitud
                    </button>
                    <button onClick={() => setAbierto(null)} className="text-sm text-gris hover:text-tinta">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
