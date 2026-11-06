import { NextResponse } from "next/server";
import { tokenVigente } from "@/lib/sii";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const valido = tokenVigente(token);
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(valido ? "/dashboard" : "/login", request.url));
  }

  if (pathname.startsWith("/dashboard") && !valido) {
    const respuesta = NextResponse.redirect(new URL("/login", request.url));
    if (token) respuesta.cookies.delete("token");
    return respuesta;
  }

  // la firma de la cookie admin se revisa en las api, aqui solo que exista
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has("admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/login" && valido) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/admin/:path*"],
};
