import { getUserLoggedAction } from "@/actions/auth";
import { getUserSubscriptionAction } from "@/actions/subscription";
import Account from "@/features/dashboard/account";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta",
};

export default async function ContaPage() {
  const response = await getUserLoggedAction();

  if (response.status !== 200 || !response.data?.user) {
    redirect("/");
  }

  const subResponse = await getUserSubscriptionAction();
  const subscription = subResponse.status === 200 ? subResponse.data : null;

  return <Account user={response.data.user} subscription={subscription} />;
}
