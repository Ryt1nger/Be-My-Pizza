import { create } from 'zustand';
// Server must compute authoritative prices; do not trust client totals.
export type CartLine={key:string;productId:string;variantId?:string;modifierIds:string[];quantity:number};
type CartState={lines:CartLine[];add:(line:CartLine)=>void;remove:(key:string)=>void;clear:()=>void};
export const useCartStore=create<CartState>(set=>({lines:[],add:line=>set(s=>{const existing=s.lines.find(x=>x.key===line.key);return {lines:[...s.lines.filter(x=>x.key!==line.key),{...line,quantity:(existing?.quantity??0)+line.quantity}]}}),remove:key=>set(s=>({lines:s.lines.filter(x=>x.key!==key)})),clear:()=>set({lines:[]})}));
