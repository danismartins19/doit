import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const layout = async ({ children }: { children: React.ReactNode; }) => {

  const session = await getServerSession(authOptions);

  console.log("session", session);
  if (session) {
    console.log("nao deve entrar")
    redirect("/");
  }

  return (
    <>{children}</>
  );
};

export default layout;
