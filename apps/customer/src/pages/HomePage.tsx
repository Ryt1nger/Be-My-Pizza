import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight,Heart,ArrowUpRight,ShoppingBag } from 'lucide-react';
import { catalogGateway } from '@/api';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import type { Product } from '@/domain/catalog';

function PopularProduct({product,isFavorite,onToggle}:{product:Product;isFavorite:boolean;onToggle:()=>void}){
return <article className="overflow-hidden rounded-[24px] bg-surface shadow-[0_8px_24px_rgba(10,32,18,.09)]">
  <div className="relative"><Link to={'/product/'+product.id} aria-label={'Открыть '+product.name}><ProductPhoto src={product.imageUrl} alt={product.name} className="aspect-[1.08] w-full"/></Link>
  <button type="button" onClick={onToggle} aria-pressed={isFavorite} aria-label={isFavorite?'Убрать из избранного':'В избранное'} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface/95 shadow-sm"><Heart size={23} fill={isFavorite?'#F65A12':'none'} stroke={isFavorite?'#F65A12':'#083123'}/></button></div>
  <div className="flex min-h-[130px] flex-col justify-between px-4 pb-4 pt-3"><div><Link to={'/product/'+product.id} className="text-[16px] font-extrabold leading-tight text-ink">{product.name}</Link><p className="mt-2 text-xs text-muted">{product.category} · состав уточняется</p></div>
    <div className="mt-3 flex items-center justify-between"><span className="text-[12px] font-bold text-muted">{product.priceRub===null?'Цена уточняется':product.priceRub+' ₽'}</span><Link to={'/product/'+product.id} aria-label={'Подробнее о '+product.name} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><ArrowUpRight size={20}/></Link></div>
  </div>
</article>}

export function HomePage(){
const {data:catalog=[],isLoading}=useQuery({queryKey:['catalog','home'],queryFn:()=>catalogGateway.getProducts()});
const [favorites,setFavorites]=useState<Set<string>>(new Set());
const popular=['ham-bacon','four-cheeses'].map(id=>catalog.find(p=>p.id===id)).filter((x):x is Product=>Boolean(x));
return <div className="mx-auto max-w-[1080px] pb-4">
  <div className="mb-3 rounded-xl bg-[#EDF3DF] px-4 py-2 text-xs font-medium text-primary" role="note">Черновик главной страницы по JPG-макету · ожидает утверждения</div>
  <section className="relative isolate mb-6 min-h-[335px] overflow-hidden rounded-[26px] bg-[#FCF7F3] sm:min-h-[410px] lg:min-h-[500px]" aria-labelledby="home-title">
    <div className="absolute inset-y-0 -right-28 w-[82%] sm:-right-16 sm:w-[65%] lg:right-0 lg:w-[53%]"><ProductPhoto src="/media/products/pepperoni.webp" alt="Пицца Пепперони" className="h-full w-full rounded-full object-cover"/></div>
    <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#FCF7F3] via-[#FCF7F3]/90 to-transparent"/>
    <div className="relative z-10 flex min-h-[335px] flex-col items-start justify-center px-2 py-6 sm:min-h-[410px] sm:px-8 lg:min-h-[500px] lg:px-14"><h1 id="home-title" className="max-w-[270px] text-[clamp(32px,8vw,68px)] font-black leading-[1.04] tracking-tight text-ink sm:max-w-[460px]">Настоящая пицца рядом</h1><p className="mt-5 max-w-[215px] text-[15px] leading-6 text-muted sm:max-w-sm sm:text-xl">Свежие ингредиенты и любимые вкусы в Орехово</p><Link to="/menu" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-sm sm:text-lg">Заказать пиццу <ArrowRight size={21}/></Link><div className="mt-7 flex gap-3" aria-label="Первый слайд из трёх"><span className="h-2.5 w-2.5 rounded-full bg-primary"/><span className="h-2.5 w-2.5 rounded-full bg-[#E9E6DF]"/><span className="h-2.5 w-2.5 rounded-full bg-[#E9E6DF]"/></div></div>
  </section>
  <section aria-label="Промо-блок на согласовании" className="relative mb-10 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#1B6535] to-[#074427] px-6 py-7 text-white sm:px-9 sm:py-9"><div className="relative z-10 max-w-[58%] sm:max-w-md"><span className="rounded-full bg-white/15 px-3 py-1 text-xs">Промо-блок · концепт</span><h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-4xl">Любимая пицца для вашей компании</h2><p className="mt-3 text-sm text-white/80">Акции и предложения появятся после согласования</p></div><div className="pointer-events-none absolute -bottom-12 -right-12 h-52 w-52 opacity-85 sm:-bottom-24 sm:right-0 sm:h-72 sm:w-72"><ProductPhoto src="/media/products/pepperoni.webp" alt="Пицца Пепперони" className="h-full w-full rounded-full object-contain"/></div></section>
  <section aria-labelledby="popular-title"><div className="mb-5 flex items-center justify-between gap-2"><h2 id="popular-title" className="text-[27px] font-black tracking-tight text-ink sm:text-4xl">Популярное</h2><Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold text-muted">Смотреть всё <ArrowRight size={17}/></Link></div>
   {isLoading&&<p className="text-sm text-muted">Загружаем позиции…</p>}
   <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">{popular.map(product=><PopularProduct key={product.id} product={product} isFavorite={favorites.has(product.id)} onToggle={()=>setFavorites(s=>{const next=new Set(s);if(next.has(product.id))next.delete(product.id);else next.add(product.id);return next})}/>)}</div>
   <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted"><ShoppingBag size={14}/> Добавление в корзину включим после подтверждения размеров и цен.</p>
  </section>
</div>}
