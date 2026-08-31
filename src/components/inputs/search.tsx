"use client"
 
import { InputSearch } from "@/components/ui/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza com mudanças externas na URL
  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  const applySearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      applySearch(value);
    }, 350);
  };

  const handleSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    applySearch(value);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <InputSearch
      className={className}
      wrapperClassName={cn("w-full", wrapperClassName)}
      value={searchTerm}
      onChange={handleChange}
      onSearch={handleSearch}
      placeholder={placeholder}
    />
  );
}
