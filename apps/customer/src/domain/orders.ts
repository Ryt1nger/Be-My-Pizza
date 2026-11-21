/** Domain contract, independent of possible YumaPOS integration. */
export type OrderStatus = 'draft'|'submitted'|'confirmed'|'cooking'|'ready'|'delivering'|'completed'|'cancelled';
export type OrderLineInput = { productId:string; variantId?:string; quantity:number; modifierIds:string[] };
export type CreateOrderInput = { lines:OrderLineInput[]; deliveryMode:'delivery'|'pickup'; addressId?:string; comment?:string };
export type Order = { id:string; status:OrderStatus; totalRub:number; createdAt:string };
export interface OrdersGateway { quote(input:CreateOrderInput):Promise<{totalRub:number;deliveryRub:number}>; create(input:CreateOrderInput):Promise<Order>; get(id:string):Promise<Order> }
