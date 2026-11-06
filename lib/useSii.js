"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// pide una seccion al backend local, que a su vez llama al sii
export function useSii(seccion) {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    fetch(`/api/sii/${seccion}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (!activo) return;
        if (!res.ok) setError(json.error || "No se pudo cargar la información");
        else setDatos(json);
      })
      .catch(() => activo && setError("No hay conexión con el servidor"))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [seccion, router]);

  return { datos, error, cargando };
}
