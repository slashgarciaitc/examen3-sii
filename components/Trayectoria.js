"use client";

import { useState } from "react";
import { nivel, colorCalif, fondoCalif } from "@/lib/colores";
import { nombreMateria } from "@/lib/texto";

const TEXTO_NIVEL = { alto: "Aprobada", medio: "Aprobada", bajo: "No acreditada" };

// "17/1" < "17/V" (verano) < "17/2"
function ordenPeriodo(periodo) {
  const [anio, parte] = periodo.split("/");
  return Number(anio) * 10 + ({ 1: 1, V: 2, 2: 3 }[parte] || 0);
}

function tipoCurso(descripcion) {
  if (descripcion.includes("ORDINARIO")) return "Ordinario";
  const t = descripcion.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ficha que aparece sobre la barra con el detalle de la materia
function Ficha({ m, intentos, lado }) {
  const flecha = lado.includes("left-0") ? "left-4" : lado.includes("right-0") ? "right-4" : "left-1/2 -ml-1.5";

  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute bottom-full z-30 mb-3.5 w-72 rounded-xl border border-linea bg-white p-4 text-left text-tinta shadow-[0_16px_40px_-12px_rgba(26,34,48,0.35)] ${lado}`}
    >
      <p className="text-xs text-gris">
        Semestre {m.semestre}, periodo {m.periodo}
      </p>
      <div className="mt-1 flex items-start justify-between gap-4">
        <p className="font-semibold leading-snug">{nombreMateria(m.nombre_materia)}</p>
        <div className="shrink-0 text-right">
          <p className={`text-3xl font-semibold leading-none tabular-nums ${colorCalif(m.calificacion)}`}>
            {m.calificacion}
          </p>
          <p className={`mt-1 text-xs ${colorCalif(m.calificacion)}`}>{TEXTO_NIVEL[nivel(m.calificacion)]}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-linea pt-3">
        <div>
          <dt className="text-xs text-gris">Clave</dt>
          <dd className="mt-0.5 text-sm font-medium">{m.clave_materia}</dd>
        </div>
        <div>
          <dt className="text-xs text-gris">Créditos</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">{m.creditos}</dd>
        </div>
        <div>
          <dt className="text-xs text-gris">Tipo</dt>
          <dd className="mt-0.5 text-sm font-medium">{tipoCurso(m.descripcion)}</dd>
        </div>
      </dl>

      {intentos.length > 1 && (
        <div className="mt-4 border-t border-linea pt-3">
          <p className="text-xs text-gris">La cursaste {intentos.length} veces</p>
          <ol className="mt-2 space-y-2">
            {intentos.map((x) => (
              <li key={x.periodo} className="grid grid-cols-[2.75rem_1fr_2rem] items-center gap-2 text-sm">
                <span className={`tabular-nums ${x === m ? "font-semibold" : "text-gris"}`}>{x.periodo}</span>
                <span className="h-2 overflow-hidden rounded-full bg-papel">
                  <span
                    className={`block h-full rounded-full ${fondoCalif(x.calificacion)}`}
                    style={{ width: `${Math.max(Number(x.calificacion), 4)}%` }}
                  />
                </span>
                <span className={`text-right font-medium tabular-nums ${colorCalif(x.calificacion)}`}>
                  {x.calificacion}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <span className={`absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-linea bg-white ${flecha}`} />
    </div>
  );
}

// una columna por semestre y una barra por cada materia del kardex
export default function Trayectoria({ kardex }) {
  const [activa, setActiva] = useState(null);

  const semestres = {};
  kardex.forEach((m) => {
    if (!semestres[m.semestre]) semestres[m.semestre] = [];
    semestres[m.semestre].push(m);
  });
  const numeros = Object.keys(semestres)
    .map(Number)
    .sort((a, b) => a - b);

  const intentos = activa
    ? kardex
        .filter((m) => m.clave_materia === activa.clave_materia)
        .sort((a, b) => ordenPeriodo(a.periodo) - ordenPeriodo(b.periodo))
    : [];

  // las primeras columnas abren la ficha a la derecha y las ultimas a la izquierda
  function ladoFicha(i) {
    if (i < numeros.length / 3) return "left-0";
    if (i >= (numeros.length * 2) / 3) return "right-0";
    return "left-1/2 -translate-x-1/2";
  }

  return (
    <div onMouseLeave={() => setActiva(null)}>
      <div className="flex items-end gap-1 border-b border-tinta/20 pb-1.5 sm:gap-2.5">
        {numeros.map((sem, i) => {
          // la animacion crea una capa por columna; la que tiene la ficha abierta va al frente
          const alFrente = activa && semestres[sem].includes(activa);
          return (
            <div
              key={sem}
              className={`relative flex min-w-0 flex-1 origin-bottom animate-[crecer_600ms_ease-out_both] flex-col-reverse gap-1 sm:gap-1.5 ${
                alFrente ? "z-30" : ""
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {semestres[sem].map((m) => {
                const esta = activa === m;
                const atenuada = activa && activa.clave_materia !== m.clave_materia;
                return (
                  <div key={m.clave_materia + m.periodo} className="relative">
                    <button
                      type="button"
                      aria-label={`${m.nombre_materia}, periodo ${m.periodo}, calificación ${m.calificacion}`}
                      onMouseEnter={() => setActiva(m)}
                      onFocus={() => setActiva(m)}
                      onBlur={() => setActiva(null)}
                      onClick={() => setActiva(m)}
                      className={`block h-4 w-full rounded-[3px] transition-opacity duration-150 sm:h-7 ${fondoCalif(
                        m.calificacion,
                      )} ${atenuada ? "opacity-25" : ""} ${esta ? "ring-2 ring-tinta ring-offset-2" : ""}`}
                    />
                    {esta && <Ficha m={m} intentos={intentos} lado={ladoFicha(i)} />}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-2.5">
        {numeros.map((sem) => (
          <span key={sem} className="flex-1 text-center text-xs tabular-nums text-gris sm:text-sm">
            {sem}
          </span>
        ))}
      </div>
      <p className="mt-1 text-right text-xs text-gris sm:text-sm">Semestre</p>
    </div>
  );
}
