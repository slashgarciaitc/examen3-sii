import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alumnoActual, noAutorizado } from "@/lib/alumno";

// el asesor acepta o rechaza una solicitud que le llegó
export async function PATCH(request, { params }) {
  const alumno = await alumnoActual(request);
  if (!alumno) return noAutorizado();

  const { id } = await params;
  const { estado } = await request.json().catch(() => ({}));

  if (!["aceptada", "rechazada"].includes(estado)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }

  const { data: solicitud } = await db()
    .from("solicitudes")
    .select("id, estado, asesores(numero_control)")
    .eq("id", id)
    .maybeSingle();

  if (!solicitud || solicitud.asesores.numero_control !== alumno.numero_control) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }
  if (solicitud.estado !== "pendiente") {
    return NextResponse.json({ error: "Esta solicitud ya fue respondida" }, { status: 409 });
  }

  const { error } = await db().from("solicitudes").update({ estado }).eq("id", id);
  if (error) return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
