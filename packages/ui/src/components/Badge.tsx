import React from "react";

type Color = "violet" | "green" | "yellow" | "red" | "gray" | "blue";

interface BadgeProps {
  color?: Color;
  children: React.ReactNode;
}

const colorStyles: Record<Color, string> = {
  violet: "bg-violet-100 text-violet-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-100 text-blue-700",
};

export function Badge({ color = "violet", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorStyles[color]}`}>
      {children}
    </span>
  );
}
