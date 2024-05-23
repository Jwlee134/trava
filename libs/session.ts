import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  id?: number;
  isAdmin?: boolean;
}

export async function setSession(id: number, isAdmin: boolean) {
  const session = await getSession();
  session.id = id;
  session.isAdmin = isAdmin;
  await session.save();
}

export default function getSession() {
  return getIronSession<SessionData>(cookies(), {
    cookieName: "trava-auth-cookie",
    password: process.env.SESSION_PASSWORD!,
  });
}
