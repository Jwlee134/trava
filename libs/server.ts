import { NextResponse } from "next/server";
import getSession, { SessionData } from "./session";

export function protectedHandler<T, K>(
  handler: (
    req: Request,
    paramsObject: { params: T },
    session: Required<SessionData>
  ) => Promise<NextResponse<K>>
) {
  return async function (request: Request, paramsObject: { params: T }) {
    const session = await getSession();
    if (!session.id)
      return NextResponse.json({ success: false }, { status: 401 });
    return await handler(
      request,
      paramsObject,
      session as Required<SessionData>
    );
  };
}
