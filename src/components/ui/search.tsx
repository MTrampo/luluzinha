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
  icon = <FaMagnifyingGlass />,
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
  const currentValue = isControlled ? value ?? "" : internalValue

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value)
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
    <InputGroup className={cn("max-w-xs", wrapperClassName)}>
      <InputGroupInput
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={className}
        {...rest}
      />

      {currentValue && showClear ? (
        <InputGroupButton size="xs" variant="ghost" onClick={handleClear}>
          <FaXmark />
        </InputGroupButton>
      ) : (
        <InputGroupAddon>{icon}</InputGroupAddon>
      )}

      {results !== undefined && (
        <InputGroupAddon align={resultsAlign}>{results}</InputGroupAddon>
      )}
    </InputGroup>
  )
}
