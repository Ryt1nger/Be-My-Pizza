export type ProductCategory = 'Пиццы' | 'Закуски' | 'Напитки';
export type ProductVariant = { id:string; title:string; priceRub:number|null };
export type Modifier = { id:string; title:string; priceRub:number|null };
export type ModifierGroup = { id:string; title:string; minSelected:number; maxSelected:number; modifiers:Modifier[] };
export type Product = { id:string; name:string; category:ProductCategory; imageUrl:string; description:string|null; priceRub:number|null; variants:ProductVariant[]; modifierGroups:ModifierGroup[] };
export interface CatalogGateway { getProducts():Promise<Product[]>; getProduct(id:string):Promise<Product|null> }
