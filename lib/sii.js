export const SII_URL = process.env.SII_URL || "https://sii.celaya.tecnm.mx/api";

// rutas del sii que el front puede pedir
export const SECCIONES = {
  perfil: "/movil/estudiante",
  calificaciones: "/movil/estudiante/calificaciones",
  kardex: "/movil/estudiante/kardex",
  horarios: "/movil/estudiante/horarios",
};

// saca el exp del jwt (no lo valida, eso lo hace el sii)
export function leerExp(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp || null;
  } catch {
    return null;
  }
}

export function tokenVigente(token) {
  if (!token) return false;
  const exp = leerExp(token);
  if (!exp) return true;
  return exp * 1000 > Date.now();
}
