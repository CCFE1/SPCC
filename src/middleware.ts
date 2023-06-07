import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest, res: NextResponse) {
  return NextResponse.next();
}

/* 
* Hace que solo las rutas con la cadena "api" puedan ejecutar este middleware, 
* pero excluye la cadena especifica "api/v1/login".
*/
export const config = {
  matcher: [
    "/((?!api/v1/login | !api/v1/logs).*)(api.*)/",
  ],
};
