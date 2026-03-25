"use client";

import React, { useActionState, useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createCampaign } from "@/app/(dashboard)/campaigns/new/actions";
import type { CreateCampaignState } from "@/app/(dashboard)/campaigns/new/schema";


// ── Editor WYSIWYG ────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        "px-2.5 py-1.5 rounded text-sm font-medium transition-colors",
        active
          ? "bg-brand text-fg-inv"
          : "text-fg-muted hover:bg-surface-2 hover:text-fg",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function RichTextEditor({
  onChange,
  hasError,
}: {
  onChange: (html: string) => void;
  hasError: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Conte o propósito desta campanha, como os recursos serão usados...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none min-h-[120px] px-4 py-3 text-sm text-fg",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Normaliza conteúdo vazio (<p></p>) para string vazia
      onChange(editor.isEmpty ? "" : html);
    },
  });

  return (
    <div
      className={[
        "border rounded-lg overflow-hidden bg-canvas transition-colors",
        hasError ? "border-error-border" : "border-border",
        "focus-within:ring-2 focus-within:ring-brand focus-within:border-transparent",
      ].join(" ")}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface">
        <ToolbarBtn
          title="Negrito"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          title="Itálico"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn
          title="Lista"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          ≡
        </ToolbarBtn>
        <ToolbarBtn
          title="Lista numerada"
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarBtn>
      </div>
      {/* Conteúdo */}
      <EditorContent
        editor={editor}
        className="[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-fg-muted [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_p]:my-1"
      />
    </div>
  );
}

// ── Upload de imagem com Drag & Drop ──────────────────────────────
function ImageDropzone({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (base64: string) => void;
  hasError: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border h-48 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Capa da campanha" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-canvas text-fg text-sm font-medium rounded-lg hover:bg-surface-2 transition-colors"
          >
            Trocar imagem
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-4 py-2 bg-error text-fg-inv text-sm font-medium rounded-lg hover:bg-error-solid transition-colors"
          >
            Remover
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        "flex flex-col items-center justify-center gap-3 h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
        isDragging
          ? "border-brand bg-brand-subtle"
          : hasError
          ? "border-error-border bg-error-tint"
          : "border-border hover:border-border-3 hover:bg-surface",
      ].join(" ")}
    >
      <div className="text-4xl">🖼️</div>
      <div className="text-center">
        <p className="text-sm font-medium text-fg">
          {isDragging ? "Solte aqui" : "Clique ou arraste uma imagem"}
        </p>
        <p className="text-xs text-fg-muted mt-0.5">PNG, JPG ou WEBP · Recomendado: 1200×630px</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </div>
  );
}

// ── Linha de seção ────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  number?: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-6">
      <h3 className="text-sm font-semibold text-fg mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ── Componente de campo com erro ──────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  return msg ? <p className="text-xs text-error-fg mt-1.5">{msg}</p> : null;
}

const inputCls = (hasErr: boolean) =>
  [
    "w-full px-4 py-2.5 text-sm border rounded-lg bg-canvas text-fg",
    "placeholder:text-fg-muted transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
    hasErr ? "border-error-border" : "border-border",
  ].join(" ");

// ── Formulário principal ──────────────────────────────────────────
export function CampaignWizard({ organizationId }: { organizationId: string }) {
  const [publishMode, setPublishMode] = useState<"draft" | "active">("draft");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [state, formAction, isPending] = useActionState<CreateCampaignState, FormData>(
    createCampaign,
    {}
  );

  const se = state.errors ?? {};

  return (
    <form action={formAction} noValidate>
      {/* Campos hidden */}
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="type" value="CAMPAIGN" />
      <input type="hidden" name="publish" value={publishMode} />
      <input type="hidden" name="description" value={descriptionHtml} />
      <input type="hidden" name="coverUrl" value={coverUrl} />

      <div className="space-y-0">

        {/* ── 1. Imagem de capa ────────────────────────────────────── */}
        <Section number={1} title="Imagem de capa *">
          <ImageDropzone value={coverUrl} onChange={setCoverUrl} hasError={!!se.coverUrl} />
          <FieldError msg={se.coverUrl ?? ""} />
        </Section>

        {/* ── 2. Título ───────────────────────────────────────────── */}
        <Section number={2} title="Título da campanha *">
          <input
            name="title"
            defaultValue={state.values?.title ?? ""}
            placeholder="Ex: Reforma do Templo 2025"
            maxLength={100}
            className={inputCls(!!se.title)}
          />
          <FieldError msg={se.title ?? ""} />
        </Section>

        {/* ── 3. Descrição WYSIWYG ────────────────────────────────── */}
        <Section number={3} title="Descrição *">
          <RichTextEditor onChange={setDescriptionHtml} hasError={!!se.description} />
          <FieldError msg={se.description ?? ""} />
        </Section>

        {/* ── 4. Meta financeira ──────────────────────────────────── */}
        <Section number={4} title="Meta financeira *">
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-fg-muted pointer-events-none select-none">
              R$
            </span>
            <input
              name="goalAmount"
              type="number"
              min="1"
              step="0.01"
              defaultValue={state.values?.goalAmount ?? ""}
              placeholder="0,00"
              className={inputCls(!!se.goalAmount) + " pl-10"}
            />
          </div>
          <FieldError msg={se.goalAmount ?? ""} />
        </Section>

        {/* ── 5. Período ──────────────────────────────────────────── */}
        <Section number={5} title="Período *">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-fg-muted mb-1.5">
                Data de início
              </label>
              <input
                type="date"
                name="startsAt"
                defaultValue={state.values?.startsAt ?? ""}
                className={inputCls(!!se.startsAt)}
              />
              <FieldError msg={se.startsAt ?? ""} />
            </div>
            <div>
              <label className="block text-xs font-medium text-fg-muted mb-1.5">
                Data de encerramento
              </label>
              <input
                type="date"
                name="endsAt"
                defaultValue={state.values?.endsAt ?? ""}
                className={inputCls(!!se.endsAt)}
              />
              <FieldError msg={se.endsAt ?? ""} />
            </div>
          </div>
        </Section>

        {/* ── 6. Publicação ───────────────────────────────────────── */}
        <div className="pb-4">
          <h3 className="text-sm font-semibold text-fg mb-3">Como deseja salvar?</h3>

            {se._form && (
              <div className="flex items-start gap-2 p-3 mb-4 bg-error-tint border border-error-border rounded-lg text-sm text-error-fg">
                <span>⚠️</span> {se._form}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPublishMode("draft")}
                className={[
                  "flex flex-col gap-1 px-4 py-4 rounded-xl border-2 text-left transition-all",
                  publishMode === "draft"
                    ? "border-border-3 bg-surface-2"
                    : "border-border hover:border-border-2",
                ].join(" ")}
              >
                <span className="font-semibold text-sm text-fg">📝 Salvar rascunho</span>
                <span className="text-xs text-fg-muted">Só você vê. Você publica quando quiser.</span>
              </button>
              <button
                type="button"
                onClick={() => setPublishMode("active")}
                className={[
                  "flex flex-col gap-1 px-4 py-4 rounded-xl border-2 text-left transition-all",
                  publishMode === "active"
                    ? "border-brand bg-brand-subtle"
                    : "border-border hover:border-border-2",
                ].join(" ")}
              >
                <span className={`font-semibold text-sm ${publishMode === "active" ? "text-brand" : "text-fg"}`}>
                  🚀 Publicar agora
                </span>
                <span className="text-xs text-fg-muted">Campanha fica visível para doadores.</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className={[
                  "inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-colors disabled:opacity-60 text-sm",
                  publishMode === "active"
                    ? "bg-brand text-fg-inv hover:bg-brand-hover"
                    : "bg-surface-inv text-fg-inv hover:bg-surface-solid",
                ].join(" ")}
              >
                {isPending && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isPending
                  ? "Salvando..."
                  : publishMode === "active"
                  ? "Publicar campanha"
                  : "Salvar rascunho"}
              </button>
            </div>
        </div>

      </div>
    </form>
  );
}
