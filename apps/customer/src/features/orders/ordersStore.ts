import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartLine } from '@/features/cart/cartStore';

export type Fulfillment = 'delivery'|'pickup';
export type PaymentMethod = 'online'|'sbp'|'cash';
export type DeliveryTiming = 'asap'|'scheduled';

export type OrderItem = {
  line:CartLine;
  name:string;
  category:string;
  imageUrl:string;
  variantTitle:string;
  modifierTitles:string[];
  unitPrice:number;
};
export type DemoOrder = {
  id:string;
  createdAt:string;
  fulfillment:Fulfillment;
  address:string;
  entrance:string;
  floor:string;
  comment:string;
  timing:DeliveryTiming;
  scheduledAt:string;
  payment:PaymentMethod;
  items:OrderItem[];
  subtotal:number;
  discount:number;
  promoCode:string|null;
  total:number;
  // Without a backend, no restaurant or payment status can be asserted.
  status:'demo-created';
};
export type NewDemoOrder = Omit<DemoOrder,'id'|'createdAt'|'status'>;
type OrdersState = {
  orders:DemoOrder[];
  placeDemoOrder:(order:NewDemoOrder)=>string;
};

export const useOrdersStore=create<OrdersState>()(persist((set)=>({
  orders:[],
  placeDemoOrder:(order)=>{
    const id='D-'+Date.now().toString(36).toUpperCase()+
      '-'+Math.random().toString(36).slice(2,6).toUpperCase();
    const created:DemoOrder={...order,id,createdAt:new Date().toISOString(),status:'demo-created'};
    set(state=>({orders:[created,...state.orders].slice(0,100)}));
    return id;
  }
}),{
  name:'bmp-demo-orders-v1',
  storage:createJSONStorage(()=>localStorage),
  partialize:state=>({orders:state.orders})
}));
export const orderRub=(amount:number)=>amount.toLocaleString('ru-RU')+' ₽';
export const orderDate=(date:string)=>new Date(date).toLocaleString('ru-RU',{
  day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'
});
export const orderQty=(count:number)=>count%100>=11&&count%100<=14?'позиций':
  count%10===1?'позиция':count%10>=2&&count%10<=4?'позиции':'позиций';
