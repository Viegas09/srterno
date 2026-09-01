/// Identidade visual da marca: ícone de gravata borboleta + "Sr.Terno" numa
/// caligrafia script, sempre sobre fundo escuro — igual à logo física da loja.
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 22, text: "text-2xl" },
    md: { icon: 30, text: "text-4xl" },
    lg: { icon: 40, text: "text-5xl" },
  }[size];

  return (
    <div className="flex items-center gap-2.5 text-gold">
      <svg
        width={sizes.icon}
        height={sizes.icon * 0.6}
        viewBox="0 0 48 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M4 4 L22 12 Q24 14 22 16 L4 24 Q2 14 4 4 Z"
          fill="currentColor"
        />
        <path
          d="M44 4 L26 12 Q24 14 26 16 L44 24 Q46 14 44 4 Z"
          fill="currentColor"
        />
        <circle cx="24" cy="14" r="3.4" fill="currentColor" />
      </svg>
      <span className={`font-script leading-none text-gold-soft ${sizes.text}`}>Sr.Terno</span>
    </div>
  );
}
