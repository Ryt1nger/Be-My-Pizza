import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import type { Product } from '@/domain/catalog';
import { PizzaProductCard } from '@/shared/ui/PizzaProductCard';

/**
 * Mobile-first homepage. Single source of design truth:
 * docs/HOMEPAGE_REFERENCE_SPEC.md and original owner JPG (823x1910).
 * Sizes and mockup prices are VISUAL REFERENCES, not confirmed catalog pricing.
 */
const previewDetails: Record<string,{size:string;price:string}>={
  'ham-bacon':{size:'30 см · 440 г',price:'635 ₽'},
  'four-cheeses':{size:'30 см · 460 г',price:'675 ₽'}
};

export function HomePage(){
 const {data:products=[],isLoading,isError}=useQuery({queryKey:['catalog','home'],queryFn:()=>catalogGateway.getProducts()});
 const popular=['ham-bacon','four-cheeses']
   .map(id=>products.find(p=>p.id===id))
   .filter((p):p is Product=>Boolean(p));
 return <div className="mx-auto max-w-[1080px]">
  <section aria-labelledby="home-title"
    className="bmp-home-hero relative -mx-4 h-[305px] overflow-hidden px-[23px] sm:mx-0 sm:h-[400px] sm:px-10 lg:h-[455px] lg:px-14"
    style={{backgroundImage:`url("${import.meta.env.BASE_URL}media/hero/hero-user.webp")`}}>
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
      <div className="mt-[19px] flex items-center gap-[8px]" aria-label="Первый слайд. Остальные слайды пока не опубликованы.">
        <span className="h-[8px] w-[8px] rounded-full bg-[#145421]"/>
        <span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/>
        <span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/>
      </div>
    </div>
  </section>

  <section aria-label="Акция: Комбо на компанию"
    className="bmp-promo-banner relative isolate mt-[10px] h-[120px] overflow-hidden rounded-[19px] bg-[#07552E] px-[16px] py-[12px] text-white sm:mt-4 sm:h-[160px] sm:rounded-[24px] sm:px-7 sm:py-5"
    style={{backgroundImage:`url("${import.meta.env.BASE_URL}media/promotions/combo-user.webp")`}}>
    <div className="relative z-10 max-w-[64%]">
      <span className="bmp-body inline-flex rounded-full bg-white/15 px-[10px] py-[3px] text-[11px] leading-[1.2] sm:text-[12px]">Акция</span>
      <h2 className="bmp-heading mt-[9px] text-[23px] leading-[.99] text-white sm:mt-4 sm:text-[34px]">
        Комбо<br/>на компанию
      </h2>
    </div>
    <p className="bmp-body absolute bottom-[13px] left-[16px] right-[64px] z-10 whitespace-nowrap text-[clamp(11.5px,3vw,13px)] leading-[1.25] text-white/90 sm:bottom-[20px] sm:left-7 sm:text-sm">
      2 пиццы 30 см + закуска + 2 напитка
    </p>
    {/* Owner-supplied combo photo fills the banner under the typography. */}
    <Link to="/promotions" aria-label="Перейти к акциям"
      className="absolute bottom-[12px] right-[11px] z-20 grid h-[37px] w-[37px] place-items-center rounded-full bg-surface text-primary sm:bottom-5 sm:right-5 sm:h-[46px] sm:w-[46px]">
      <ArrowRight size={28} strokeWidth={2.25} aria-hidden="true"/>
    </Link>
  </section>

  <section aria-labelledby="popular-title" className="mt-[24px] sm:mt-9">
    <div className="mb-[15px] flex items-end justify-between gap-2">
      <h2 id="popular-title" className="bmp-heading text-[clamp(23px,6.4vw,29px)] leading-[1.05] text-ink sm:text-4xl">
        Популярное
      </h2>
      <Link to="/menu" className="bmp-body-strong inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] text-[#5F605D] sm:text-base">
        Смотреть всё <ArrowRight size={21} strokeWidth={2.2} aria-hidden="true"/>
      </Link>
    </div>
    {isLoading&&<p role="status" className="bmp-body text-sm text-muted">Загружаем товары…</p>}
    {isError&&<p role="alert" className="bmp-body text-sm text-muted">Не удалось загрузить товары.</p>}
    {!isLoading&&!isError&&<div className="grid grid-cols-2 gap-[10px] sm:gap-5 lg:grid-cols-4">
      {popular.map(p=><PizzaProductCard key={p.id} product={p} display={{sizeLabel:previewDetails[p.id]?.size,priceLabel:previewDetails[p.id]?.price}}/>)}
    </div>}
  </section>
 </div>;
}
