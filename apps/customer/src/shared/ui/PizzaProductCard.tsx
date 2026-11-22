import { Heart, Plus } from 'lucide-react';
import { useProductSheetStore } from '@/features/product/productSheetStore';
import type { Product } from '@/domain/catalog';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';

/**
 * Shared visual standard for every PIZZA product card (not snacks/drinks).
 * Large, right-shifted pizza photographs retain the pale top-left corner.
 * Owner prefers this art direction over centered contain; slightly higher crop.
 * The milk-glass footer is a separate rounded panel below the photo.
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
  const openProduct=useProductSheetStore(state=>state.openProduct);
  const open=()=>openProduct(product.id);
  return <article className="bmp-pizza-card group relative isolate min-w-0 overflow-hidden rounded-[22px] bg-transparent sm:rounded-[26px]">
    {/* Owner-approved direction: pizza large and right-weighted, bright space
         at top-left. Keep the photo's natural aspect and raise it only slightly. */}
    <div className="relative z-0 aspect-[1.30] w-full overflow-hidden bg-[#FBF8F5]">
      <button type="button" onClick={open} className="absolute inset-0" aria-label={'Открыть '+product.name}>
        <ProductPhoto src={product.imageUrl} alt={product.name}
          className="bmp-pizza-photo absolute -left-[20%] -top-[17%] block !h-auto !w-[167%] max-w-none object-contain sm:-left-[22%] sm:-top-[18%] sm:!w-[162%]"/>
      </button>
      <button type="button" onClick={()=>toggle(product.id)} aria-pressed={saved}
        aria-label={saved?'Убрать '+product.name+' из избранного':'Добавить '+product.name+' в избранное'}
        className="bmp-card-favorite absolute right-[1px] top-[1px] z-20 grid h-[44px] w-[44px] place-items-center rounded-full">
        {saved
          ? <Heart size={18} strokeWidth={2.15} className="text-primary" fill="currentColor" aria-hidden="true"/>
          : <Heart size={18} strokeWidth={2.15} className="text-[#0A4025]" fill="none" aria-hidden="true"/>}
      </button>
    </div>

    <div className="bmp-product-glass relative z-10 -mt-px flex min-h-[116px] flex-col overflow-hidden rounded-t-none rounded-b-[21px] px-[12px] pb-[12px] pt-[14px] sm:min-h-[129px] sm:rounded-t-none sm:rounded-b-[25px] sm:px-4">
      <button type="button" onClick={open} className="bmp-body-strong line-clamp-2 text-left text-[clamp(13.5px,3.65vw,16px)] leading-[1.23] text-ink sm:text-lg">
        {product.name}
      </button>
      <p className="bmp-body mt-[6px] text-[12px] leading-[1.3] text-[#6D6D6D] sm:text-sm">
        {display?.sizeLabel??'Размер уточняется'}
      </p>
      <div className="mt-auto flex items-end justify-between gap-1 pt-[9px]">
        <span className="bmp-price text-[19px] leading-[1.1] text-ink sm:text-[23px]">
          {display?.priceLabel??(product.priceRub!==null?product.priceRub+' ₽':'Цена уточняется')}
        </span>
        <button type="button" onClick={open} aria-label={'Выбрать '+product.name}
          className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-[#16833D] text-white shadow-[0_2px_8px_rgba(18,69,35,.2)] sm:h-10 sm:w-10">
          <Plus size={25} strokeWidth={2.8} aria-hidden="true" className="block shrink-0"/>
        </button>
      </div>
    </div>
  </article>;
}
