"use client"
 
import { SearchInput } from "@/components/inputs/search";

type SearchProcedureProps = {
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export function SearchProcedure({ placeholder = "Buscar procedimento por nome...", className, wrapperClassName }: SearchProcedureProps) {
  return (
    <SearchInput
      className={className}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
    />
  );
}
