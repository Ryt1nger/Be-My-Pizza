import { useState } from 'react';
/** Wordmark is cropped from the approved home-page reference. The round logo remains on disk for elsewhere. */
export function BrandLogo(){
 const [broken,setBroken]=useState(false);
 return broken
  ? <span className="whitespace-nowrap text-[25px] font-black tracking-tight text-primary">Be My <span className="italic text-accent">Pizza</span></span>
  : <img src={import.meta.env.BASE_URL+'media/brand/wordmark.webp'} alt="Be My Pizza"
      className="block h-[42px] w-[154px] object-contain sm:h-[44px] sm:w-[168px]"
      onError={()=>setBroken(true)} />;
}
