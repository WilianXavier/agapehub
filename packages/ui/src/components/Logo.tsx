import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

const sizeMap = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ size = "md", variant = "full" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="var(--color-brand)" />
        <path
          d="M20 30C20 30 10 23.5 10 16.5C10 13.4 12.4 11 15.5 11C17.4 11 19.1 12 20 13.5C20.9 12 22.6 11 24.5 11C27.6 11 30 13.4 30 16.5C30 23.5 20 30 20 30Z"
          fill="white"
        />
      </svg>
      {variant === "full" && (
        <span className={`font-bold text-fg ${s.text}`}>
          ágape<span className="text-brand">hub</span>
        </span>
      )}
    </div>
  );
}
