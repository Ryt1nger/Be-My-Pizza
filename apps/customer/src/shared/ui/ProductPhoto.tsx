import { useState } from 'react';
import { ImageOff } from 'lucide-react';
/**
 * Owner's full photo when present, compact preview atlas as temporary fallback.
 * Adapt absolute media paths to Vite's base (GitHub Pages subdirectory).
 */
const mediaUrl=(src:string)=>src.startsWith('/media/')
  ? import.meta.env.BASE_URL+src.slice(1)
  : src;
export function ProductPhoto({src,alt,className='',priority=false}:{src:string;alt:string;className?:string;priority?:boolean}){
 const [error,setError]=useState(false);
 if(error)return <div className={'flex items-center justify-center bg-[#F7F2EA] text-muted '+className}
  role="img" aria-label={'Фотография '+alt+' ещё не загружена'}><ImageOff size={38} strokeWidth={1.5}/></div>;
 return <img src={mediaUrl(src)} alt={alt} loading={priority?"eager":"lazy"} decoding="async" onError={()=>setError(true)} className={'object-cover '+className}/>;
}
