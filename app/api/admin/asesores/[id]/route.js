import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminActual, noEsAdmin } from "@/lib/admin";

// aprobar o rechazar a un asesor
export async function PATCH(request, { params }) {
  if (!adminActual(request)) return noEsAdmin();

  const { id } = await params;
  const { estado } = await request.json().catch(() => ({}));

  if (!["aprobado", "rechazado", "pendiente"].includes(estado)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }

  const { data, error } = await db().from("asesores").update({ estado }).eq("id", id).select("id");
  if (error) return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  if (!data.length) return NextResponse.json({ error: "Asesor no encontrado" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!adminActual(request)) return noEsAdmin();

  const { id } = await params;
  const { error } = await db().from("asesores").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
