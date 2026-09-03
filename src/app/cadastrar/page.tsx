import { SignUpFlow } from "@/features/signup";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getInvitationCookie } from "@/commons/lib/auth/invitation";

export const dynamic = 'force-dynamic';

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ convite?: string }>;
}) {
  const { convite } = await searchParams;
  const cookieToken = await getInvitationCookie();
  const activeToken = convite || cookieToken || undefined;

  return (
    <div className="bg-muted/60 min-h-svh flex flex-col items-center justify-center px-3.5 sm:px-6 py-6 sm:py-12">
      <div className="w-full max-w-lg md:max-w-4xl">
        <Suspense fallback={<div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-purple-900" /></div>}>
          <SignUpFlow initialToken={activeToken} />
        </Suspense>
      </div>
    </div>
  );
}


