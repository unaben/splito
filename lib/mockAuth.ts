import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Not authenticated");
  return id;
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  return session.user as { id: string; name: string; email: string };
}

export async function getMockSession() {
  const user = await getCurrentUser();
  return {
    user: { id: user.id, name: user.name, email: user.email },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
