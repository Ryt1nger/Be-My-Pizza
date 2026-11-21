import { useState } from 'react';
import { ImageOff } from 'lucide-react';
/** Broken images are visibly marked until original client photos are committed. */
export function ProductPhoto({src,alt,className=''}:{src:string;alt:string;className?:string}){const [error,setError]=useState(false);return error?<div className={'flex items-center justify-center bg-[#F7F2EA] text-muted '+className} role="img" aria-label={'Фотография '+alt+' ещё не загружена'}><ImageOff size={38} strokeWidth={1.5}/></div>:<img src={src} alt={alt} loading="lazy" onError={()=>setError(true)} className={'object-cover '+className}/>}
