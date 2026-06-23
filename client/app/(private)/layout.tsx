import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const layout = async ({ children }: { children: React.ReactNode; }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
};

export default layout;
