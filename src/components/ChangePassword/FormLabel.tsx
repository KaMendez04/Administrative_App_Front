import * as React from "react"

interface FormLabelProps {
  children: React.ReactNode
}

export function FormLabel({ children }: FormLabelProps) {
  return (
    <label className="block text-sm font-medium text-[#2E321B] mb-1">
      {children}
    </label>
  )
}
