/** Retinally crisp, fully transparent ingredient artwork. No JPEG/WebP matte. */
export type IngredientKind='mozzarella'|'bacon'|'mushrooms'|'jalapeno';

export function IngredientArt({name}:{name:IngredientKind}){
 return <svg viewBox="0 0 108 82" width="80" height="61" aria-hidden="true"
   xmlns="http://www.w3.org/2000/svg" style={{overflow:'visible'}}>
  <defs>
   <filter id="bmp-ing-shadow" x="-25%" y="-35%" width="150%" height="170%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
    <feOffset dx="0" dy="2" result="blur"/>
    <feComponentTransfer in="blur" result="fade"><feFuncA type="linear" slope=".22"/></feComponentTransfer>
    <feMerge><feMergeNode in="fade"/><feMergeNode in="SourceGraphic"/></feMerge>
   </filter>
   <radialGradient id="bmp-ing-cheese" cx=".29" cy=".22" r=".88">
    <stop stopColor="#FFFDF3"/><stop offset=".52" stopColor="#F4EDD7"/>
    <stop offset="1" stopColor="#D6C9AA"/>
   </radialGradient>
   <linearGradient id="bmp-ing-leaf" x1="0" y1="0" x2="1" y2="1">
    <stop stopColor="#74AE39"/><stop offset=".55" stopColor="#2E802B"/><stop offset="1" stopColor="#195D26"/>
   </linearGradient>
   <linearGradient id="bmp-ing-bacon" x1="0" y1="0" x2="1" y2="1">
    <stop stopColor="#F5BA8B"/><stop offset=".22" stopColor="#C96345"/>
    <stop offset=".53" stopColor="#B84234"/><stop offset=".79" stopColor="#E77D55"/><stop offset="1" stopColor="#A13D34"/>
   </linearGradient>
   <radialGradient id="bmp-ing-mushroom" cx=".33" cy=".16" r=".95">
    <stop stopColor="#FDF3DC"/><stop offset=".59" stopColor="#E8D1AC"/>
    <stop offset="1" stopColor="#BA9874"/>
   </radialGradient>
   <radialGradient id="bmp-ing-pepper" cx=".38" cy=".25" r=".95">
    <stop stopColor="#8AB83C"/><stop offset=".5" stopColor="#4E8E24"/>
    <stop offset="1" stopColor="#1B5D28"/>
   </radialGradient>
  </defs>
  {name==='mozzarella'&&<g filter="url(#bmp-ing-shadow)">
   <path d="M61 34Q76 3 100 18Q91 42 65 43Z" fill="url(#bmp-ing-leaf)"/>
   <path d="M60 36Q76 18 94 19" fill="none" stroke="#B3D981" strokeWidth="2.1"/>
   <path d="M31 43Q14 12 38 9Q57 14 48 38Z" fill="url(#bmp-ing-leaf)"/>
   <path d="M37 35Q39 24 39 15" fill="none" stroke="#D1E9A8" strokeWidth="1.5"/>
   <ellipse cx="33" cy="47" rx="21" ry="19" fill="url(#bmp-ing-cheese)" stroke="#ECE2CC"/>
   <ellipse cx="73" cy="50" rx="22" ry="19" fill="url(#bmp-ing-cheese)" stroke="#E4D8C0"/>
   <ellipse cx="51" cy="31" rx="21" ry="19" fill="url(#bmp-ing-cheese)" stroke="#EEE5D3"/>
   <path d="M25 39Q29 33 35 34M63 44Q67 39 74 39M44 23Q47 18 54 19" fill="none" stroke="#FFFDF7" strokeWidth="3" strokeLinecap="round" opacity=".83"/>
  </g>}
  {name==='bacon'&&<g filter="url(#bmp-ing-shadow)" strokeLinejoin="round" strokeLinecap="round">
   <path d="M23 61Q35 46 28 29Q24 12 40 8L63 13Q70 33 54 50L46 69Z" fill="url(#bmp-ing-bacon)" stroke="#9A3A2D" strokeWidth="1"/>
   <path d="M30 59Q41 39 36 24Q34 17 43 13" fill="none" stroke="#F6C79F" strokeWidth="5" opacity=".83"/>
   <path d="M41 58Q54 35 47 21" fill="none" stroke="#FCC9A3" strokeWidth="3" opacity=".77"/>
   <path d="M38 66Q49 44 56 26Q63 7 79 18L94 27Q84 45 68 61L55 75Z" fill="url(#bmp-ing-bacon)" stroke="#A84233" strokeWidth="1.2"/>
   <path d="M47 64Q62 41 68 20M60 67Q78 48 86 30" fill="none" stroke="#F5CEAD" strokeWidth="6" opacity=".9"/>
   <path d="M46 60Q61 35 66 19M65 61Q79 47 85 32" fill="none" stroke="#B8503D" strokeWidth="2"/>
   <path d="M13 60Q26 51 29 44Q38 39 51 47L71 58L58 70L39 64L18 72Z" fill="url(#bmp-ing-bacon)" stroke="#AE4432" strokeWidth="1"/>
   <path d="M18 64Q30 56 42 54L57 62" fill="none" stroke="#FFE1BD" strokeWidth="4"/>
  </g>}
  {name==='mushrooms'&&<g filter="url(#bmp-ing-shadow)" strokeLinejoin="round">
   <path d="M52 42Q48 18 69 15Q93 15 90 44L76 48L75 66L59 65L59 48Z" fill="url(#bmp-ing-mushroom)" stroke="#B99A78" strokeWidth="1.4"/>
   <path d="M55 42Q70 37 87 44" stroke="#9D7855" strokeWidth="4" fill="none"/>
   <path d="M65 41L66 59M72 41L71 60M79 43L76 57" stroke="#B18A63" strokeWidth="1.6"/>
   <path d="M25 67Q9 53 21 31Q28 21 41 27Q52 35 49 48Q53 56 46 65L37 74Z" fill="url(#bmp-ing-mushroom)" stroke="#B18E6D" strokeWidth="1.2"/>
   <path d="M18 47Q30 34 45 44L45 55Q36 49 25 64" fill="#735B43" opacity=".75"/>
   <path d="M34 44L39 68M28 47L34 66" stroke="#C7AA83" strokeWidth="2"/>
   <path d="M58 66Q58 49 72 49Q91 48 95 64L88 72L83 65L78 77L67 77L66 65Z" fill="url(#bmp-ing-mushroom)" stroke="#BCA07D" strokeWidth="1.2"/>
   <path d="M65 65Q75 57 88 64M75 61L74 73M83 61L80 72" stroke="#8F7155" strokeWidth="2" fill="none"/>
  </g>}
  {name==='jalapeno'&&<g filter="url(#bmp-ing-shadow)">
   {[[35,49,-17],[63,26,12],[78,57,18],[53,61,-9]].map(([x,y,a],i)=>
    <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
     <ellipse cx="0" cy="0" rx="21" ry="16.5" fill="url(#bmp-ing-pepper)" stroke="#1A5D23" strokeWidth="2"/>
     <ellipse cx="-1" cy="-1" rx="15.7" ry="11.7" fill="#BED36B" stroke="#80A63D" strokeWidth="1.8"/>
     <ellipse cx="-2" cy="0" rx="9" ry="5.7" fill="#E0DDA1" opacity=".78"/>
     <path d="M-9-1L-5-7L0-2L7-7L8 1L3 5L-3 3Z" fill="#DBDDA0" stroke="#B2B56E" strokeWidth="1"/>
     <circle cx="-8" cy="2" r="1.9" fill="#F8E8AF"/>
     <circle cx="4" cy="-4" r="1.6" fill="#F7E7A9"/>
     <circle cx="7" cy="4" r="1.6" fill="#F6E5A1"/>
    </g>)}
  </g>}
 </svg>;
}
