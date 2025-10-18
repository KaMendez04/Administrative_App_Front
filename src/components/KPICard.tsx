interface KPICardProps {
  label: string;
  value: string | number;
  tone?: "base" | "alt" | "gold";
}

export function KPICard({ label, value, tone = "base" }: KPICardProps) {
  const toneMap = {
    base: "bg-[#F8F9F3] text-[#5B732E]",
    alt: "bg-[#EAEFE0] text-[#5B732E]",
    gold: "bg-[#FEF6E0] text-[#C19A3D]",
  } as const;

  return (
    <div className={`rounded-2xl ${toneMap[tone]} p-3.5 shadow-sm`}>
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold">{value}</div>
    </div>
  );
}