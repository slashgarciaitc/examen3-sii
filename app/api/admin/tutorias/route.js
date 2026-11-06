import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminActual, noEsAdmin } from "@/lib/admin";

// todo lo que necesita el panel: asesores y solicitudes
export async function GET(request) {
  if (!adminActual(request)) return noEsAdmin();

  const [asesores, solicitudes] = await Promise.all([
    db().from("asesores").select("*").order("creado", { ascending: false }),
    db()
      .from("solicitudes")
      .select("id, nombre, numero_control, mensaje, estado, creado, asesores(nombre, nombre_materia)")
      .order("creado", { ascending: false }),
  ]);

  if (asesores.error || solicitudes.error) {
    return NextResponse.json({ error: "No se pudieron cargar los datos" }, { status: 500 });
  }

  return NextResponse.json({ asesores: asesores.data, solicitudes: solicitudes.data });
}
