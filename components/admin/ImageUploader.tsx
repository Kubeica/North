"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  fieldClassName,
} from "@/components/admin/FormSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  altArName?: string;
  altEnName?: string;
  defaultAltAr?: string;
  defaultAltEn?: string;
  showAltFields?: boolean;
  enableUpload?: boolean;
  error?: string;
  className?: string;
};

/**
 * URL input + optional file upload to `/api/media/upload` with preview.
 * Keeps a hidden/text field so it works inside native forms.
 */
export function ImageUploader({
  name = "coverImageUrl",
  label = "Image URL",
  defaultValue = "",
  value,
  onChange,
  altArName = "altAr",
  altEnName = "altEn",
  defaultAltAr = "",
  defaultAltEn = "",
  showAltFields = false,
  enableUpload = true,
  error,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(value ?? defaultValue);
  const [uploading, setUploading] = useState(false);
  const resolved = value ?? url;

  function setUrlValue(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      setUrlValue(data.url);
      toast.success("Uploaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Upload failed",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-3 sm:col-span-2", className)}>
      <Field label={label} name={name} error={error} full>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={name}
            name={name}
            value={resolved}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://…"
            className={cn(fieldClassName, "flex-1")}
          />
          {enableUpload ? (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => void onUpload(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                <Upload data-icon="inline-start" />
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </>
          ) : null}
        </div>
      </Field>

      <div className="flex aspect-video max-w-md items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
        {resolved ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolved}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="size-6 text-gold/70" />
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>

      {showAltFields ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Alt text (EN)" name={altEnName}>
            <input
              id={altEnName}
              name={altEnName}
              defaultValue={defaultAltEn}
              className={fieldClassName}
            />
          </Field>
          <Field label="Alt text (AR)" name={altArName}>
            <input
              id={altArName}
              name={altArName}
              dir="rtl"
              defaultValue={defaultAltAr}
              className={fieldClassName}
            />
          </Field>
        </div>
      ) : null}
    </div>
  );
}
