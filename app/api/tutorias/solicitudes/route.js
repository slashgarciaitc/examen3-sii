import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alumnoActual, noAutorizado } from "@/lib/alumno";

export async function POST(request) {
  const alumno = await alumnoActual(request);
  if (!alumno) return noAutorizado();

  const body = await request.json().catch(() => ({}));
  const asesorId = Number(body.asesor_id);
  const mensaje = (body.mensaje || "").trim();

  if (!asesorId || !mensaje) {
    return NextResponse.json({ error: "Escribe un mensaje para el asesor" }, { status: 400 });
  }

  const { data: asesor } = await db()
    .from("asesores")
    .select("id, numero_control, estado")
    .eq("id", asesorId)
    .maybeSingle();

  if (!asesor || asesor.estado !== "aprobado") {
    return NextResponse.json({ error: "Ese asesor no está disponible" }, { status: 404 });
  }
  if (asesor.numero_control === alumno.numero_control) {
    return NextResponse.json({ error: "No puedes pedirte asesoría a ti mismo" }, { status: 400 });
  }

  const { data: pendiente } = await db()
    .from("solicitudes")
    .select("id")
    .eq("asesor_id", asesorId)
    .eq("numero_control", alumno.numero_control)
    .eq("estado", "pendiente")
    .maybeSingle();

  if (pendiente) {
    return NextResponse.json({ error: "Ya tienes una solicitud pendiente con este asesor" }, { status: 409 });
  }

  const { error } = await db().from("solicitudes").insert({
    asesor_id: asesorId,
    numero_control: alumno.numero_control,
    nombre: alumno.nombre,
    email: alumno.email,
    mensaje,
  });

  if (error) return NextResponse.json({ error: "No se pudo enviar la solicitud" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
