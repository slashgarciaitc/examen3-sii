// fetch a nuestro backend que siempre regresa { ok, status, datos }
export async function pedir(url, opciones = {}) {
  try {
    const res = await fetch(url, {
      ...opciones,
      headers: { "Content-Type": "application/json" },
      body: opciones.body ? JSON.stringify(opciones.body) : undefined,
    });
    const datos = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, datos };
  } catch {
    return { ok: false, status: 0, datos: { error: "No hay conexión con el servidor" } };
  }
}
