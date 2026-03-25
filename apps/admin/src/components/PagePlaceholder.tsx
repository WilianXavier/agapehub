import React from "react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: string;
  tags?: string[];
}

export function PagePlaceholder({ title, description, icon, tags }: PagePlaceholderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24 md:pb-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-brand-subtle rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-fg mb-2">{title}</h1>
        <p className="text-fg-muted mb-6">{description}</p>
        {tags && (
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-brand-subtle text-brand text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-8 p-4 bg-warning-tint border border-warning-border rounded-xl text-left">
          <p className="text-xs font-medium text-warning-fg mb-1">🚧 Em desenvolvimento</p>
          <p className="text-xs text-warning">Este fluxo será implementado em um prompt dedicado.</p>
        </div>
      </div>
    </div>
  );
}
