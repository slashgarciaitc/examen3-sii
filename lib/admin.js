import crypto from "node:crypto";
import { NextResponse } from "next/server";

const DURACION = 8 * 60 * 60 * 1000;

export function revisarPassword(password, guardado) {
  const [sal, hash] = guardado.split(":");
  const calculado = crypto.scryptSync(password, sal, 64);
  return crypto.timingSafeEqual(calculado, Buffer.from(hash, "hex"));
}

function firmar(texto) {
  return crypto.createHmac("sha256", process.env.ADMIN_SECRET).update(texto).digest("hex");
}

// cookie con forma id.expira.firma
export function crearSesion(id) {
  const valor = `${id}.${Date.now() + DURACION}`;
  return `${valor}.${firmar(valor)}`;
}

export function adminActual(request) {
  const cookie = request.cookies.get("admin")?.value;
  if (!cookie) return null;
  try {
    const [id, expira, firma] = cookie.split(".");
    if (!firma || firma !== firmar(`${id}.${expira}`)) return null;
    if (Number(expira) < Date.now()) return null;
    return Number(id);
  } catch {
    return null;
  }
}

export function noEsAdmin() {
  return NextResponse.json({ error: "Inicia sesión como administrador" }, { status: 401 });
}

export const DURACION_SEGUNDOS = DURACION / 1000;
