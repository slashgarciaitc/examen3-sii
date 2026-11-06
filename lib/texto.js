// el sii manda algunas materias en mayusculas: "TÓPICOS DE WEB" -> "Tópicos de web"
export function nombreMateria(texto) {
  if (texto !== texto.toUpperCase()) return texto;
  const minus = texto.toLowerCase();
  return minus.charAt(0).toUpperCase() + minus.slice(1);
}

// "SAUL GARCIA HERNANDEZ" -> "Saul Garcia Hernandez"
export function nombrePropio(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
