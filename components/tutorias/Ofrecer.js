"use client";

import { useState } from "react";
import { pedir } from "@/lib/pedir";
import { useSii } from "@/lib/useSii";
import { campo, areaTexto, boton, etiqueta, panel } from "@/lib/estilos";
import { Cargando, MensajeError } from "@/components/Estado";

const MINIMA = 85;

export default function Ofrecer() {
  const { datos, error, cargando } = useSii("kardex");
  const [clave, setClave] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError texto={error} />;

  // la mejor calificación de cada materia, solo las de 85 o más
  const mejores = {};
  datos.data.kardex.forEach((m) => {
    const c = Number(m.calificacion);
    if (c >= MINIMA && (!mejores[m.clave_materia] || c > mejores[m.clave_materia].calificacion)) {
      mejores[m.clave_materia] = { nombre: m.nombre_materia, calificacion: c };
    }
  });
  const opciones = Object.entries(mejores).sort((a, b) => a[1].nombre.localeCompare(b[1].nombre));

  if (opciones.length === 0) {
    return (
      <p className="max-w-prose text-gris">
        Para dar asesoría necesitas al menos una materia aprobada con {MINIMA} o más. Todavía no tienes ninguna.
      </p>
    );
  }

  async function registrar(e) {
    e.preventDefault();
    setEnviando(true);
    const { ok, datos } = await pedir("/api/tutorias/asesores", {
      method: "POST",
      body: { clave_materia: clave, disponibilidad },
    });
    setAviso({
      ok,
      texto: ok ? "Registro enviado. Aparecerás en la búsqueda cuando un administrador lo apruebe." : datos.error,
    });
    if (ok) {
      setClave("");
      setDisponibilidad("");
    }
    setEnviando(false);
  }

  return (
    <form onSubmit={registrar} className={`${panel} max-w-xl p-5 sm:p-8`}>
      <p className="text-gris">
        Elige una materia que aprobaste con {MINIMA} o más. Un administrador revisa cada registro antes de publicarlo.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className={etiqueta} htmlFor="materia">
            Materia
          </label>
          <select id="materia" value={clave} onChange={(e) => setClave(e.target.value)} className={campo}>
            <option value="">Elige una materia</option>
            {opciones.map(([c, m]) => (
              <option key={c} value={c}>
                {m.nombre} ({m.calificacion})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={etiqueta} htmlFor="disp">
            Cuándo y dónde puedes
          </label>
          <textarea
            id="disp"
            rows={3}
            placeholder="Lunes y miércoles de 1 a 2 pm, en la biblioteca"
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
            className={areaTexto}
          />
        </div>
      </div>

      {aviso && (
        <p role="status" className={`mt-5 text-sm ${aviso.ok ? "text-alto" : "text-bajo"}`}>
          {aviso.texto}
        </p>
      )}

      <button type="submit" disabled={enviando || !clave || !disponibilidad.trim()} className={`${boton} mt-6`}>
        {enviando ? "Enviando..." : "Registrarme como asesor"}
      </button>
    </form>
  );
}
