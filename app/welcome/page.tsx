import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser } from "@/lib/db";
import { Welcome } from "@/components/Welcome";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  if (!currentUserId) redirect("/login");

  const user = await getUser(currentUserId);
  if (!user) redirect("/login");

  if (user.onboardingComplete) redirect("/dashboard");

  return (
    <Welcome userName={user.name.split(" ")[0]} currentUserId={currentUserId} />
  );
}
