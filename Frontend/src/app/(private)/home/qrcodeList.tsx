"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

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
}

const Gallery = ({
  heading = "Meus Links Encurtados",
}: GalleryProps) => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Função para buscar URLs
  const fetchUrls = async () => {
    try {
      setLoading(true);
      // Configurar axios para enviar cookies com a requisição
      const response = await axios.get("http://localhost/api/shortener/my-urls", {
        withCredentials: true  // Esta configuração é crucial para enviar cookies
      });
      setUrls(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar URLs:", err);
      setError("Não foi possível carregar seus links encurtados");
    } finally {
      setLoading(false);
    }
  };

  // Buscar URLs ao montar o componente
  useEffect(() => {
    fetchUrls();
  }, []);

  // Configurar o carousel
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h2>
            <DialogDemo></DialogDemo>
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev || loading}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext || loading}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        {loading ? (
          <div className="text-center py-12">
            <p>Carregando seus links encurtados...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
            <Button
              onClick={fetchUrls}
              variant="outline"
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-12">
            <p>Você ainda não tem links encurtados. Crie um link acima!</p>
          </div>
        ) : (
          <Carousel
            setApi={setCarouselApi}
            opts={{
              breakpoints: {
                "(max-width: 768px)": {
                  dragFree: true,
                },
              },
            }}
            className="relative left-[-1rem]"
          >
            <CarouselContent className="-mr-4 ml-8 2xl:mr-[max(0rem,calc(50vw-700px-1rem))] 2xl:ml-[max(8rem,calc(50vw-700px+1rem))]">
              {urls.map((url) => (
                <CarouselItem key={url.id} className="pl-4 md:max-w-[452px]">
                  <a
                    href={`http://localhost/api/${url.short}`}
                    className="group flex flex-col justify-between"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>
                      <div className="flex aspect-[3/2] overflow-clip rounded-xl">
                        <div className="flex-1">
                          <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            <img
                              src={url.qrCode}
                              alt={`QR Code para ${url.short}`}
                              className="h-full w-full object-contain bg-white p-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                      {url.short}
                    </div>
                    <div className="mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9">
                      {url._count.accesses} {url._count.accesses === 1 ? 'acesso' : 'acessos'} • Criado em {formatDate(url.createdAt)}
                    </div>
                    <div className="flex items-center text-sm">
                      Acessar link{" "}
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export { Gallery };