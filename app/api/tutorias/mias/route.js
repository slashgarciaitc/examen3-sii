import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alumnoActual, noAutorizado } from "@/lib/alumno";

// lo que el alumno ofrece (con las solicitudes que recibió) y lo que pidió
export async function GET(request) {
  const alumno = await alumnoActual(request);
  if (!alumno) return noAutorizado();

  const [ofrezco, pedi] = await Promise.all([
    db()
      .from("asesores")
      .select("id, nombre_materia, disponibilidad, estado, solicitudes(id, nombre, email, mensaje, estado, creado)")
      .eq("numero_control", alumno.numero_control)
      .order("creado", { ascending: false }),
    db()
      .from("solicitudes")
      .select("id, mensaje, estado, creado, asesores(nombre, email, nombre_materia, disponibilidad)")
      .eq("numero_control", alumno.numero_control)
      .order("creado", { ascending: false }),
  ]);

  if (ofrezco.error || pedi.error) {
    return NextResponse.json({ error: "No se pudieron cargar tus tutorías" }, { status: 500 });
  }

  // los correos solo se comparten cuando la solicitud fue aceptada
  const ofrezcoLimpio = ofrezco.data.map((a) => ({
    ...a,
    solicitudes: a.solicitudes.map((s) => ({ ...s, email: s.estado === "aceptada" ? s.email : null })),
  }));
  const pediLimpio = pedi.data.map((s) => ({
    ...s,
    asesores: { ...s.asesores, email: s.estado === "aceptada" ? s.asesores.email : null },
  }));

  return NextResponse.json({ ofrezco: ofrezcoLimpio, pedi: pediLimpio });
}
