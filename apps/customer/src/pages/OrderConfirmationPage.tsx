import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, Check, ChevronLeft, Clock3, Headset, MapPin,
  PackageCheck, ShoppingBag, Truck
} from 'lucide-react';
import {
  useOrdersStore, orderDate, orderQty, orderRub
} from '@/features/orders/ordersStore';
import { OrderItemPhoto } from '@/pages/OrderItemPhoto';
import './order-pages.css';

export function OrderConfirmationPage(){
  const {id}=useParams<{id:string}>();
  const order=useOrdersStore(state=>state.orders.find(item=>item.id===id));
  if(!order)return <section className="bmp-order-page bmp-order-not-found">
    <h1>Заказ не найден</h1>
    <p>Заказы в демоверсии сохраняются только в этом браузере.</p>
    <Link to="/orders">Мои заказы <ArrowRight size={19}/></Link>
  </section>;

  const count=order.items.reduce((sum,item)=>sum+item.line.quantity,0);
  const steps=[
    {name:'Заказ создан',description:'Сохранён в демоверсии',phase:'current'},
    {name:'Готовим ваш заказ',description:'Ожидает подключения ресторана',phase:'future'},
    {name:'Собираем заказ',description:'Ещё не начато',phase:'future'},
    {name:order.fulfillment==='pickup'?'Готов к выдаче':'Передаём курьеру',
      description:'Ещё не начато',phase:'future'},
    {name:order.fulfillment==='pickup'?'Заказ выдан':'Доставляем',
      description:'Ещё не начато',phase:'future'}
  ] as const;

  return <section className="bmp-order-page bmp-order-confirmation"
    aria-labelledby="bmp-order-confirmation-title">
    <div className="bmp-confirmation-intro">
      <span className="bmp-confirmation-check" aria-hidden="true">
        <span><Check size={47} strokeWidth={2.3}/></span>
      </span>
      <h1 id="bmp-order-confirmation-title">Заказ оформлен!</h1>
      <p>Мы сохранили его в истории заказов этого устройства.</p>
      <span className="bmp-confirmation-number">Заказ №{order.id}</span>
    </div>

    <div className="bmp-confirmation-caution" role="note">
      Это демоверсия: заказ не отправлен в пиццерию, оплата не проводилась.
      Статусы доставки пока не обновляются.
    </div>

    <section className="bmp-order-panel bmp-confirmation-status" aria-labelledby="bmp-order-status-title">
      <div className="bmp-confirmation-panel-title">
        <h2 id="bmp-order-status-title">Статус заказа</h2>
        <div className="bmp-confirmation-estimate">
          <Clock3 size={23} strokeWidth={1.8} aria-hidden="true"/>
          <span>Время выполнения<small>Уточняется</small></span>
        </div>
      </div>
      <ol className="bmp-confirmation-steps">
        {steps.map((step,index)=><li key={step.name}
          className={'bmp-confirmation-step bmp-confirmation-step--'+step.phase}>
          <span className="bmp-confirmation-step-marker" aria-hidden="true">
            {index===0?<Check size={18} strokeWidth={3}/>:null}
          </span>
          <div>
            <strong>{step.name}</strong>
            <small>{index===0?orderDate(order.createdAt):step.description}</small>
          </div>
          {index===2&&<PackageCheck size={26} strokeWidth={1.6} aria-hidden="true"/>}
        </li>)}
      </ol>
    </section>

    <section className="bmp-order-panel bmp-confirmation-items" aria-labelledby="bmp-order-items-title">
      <div className="bmp-confirmation-panel-title">
        <h2 id="bmp-order-items-title">Состав заказа</h2>
        <span>{count} {orderQty(count)}</span>
      </div>
      <div className="bmp-order-product-list">
        {order.items.map(item=><div className="bmp-order-product" key={item.line.key}>
          <div className="bmp-order-product-image"><OrderItemPhoto item={item}/></div>
          <div className="bmp-order-product-copy">
            <strong>{item.name}</strong>
            <small>{item.variantTitle}</small>
            {item.modifierTitles.length>0&&<small>{item.modifierTitles.join(', ')}</small>}
          </div>
          <span className="bmp-order-product-qty">{item.line.quantity} шт.</span>
          <strong className="bmp-order-product-price">
            {orderRub(item.unitPrice*item.line.quantity)}
          </strong>
        </div>)}
      </div>
      <div className="bmp-order-items-total">
        {order.discount>0&&<p><span>Скидка</span><span>− {orderRub(order.discount)}</span></p>}
        <p><strong>Итого</strong><strong>{orderRub(order.total)}</strong></p>
      </div>
    </section>

    <section className="bmp-order-panel bmp-confirmation-details">
      <h2>Детали заказа</h2>
      <div><MapPin size={19} strokeWidth={1.8} aria-hidden="true"/>
        <span>{order.fulfillment==='pickup'?'Самовывоз':order.address}</span></div>
      <div><Clock3 size={19} strokeWidth={1.8} aria-hidden="true"/>
        <span>{order.timing==='asap'?'Как можно скорее':order.scheduledAt.replace('T',' ')}</span></div>
      <div><ShoppingBag size={19} strokeWidth={1.8} aria-hidden="true"/>
        <span>{order.payment==='online'?'Банковской картой онлайн':
          order.payment==='sbp'?'СБП':'Наличными при получении'}
          {' · оплата не проводилась'}</span></div>
    </section>

    <Link className="bmp-order-primary-action" to="/orders">
      <Truck size={24} strokeWidth={1.8} aria-hidden="true"/>
      Мои заказы <ArrowRight size={20} strokeWidth={2} aria-hidden="true"/>
    </Link>
    <Link className="bmp-order-secondary-action" to="/support">
      <Headset size={22} strokeWidth={1.8} aria-hidden="true"/> Связаться с поддержкой
    </Link>
    <Link className="bmp-order-return" to="/menu">
      <ChevronLeft size={18} aria-hidden="true"/> Вернуться в меню
    </Link>
  </section>;
}
