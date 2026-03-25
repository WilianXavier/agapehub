import React from "react";

type Color =
  | "brand"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral"
  | "tithe"
  | "offer"
  | "campaign"
  | "donors";

interface BadgeProps {
  color?: Color;
  children: React.ReactNode;
}

const colorStyles: Record<Color, string> = {
  brand:    "bg-brand-subtle    text-brand",
  success:  "bg-success-tint   text-success-fg",
  info:     "bg-info-tint      text-info-fg",
  warning:  "bg-warning-tint   text-warning-fg",
  error:    "bg-error-tint     text-error-fg",
  neutral:  "bg-surface-2      text-fg-muted",
  tithe:    "bg-tithe-tint     text-tithe-fg",
  offer:    "bg-offer-tint     text-offer-fg",
  campaign: "bg-campaign-tint  text-campaign-fg",
  donors:   "bg-donors-tint    text-donors-fg",
};

export function Badge({ color = "brand", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorStyles[color]}`}
    >
      {children}
    </span>
  );
}
