import React from "react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: string;
  tags?: string[];
}

export function PagePlaceholder({ title, description, icon, tags }: PagePlaceholderProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-violet-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 mb-6">{description}</p>
        {tags && (
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
          <p className="text-xs font-medium text-amber-700 mb-1">🚧 Em desenvolvimento</p>
          <p className="text-xs text-amber-600">Este fluxo será implementado em um prompt dedicado.</p>
        </div>
      </div>
    </div>
  );
}
