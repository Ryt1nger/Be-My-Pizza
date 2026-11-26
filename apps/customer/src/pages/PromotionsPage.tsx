import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgePercent, Check, Copy } from 'lucide-react';
import { promotions, type Promotion } from '@/features/promotions/promotionsData';
import { useCartStore } from '@/features/cart/cartStore';
import './promotions-page.css';

function PromotionCard({promo}:{promo:Promotion}){
  const navigate=useNavigate();
  const setPromoCode=useCartStore(state=>state.setPromoCode);
  const hasCart=useCartStore(state=>state.lines.length>0);
  const base=import.meta.env.BASE_URL;
  const background={
    backgroundImage:
      (promo.theme==='pickup'
        ?'linear-gradient(90deg,rgba(251,205,188,.99) 0%,rgba(250,199,180,.85) 42%,rgba(250,199,180,0) 88%)'
        :promo.theme==='code'
        ?'linear-gradient(90deg,rgba(44,32,81,.98),rgba(44,32,81,.78) 48%,transparent 91%)'
        :'linear-gradient(90deg,rgba(1,71,30,.85),rgba(1,71,30,.18) 68%)')+
      ',url("'+base+promo.image+'")'
  };
  const actionText=promo.id==='combo'?'Собрать набор':promo.id==='pickup'
    ?'Выбрать пиццу':'Активировать PIZZA40';
  function applyPromo(){
    setPromoCode('PIZZA40');
    navigate(hasCart?'/cart':'/menu/pizza');
  }
  return <article className={'bmp-offer-card bmp-offer-card--'+promo.theme}>
    <div className="bmp-offer-photo" style={background} aria-hidden="true"/>
    <div className="bmp-offer-info">
      <span className="bmp-offer-badge">{promo.label}</span>
      <h2>{promo.title.join(' ')}</h2>
      <p className="bmp-offer-description">{promo.description}</p>
      <p className="bmp-offer-details">{promo.details}</p>
      {promo.id==='code'
        ?<button type="button" className="bmp-offer-action" onClick={applyPromo}>
          <Copy size={17} strokeWidth={1.9} aria-hidden="true"/>{actionText}
        </button>
        :<Link className="bmp-offer-action" to="/menu/pizza">
          {actionText}<ArrowRight size={19} strokeWidth={2} aria-hidden="true"/>
        </Link>}
    </div>
  </article>;
}

export function PromotionsPage(){
  return <section className="bmp-promotions-page" aria-labelledby="bmp-promotions-heading">
    <header className="bmp-offers-heading">
      <h1 id="bmp-promotions-heading">Акции</h1>
      <p>Вкусные поводы заказать пиццу</p>
    </header>
    <div className="bmp-offers-note">
      <BadgePercent size={20} strokeWidth={1.8} aria-hidden="true"/>
      <span>Скидки сейчас работают в демонстрационном оформлении заказа. Оплата и доставка рестораном не подключены.</span>
    </div>
    <div className="bmp-offers-grid">
      {promotions.map(promo=><PromotionCard key={promo.id} promo={promo}/>)}
    </div>
    <p className="bmp-offers-bottom">
      <Check size={18} strokeWidth={2} aria-hidden="true"/>
      Промокод и скидка за самовывоз рассчитываются в корзине и при оформлении.
    </p>
  </section>;
}
