import type { SVGProps } from "react";

export function BrandMark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...props}>
      <rect x="4" y="8" width="56" height="52" rx="17" fill="currentColor" />
      <rect x="17" y="22" width="31" height="25" rx="9" fill="white" />
      <path d="M43 41 55 53V33" fill="white" />
      <rect x="17" y="3" width="7" height="13" rx="3.5" fill="currentColor" />
      <rect x="40" y="3" width="7" height="13" rx="3.5" fill="currentColor" />
    </svg>
  );
}

export function BrandLogo({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className={`brand-logo ${inverse ? "brand-logo--inverse" : ""}`}>
      <BrandMark className="brand-logo__mark" />
      {!compact && (
        <span className="brand-logo__word">
          Agenda<span>IQ</span>
        </span>
      )}
    </div>
  );
}

export function Mascot({
  mood = "happy",
  className = "",
}: {
  mood?: "happy" | "thinking" | "success";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 180 190"
      className={className}
      aria-label="Q, assistente do AgendaIQ"
      role="img"
    >
      <g className={mood === "success" ? "mascot-bounce" : ""}>
        <path
          d="M40 154c-13 7-18 18-20 28M139 154c13 7 18 18 20 28"
          fill="none"
          stroke="#101828"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M42 91c-20 2-30 17-33 29M138 91c18 2 28 13 34 25"
          fill="none"
          stroke="#101828"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <rect x="26" y="25" width="128" height="132" rx="38" fill="#4F46E5" />
        <rect x="51" y="57" width="80" height="67" rx="23" fill="white" />
        <path d="m113 108 30 31v-55" fill="white" />
        <rect x="54" y="12" width="18" height="32" rx="9" fill="#4F46E5" />
        <rect x="108" y="12" width="18" height="32" rx="9" fill="#4F46E5" />
        <circle cx="137" cy="48" r="11" fill="#FF6B4A" />
        {mood === "thinking" ? (
          <>
            <circle cx="75" cy="88" r="5" fill="#101828" />
            <circle cx="105" cy="88" r="5" fill="#101828" />
            <path
              d="M82 108c7-4 14-4 21 0"
              fill="none"
              stroke="#101828"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d="M68 87c5 7 11 7 16 0M98 87c5 7 11 7 16 0"
              fill="none"
              stroke="#101828"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M78 105c8 10 17 10 25 0"
              fill="none"
              stroke="#101828"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </svg>
  );
}
