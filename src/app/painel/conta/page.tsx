import { getUserLoggedAction } from "@/actions/auth";
import { getUserSubscriptionAction } from "@/actions/subscription";
import Account from "@/features/dashboard/account";
import { redirect } from "next/navigation";

export default async function ContaPage() {
  const response = await getUserLoggedAction();

  if (response.status !== 200 || !response.data?.user) {
    redirect("/");
  }

  const subResponse = await getUserSubscriptionAction();
  const subscription = subResponse.status === 200 ? subResponse.data : null;

  return <Account user={response.data.user} subscription={subscription} />;
}
