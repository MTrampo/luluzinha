export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("✅ Service Worker registrado com sucesso");

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'activated') {
                // Notifique o usuário sobre a atualização
                console.log('Uma nova versão está disponível. Recarregue a página.');
                // Você pode exibir um toast ou banner aqui
                // Exemplo: showUpdatePrompt();
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error("❌ Falha ao registrar Service Worker:", err);
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

export async function clearServiceWorkerCache() {
  if (!('serviceWorker' in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const serviceWorker = registration.active;

    if (!serviceWorker) {
      return
    }

    await new Promise<void>((resolve, reject) => {
      const messageChannel = new MessageChannel()
      const timeout = setTimeout(() => {
        console.error("Service Worker não respondeu a tempo.")
        reject(new Error("Service Worker timeout"))
      }, 5000)

      messageChannel.port1.onmessage = (event) => {
        clearTimeout(timeout)
        if (event.data && event.data.type === 'CACHE_CLEARED') {
            console.log('Cache limpo com sucesso.')
            resolve()
        } else {
          reject(new Error("Resposta do Service Worker inesperada."))
        }
      }

      serviceWorker.postMessage({ type: 'CACHE_CLEAR' }, [messageChannel.port2])
    })
  } catch (error) {
    console.log("Erro ao limpar o cache:", error)
  }
}