import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DialogDemoProps {
  onSuccess?: () => Promise<void> | void;
}

export function DialogDemo({ onSuccess }: DialogDemoProps) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortName, setShortName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shortener/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original: originalUrl,
          short: shortName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create shortened URL");
      }

      // Reset form and close dialog
      setOriginalUrl("");
      setShortName("");
      setOpen(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New URL</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Shortened URL</DialogTitle>
            <DialogDescription>
              Enter the original URL and a custom name for your shortened link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="original-url" className="text-right">
                Original URL
              </Label>
              <Input
                id="original-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/very-long-url"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="short-name" className="text-right">
                Custom Name
              </Label>
              <Input
                id="short-name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="col-span-3"
                placeholder="my-cool-link"
                required
              />
            </div>
            {error && (
              <div className="col-span-4 text-sm text-destructive">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}