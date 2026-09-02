import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/errors/error-state';
import { isSubscriptionActive } from '@/commons/lib/http/security';
import { SubscriptionPayloadCookie } from '@/commons/models/subscription';
import { getCookieSubscription } from '@/commons/lib/auth/subscription';
import { FaArrowLeft } from 'react-icons/fa6';

export default async function NotFound() {
  let targetHref = '/';
  let buttonLabel = 'Voltar para o Início';

  try {
    const cookieValue = await getCookieSubscription();

    if (cookieValue) {
      const subscription: SubscriptionPayloadCookie = JSON.parse(cookieValue);
      if (isSubscriptionActive(subscription)) {
        targetHref = '/painel';
        buttonLabel = 'Voltar para o Painel';
      }
    }
  } catch (error) {
    // Ignorar erros de parse ou renderização estática
  }

  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
      <ErrorState
        type="not-found"
        title="Página não encontrada"
        description="Ops! Parece que você se perdeu. A página que você tentou acessar não existe ou foi movida."
        action={
          <Link href={targetHref}>
            <Button>
              <FaArrowLeft />
              {buttonLabel}
            </Button>
          </Link>
        }
      />
    </div>
  );
}
