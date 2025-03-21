"use client";

import { useEffect, useState } from "react";
import { Gallery } from "./qrcodeList";
import { DialogDemo } from "./urlForm";

interface UrlItem {
  id: number;
  original: string;
  short: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  _count: {
    accesses: number;
  }
}

export default function UrlsPage() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch URLs from the API
  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shortener/my-urls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError('Error loading your URLs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">URL Shortener</h1>
        <DialogDemo onSuccess={fetchUrls} />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
          {error}
        </div>
      ) : urls.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't created any shortened URLs yet.</p>
          <p className="mt-2">Click the "Create New URL" button to get started.</p>
        </div>
      ) : (
        <Gallery items={urls} />
      )}
    </div>
  );
}