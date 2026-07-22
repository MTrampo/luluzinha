"use client"

import { InputSearch } from "@/components/ui/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/commons/lib/tw-merge";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export function SearchInput({ placeholder, className, wrapperClassName }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <InputSearch
      className={className}
      wrapperClassName={cn("w-50 md:w-full max-w-xs", wrapperClassName)}
      defaultValue={currentQuery}
      onSearch={handleSearch}
      placeholder={placeholder}
    />
  );
}
