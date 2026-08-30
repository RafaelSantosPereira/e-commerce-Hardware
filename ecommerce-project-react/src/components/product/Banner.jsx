import { useRef } from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const banners = [
  {
    id: 1,
    title: "Gráficos de Nova Geração",
    subtitle: "Placas Gráficas RTX e RX",
    description: "Desempenho extremo para gamers e criadores. Joga em 4K com Ray Tracing no máximo.",
    image: "src/assets/images/grafica-gigabite.png", 
    buttonText: "Ver Gráficas",
    link: "/placas-graficas",
    bgColor: "bg-gradient-to-r from-gray-900 to-green-900",
  },
  {
    id: 2,
    title: "O Cérebro da Máquina",
    subtitle: "Processadores AMD e Intel",
    description: "Multitarefa sem limites e velocidades incríveis para as tuas sessões de gaming mais intensas.",
    image: "src/assets/images/ryzen-removebg-preview.png",
    buttonText: "Ver Processadores",
    link: "/processadores",
    bgColor: "bg-gradient-to-r from-slate-900 to-red-900",
  },
  {
    id: 3,
    title: "Velocidade e Estilo",
    subtitle: "Memórias RAM DDR5",
    description: "Aumenta os FPS e dá mais cor ao teu setup com os novos kits de memória de alta frequência.",
    image: "src/assets/images/memorias.png",
    buttonText: "Ver Memórias",
    link: "/memorias-ram",
    bgColor: "bg-gradient-to-r from-gray-900 to-blue-900",
  }
];

export function HeroBanner() {
  // Plugin para rodar sozinho e pausar no hover
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full mx-auto py-6">
      <Carousel
        plugins={[plugin.current]}
        className="w-full rounded-2xl overflow-hidden shadow-2xl"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className={`relative w-full h-[400px] md:h-[500px] flex items-center ${banner.bgColor}`}>
                
                {/* Metade Esquerda: Texto */}
                <div className="w-full md:w-1/2 p-8 md:p-16 z-10">
                  <h3 className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2">
                    {banner.subtitle}
                  </h3>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-gray-300 mb-8 max-w-md text-lg">
                    {banner.description}
                  </p>
                  <Link 
                    to={banner.link}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
                  >
                    {banner.buttonText}
                  </Link>
                </div>

                {/* Metade Direita: Imagem do Componente (Escondida em ecrãs muito pequenos) */}
                <div className="hidden md:flex w-1/2 h-full items-center justify-center p-8">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Setas de navegação */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/80" />
          <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/80" />
        </div>
      </Carousel>
    </div>
  );
}