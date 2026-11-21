import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/domain/catalog';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';

/**
 * Shared visual standard for every PIZZA product card (not snacks/drinks).
 * Large, upward/right-cropped food photo with a bright top-left; the
 * separately rounded milky-glass footer has no image peeking out at corners.
 * Details passed by the page must come from confirmed catalog data or clearly
 * identified mockup preview labels; never invent a current price.
 */
export type PizzaCardDisplay = {
  sizeLabel?: string;
  priceLabel?: string;
};

export function PizzaProductCard({
  product,display
}:{product:Product;display?:PizzaCardDisplay}){
  const saved=useFavoritesStore(state=>state.ids.includes(product.id));
  const toggle=useFavoritesStore(state=>state.toggle);
  const productUrl='/product/'+product.id;
  return <article className="bmp-pizza-card group relative isolate min-w-0 overflow-hidden rounded-[22px] border border-white/75 bg-surface shadow-[0_10px_24px_rgba(30,37,23,.11)] sm:rounded-[26px]">
    {/* Separate image viewport: large pizza crops upward/right;
         never stretch its 1:1 photo over the entire card height. */}
    <div className="relative z-0 aspect-[1.30] w-full overflow-hidden bg-[#FBF8F5]">
      <Link to={productUrl} className="absolute inset-0" aria-label={'Открыть '+product.name}>
        <ProductPhoto src={product.imageUrl} alt={product.name}
          className="absolute -left-[13%] -top-[19%] block !h-auto !w-[167%] max-w-none object-contain sm:-left-[15%] sm:-top-[20%] sm:!w-[162%]"/>
      </Link>
      <button type="button" onClick={()=>toggle(product.id)} aria-pressed={saved}
        aria-label={saved?'Убрать '+product.name+' из избранного':'Добавить '+product.name+' в избранное'}
        className="absolute right-[8px] top-[8px] z-20 grid h-[38px] w-[38px] place-items-center rounded-full border border-white/85 bg-white/90 shadow-[0_3px_13px_rgba(0,0,0,.09)] backdrop-blur-lg">
        {saved
          ? <Heart size={23} strokeWidth={2.1} className="text-primary" fill="currentColor" aria-hidden="true"/>
          : <Heart size={23} strokeWidth={2.1} className="text-[#0A4025]" fill="none" aria-hidden="true"/>}
      </button>
    </div>

    <div className="bmp-product-glass relative z-10 -mt-[12px] flex min-h-[132px] flex-col overflow-hidden rounded-t-[19px] rounded-b-[21px] px-[12px] pb-[12px] pt-[20px] sm:min-h-[139px] sm:rounded-t-[23px] sm:rounded-b-[25px] sm:px-4">
      <Link to={productUrl} className="bmp-body-strong line-clamp-2 text-[clamp(13.5px,3.65vw,16px)] leading-[1.23] text-ink sm:text-lg">
        {product.name}
      </Link>
      <p className="bmp-body mt-[6px] text-[12px] leading-[1.3] text-[#6D6D6D] sm:text-sm">
        {display?.sizeLabel??'Размер уточняется'}
      </p>
      <div className="mt-auto flex items-end justify-between gap-1 pt-[9px]">
        <span className="bmp-price text-[19px] leading-[1.1] text-ink sm:text-[23px]">
          {display?.priceLabel??(product.priceRub!==null?product.priceRub+' ₽':'Цена уточняется')}
        </span>
        <Link to={productUrl} aria-label={'Выбрать '+product.name}
          className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-[#16833D] text-white shadow-[0_2px_8px_rgba(18,69,35,.2)] sm:h-10 sm:w-10">
          <span aria-hidden="true" className="-mt-[2px] font-light text-[29px] leading-none">+</span>
        </Link>
      </div>
    </div>
  </article>;
}
