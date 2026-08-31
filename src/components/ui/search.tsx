"use client"

import * as React from "react"
import { cn } from "@/commons/lib/tw-merge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6"

export interface InputSearchProps
  extends Omit<
    React.ComponentProps<typeof InputGroupInput>,
    "onChange" | "placeholder" | "className" | "results"
  > {
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string) => void
  placeholder?: string
  results?: React.ReactNode
  icon?: React.ReactNode
  wrapperClassName?: string
  resultsAlign?: "inline-start" | "inline-end" | "block-start" | "block-end"
  showClear?: boolean
  ariaLabel?: string
  className?: string
}

export function InputSearch({
  value,
  defaultValue,
  onChange,
  onSearch,
  results,
  icon = <FaMagnifyingGlass className="text-purple-400 text-sm" />,
  wrapperClassName,
  resultsAlign = "inline-end",
  showClear = true,
  placeholder = "Pesquisar...",
  ariaLabel,
  className,
  ...rest
}: InputSearchProps) {
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue ?? ""
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? (value ?? "") : internalValue

  React.useEffect(() => {
    if (defaultValue !== undefined && !isControlled) {
      setInternalValue(defaultValue)
    }
  }, [defaultValue, isControlled])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (!isControlled) setInternalValue(val)
    onChange?.(e)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch?.(currentValue)
    }
  }

  function handleClear() {
    if (!isControlled) setInternalValue("")
    onChange?.(({
      target: { value: "" },
    } as unknown) as React.ChangeEvent<HTMLInputElement>)
    onSearch?.("")
  }

  return (
    <InputGroup className={cn("w-full bg-white shadow-xs rounded-xl border-purple-100/80 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-200 transition-all", wrapperClassName)}>
      <InputGroupAddon align="inline-start" className="pl-3.5 pr-1">
        {icon}
      </InputGroupAddon>

      <InputGroupInput
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn("h-10 text-sm text-gray-800 placeholder:text-gray-400", className)}
        {...rest}
      />

      {currentValue && showClear && (
        <InputGroupAddon align="inline-end" className="pr-2 pl-1">
          <InputGroupButton
            size="xs"
            variant="ghost"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 rounded-full h-6 w-6 p-0 flex items-center justify-center hover:bg-gray-100"
            title="Limpar pesquisa"
          >
            <FaXmark className="text-xs" />
          </InputGroupButton>
        </InputGroupAddon>
      )}

      {results !== undefined && (
        <InputGroupAddon align={resultsAlign}>{results}</InputGroupAddon>
      )}
    </InputGroup>
  )
}
