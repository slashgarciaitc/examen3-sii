# Propuesta: tutorías entre alumnos

## Problema

En el kardex de muchos alumnos se repiten las mismas materias reprobadas (cálculo, estructuras de datos, métodos numéricos). Las asesorías oficiales tienen horarios fijos y pocos lugares, y buscar a alguien que ya pasó la materia depende de conocer a la persona correcta.

## Propuesta

Una sección de tutorías dentro de la app donde:

- Un alumno que aprobó una materia con 85 o más se registra como asesor y pone su disponibilidad.
- Otro alumno busca asesores por materia y les manda una solicitud explicando en qué necesita ayuda.
- El asesor acepta o rechaza. Si acepta, los dos ven el correo institucional del otro para ponerse de acuerdo.
- Un administrador (por ejemplo, de tutorías o de la coordinación) aprueba a los asesores antes de que aparezcan y puede ver todas las solicitudes.

## Beneficios para los estudiantes

- **Ayuda de alguien que ya pasó por lo mismo**, con el mismo plan de estudios y los mismos profesores.
- **Asesores confiables:** la calificación se toma del kardex real del SII, no de lo que el alumno diga.
- **Sugerencias personalizadas:** la app muestra las materias que el alumno ha reprobado para que busque ayuda ahí primero.
- **Privacidad:** el correo solo se comparte cuando el asesor acepta.
- **Para el asesor**, es experiencia que puede contar para actividades complementarias o servicio social si la escuela lo decide.

## Cómo está hecho

- Los datos de tutorías viven en Supabase (Postgres) y solo el backend de Next.js tiene acceso.
- La identidad del alumno sale de su token del SII; el backend consulta el perfil y el kardex en cada operación.
- El panel `/admin` tiene su propio login (usuario y contraseña con hash scrypt y cookie firmada).
