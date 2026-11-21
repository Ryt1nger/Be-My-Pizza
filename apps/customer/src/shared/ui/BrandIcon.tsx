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
  /** Equalize the VISIBLE silhouette of each tab's active/inactive glyph. */
  nav?:boolean;
};
const navOutlineInkRatio:Partial<Record<BrandIconName,number>>={
  home:42/96, categories:42/96, promotion:60/96,
  favorite:48/96, profile:40/96
};
const navFilledInkRatio=95/108;

/**
 * The outline sprite has wide transparent margins (~40–60% of each cell);
 * the filled one nearly fills its cell (~88%). A 36px CSS background for
 * both therefore *visually* doubles the active glyph.
 *
 * Keep identical 36px layout boxes. For bottom tabs only, compute each
 * sprite's own inner size so the painted silhouette is about 25px across.
 */
export function BrandIcon({name,size=34,className='',label,filled=false,nav=false}:IconProps){
  const activeFill=filled && name in filledTabs;
  const [col,row]=locations[name];
  const paintedTarget=size*.69;
  const outlineFraction=navOutlineInkRatio[name]??.5;
  const artworkSize=nav
    ? Math.round(paintedTarget/(activeFill?navFilledInkRatio:outlineFraction))
    : size;
  const spriteStyle:CSSProperties=activeFill ? {
    backgroundImage:`url("${import.meta.env.BASE_URL}media/brand/nav-filled.svg")`,
    backgroundSize:'500% 100%',
    backgroundPosition:`${filledTabs[name as keyof typeof filledTabs]*25}% 50%`
  } : {
    backgroundImage:`url("${import.meta.env.BASE_URL}media/brand/icons.webp")`,
    backgroundSize:'400% 300%',
    backgroundPosition:`${col/3*100}% ${row/2*100}%`
  };
  return <span className={className} style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',
      width:size,height:size,flexShrink:0
    }} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true}>
      <span aria-hidden="true" style={{
        display:'block',flexShrink:0,width:artworkSize,height:artworkSize,
        backgroundRepeat:'no-repeat',...spriteStyle
      }}/>
    </span>;
}
