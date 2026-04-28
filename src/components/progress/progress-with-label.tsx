import React from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

type ProgressWithLabelProps = {
  label: string
  value: number
}

export const ProgressWithLabel = React.memo(function ProgressWithLabel({
  label,
  value,
}: ProgressWithLabelProps) {
  return (
    <Field className="w-full max-w-xl">
      <FieldLabel htmlFor="progress-upload">
        <span>{label}</span>
        <span className="ml-auto">{value}%</span>
      </FieldLabel>
      <Progress value={value} id="progress-upload" />
    </Field>
  )
})

ProgressWithLabel.displayName = "ProgressWithLabel"
