import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Minus, Plus, ShoppingBag, Ticket, Trash2, X } from 'lucide-react';
import { catalogGateway } from '@/api';
import type { Product } from '@/domain/catalog';
import { useCartStore } from '@/features/cart/cartStore';
import { useProductSheetStore } from '@/features/product/productSheetStore';

const rub=(value:number)=>value.toLocaleString('ru-RU')+' ₽';
const asset=(path:string)=>import.meta.env.BASE_URL+path.replace(/^\//,'');

function CartPizzaPhoto({product}:{product:Product}){
  // Dedicated unsliced cart assets, completely independent of the menu photography.
  const [fallback,setFallback]=useState(false);
  return <img
    src={fallback?asset(product.imageUrl):asset('/media/cart/'+product.id+'.webp')}
    onError={()=>{if(!fallback)setFallback(true);}}
    className="bmp-cart-item-photo" alt={product.name} loading="eager" decoding="async"/>;
}

export function CartPage(){
  const lines=useCartStore(state=>state.lines);
  const setQuantity=useCartStore(state=>state.setQuantity);
  const remove=useCartStore(state=>state.remove);
  const clear=useCartStore(state=>state.clear);
  const promoCode=useCartStore(state=>state.promoCode);
  const setPromoCode=useCartStore(state=>state.setPromoCode);
  const openProduct=useProductSheetStore(state=>state.openProduct);
  const {data:products=[],isLoading}=useQuery({queryKey:['catalog','cart'],queryFn:()=>catalogGateway.getProducts()});
  const [code,setCode]=useState(promoCode??'');
  const promoApplied=promoCode==='PIZZA40';
  const [promoMessage,setPromoMessage]=useState('');

  const items=useMemo(()=>lines.map(line=>{
    const product=products.find(p=>p.id===line.productId);
    if(!product)return null;
    const selectedVariant=product.variants.find(v=>v.id===line.variantId);
    const modifiers=product.modifierGroups.flatMap(g=>g.modifiers)
      .filter(mod=>line.modifierIds.includes(mod.id));
    const unitPrice=(selectedVariant?.priceRub??product.priceRub??0)+
      modifiers.reduce((sum,mod)=>sum+(mod.priceRub??0),0);
    return {line,product,variant:selectedVariant,modifiers,unitPrice};
  }).filter((item):item is NonNullable<typeof item>=>item!==null),[lines,products]);
  const count=lines.reduce((sum,line)=>sum+line.quantity,0);
  const subtotal=items.reduce((sum,item)=>sum+item.unitPrice*item.line.quantity,0);
  const discount=promoApplied?Math.min(40,subtotal):0;
  const total=subtotal-discount;

  const applyCode=()=>{
    if(code.trim().toUpperCase()==='PIZZA40'){
      setPromoCode('PIZZA40');
      setPromoMessage('Промокод применён — скидка 40 ₽ (демо).');
    }else{
      setPromoCode(null);
      setPromoMessage('Промокод не найден.');
    }
  };

  return <section className="bmp-account-page bmp-cart-page" aria-labelledby="bmp-cart-title">
    <header className="bmp-cart-heading">
      <div className="bmp-page-heading">
        <h1 id="bmp-cart-title">Корзина</h1>
        <p>{count} {count%10===1&&count%100!==11?'позиция':count%10>=2&&count%10<=4&&(count%100<10||count%100>20)?'позиции':'позиций'} · {rub(total)}</p>
      </div>
      {lines.length>0&&<button type="button" className="bmp-cart-clear" onClick={()=>{
        if(window.confirm('Очистить корзину?')){clear();setCode('');setPromoMessage('');}
      }}><Trash2 size={21} strokeWidth={1.8} aria-hidden="true"/>Очистить</button>}
    </header>

    {isLoading&&<p className="bmp-cart-status" role="status">Загружаем корзину…</p>}
    {!isLoading&&items.length===0&&<div className="bmp-cart-empty">
      <ShoppingBag size={59} strokeWidth={1.4} aria-hidden="true"/>
      <h2>В корзине пока пусто</h2>
      <p>Выберите любимую пиццу — она появится здесь.</p>
      <Link to="/menu/pizza">Перейти в меню <ArrowRight size={22}/></Link>
    </div>}

    {items.length>0&&<>
      <div className="bmp-cart-items">
        {items.map(({line,product,variant,modifiers,unitPrice})=><article key={line.key} className="bmp-cart-item">
          <button type="button" className="bmp-cart-item-image" onClick={()=>openProduct(product.id)} aria-label={'Открыть '+product.name}>
            <CartPizzaPhoto product={product}/>
          </button>
          <div className="bmp-cart-item-content">
            <div className="bmp-cart-item-topline">
              <button type="button" className="bmp-cart-item-title" onClick={()=>openProduct(product.id)}>{product.name}</button>
              <button type="button" className="bmp-cart-item-remove" onClick={()=>remove(line.key)} aria-label={'Удалить '+product.name}><X size={22} strokeWidth={1.85}/></button>
            </div>
            <p className="bmp-cart-item-meta">
              {variant?.title??(product.category==='Пиццы'?'30 см':'1 шт.')}
              {product.weightGrams&&(!variant||variant.id==='30')?' · '+product.weightGrams+' г':''}
            </p>
            {modifiers.length>0&&<p className="bmp-cart-item-addons">{modifiers.map(m=>m.title).join(', ')}</p>}
            <div className="bmp-cart-item-bottom">
              <div className="bmp-cart-quantity" role="group" aria-label={'Количество '+product.name}>
                <button type="button" onClick={()=>{if(line.quantity===1)remove(line.key);else setQuantity(line.key,line.quantity-1);}} aria-label="Уменьшить количество">
                  <Minus size={21} strokeWidth={2.5}/>
                </button>
                <output aria-label={'Количество: '+line.quantity}>{line.quantity}</output>
                <button type="button" onClick={()=>setQuantity(line.key,line.quantity+1)} disabled={line.quantity>=99} aria-label="Увеличить количество">
                  <Plus size={21} strokeWidth={2.5}/>
                </button>
              </div>
              <strong className="bmp-cart-item-price">{rub(unitPrice*line.quantity)}</strong>
            </div>
          </div>
        </article>)}
      </div>

      <form className="bmp-cart-promo" onSubmit={event=>{event.preventDefault();applyCode();}}>
        <Ticket size={27} strokeWidth={1.7} aria-hidden="true"/>
        <label className="sr-only" htmlFor="bmp-promo-code">Промокод</label>
        <input id="bmp-promo-code" value={code} onChange={event=>setCode(event.target.value)}
          placeholder="Промокод" autoComplete="off" />
        <button type="submit">Применить</button>
      </form>
      {promoMessage&&<p className="bmp-cart-promo-message" role="status">{promoMessage}</p>}

      <div className="bmp-cart-summary" aria-label="Сумма заказа">
        <div><span>Сумма заказа</span><span>{rub(subtotal)}</span></div>
        {discount>0&&<div className="bmp-cart-summary-discount"><span>Скидка по акции</span><span>− {rub(discount)}</span></div>}
        <div><span>Доставка</span><span className="bmp-cart-free">Бесплатно</span></div>
        <div className="bmp-cart-total"><strong>Итого</strong><strong>{rub(total)}</strong></div>
      </div>
      <Link to="/checkout" className="bmp-cart-checkout">Оформить заказ <ArrowRight size={26} strokeWidth={2}/></Link>
    </>}
  </section>;
}
