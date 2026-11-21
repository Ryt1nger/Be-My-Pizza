import type { CSSProperties } from 'react';

/** Two owner-supplied icon sheets, matched by icon name:
 * - outline: original 4×3 sheet for inactive elements and general UI;
 * - filled: traced from owner's five-icon set, used ONLY for active bottom-nav tabs.
 * Keep outlines on the inactive tabs. Never tint the whole panel on selection.
 */
const locations = {
  menu:[0,0],cart:[1,0],home:[2,0],categories:[3,0],
  promotion:[0,1],favorite:[1,1],profile:[2,1],arrow:[3,1],
  plus:[0,2],close:[1,2],pizza:[2,2],settings:[3,2],
} as const;
const filledTabs = {
  home:0,categories:1,promotion:2,favorite:3,profile:4
} as const;
export type BrandIconName=keyof typeof locations;
type IconProps={
  name:BrandIconName;
  size?:number;
  className?:string;
  label?:string;
  filled?:boolean;
};
export function BrandIcon({name,size=34,className='',label,filled=false}:IconProps){
  const filledTab=filled&&name in filledTabs;
  let style:CSSProperties;
  if(filledTab){
    const col=filledTabs[name as keyof typeof filledTabs];
    style={
      width:size,height:size,flexShrink:0,display:'inline-block',
      backgroundImage:`url("${import.meta.env.BASE_URL}media/brand/nav-filled.svg")`,
      backgroundRepeat:'no-repeat',
      backgroundSize:'500% 100%',
      backgroundPosition:`${col*25}% 50%`
    };
  }else{
    const [col,row]=locations[name];
    style={
      width:size,height:size,flexShrink:0,display:'inline-block',
      backgroundImage:`url("${import.meta.env.BASE_URL}media/brand/icons.webp")`,
      backgroundRepeat:'no-repeat',
      backgroundSize:'400% 300%',
      backgroundPosition:`${col/3*100}% ${row/2*100}%`
    };
  }
  return <span className={className} style={style}
    role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true}/>;
}
