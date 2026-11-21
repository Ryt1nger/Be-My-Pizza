import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImageOff } from 'lucide-react';
import { catalogGateway } from '@/api';
function ProductImage({src,alt}:{src:string;alt:string}){
  const [failed,setFailed]=useState(false);
  const url=src.startsWith('/media/')?import.meta.env.BASE_URL+src.slice(1):src;
  return failed
    ? <div className="flex aspect-square items-center justify-center bg-[#F7F2EA] text-muted" role="img" aria-label={'Фото '+alt+' ещё не загружено'}><ImageOff size={32}/></div>
    : <img src={url} alt={alt} className="aspect-square w-full bg-[#F7F2EA] object-contain" loading="lazy" onError={()=>setFailed(true)}/>;
}
/** Technical review gallery only; not an approved catalog page. */
export function CatalogSandboxPage(){
 const {data=[],isLoading,error}=useQuery({queryKey:['catalog','sandbox'],queryFn:()=>catalogGateway.getProducts()});
 return <section><div className="mb-6 rounded-2xl border border-[#D9E8C7] bg-[#EDF3DF] p-4 text-sm text-primary"><b>Техническая галерея</b> — сопоставление 15 товаров со старым меню. Фотографии подключаются отдельным ассет-коммитом. Цены и составы пока не подтверждены.</div><h1 className="mb-5 text-2xl font-extrabold">Товары ({data.length})</h1>{isLoading&&<p>Загружаем каталог…</p>}{error&&<p role="alert">Не удалось загрузить каталог.</p>}<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{data.map(p=><article key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface"><ProductImage src={p.imageUrl} alt={p.name}/><div className="p-3"><div className="text-sm font-bold">{p.name}</div><div className="mt-1 text-xs text-muted">{p.category} · цена не подтверждена</div></div></article>)}</div></section>;
}
