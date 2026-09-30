import { logoutCookie, rejectCrossOrigin } from "../../../../../lib/security";
export async function POST(request: Request) { const error = rejectCrossOrigin(request); if (error) return error; return Response.json({ message: "Kiléptél." }, { headers: { "Set-Cookie": logoutCookie() } }); }
