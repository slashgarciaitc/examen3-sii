export function Cargando() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Cargando">
      <div className="h-8 w-64 rounded bg-linea" />
      <div className="h-4 w-40 rounded bg-linea" />
      <div className="mt-10 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 rounded bg-linea" style={{ width: `${90 - i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

export function MensajeError({ texto }) {
  return (
    <div className="border-l-2 border-bajo bg-white px-4 py-3">
      <p className="font-medium text-bajo">No se pudo cargar</p>
      <p className="text-sm text-gris">{texto}</p>
    </div>
  );
}

const ESTADOS = {
  pendiente: ["Pendiente", "text-medio"],
  aprobado: ["Aprobado", "text-alto"],
  aceptada: ["Aceptada", "text-alto"],
  rechazado: ["Rechazado", "text-bajo"],
  rechazada: ["Rechazada", "text-bajo"],
};

export function Etiqueta({ estado }) {
  const [texto, color] = ESTADOS[estado] || [estado, "text-gris"];
  return <span className={`text-sm font-medium ${color}`}>{texto}</span>;
}
