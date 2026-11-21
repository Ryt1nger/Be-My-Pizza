import { useState } from 'react';
import { ImageOff } from 'lucide-react';
/**
 * Shows the owner's original product photo when present, with a temporary
 * compact preview atlas as a fallback while full-resolution assets are added.
 * Atlas order is identical to the approved products.json entries.
 */
const previewOrder = [
 'chicken-mushrooms','ham-bacon','margherita','pepperoni',
 'eggplant-nuts','four-cheeses','chicken-bbq','tuna',
 'pear-gorgonzola','cheese-sticks','potato-wedges','nuggets',
 'french-fries','berry-mors','sweet-potato-fries'
];
export function ProductPhoto({src,alt,className=''}:{src:string;alt:string;className?:string}){
 const [error,setError]=useState(false);
 const slug=src.split('/').pop()?.replace(/\.webp$/,'')??'';
 const index=previewOrder.indexOf(slug);
 if(error && index>=0){
  const col=index%4,row=Math.floor(index/4);
  return <div className={'relative isolate overflow-hidden bg-[#F7F2EA] '+className}
       role="img" aria-label={alt}>
    <img src="/media/catalog-preview.webp" alt="" aria-hidden="true"
      className="absolute max-w-none"
      style={{width:'400%',height:'400%',left:`-${col*100}%`,top:`-${row*100}%`}}/>
   </div>;
 }
 if(error)return <div className={'flex items-center justify-center bg-[#F7F2EA] text-muted '+className}
  role="img" aria-label={'Фотография '+alt+' ещё не загружена'}><ImageOff size={38} strokeWidth={1.5}/></div>;
 return <img src={src} alt={alt} loading="lazy" onError={()=>setError(true)} className={'object-cover '+className}/>;
}
