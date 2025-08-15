import React from "react"
import type { LucideIcon } from "lucide-react"

interface TextInputWithIconProps {
  icon: LucideIcon
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export default function TextInputWithIcon({
  icon: Icon,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
}: TextInputWithIconProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[20px] w-[20px] text-gray-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-[56px] pl-11 pr-3 text-[16px] rounded-md border border-[#E2E8F0] bg-white
                   outline-none focus:border-[#7FB347] focus:ring-2 focus:ring-[#7FB347]/20 transition-colors"
      />
    </div>
  )
}
