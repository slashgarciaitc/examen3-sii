// alto: 85 o más, medio: 70 a 84, bajo: menos de 70
export function nivel(calif) {
  if (calif === null || calif === undefined || calif === "") return null;
  const n = Number(calif);
  if (n >= 85) return "alto";
  if (n >= 70) return "medio";
  return "bajo";
}

const TEXTO = { alto: "text-alto", medio: "text-medio", bajo: "text-bajo" };
const FONDO = { alto: "bg-alto", medio: "bg-medio", bajo: "bg-bajo" };

export function colorCalif(calif) {
  return TEXTO[nivel(calif)] || "text-gris";
}

export function fondoCalif(calif) {
  return FONDO[nivel(calif)] || "bg-linea";
}
