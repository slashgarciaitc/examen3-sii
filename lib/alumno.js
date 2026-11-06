import { NextResponse } from "next/server";
import { SII_URL } from "./sii";

async function pedirSii(token, ruta) {
  const res = await fetch(`${SII_URL}${ruta}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.data ?? null;
}

// el alumno se identifica con su token del sii, no con lo que mande el front
export async function alumnoActual(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const perfil = await pedirSii(token, "/movil/estudiante");
    if (!perfil?.numero_control) return null;
    return { token, numero_control: perfil.numero_control, nombre: perfil.persona, email: perfil.email };
  } catch {
    return null;
  }
}

export async function kardexAlumno(token) {
  const datos = await pedirSii(token, "/movil/estudiante/kardex");
  return datos?.kardex || [];
}

export function noAutorizado() {
  return NextResponse.json({ error: "Tu sesión expiró, vuelve a iniciar sesión" }, { status: 401 });
}

export const CALIF_MINIMA_ASESOR = 85;
