import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { catalogGateway } from '@/api';
import type { Product,ProductCategory } from '@/domain/catalog';
import { PizzaProductCard } from '@/shared/ui/PizzaProductCard';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import { useProductSheetStore } from '@/features/product/productSheetStore';

const categories=['Все','Пиццы','Закуски','Напитки'] as const;
type Filter=(typeof categories)[number];

function SmallProductCard({product}:{product:Product}){
 const open=useProductSheetStore(s=>s.openProduct);
 return <article className="group min-w-0 overflow-hidden rounded-[22px] bg-[#FFFDF9] shadow-[0_9px_25px_rgba(25,45,30,.08)]">
  <button type="button" onClick={()=>open(product.id)} className="relative block aspect-square w-full overflow-hidden rounded-t-[22px]">
   <ProductPhoto src={product.imageUrl} alt={product.name} className="h-full w-full object-cover"/>
  </button>
  <div className="flex min-h-[112px] flex-col px-3 pb-3 pt-3">
   <button type="button" onClick={()=>open(product.id)} className="bmp-body-strong text-left text-[14px] leading-5 text-ink">{product.name}</button>
   <div className="mt-auto flex items-end justify-between pt-3">
    <span className="bmp-price text-[20px]">{product.priceRub===null?'Уточняется':product.priceRub+' ₽'}</span>
    <button type="button" onClick={()=>open(product.id)}
      aria-label={'Выбрать '+product.name} className="grid h-9 w-9 place-items-center rounded-full bg-[#16833D] text-white">
      <Plus size={22} strokeWidth={2.5} aria-hidden="true"/>
    </button>
   </div>
  </div>
 </article>;
}
export function MenuPage(){
 const [filter,setFilter]=useState<Filter>('Все');
 const {data:products=[],isLoading,isError}=useQuery({queryKey:['catalog','menu'],queryFn:()=>catalogGateway.getProducts()});
 const visible=products.filter(p=>filter==='Все'||p.category===filter);
 return <section className="mx-auto max-w-[1080px] pt-5">
  <h1 className="bmp-display mb-5 text-[clamp(32px,8vw,44px)]">Меню</h1>
  <div className="bmp-menu-filters mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Категории меню">
   {categories.map(category=><button key={category} type="button"
     aria-pressed={filter===category}
     className={'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors '+(filter===category?'bg-[#145421] text-white':'bg-[#F1ECE7] text-[#32453A]')}
     onClick={()=>setFilter(category)}>{category}</button>)}
  </div>
  {isLoading&&<p role="status">Загружаем меню…</p>}
  {isError&&<p role="alert">Не удалось загрузить меню.</p>}
  <div className="bmp-menu-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
   {visible.map(p=>p.category==='Пиццы'
     ?<PizzaProductCard key={p.id} product={p} display={{sizeLabel:'30 см · '+p.weightGrams+' г'}}/>
     :<SmallProductCard key={p.id} product={p}/>)}
  </div>
 </section>;
}
