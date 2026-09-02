import { SignUpFlow } from "@/features/signup";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Signup() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Suspense fallback={<div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-purple-900" /></div>}>
          <SignUpFlow />
        </Suspense>
      </div>
    </div>
  )
}

