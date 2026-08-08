"use client";

import { useState, useTransition } from "react";
import { FolderOpen } from "lucide-react";
import { toast } from "sonner";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  listMediaForPicker,
  type MediaPickerItem,
} from "@/app/actions/media";
import { cn } from "@/lib/utils";

type MediaPickerProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  error?: string;
  className?: string;
};

/**
 * URL + upload field with optional browse of existing Media library items.
 * Keeps native form compatibility via the underlying ImageUploader input.
 */
export function MediaPicker({
  name,
  label = "Image",
  defaultValue = "",
  error,
  className,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(defaultValue);
  const [items, setItems] = useState<MediaPickerItem[]>([]);
  const [pending, startTransition] = useTransition();

  function openLibrary() {
    setOpen(true);
    startTransition(async () => {
      try {
        const next = await listMediaForPicker();
        setItems(next);
      } catch {
        toast.error("Could not load media library");
        setOpen(false);
      }
    });
  }

  function selectItem(item: MediaPickerItem) {
    setUrl(item.url);
    setOpen(false);
  }

  return (
    <div className={cn("space-y-2 sm:col-span-2", className)}>
      <ImageUploader
        name={name}
        label={label}
        value={url}
        onChange={setUrl}
        error={error}
        enableUpload
        showAltFields={false}
      />
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openLibrary}
          disabled={pending}
        >
          <FolderOpen data-icon="inline-start" />
          Browse library
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select media</DialogTitle>
            <DialogDescription>
              Choose an existing image, or cancel to keep the current URL.
            </DialogDescription>
          </DialogHeader>
          {pending ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No media uploaded yet. Use Upload above, or open Media.
            </p>
          ) : (
            <div className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item)}
                  className="group overflow-hidden rounded-lg border border-border bg-muted/30 text-left transition hover:border-gold"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block truncate px-2 py-1 text-[10px] text-muted-foreground group-hover:text-foreground">
                    {item.fileName}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
