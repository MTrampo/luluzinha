"use client"

import { InputSearch } from "@/components/ui/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type SearchInputProps = {
  placeholder?: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
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
      defaultValue={currentQuery}
      onSearch={handleSearch}
      placeholder={placeholder}
    />
  );
}
