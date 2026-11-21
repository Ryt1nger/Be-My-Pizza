import { create } from 'zustand';
// Server must compute authoritative prices; do not trust client totals.
export type CartLine={key:string;productId:string;variantId?:string;modifierIds:string[];quantity:number};
type CartState={lines:CartLine[];add:(line:CartLine)=>void;remove:(key:string)=>void;clear:()=>void};
export const useCartStore=create<CartState>(set=>({lines:[],add:line=>set(s=>({lines:[...s.lines.filter(x=>x.key!==line.key),line]})),remove:key=>set(s=>({lines:s.lines.filter(x=>x.key!==key)})),clear:()=>set({lines:[]})}));
