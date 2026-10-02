"use client";

import Head from "next/head";
import { useEffect } from "react";
import { registerServiceWorker } from "./register-sw";


export function PwaMetaTags() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Manifest e ícones */}
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
      
      {/* Cor da barra do navegador (para Android e Chrome) */}
      <meta name="theme-color" content="#ffffff" />

      {/* Compatibilidade iOS */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Motor" />

      {/* Compatibilidade Windows / Edge */}
      <meta name="msapplication-TileColor" content="#00abed" />
      <meta name="msapplication-TileImage" content="/web-app-manifest-192x192.png" />
    </Head>
  );
}
