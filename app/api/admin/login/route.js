import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revisarPassword, crearSesion, DURACION_SEGUNDOS } from "@/lib/admin";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const usuario = (body.usuario || "").trim();
  const password = body.password || "";

  if (!usuario || !password) {
    return NextResponse.json({ error: "Escribe usuario y contraseña" }, { status: 400 });
  }

  const { data: admin } = await db()
    .from("administradores")
    .select("id, password_hash")
    .eq("usuario", usuario)
    .maybeSingle();

  if (!admin || !revisarPassword(password, admin.password_hash)) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set("admin", crearSesion(admin.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
  });
  return respuesta;
}
