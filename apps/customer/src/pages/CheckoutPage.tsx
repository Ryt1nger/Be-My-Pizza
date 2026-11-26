import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Banknote, Bike, CalendarDays, ChevronLeft, Clock3,
  CreditCard, DoorOpen, MapPin, MessageSquareText, ShoppingBag, Wallet
} from 'lucide-react';
import { catalogGateway } from '@/api';
import { useCartStore } from '@/features/cart/cartStore';
import {
  useOrdersStore, orderRub, type DeliveryTiming, type Fulfillment,
  type OrderItem, type PaymentMethod
} from '@/features/orders/ordersStore';
import './order-pages.css';

const paymentChoices:{value:PaymentMethod;label:string;Icon:typeof CreditCard}[]=[
  {value:'online',label:'Банковской картой онлайн',Icon:CreditCard},
  {value:'sbp',label:'СБП',Icon:Wallet},
  {value:'cash',label:'Наличными при получении',Icon:Banknote}
];

export function CheckoutPage(){
  const navigate=useNavigate();
  const lines=useCartStore(state=>state.lines);
  const promoCode=useCartStore(state=>state.promoCode);
  const clearCart=useCartStore(state=>state.clear);
  const placeDemoOrder=useOrdersStore(state=>state.placeDemoOrder);
  const {data:products=[],isLoading,isError}=useQuery({
    queryKey:['catalog','checkout'],queryFn:()=>catalogGateway.getProducts()
  });
  const [fulfillment,setFulfillment]=useState<Fulfillment>('delivery');
  const [address,setAddress]=useState('');
  const [entrance,setEntrance]=useState('');
  const [floor,setFloor]=useState('');
  const [comment,setComment]=useState('');
  const [timing,setTiming]=useState<DeliveryTiming>('asap');
  const [scheduledAt,setScheduledAt]=useState('');
  const [payment,setPayment]=useState<PaymentMethod>('online');
  const [error,setError]=useState('');

  const orderItems=useMemo(()=>{
    const byId=new Map(products.map(p=>[p.id,p]));
    return lines.flatMap((line):OrderItem[]=>{
      const p=byId.get(line.productId);
      if(!p)return [];
      const variant=p.variants.find(v=>v.id===line.variantId);
      const mods=p.modifierGroups.flatMap(g=>g.modifiers)
        .filter(m=>line.modifierIds.includes(m.id));
      return [{
        line:{...line,modifierIds:[...line.modifierIds]},
        name:p.name,category:p.category,imageUrl:p.imageUrl,
        variantTitle:variant?.title??(p.category==='Пиццы'?'30 см':'1 шт.'),
        modifierTitles:mods.map(m=>m.title),
        unitPrice:(variant?.priceRub??p.priceRub??0)+
          mods.reduce((sum,m)=>sum+(m.priceRub??0),0)
      }];
    });
  },[lines,products]);
  const subtotal=orderItems.reduce((sum,item)=>sum+item.unitPrice*item.line.quantity,0);
  const discount=promoCode==='PIZZA40'?Math.min(40,subtotal):0;
  const total=subtotal-discount;
  const qty=orderItems.reduce((sum,item)=>sum+item.line.quantity,0);
  const localNow=new Date(Date.now()-new Date().getTimezoneOffset()*60_000)
    .toISOString().slice(0,16);

  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(isLoading||isError||!lines.length||orderItems.length!==lines.length){
      setError('Состав заказа не загрузился. Вернитесь в корзину.');
      return;
    }
    if(fulfillment==='delivery'&&!address.trim()){
      setError('Укажите адрес доставки.');
      document.getElementById('bmp-checkout-address')?.focus();
      return;
    }
    if(timing==='scheduled'&&(!scheduledAt||new Date(scheduledAt).getTime()<=Date.now())){
      setError('Выберите будущую дату и время.');
      document.getElementById('bmp-checkout-time')?.focus();
      return;
    }
    setError('');
    // Demo only. No payment gateway, order API or actual restaurant acceptance.
    const id=placeDemoOrder({
      fulfillment,
      address:fulfillment==='delivery'?address.trim():'',
      entrance:fulfillment==='delivery'?entrance.trim():'',
      floor:fulfillment==='delivery'?floor.trim():'',
      comment:comment.trim(),
      timing,scheduledAt:timing==='scheduled'?scheduledAt:'',
      payment,items:orderItems,subtotal,discount,promoCode,total
    });
    clearCart();
    navigate('/orders/'+encodeURIComponent(id),{replace:true});
  }

  return <section className="bmp-order-page bmp-checkout-page" aria-labelledby="bmp-checkout-heading">
    <div className="bmp-order-titlebar">
      <Link to="/cart" className="bmp-order-back" aria-label="Вернуться в корзину">
        <ChevronLeft size={29} strokeWidth={2.25} aria-hidden="true"/>
      </Link>
      <div>
        <h1 id="bmp-checkout-heading">Доставка и оплата</h1>
        <p>Укажите адрес и удобный способ оплаты</p>
      </div>
    </div>

    <form onSubmit={submit} noValidate>
      <div className="bmp-checkout-fulfillment" role="group" aria-label="Способ получения">
        <button type="button" aria-pressed={fulfillment==='delivery'}
          className={'bmp-choice-tile'+(fulfillment==='delivery'?' bmp-choice-tile--selected':'')}
          onClick={()=>{setFulfillment('delivery');setError('');}}>
          <Bike size={27} strokeWidth={1.8} aria-hidden="true"/><strong>Доставка</strong>
        </button>
        <button type="button" aria-pressed={fulfillment==='pickup'}
          className={'bmp-choice-tile'+(fulfillment==='pickup'?' bmp-choice-tile--selected':'')}
          onClick={()=>{setFulfillment('pickup');setError('');}}>
          <ShoppingBag size={27} strokeWidth={1.8} aria-hidden="true"/>
          <span>Самовывоз</span><em>−10%</em>
        </button>
      </div>

      {fulfillment==='delivery'?<div className="bmp-checkout-address">
        <label className="bmp-checkout-input-card bmp-checkout-input-card--wide" htmlFor="bmp-checkout-address">
          <MapPin size={26} strokeWidth={1.8} aria-hidden="true"/>
          <span><small>Адрес доставки</small>
            <input id="bmp-checkout-address" type="text" autoComplete="street-address"
              value={address} onChange={event=>{setAddress(event.target.value);setError('');}}
              placeholder="Улица, дом, квартира" maxLength={200}/>
          </span>
        </label>
        <div className="bmp-checkout-input-row">
          <label className="bmp-checkout-input-card" htmlFor="bmp-checkout-entrance">
            <DoorOpen size={25} strokeWidth={1.8} aria-hidden="true"/>
            <span><small>Подъезд</small><input id="bmp-checkout-entrance" type="text"
              inputMode="numeric" value={entrance} onChange={event=>setEntrance(event.target.value)}
              placeholder="—" maxLength={12}/></span>
          </label>
          <label className="bmp-checkout-input-card" htmlFor="bmp-checkout-floor">
            <span className="bmp-checkout-stairs" aria-hidden="true">⌁</span>
            <span><small>Этаж</small><input id="bmp-checkout-floor" type="text"
              inputMode="numeric" value={floor} onChange={event=>setFloor(event.target.value)}
              placeholder="—" maxLength={12}/></span>
          </label>
        </div>
      </div>:<div className="bmp-checkout-pickup-note">
        <ShoppingBag size={25} strokeWidth={1.8} aria-hidden="true"/>
        <span><strong>Самовывоз</strong>
          <small>Адрес пиццерии появится после подключения реального оформления.</small>
        </span>
      </div>}

      <label className="bmp-checkout-input-card bmp-checkout-comment" htmlFor="bmp-checkout-comment">
        <MessageSquareText size={26} strokeWidth={1.8} aria-hidden="true"/>
        <span><small>Комментарий к заказу</small>
          <textarea id="bmp-checkout-comment" value={comment}
            onChange={event=>setComment(event.target.value)}
            placeholder="Например: домофон не работает" rows={1} maxLength={500}/>
        </span>
      </label>

      <fieldset className="bmp-checkout-group">
        <legend>Время {fulfillment==='delivery'?'доставки':'получения'}</legend>
        <div className="bmp-checkout-timing">
          <button type="button" aria-pressed={timing==='asap'}
            className={'bmp-checkout-time-tile'+(timing==='asap'?' bmp-checkout-time-tile--active':'')}
            onClick={()=>{setTiming('asap');setError('');}}>
            <Clock3 size={27} strokeWidth={1.8} aria-hidden="true"/>
            <span><strong>Как можно скорее</strong><small>Время уточняется</small></span>
          </button>
          <button type="button" aria-pressed={timing==='scheduled'}
            className={'bmp-checkout-time-tile'+(timing==='scheduled'?' bmp-checkout-time-tile--active':'')}
            onClick={()=>{setTiming('scheduled');setError('');}}>
            <CalendarDays size={27} strokeWidth={1.8} aria-hidden="true"/>
            <span><strong>К определённому времени</strong></span>
          </button>
        </div>
        {timing==='scheduled'&&<label className="bmp-checkout-schedule" htmlFor="bmp-checkout-time">
          Выберите дату и время
          <input id="bmp-checkout-time" type="datetime-local" min={localNow}
            value={scheduledAt} onChange={event=>{setScheduledAt(event.target.value);setError('');}}/>
        </label>}
      </fieldset>

      <fieldset className="bmp-checkout-group">
        <legend>Способ оплаты</legend>
        <div className="bmp-checkout-payments">
          {paymentChoices.map(({value,label,Icon})=>
            <label key={value} className={'bmp-checkout-payment'+(payment===value?' bmp-checkout-payment--selected':'')}>
              <input type="radio" name="payment-method" value={value} checked={payment===value}
                onChange={()=>setPayment(value)}/>
              <Icon size={25} strokeWidth={1.8} aria-hidden="true"/>
              <span>{label}</span>
              <i aria-hidden="true"/>
            </label>)}
        </div>
      </fieldset>

      <div className="bmp-checkout-total">
        <span>{qty} {qty===1?'товар':qty>=2&&qty<=4?'товара':'товаров'}</span>
        <strong>{orderRub(total)}</strong>
      </div>
      {discount>0&&<p className="bmp-checkout-discount">Промокод {promoCode}: скидка {orderRub(discount)}</p>}
      <p className="bmp-checkout-demo-note">
        Демоверсия: заказ сохранится только на этом устройстве.
        Деньги не списываются, информация в пиццерию не отправляется.
      </p>
      {error&&<p className="bmp-checkout-error" role="alert">{error}</p>}
      <button type="submit" className="bmp-checkout-submit" disabled={isLoading||isError||!lines.length}>
        Оформить заказ <ArrowRight size={24} strokeWidth={2.25} aria-hidden="true"/>
      </button>
      {(!lines.length||isError)&&<Link to="/cart" className="bmp-checkout-cart-link">
        {isLoading?'Загружаем состав заказа…':'Вернуться в корзину'}
      </Link>}
    </form>
  </section>;
}
