import { useState } from 'react';
import type { OrderItem } from '@/features/orders/ordersStore';

const media=(src:string)=>import.meta.env.BASE_URL+src.replace(/^\/+/,'');

export function OrderItemPhoto({item}:{item:OrderItem}){
  const [fallback,setFallback]=useState(false);
  const original=item.imageUrl;
  const preferred=item.category==='Пиццы'&&!fallback
    ?'/media/cart/'+item.line.productId+'.webp'
    :original;
  return <img src={media(preferred)} alt={item.name}
    loading="lazy" decoding="async"
    onError={()=>{if(!fallback&&preferred!==original)setFallback(true);}}
    className="bmp-order-item-photo"/>;
}
