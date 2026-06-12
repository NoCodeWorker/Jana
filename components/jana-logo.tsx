"use client";

import { cn } from "@/lib/utils";

// Orange brand color — hardcoded so SVG fill works regardless of CSS cascade
const JANA_ORANGE = "#ec690c";

type JanaLogoProps = {
  className?: string;
};

export function JanaLogo({ className }: JanaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 64"
      className={cn("h-11 w-auto select-none", className)}
      aria-label="Logo JANA Producciones y Escuela"
      role="img"
    >
      {/* Card 1: J */}
      <g transform="translate(10, 12) rotate(-8)">
        <rect width="34" height="42" rx="5" fill={JANA_ORANGE} />
        <text
          x="17" y="29"
          textAnchor="middle"
          fontSize="24" fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >J</text>
      </g>

      {/* Card 2: A */}
      <g transform="translate(48, 12) rotate(-3)">
        <rect width="34" height="42" rx="5" fill={JANA_ORANGE} />
        <text
          x="17" y="29"
          textAnchor="middle"
          fontSize="24" fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >A</text>
      </g>

      {/* Card 3: N */}
      <g transform="translate(86, 12) rotate(-6)">
        <rect width="34" height="42" rx="5" fill={JANA_ORANGE} />
        <text
          x="17" y="29"
          textAnchor="middle"
          fontSize="24" fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >N</text>
      </g>

      {/* Card 4: A */}
      <g transform="translate(124, 12) rotate(-2)">
        <rect width="34" height="42" rx="5" fill={JANA_ORANGE} />
        <text
          x="17" y="29"
          textAnchor="middle"
          fontSize="24" fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >A</text>
      </g>

      {/* Stacked text: P R O / D U C / C I O / N E S */}
      <g transform="translate(174, 6)">
        <text x="0" y="13" fontSize="10" fontWeight="900" letterSpacing="2"
          fontFamily="Outfit, sans-serif" fill={JANA_ORANGE}>PRO</text>
        <text x="0" y="25" fontSize="10" fontWeight="900" letterSpacing="2"
          fontFamily="Outfit, sans-serif" fill={JANA_ORANGE}>DUC</text>
        <text x="0" y="37" fontSize="10" fontWeight="900" letterSpacing="2"
          fontFamily="Outfit, sans-serif" fill={JANA_ORANGE}>CIO</text>
        <text x="0" y="49" fontSize="10" fontWeight="900" letterSpacing="2"
          fontFamily="Outfit, sans-serif" fill={JANA_ORANGE}>NES</text>
      </g>
    </svg>
  );
}
