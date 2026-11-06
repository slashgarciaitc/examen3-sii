import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { alumnoActual, kardexAlumno, noAutorizado, CALIF_MINIMA_ASESOR } from "@/lib/alumno";

// asesores aprobados, sin contar al propio alumno
export async function GET(request) {
  const alumno = await alumnoActual(request);
  if (!alumno) return noAutorizado();

  const { data, error } = await db()
    .from("asesores")
    .select("id, nombre, clave_materia, nombre_materia, calificacion, disponibilidad")
    .eq("estado", "aprobado")
    .neq("numero_control", alumno.numero_control)
    .order("nombre_materia");

  if (error) return NextResponse.json({ error: "No se pudieron cargar los asesores" }, { status: 500 });
  return NextResponse.json(data);
}

// el alumno se ofrece como asesor de una materia que aprobó con buena calificación
export async function POST(request) {
  const alumno = await alumnoActual(request);
  if (!alumno) return noAutorizado();

  const body = await request.json().catch(() => ({}));
  const clave = body.clave_materia;
  const disponibilidad = (body.disponibilidad || "").trim();

  if (!clave || !disponibilidad) {
    return NextResponse.json({ error: "Elige una materia y escribe tu disponibilidad" }, { status: 400 });
  }

  // se revisa contra el kardex real, no contra lo que mande el navegador
  const kardex = await kardexAlumno(alumno.token);
  const cursos = kardex.filter((m) => m.clave_materia === clave);
  const mejor = Math.max(0, ...cursos.map((m) => Number(m.calificacion)));

  if (!cursos.length || mejor < CALIF_MINIMA_ASESOR) {
    return NextResponse.json(
      { error: `Solo puedes dar asesoría en materias con ${CALIF_MINIMA_ASESOR} o más` },
      { status: 400 },
    );
  }

  const { error } = await db().from("asesores").insert({
    numero_control: alumno.numero_control,
    nombre: alumno.nombre,
    email: alumno.email,
    clave_materia: clave,
    nombre_materia: cursos[0].nombre_materia,
    calificacion: mejor,
    disponibilidad,
  });

  if (error?.code === "23505") {
    return NextResponse.json({ error: "Ya te registraste para esta materia" }, { status: 409 });
  }
  if (error) return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}
