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
/** Measured alpha extents of the original owner-provided sprite tiles.
 *  Calibrate both filled and outlined variants to the SAME optical centre and
 *  max painted dimension. No selected-state scaling or positional jump. */
const outlineBounds:Partial<Record<BrandIconName,[number,number,number,number]>>={
  home:[14,21,74,69],
  categories:[16,24,83,77],
  promotion:[13,16,83,83],
  favorite:[13,22,65,73],
  profile:[15,23,60,67]
};
const filledBounds:Partial<Record<BrandIconName,[number,number,number,number]>>={
  home:[7,6,101,101],
  categories:[6,7,100,101],
  promotion:[6,7,101,101],
  favorite:[7,6,101,100],
  profile:[6,6,101,101]
};

export function BrandIcon({name,size=34,className='',label,filled=false,nav=false}:IconProps){
  const activeFill=filled && name in filledTabs;
  const [col,row]=locations[name];
  const bounds=activeFill?filledBounds[name]:outlineBounds[name];
  const tileSize=activeFill?108:96;
  const paintedMax=bounds?Math.max(bounds[2]-bounds[0],bounds[3]-bounds[1]):tileSize;
  const artworkSize=nav&&bounds
    ? Math.round((size*.70)*tileSize/paintedMax)
    : size;
  const opticalX=nav&&bounds?Math.round(((tileSize-(bounds[0]+bounds[2]))/2)*artworkSize/tileSize*100)/100:0;
  const opticalY=nav&&bounds?Math.round(((tileSize-(bounds[1]+bounds[3]))/2)*artworkSize/tileSize*100)/100:0;
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
        transform:`translate(${opticalX}px, ${opticalY}px)`,
        backgroundRepeat:'no-repeat',...spriteStyle
      }}/>
    </span>;
}
