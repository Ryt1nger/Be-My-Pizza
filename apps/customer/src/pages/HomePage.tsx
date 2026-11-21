import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import { BrandIcon } from '@/shared/ui/BrandIcon';
import type { Product } from '@/domain/catalog';

/**
 * Mobile-first homepage. Single source of design truth:
 * docs/HOMEPAGE_REFERENCE_SPEC.md and original owner JPG (823x1910).
 * Sizes and mockup prices are VISUAL REFERENCES, not confirmed catalog pricing.
 */
const previewDetails: Record<string,{size:string;price:string}>={
  'ham-bacon':{size:'30 см · 440 г',price:'635 ₽'},
  'four-cheeses':{size:'30 см · 460 г',price:'675 ₽'}
};

function PopularCard({product}:{product:Product}){
 const saved=useFavoritesStore(s=>s.ids.includes(product.id));
 const toggle=useFavoritesStore(s=>s.toggle);
 const visual=previewDetails[product.id];
 return <article className="group relative min-w-0 overflow-hidden rounded-[22px] border border-white/70 bg-[#FFFDF9] shadow-[0_10px_24px_rgba(30,37,23,.11)] sm:rounded-[26px]">
  <div className="relative aspect-[1.34] w-full overflow-hidden bg-[#FBF7F3]">
    <Link to={'/product/'+product.id} aria-label={'Открыть '+product.name} className="block h-full w-full">
      <ProductPhoto src={product.imageUrl} alt={product.name} className="block h-full w-full origin-top-left translate-x-[12px] scale-[1.28] object-cover object-top sm:translate-x-[16px] sm:scale-[1.24]"/>
    </Link>
    <button type="button" onClick={()=>toggle(product.id)} aria-pressed={saved}
      aria-label={saved?'Убрать '+product.name+' из избранного':'Добавить '+product.name+' в избранное'}
      className="absolute right-[8px] top-[8px] z-20 grid h-[38px] w-[38px] place-items-center rounded-full border border-white/80 bg-white/90 shadow-[0_3px_13px_rgba(0,0,0,.09)] backdrop-blur-lg">
      <Heart size={23} strokeWidth={2.1} className="text-[#0A4025]" fill={saved?'#145421':'none'}/>
    </button>
  </div>
  <div className="bmp-product-glass relative z-10 -mt-[20px] flex min-h-[114px] flex-col px-[12px] pb-[12px] pt-[19px] sm:min-h-[123px] sm:px-4">
    <Link to={'/product/'+product.id} className="bmp-body-strong line-clamp-2 text-[clamp(13.5px,3.65vw,16px)] leading-[1.23] text-ink sm:text-lg">
      {product.name}
    </Link>
    <p className="bmp-body mt-[6px] text-[12px] leading-[1.3] text-[#6D6D6D] sm:text-sm">{visual?.size??'Размер уточняется'}</p>
    <div className="mt-auto flex items-end justify-between gap-1 pt-[9px]">
      <span className="bmp-price text-[19px] leading-[1.1] text-ink sm:text-[23px]">
        {visual?.price??'—'}
      </span>
      <Link to={'/product/'+product.id} aria-label={'Выбрать '+product.name}
        className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-[#16833D] text-white shadow-[0_2px_8px_rgba(18,69,35,.2)] sm:h-10 sm:w-10">
        <span aria-hidden="true" className="-mt-[2px] font-light text-[29px] leading-none">+</span>
      </Link>
    </div>
  </div>
 </article>;
}

export function HomePage(){
 const {data:products=[],isLoading,isError}=useQuery({queryKey:['catalog','home'],queryFn:()=>catalogGateway.getProducts()});
 const popular=['ham-bacon','four-cheeses']
   .map(id=>products.find(p=>p.id===id))
   .filter((p):p is Product=>Boolean(p));
 return <div className="mx-auto max-w-[1080px]">
  <section aria-labelledby="home-title"
    className="relative -mx-4 h-[305px] overflow-hidden px-[23px] sm:mx-0 sm:h-[400px] sm:rounded-[28px] sm:px-10 lg:h-[455px] lg:px-14">
    <div className="pointer-events-none absolute -right-[190px] -top-[55px] h-[430px] w-[430px] sm:-right-[65px] sm:-top-[32px] sm:h-[477px] sm:w-[477px] lg:right-[-25px] lg:top-[-30px] lg:h-[535px] lg:w-[535px]" style={{maskImage:"radial-gradient(circle at center, #000 58%, transparent 79%)",WebkitMaskImage:"radial-gradient(circle at center, #000 58%, transparent 79%)"}}>
      <ProductPhoto src="/media/products/pepperoni.webp" alt="Пицца Пепперони" className="h-full w-full object-contain mix-blend-multiply"/>
    </div>
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
        Заказать пиццу <BrandIcon name="arrow" size={25} className="brightness-0 invert"/>
      </Link>
      <div className="mt-[19px] flex items-center gap-[8px]" aria-label="Первый слайд. Остальные слайды пока не опубликованы.">
        <span className="h-[8px] w-[8px] rounded-full bg-[#145421]"/>
        <span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/>
        <span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/>
      </div>
    </div>
  </section>

  <section aria-label="Концепт акции — изображение появится позже"
    className="relative isolate mt-[10px] h-[120px] overflow-hidden rounded-[19px] bg-gradient-to-br from-[#237C47] via-[#155B32] to-[#0B482A] px-[16px] py-[12px] text-white sm:mt-4 sm:h-[160px] sm:rounded-[24px] sm:px-7 sm:py-5">
    <div className="relative z-10 max-w-[64%]">
      <span className="bmp-body inline-flex rounded-full bg-white/15 px-[10px] py-[3px] text-[11px] leading-[1.2] sm:text-[12px]">Акция</span>
      <h2 className="bmp-heading mt-[9px] text-[23px] leading-[.99] text-white sm:mt-4 sm:text-[34px]">
        Комбо<br/>на компанию
      </h2>
    </div>
    <p className="bmp-body absolute bottom-[13px] left-[16px] right-[64px] z-10 whitespace-nowrap text-[clamp(11.5px,3vw,13px)] leading-[1.25] text-white/90 sm:bottom-[20px] sm:left-7 sm:text-sm">
      2 пиццы 30 см + закуска + 2 напитка
    </p>
    {/* Reserved for the agreed promo photography. Leave intentionally empty. */}
    <div aria-hidden="true" data-promo-image-slot="reserved"
      className="pointer-events-none absolute inset-y-0 right-0 w-[42%]"/>
    <Link to="/promotions" aria-label="Перейти к акциям"
      className="absolute bottom-[12px] right-[11px] z-20 grid h-[37px] w-[37px] place-items-center rounded-full bg-surface text-primary sm:bottom-5 sm:right-5 sm:h-[46px] sm:w-[46px]">
      <BrandIcon name="arrow" size={29}/>
    </Link>
  </section>

  <section aria-labelledby="popular-title" className="mt-[24px] sm:mt-9">
    <div className="mb-[15px] flex items-end justify-between gap-2">
      <h2 id="popular-title" className="bmp-heading text-[clamp(23px,6.4vw,29px)] leading-[1.05] text-ink sm:text-4xl">
        Популярное
      </h2>
      <Link to="/menu" className="bmp-body-strong inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] text-[#5F605D] sm:text-base">
        Смотреть всё <BrandIcon name="arrow" size={21} className="opacity-70"/>
      </Link>
    </div>
    {isLoading&&<p role="status" className="bmp-body text-sm text-muted">Загружаем товары…</p>}
    {isError&&<p role="alert" className="bmp-body text-sm text-muted">Не удалось загрузить товары.</p>}
    {!isLoading&&!isError&&<div className="grid grid-cols-2 gap-[10px] sm:gap-5 lg:grid-cols-4">
      {popular.map(p=><PopularCard key={p.id} product={p}/>)}
    </div>}
  </section>
 </div>;
}
