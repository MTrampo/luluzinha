'use client'

import { Button } from "@/components/ui/button";
import { LuRefreshCw, LuWifiOff } from "react-icons/lu";

interface ConnectionErrorRetryProps {
  onRetry: () => void;
  message?: string;
  className?: string;
}

export function ConnectionErrorRetry({
  onRetry,
  message = "Tivemos uma pequena oscilação para carregar mais registros.",
  className = "",
}: ConnectionErrorRetryProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-purple-50/70 border border-purple-100/80 text-purple-950 text-sm shadow-xs ${className}`}
    >
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="p-2 bg-purple-100 rounded-full text-purple-600 shrink-0">
          <LuWifiOff className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-xs sm:text-sm text-purple-900">
            {message}
          </span>
          <span className="text-[11px] text-purple-600/70">
            Verifique sua conexão e tente carregar novamente.
          </span>
        </div>
      </div>

      <Button
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto shrink-0 border-purple-200 text-purple-700 hover:bg-purple-100/50 hover:text-purple-900 gap-1.5 text-xs font-semibold cursor-pointer"
      >
        <LuRefreshCw className="w-3.5 h-3.5" />
        Tentar novamente
      </Button>
    </div>
  );
}
