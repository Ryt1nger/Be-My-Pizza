import { useState } from 'react';
/** Renders the supplied brand asset once public/media/brand/logo.png is committed.
 * Until that point, a clearly temporary typographic fallback is shown. */
export function BrandLogo(){const [broken,setBroken]=useState(false);return !broken?<img src="/media/brand/logo.png" alt="Be My Pizza" className="h-10 w-auto max-w-[180px] object-contain" onError={()=>setBroken(true)}/>:<span className="inline-flex items-baseline gap-1 whitespace-nowrap text-[23px] font-black tracking-[-0.05em] text-primary">Be My<span className="text-accent italic">Pizza</span></span>}
