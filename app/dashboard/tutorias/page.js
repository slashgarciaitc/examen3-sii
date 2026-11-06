"use client";

import { useState } from "react";
import Encabezado from "@/components/Encabezado";
import Buscar from "@/components/tutorias/Buscar";
import Ofrecer from "@/components/tutorias/Ofrecer";
import Mias from "@/components/tutorias/Mias";
import { contenedor } from "@/lib/estilos";

const PESTANAS = [
  ["buscar", "Buscar asesor"],
  ["ofrecer", "Ofrecer asesoría"],
  ["mias", "Mis tutorías"],
];

export default function TutoriasPage() {
  const [pestana, setPestana] = useState("buscar");

  return (
    <>
      <Encabezado
        titulo="Tutorías"
        detalle="Pide ayuda a compañeros que ya aprobaron la materia, o ayuda tú en las que te fue bien."
      >
        <div role="tablist" className="-mb-10 mt-10 flex gap-6 overflow-x-auto sm:-mb-12">
          {PESTANAS.map(([clave, texto]) => (
            <button
              key={clave}
              role="tab"
              aria-selected={pestana === clave}
              onClick={() => setPestana(clave)}
              className={`whitespace-nowrap border-b-[3px] pb-3 text-sm ${
                pestana === clave
                  ? "border-oro font-medium text-white"
                  : "border-transparent text-white/65 hover:text-white"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>
      </Encabezado>

      <div className={`${contenedor} mt-10`}>
        {pestana === "buscar" && <Buscar />}
        {pestana === "ofrecer" && <Ofrecer />}
        {pestana === "mias" && <Mias />}
      </div>
    </>
  );
}
