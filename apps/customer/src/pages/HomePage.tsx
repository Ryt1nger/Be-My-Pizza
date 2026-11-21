import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import { BrandIcon } from '@/shared/ui/BrandIcon';
import type { Product } from '@/domain/catalog';

/**
 * FIRST MOBILE HOMEPAGE — reference: docs/HOMEPAGE_REFERENCE_SPEC.md.
 * Visual prices and metrics below are transcribed from the approved *design reference*
 * for layout comparison only. They are NOT a verified current commercial offer.
 * Do not use these preview prices for checkout / API / payment.
 */
const previewDetails:Record<string,{size:string;price:string}>={
 'ham-bacon':{size:'30 см · 440 г',price:'635 ₽'},
 'four-cheeses':{size:'30 см · 460 г',price:'675 ₽'}
};

function PopularCard({product}:{product:Product}){
 const saved=useFavoritesStore(s=>s.ids.includes(product.id));
 const toggle=useFavoritesStore(s=>s.toggle);
 const visual=previewDetails[product.id];
 return <article className="min-w-0 overflow-hidden rounded-[22px] bg-[#FFFDF9] shadow-[0_7px_17px_rgba(39,44,29,.12)]">
  <div className="relative aspect-[1.48] w-full overflow-hidden bg-[#FBF7F3]">
    <Link to={'/product/'+product.id} aria-label={'Открыть '+product.name} className="block h-full w-full">
      <ProductPhoto src={product.imageUrl} alt={product.name} className="h-full w-full object-cover"/>
    </Link>
    <button type="button" onClick={()=>toggle(product.id)} aria-pressed={saved}
      aria-label={saved?'Убрать '+product.name+' из избранного':'Добавить '+product.name+' в избранное'}
      className="absolute right-2 top-2 flex h-[37px] w-[37px] items-center justify-center rounded-full bg-[#FFFDF9] shadow-sm">
      <BrandIcon name="favorite" size={35} className={saved?'opacity-100':'opacity-85'}/>
      {saved&&<span aria-hidden="true" className="pointer-events-none absolute right-[9px] top-[11px] h-[16px] w-[16px] rounded-full bg-[#F65A12]/30"/>}
    </button>
  </div>
  <div className="flex min-h-[92px] flex-col px-[13px] pb-[11px] pt-[9px]">
    <Link to={'/product/'+product.id} className="line-clamp-1 text-[15px] font-extrabold leading-[1.2] tracking-[-.035em] text-ink sm:text-[19px]">{product.name}</Link>
    <p className="mt-[5px] text-[12px] text-[#777]">{visual?.size??'Размер уточняется'}</p>
    <div className="mt-auto flex items-end justify-between pt-[7px]">
      <span className="text-[21px] font-black leading-none tracking-[-.03em] text-ink">{visual?.price??'—'}</span>
      <Link to={'/product/'+product.id} aria-label={'Выбрать '+product.name}
        className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#16833D] text-white shadow-[0_2px_5px_rgba(18,69,35,.15)]">
        <span aria-hidden="true" className="relative -mt-[2px] text-[31px] font-light leading-none">+</span>
      </Link>
    </div>
  </div>
 </article>;
}

export function HomePage(){
 const {data:products=[],isLoading,isError}=useQuery({queryKey:['catalog','home'],queryFn:()=>catalogGateway.getProducts()});
 const popular=['ham-bacon','four-cheeses'].map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>Boolean(p));
 return <div className="mx-auto max-w-[1080px]">
  <section aria-labelledby="home-title"
   className="relative -mx-4 h-[319px] overflow-hidden bg-background px-[23px] sm:mx-0 sm:h-[415px] sm:rounded-[30px] sm:px-10 lg:h-[470px] lg:px-14">
   <div className="pointer-events-none absolute -right-[145px] top-[7px] h-[363px] w-[363px] sm:-right-[60px] sm:-top-[22px] sm:h-[480px] sm:w-[480px] lg:right-[-30px] lg:h-[530px] lg:w-[530px]">
     <ProductPhoto src="/media/products/pepperoni.webp" alt="Пепперони" className="h-full w-full object-contain"/>
   </div>
   <div className="pointer-events-none absolute inset-y-0 left-0 w-[57%] bg-gradient-to-r from-background via-background/95 to-transparent sm:w-[62%]"/>
   <div className="relative z-10 pt-[23px] sm:pt-[55px] lg:pt-[73px]">
     <h1 id="home-title" className="text-[clamp(37px,10.3vw,45px)] font-black leading-[.98] tracking-[-.055em] text-ink sm:text-[57px] lg:text-[67px]">
       <span className="block">Настоящая</span><span className="block">пицца</span><span className="block">рядом</span>
     </h1>
     <p className="mt-[17px] text-[15px] font-medium leading-[1.32] text-[#60615F] sm:mt-6 sm:text-[21px] sm:leading-[1.35]">
       Свежие ингредиенты,<br/>быстрая доставка<br/>в Орехово
     </p>
     <Link to="/menu" className="mt-[18px] inline-flex h-[43px] items-center gap-2 rounded-full bg-[#11562A] px-[18px] text-[14px] font-bold text-white shadow-sm sm:mt-7 sm:h-[56px] sm:px-7 sm:text-lg">
       Заказать пиццу <BrandIcon name="arrow" size={27} className="brightness-0 invert"/>
     </Link>
     <div className="mt-[18px] flex items-center gap-[8px]" role="img" aria-label="Первый слайд из трёх. Остальные слайды пока не предусмотрены.">
       <span className="h-[8px] w-[8px] rounded-full bg-[#145421]"/><span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/><span className="h-[8px] w-[8px] rounded-full bg-[#ECE5DE]"/>
     </div>
   </div>
  </section>

  <section aria-label="Акция — место под будущую фотографию" className="relative isolate mt-[12px] flex h-[121px] overflow-hidden rounded-[19px] bg-gradient-to-br from-[#247B48] via-[#155B32] to-[#0B482A] px-[16px] py-[13px] text-white sm:h-[166px] sm:rounded-[24px] sm:p-7">
    <div className="relative z-10 max-w-[66%] sm:max-w-[62%]">
      <span className="inline-flex rounded-full bg-white/15 px-[9px] py-[3px] text-[11px] leading-[1.2]">Акция</span>
      <h2 className="mt-[10px] text-[25px] font-black leading-[.89] tracking-[-.045em] sm:mt-4 sm:text-[37px] sm:leading-none">
        Комбо<br/>на компанию
      </h2>
      <p className="mt-[8px] whitespace-nowrap text-[10.5px] leading-[1.1] text-white/85 sm:mt-3 sm:text-sm">2 пиццы 30 см + закуска + 2 напитка</p>
    </div>
    {/* Intentionally blank photo area. Owner explicitly requested a reserved slot with no picture yet. */}
    <div className="absolute inset-y-0 right-0 w-[40%]" aria-hidden="true" data-promo-image-slot="reserved"/>
    <Link to="/promotions" aria-label="Перейти к акциям" className="absolute bottom-[13px] right-[12px] z-10 grid h-[37px] w-[37px] place-items-center rounded-full bg-[#FFFDF9] text-primary sm:bottom-5 sm:right-5 sm:h-[47px] sm:w-[47px]">
      <BrandIcon name="arrow" size={33}/>
    </Link>
  </section>

  <section aria-labelledby="popular-title" className="mt-[23px] sm:mt-9">
    <div className="mb-[15px] flex items-end justify-between gap-3">
      <h2 id="popular-title" className="text-[26px] font-black leading-none tracking-[-.048em] text-ink sm:text-4xl">Популярное</h2>
      <Link to="/menu" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-medium text-[#5F605D] sm:text-[16px]">
        Смотреть всё <BrandIcon name="arrow" size={23} className="opacity-70"/>
      </Link>
    </div>
    {isLoading&&<p role="status" className="text-sm text-muted">Загружаем товары…</p>}
    {isError&&<p role="alert" className="text-sm text-muted">Не удалось загрузить товары.</p>}
    <div className="grid grid-cols-2 gap-[10px] sm:gap-[20px] lg:grid-cols-4">
      {popular.map(p=><PopularCard key={p.id} product={p}/>)}
    </div>
  </section>
 </div>;
}
