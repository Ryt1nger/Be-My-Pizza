import { create } from 'zustand';

/** UI-only sheet state: all product cards open the same dialog in-place. */
type ProductSheetState={
  productId:string|null;
  openProduct:(productId:string)=>void;
  closeProduct:()=>void;
};
export const useProductSheetStore=create<ProductSheetState>(set=>({
  productId:null,
  openProduct:productId=>set({productId}),
  closeProduct:()=>set({productId:null})
}));
