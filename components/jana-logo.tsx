"use client";

import { cn } from "@/lib/utils";

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
        <rect
          width="34"
          height="42"
          rx="5"
          className="fill-jana-primary shadow-sm"
        />
        <text
          x="17"
          y="29"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >
          J
        </text>
      </g>

      {/* Card 2: A */}
      <g transform="translate(48, 12) rotate(-3)">
        <rect
          width="34"
          height="42"
          rx="5"
          className="fill-jana-primary shadow-sm"
        />
        <text
          x="17"
          y="29"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >
          A
        </text>
      </g>

      {/* Card 3: N */}
      <g transform="translate(86, 12) rotate(-6)">
        <rect
          width="34"
          height="42"
          rx="5"
          className="fill-jana-primary shadow-sm"
        />
        <text
          x="17"
          y="29"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >
          N
        </text>
      </g>

      {/* Card 4: A */}
      <g transform="translate(124, 12) rotate(-2)">
        <rect
          width="34"
          height="42"
          rx="5"
          className="fill-jana-primary shadow-sm"
        />
        <text
          x="17"
          y="29"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="Outfit, sans-serif"
          fill="#ffffff"
        >
          A
        </text>
      </g>

      {/* Text column on the right: PRO DUC CIO NES */}
      <g transform="translate(172, 8)">
        <text
          x="0"
          y="11"
          className="fill-jana-primary font-black tracking-widest text-[10px]"
          fontFamily="Outfit, sans-serif"
        >
          PRO
        </text>
        <text
          x="0"
          y="22"
          className="fill-jana-primary font-black tracking-widest text-[10px]"
          fontFamily="Outfit, sans-serif"
        >
          DUC
        </text>
        <text
          x="0"
          y="33"
          className="fill-jana-primary font-black tracking-widest text-[10px]"
          fontFamily="Outfit, sans-serif"
        >
          CIO
        </text>
        <text
          x="0"
          y="44"
          className="fill-jana-primary font-black tracking-widest text-[10px]"
          fontFamily="Outfit, sans-serif"
        >
          NES
        </text>
      </g>
    </svg>
  );
}
