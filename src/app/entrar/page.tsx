import { SignInFlow } from "@/features/signin";


export const dynamic = 'force-dynamic';

export default function SingnIn() {
  return (
    <div className="bg-muted/60 min-h-svh flex flex-col items-center justify-center px-3.5 sm:px-6 py-6 sm:py-12">
      <div className="w-full max-w-lg md:max-w-4xl">
        <SignInFlow/>
      </div>
    </div>
  );
}