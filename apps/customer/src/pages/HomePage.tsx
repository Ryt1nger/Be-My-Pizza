import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import type { Product } from '@/domain/catalog';
import { PizzaProductCard } from '@/shared/ui/PizzaProductCard';
import { PromoCarousel } from '@/shared/ui/PromoCarousel';

/** Homepage menu prices and weights now come from owner-supplied catalog entries. */

export function HomePage(){
 const {data:products=[],isLoading,isError}=useQuery({queryKey:['catalog','home'],queryFn:()=>catalogGateway.getProducts()});
 const popular=['ham-bacon','four-cheeses','pepperoni','margherita']
   .map(id=>products.find(p=>p.id===id))
   .filter((p):p is Product=>Boolean(p));
 return <div className="mx-auto max-w-[1080px]">
  <section aria-labelledby="home-title"
    className="bmp-home-hero relative -mx-4 h-[305px] overflow-hidden px-[23px] sm:mx-0 sm:h-[400px] sm:px-10 lg:h-[455px] lg:px-14"
    style={{backgroundImage:`linear-gradient(90deg,#FCF7F3 48%,rgba(252,247,243,.82) 60%,rgba(252,247,243,0) 87%),url("${import.meta.env.BASE_URL}media/hero/hero-user.webp")`}}>
    {/* Single owner-supplied background. No overlaid pizza image or mask. */}
    <div className="relative z-10 pt-[24px] sm:pt-[53px] lg:pt-[68px]">
      <h1 id="home-title" className="bmp-display text-[clamp(35px,9.5vw,41px)] leading-[.99] text-ink sm:text-[53px] lg:text-[64px]">
        <span className="block">Настоящая</span>
        <span className="block">пицца</span>
        <span className="block">рядом</span>
      </h1>
      <p className="bmp-body mt-[15px] text-[clamp(13.5px,3.7vw,16px)] leading-[1.3] text-[#646663] sm:mt-6 sm:text-lg sm:leading-[1.42]">
        Свежие ингредиенты,<br/>быстрая доставка<br/>в Орехово
      </p>
      <Link to="/menu"
        className="bmp-body-strong mt-[18px] inline-flex h-[42px] items-center gap-[10px] rounded-full bg-[#11562A] px-[18px] text-[clamp(13px,3.5vw,15px)] text-white shadow-[0_2px_5px_rgba(9,50,28,.13)] sm:mt-7 sm:h-12 sm:px-6 sm:text-base">
        Заказать пиццу <ArrowRight size={23} strokeWidth={2.3} aria-hidden="true"/>
      </Link>
    </div>
  </section>

  <PromoCarousel/>

  <section aria-labelledby="popular-title" className="bmp-popular-section mt-[23px] sm:mt-9">
    <div className="mb-[13px] flex items-center justify-between gap-2">
      <h2 id="popular-title" className="bmp-heading text-[clamp(22px,6vw,29px)] leading-[1.05] text-ink sm:text-4xl">
        Популярное
      </h2>
      <div className="bmp-popular-controls">
        <Link to="/menu/pizza" className="bmp-body-strong bmp-popular-all inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] text-[#5F605D] sm:text-base">
          Смотреть всё <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true"/>
        </Link>
      </div>
    </div>
    {isLoading&&<p role="status" className="bmp-body text-sm text-muted">Загружаем товары…</p>}
    {isError&&<p role="alert" className="bmp-body text-sm text-muted">Не удалось загрузить товары.</p>}
    {!isLoading&&!isError&&<div className="bmp-popular-track" role="region" tabIndex={0}
      aria-label="Популярные пиццы. Листайте горизонтально">
      {popular.map(p=><PizzaProductCard key={p.id} product={p}
        display={{sizeLabel:p.weightGrams?'30 см · '+p.weightGrams+' г':undefined}}/>)}
    </div>}
  </section>
 </div>;
}
