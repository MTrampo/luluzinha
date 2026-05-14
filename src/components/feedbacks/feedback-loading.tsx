import { cn } from "@/commons/lib/tw-merge";

interface FeedbackLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FeedbackLoading({ 
  title = "Carregando...", 
  description, 
  className 
}: FeedbackLoadingProps) {
  return (
    <div className={cn("h-full flex flex-col items-center justify-center text-center min-h-[300px] animate-in fade-in duration-500", className)}>
      <div className="relative">
        {/* Camada de fundo pulsante */}
        <div className="w-12 h-12 rounded-full border-2 border-gray-100 animate-pulse"></div>
        {/* Spinner principal */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-t-purple-600 animate-spin"></div>
      </div>
      
      {title && (
        <p className="text-gray-900 font-bold mt-6 text-lg tracking-tight">
          {title}
        </p>
      )}
      
      {description && (
        <p className="text-gray-500 text-sm mt-1 max-w-[280px] mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
