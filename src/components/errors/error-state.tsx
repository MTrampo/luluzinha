import Image from 'next/image';
import errorSvg from '@/commons/assets/svgs/internal-server-error.svg';
import notFoundSvg from '@/commons/assets/svgs/page-not-found.svg';
import noDataSvg from '@/commons/assets/svgs/no-data.svg';
import searchNotFoundSvg from '@/commons/assets/svgs/data-search-not-found.svg';
import { ReactNode } from 'react';

type ErrorStateProps = {
  type: 'error' | 'empty' | 'not-found' | 'search-not-found';
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({ type, title, description, action, className }: ErrorStateProps) {
  const imgSrc = type === 'error' ? errorSvg : type === 'not-found' ? notFoundSvg : type === 'search-not-found' ? searchNotFoundSvg : noDataSvg;

  return (
    <div className={`col-span-full flex flex-col items-center justify-center py-16 px-4 text-center ${className || ''}`}>
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mb-6">
        <Image src={imgSrc} alt={title} fill className="object-contain" priority />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
