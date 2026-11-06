import { NextResponse } from "next/server";

export async function POST() {
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.delete("admin");
  return respuesta;
}
