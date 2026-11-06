import { NextResponse } from "next/server";
import { SII_URL, SECCIONES } from "@/lib/sii";

function sesionExpirada() {
  const respuesta = NextResponse.json({ error: "Tu sesión expiró, vuelve a iniciar sesión" }, { status: 401 });
  respuesta.cookies.delete("token");
  return respuesta;
}

export async function GET(request, { params }) {
  const { seccion } = await params;
  const ruta = SECCIONES[seccion];
  if (!ruta) {
    return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
  }

  const token = request.cookies.get("token")?.value;
  if (!token) return sesionExpirada();

  let res;
  try {
    res = await fetch(`${SII_URL}${ruta}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el SII" }, { status: 503 });
  }

  const datos = await res.json().catch(() => null);

  if (res.status === 401 || datos?.status === 401 || datos?.code === 401) return sesionExpirada();

  if (!res.ok || !datos) {
    return NextResponse.json({ error: "El SII respondió con un error" }, { status: 502 });
  }

  return NextResponse.json(datos);
}
