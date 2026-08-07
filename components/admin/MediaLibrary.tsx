"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Upload, Archive } from "lucide-react";
import { toast } from "sonner";

import { archiveMedia, deleteMedia } from "@/app/actions/media";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

export type MediaItem = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

type MediaLibraryProps = {
  items: MediaItem[];
};

export function MediaLibrary({ items }: MediaLibraryProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/media/upload", {
          method: "POST",
          body,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.error ?? `Failed to upload ${file.name}`);
          continue;
        }
        toast.success(`Uploaded ${file.name}`);
      }
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function copyUrl(url: string) {
    const absolute =
      typeof window !== "undefined"
        ? new URL(url, window.location.origin).toString()
        : url;
    void navigator.clipboard.writeText(absolute);
    toast.success("URL copied");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => void onUpload(e.target.files)}
        />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="bg-gold text-primary-foreground hover:bg-gold-light"
        >
          <Upload data-icon="inline-start" />
          {uploading ? "Uploading…" : "Upload files"}
        </Button>
        <p className="text-sm text-muted-foreground">
          JPEG, PNG, WebP, GIF, SVG, PDF · max 10 MB
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const isImage = item.mimeType.startsWith("image/");
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-surface/50"
            >
              <div className="flex aspect-video items-center justify-center bg-muted/40">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {item.mimeType}
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium">{item.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.size)}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyUrl(item.url)}
                  >
                    <Copy data-icon="inline-start" />
                    Copy URL
                  </Button>
                  <ConfirmDialog
                    title="Archive media?"
                    description="The file will be hidden from the library."
                    confirmLabel="Archive"
                    onConfirm={async () => {
                      const result = await archiveMedia(item.id);
                      startTransition(() => router.refresh());
                      return result;
                    }}
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <Archive />
                      </Button>
                    }
                  />
                  <ConfirmDialog
                    title="Delete media?"
                    description="Permanently deletes the file and database record."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={async () => {
                      const result = await deleteMedia(item.id);
                      startTransition(() => router.refresh());
                      return result;
                    }}
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="text-destructive" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
