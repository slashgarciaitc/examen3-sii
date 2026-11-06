-- correr en el SQL Editor de Supabase

create table asesores (
  id bigint generated always as identity primary key,
  numero_control text not null,
  nombre text not null,
  email text not null,
  clave_materia text not null,
  nombre_materia text not null,
  calificacion int not null,
  disponibilidad text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobado', 'rechazado')),
  creado timestamptz not null default now(),
  unique (numero_control, clave_materia)
);

create table solicitudes (
  id bigint generated always as identity primary key,
  asesor_id bigint not null references asesores (id) on delete cascade,
  numero_control text not null,
  nombre text not null,
  email text not null,
  mensaje text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'rechazada')),
  creado timestamptz not null default now()
);

create table administradores (
  id bigint generated always as identity primary key,
  usuario text not null unique,
  password_hash text not null
);

-- sin politicas: solo el backend (service role) puede leer y escribir
alter table asesores enable row level security;
alter table solicitudes enable row level security;
alter table administradores enable row level security;
