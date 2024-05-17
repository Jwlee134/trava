import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  id?: number;
}

export async function setSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export default function getSession() {
  return getIronSession<SessionData>(cookies(), {
    cookieName: "trava-auth-cookie",
    password: process.env.SESSION_PASSWORD!,
  });
}
