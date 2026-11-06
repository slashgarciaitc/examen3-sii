import { NextResponse } from "next/server";
import { SII_URL, leerExp } from "@/lib/sii";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").trim();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({ error: "Escribe tu correo y tu contraseña" }, { status: 400 });
  }

  let res;
  try {
    res = await fetch(`${SII_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el SII, intenta más tarde" }, { status: 503 });
  }

  if (res.status >= 500) {
    return NextResponse.json({ error: "El SII no está disponible en este momento" }, { status: 503 });
  }

  const datos = await res.json().catch(() => null);
  const token = datos?.message?.login?.token;

  if (!token) {
    // el sii contesta 200 pero manda status 401 en el json
    if (res.status === 401 || datos?.status === 401) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
    }
    return NextResponse.json({ error: "Respuesta inesperada del SII" }, { status: 502 });
  }

  const exp = leerExp(token);
  const maxAge = exp ? exp - Math.floor(Date.now() / 1000) : 60 * 60;

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return respuesta;
}
