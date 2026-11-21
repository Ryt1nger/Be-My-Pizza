import { useState } from 'react';
/** Owner-provided brand logo optimized for UI. */
export function BrandLogo(){
 const [broken,setBroken]=useState(false);
 return !broken
  ? <img src={import.meta.env.BASE_URL+'media/brand/logo.webp'} alt="Be My Pizza"
      className="h-12 w-12 rounded-full object-contain" onError={()=>setBroken(true)}/>
  : <span className="inline-flex items-baseline gap-1 whitespace-nowrap text-[23px] font-black tracking-[-0.05em] text-primary">Be My<span className="text-accent italic">Pizza</span></span>;
}
