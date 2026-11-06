// uso: node --env-file=.env.local scripts/crear-admin.mjs usuario contraseña
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const [usuario, password] = process.argv.slice(2);
if (!usuario || !password) {
  console.log("uso: node --env-file=.env.local scripts/crear-admin.mjs usuario contraseña");
  process.exit(1);
}

const sal = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, sal, 64).toString("hex");

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { error } = await db.from("administradores").insert({ usuario, password_hash: `${sal}:${hash}` });

if (error) {
  console.log("no se pudo crear:", error.message);
  process.exit(1);
}
console.log(`admin "${usuario}" creado`);
