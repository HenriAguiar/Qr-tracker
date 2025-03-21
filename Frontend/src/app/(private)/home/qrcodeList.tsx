"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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

interface GalleryProps {
  heading?: string;
  items?: UrlItem[];
}

const Gallery = ({
  heading = "My Shortened URLs",
  items = [],
}: GalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setCarouselApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="overflow-hidden rounded-xl border bg-background p-4">
                <div className="flex flex-col gap-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <div className="h-full w-full flex items-center justify-center">
                      <img
                        src={item.qrCode}
                        alt={`QR Code for ${item.short}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">{item.short}</h3>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Accessed {item._count.accesses} times
                  </div>

                  <div>
                    <a
                      href={item.original}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium"
                    >
                      Visit original URL <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export { Gallery };