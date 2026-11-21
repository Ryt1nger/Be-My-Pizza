import type { CSSProperties } from 'react';

/** Owner-supplied custom green icon sheet (4 cols x 3 rows), not Lucide replacements.
 * Crop each transparent cell with CSS so individual brand icons scale consistently.
 */
const locations = {
  menu:[0,0],cart:[1,0],home:[2,0],categories:[3,0],
  promotion:[0,1],favorite:[1,1],profile:[2,1],arrow:[3,1],
  plus:[0,2],close:[1,2],pizza:[2,2],settings:[3,2],
} as const;
export type BrandIconName=keyof typeof locations;
export function BrandIcon({name,size=34,className='',label}:{name:BrandIconName;size?:number;className?:string;label?:string}){
 const [col,row]=locations[name];
 const style:CSSProperties={
   width:size,height:size,flexShrink:0,display:'inline-block',
   backgroundImage:`url("${import.meta.env.BASE_URL}media/brand/icons.webp")`,
   backgroundRepeat:'no-repeat',backgroundSize:'400% 300%',
   backgroundPosition:`${col/3*100}% ${row/2*100}%`
 };
 return <span className={className} style={style} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true}/>;
}
