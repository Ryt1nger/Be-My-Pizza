import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Clock3, History, MapPin, RotateCcw, ShoppingBag
} from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import {
  useOrdersStore, orderDate, orderQty, orderRub, orderCountLabel, type DemoOrder
} from '@/features/orders/ordersStore';
import { OrderItemPhoto } from '@/pages/OrderItemPhoto';
import './order-pages.css';

export function OrdersPage(){
  const orders=useOrdersStore(state=>state.orders);
  const addToCart=useCartStore(state=>state.add);
  const navigate=useNavigate();

  const repeatOrder=(order:DemoOrder)=>{
    for(const item of order.items){
      addToCart({...item.line,modifierIds:[...item.line.modifierIds]});
    }
    navigate('/cart');
  };

  return <section className="bmp-order-page bmp-orders-page" aria-labelledby="bmp-orders-title">
    <header className="bmp-orders-heading">
      <h1 id="bmp-orders-title">Мои заказы</h1>
      <p>{orders.length===0
        ?'Ваша история заказов'
        :'Сохранено '+orderCountLabel(orders.length)}</p>
    </header>
    {orders.length===0?<div className="bmp-orders-empty" role="status">
      <span className="bmp-orders-empty-icon" aria-hidden="true">
        <ShoppingBag size={53} strokeWidth={1.6}/>
      </span>
      <h2>Пока нет заказов</h2>
      <p>Когда оформите первый заказ, его состав и детали появятся здесь.</p>
      <Link className="bmp-order-primary-action" to="/menu">
        Перейти в меню <ArrowRight size={21} strokeWidth={2} aria-hidden="true"/>
      </Link>
    </div>:
    <>
      <div className="bmp-orders-intro">
        <History size={22} strokeWidth={1.9} aria-hidden="true"/>
        <h2>История заказов</h2>
      </div>
      <div className="bmp-orders-list">
        {orders.map(order=>{
          const count=order.items.reduce((sum,item)=>sum+item.line.quantity,0);
          return <article className="bmp-order-history-card" key={order.id}>
            <div className="bmp-order-history-top">
              <div>
                <h3>Заказ №{order.id}</h3>
                <time dateTime={order.createdAt}>{orderDate(order.createdAt)}</time>
              </div>
              <span className="bmp-order-demo-status">Демозаказ</span>
            </div>
            <div className="bmp-order-history-summary">
              <span><ShoppingBag size={17} aria-hidden="true"/> {count} {orderQty(count)}</span>
              <span><MapPin size={17} aria-hidden="true"/>
                {order.fulfillment==='pickup'?'Самовывоз':'Доставка'}
              </span>
            </div>
            <div className="bmp-order-history-products">
              <div className="bmp-order-history-photos" aria-label="Товары заказа">
                {order.items.slice(0,4).map(item=><span key={item.line.key}>
                  <OrderItemPhoto item={item}/>
                </span>)}
              </div>
              <strong>{orderRub(order.total)}</strong>
            </div>
            <div className="bmp-order-history-actions">
              <Link to={'/orders/'+encodeURIComponent(order.id)} className="bmp-order-history-details">
                Подробнее <ArrowRight size={18} strokeWidth={2} aria-hidden="true"/>
              </Link>
              <button type="button" onClick={()=>repeatOrder(order)} className="bmp-order-history-repeat">
                <RotateCcw size={18} strokeWidth={2} aria-hidden="true"/>
                Повторить заказ
              </button>
            </div>
          </article>;
        })}
      </div>
      <p className="bmp-orders-storage-note">
        <Clock3 size={16} aria-hidden="true"/>
        Здесь хранятся только заказы, созданные в этой демоверсии на данном устройстве.
        Они не отправлялись в ресторан.
      </p>
    </>}
  </section>;
}
