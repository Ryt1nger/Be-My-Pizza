import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgePercent, ChevronRight, Heart, Headset, Info,
  MapPin, ReceiptText, UserRound
} from 'lucide-react';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { useOrdersStore } from '@/features/orders/ordersStore';
import './account-pages.css';

type RowProps={
  to:string;
  title:string;
  detail?:string;
  Icon:typeof MapPin;
};

function ProfileRow({to,title,detail,Icon}:RowProps){
  return <Link to={to} className="bmp-account-row">
    <span className="bmp-account-row-icon">
      <Icon size={27} strokeWidth={1.8} aria-hidden="true"/>
    </span>
    <span className="bmp-account-row-copy">
      <span className="bmp-account-row-title">{title}</span>
      {detail&&<span className="bmp-account-row-detail">{detail}</span>}
    </span>
    <ChevronRight className="bmp-account-row-chevron" size={25}
      strokeWidth={1.9} aria-hidden="true"/>
  </Link>;
}

export function ProfilePage(){
  const favoriteCount=useFavoritesStore(state=>state.ids.length);
  const orderCount=useOrdersStore(state=>state.orders.length);
  // No authenticated session or SMS/OAuth provider is connected yet.
  // Never invent a user name, phone number, addresses, points, or order history.
  return <section className="bmp-account-page bmp-profile-page"
    aria-labelledby="bmp-profile-title">
    <header className="bmp-page-heading">
      <h1 id="bmp-profile-title">Профиль</h1>
      <p>Ваш аккаунт и настройки</p>
    </header>

    <div className="bmp-profile-guest">
      <span className="bmp-profile-avatar" aria-hidden="true">
        <UserRound size={43} strokeWidth={1.65}/>
      </span>
      <div className="bmp-profile-guest-copy">
        <h2>Войдите в свой профиль</h2>
        <p>Чтобы сохранять адреса, видеть заказы и пользоваться бонусами.</p>
      </div>
      <Link to="/auth" className="bmp-profile-login">
        Войти или зарегистрироваться
        <ArrowRight size={20} strokeWidth={2.1} aria-hidden="true"/>
      </Link>
    </div>

    <h2 className="bmp-profile-section-title">Разделы</h2>
    <div className="bmp-profile-links">
      <ProfileRow to="/auth" title="Мои адреса" detail="Доступно после входа" Icon={MapPin}/>
      <ProfileRow to="/favorites" title="Избранное" detail={favoriteCount+' товаров'} Icon={Heart}/>
      <ProfileRow to="/auth" title="Мои бонусы" detail="Доступно после входа" Icon={BadgePercent}/>
      <ProfileRow to="/orders" title="Мои заказы" detail={orderCount===0?'История заказов':orderCount+' заказ(ов)'} Icon={ReceiptText}/>
      <ProfileRow to="/delivery" title="Доставка и оплата" Icon={MapPin}/>
      <ProfileRow to="/support" title="Поддержка" Icon={Headset}/>
      <ProfileRow to="/about" title="О приложении" Icon={Info}/>
    </div>
  </section>;
}
