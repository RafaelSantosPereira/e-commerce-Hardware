import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import CardItem from './CardItem';
import type { Product } from '@/types';

export interface ProductCarouselProps {
  title: string;
  products: Product[];
  categoria: string;
  linkVerMais?: string;
}

export function ProductCarousel({
  title,
  products = [],
  categoria,
  linkVerMais,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start', 
    containScroll: 'trimSnaps',
    slidesToScroll: 5, 
    dragFree: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative my-8 w-full">
      {/* Cabeçalho com Título e Botão */}
      <div className="mb-4 flex items-end justify-between px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        
        {/* Botão Ver Mais */}
        {linkVerMais && (
          <Link 
            to={linkVerMais} 
            className="text-sm border rounded-full py-2 px-4 font-semibold bg-white dark:bg-darkSurface text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Ver mais
          </Link>
        )}
      </div>

      <div className="relative group">
        {/* Seta Esquerda */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-2 sm:left-4 top-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 sm:opacity-100"
          aria-label="Anterior"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Viewport do Embla */}
        <div className="overflow-hidden py-2 cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product, index) => (
              <div 
                key={product.id || index} 
                className="flex-[0_0_260px] sm:flex-[0_0_280px] md:flex-[0_0_300px]"
              >
                <CardItem {...product} categoria={categoria} />
              </div>
            ))}
          </div>
        </div>

        {/* Seta Direita */}
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-2 sm:right-4 top-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 sm:opacity-100"
          aria-label="Seguinte"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
