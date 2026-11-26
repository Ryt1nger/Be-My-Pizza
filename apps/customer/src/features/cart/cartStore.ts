import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Server must compute authoritative prices; persisted client lines are only cart intent.
export type CartLine={key:string;productId:string;variantId?:string;modifierIds:string[];quantity:number};
type CartState={
  lines:CartLine[];
  promoCode:string|null;
  setPromoCode:(code:string|null)=>void;
  add:(line:CartLine)=>void;
  setQuantity:(key:string,quantity:number)=>void;
  remove:(key:string)=>void;
  clear:()=>void;
};

export const useCartStore=create<CartState>()(persist((set)=>({
  lines:[],
  promoCode:null,
  setPromoCode:promoCode=>set({promoCode}),
  add:line=>set(s=>{
    const existing=s.lines.find(x=>x.key===line.key);
    return {lines:[...s.lines.filter(x=>x.key!==line.key),{
      ...line,quantity:Math.max(1,Math.min(99,(existing?.quantity??0)+line.quantity))
    }]};
  }),
  setQuantity:(key,quantity)=>set(s=>({
    lines:s.lines.map(line=>line.key===key
      ?{...line,quantity:Math.max(1,Math.min(99,quantity))}
      :line)
  })),
  remove:key=>set(s=>({lines:s.lines.filter(x=>x.key!==key)})),
  clear:()=>set({lines:[],promoCode:null})
}),{
  name:'bmp-cart-v1',
  storage:createJSONStorage(()=>localStorage),
  partialize:state=>({lines:state.lines,promoCode:state.promoCode})
}));
