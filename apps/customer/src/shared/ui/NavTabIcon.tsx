/**
 * Unified bottom-nav icon geometry for Be My Pizza.
 * Every glyph shares the SAME 30×30 displayed size in both states.
 * Active state changes ONLY the filling/color, never size, offsets, paths,
 * stroke geometry or label layout. Based on the owner's five icon silhouettes.
 */
export type NavTabIconName='home'|'categories'|'promotion'|'favorite'|'profile';

export function NavTabIcon({name,active}:{name:NavTabIconName;active:boolean}){
 const paint=active?'currentColor':'none';
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
   width="30" height="30" className="block h-[30px] w-[30px] shrink-0"
   fill="none" stroke="currentColor" strokeWidth="2.25"
   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  {name==='home'&&
   <path fill={paint}
    d="M16 3.5 3.9 13.7v11.4c0 1.7 1.3 3 3 3h5.3v-8.2c0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8v8.2h5.3c1.7 0 3-1.3 3-3V13.7L16 3.5Z"/>}
  {name==='categories'&&
   <g fill={paint}>
    <circle cx="9.3" cy="9.3" r="4.6"/>
    <circle cx="22.7" cy="9.3" r="4.6"/>
    <circle cx="9.3" cy="22.7" r="4.6"/>
    <circle cx="22.7" cy="22.7" r="4.6"/>
   </g>}
  {name==='promotion'&&<>
   <path fill={paint} d="M16 3.2c1.5 0 2.6 1.5 4 1.8l4-.3 1.1 3.9 3.1 2.5-.8 4.9.8 4.2-3.1 2.5-1.1 4-4-.3-4 1.8-4-1.8-4 .3-1.1-4-3.1-2.5.8-4.2-.8-4.9 3.1-2.5 1.1-3.9 4 .3c1.4-.3 2.5-1.8 4-1.8Z"/>
   <g fill="none" stroke={active?'#FFFFFF':'currentColor'} strokeWidth="2.25">
    <path d="m11 21 10-10"/>
    <circle cx="11.5" cy="11.5" r="1.9"/>
    <circle cx="20.5" cy="20.5" r="1.9"/>
   </g>
  </>}
  {name==='favorite'&&
   <path fill={paint} d="M16 27.7 5.7 17.4C1.4 13.1 3 5.5 8.4 4.8c3.5-.5 5.9 1 7.6 3.6 1.7-2.6 4.1-4.1 7.6-3.6 5.4.7 7 8.3 2.7 12.6L16 27.7Z"/>}
  {name==='profile'&&
   <g fill={paint}>
    <circle cx="16" cy="9.2" r="5"/>
    <path d="M4.6 27.4c0-6.2 5.1-11.2 11.4-11.2s11.4 5 11.4 11.2H4.6Z"/>
   </g>}
 </svg>;
}
