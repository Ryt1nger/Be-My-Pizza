import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgePercent, Bell, ChevronRight, Heart, Headset, Info,
  LogOut, MapPin, ReceiptText, UserRound
} from 'lucide-react';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import './account-pages.css';

type RowProps = {
  to: string;
  title: string;
  detail?: string;
  Icon: typeof MapPin;
};

function ProfileRow({to,title,detail,Icon}:RowProps){
  return <Link to={to} className="bmp-account-row">
    <span className="bmp-account-row-icon"><Icon size={27} strokeWidth={1.8} aria-hidden="true"/></span>
    <span className="bmp-account-row-copy">
      <span className="bmp-account-row-title">{title}</span>
      {detail&&<span className="bmp-account-row-detail">{detail}</span>}
    </span>
    <ChevronRight className="bmp-account-row-chevron" size={25} strokeWidth={1.9} aria-hidden="true"/>
  </Link>;
}

export function ProfilePage(){
  const favoriteCount=useFavoritesStore(state=>state.ids.length);
  const [notifications,setNotifications]=useState(()=>{
    try{return window.localStorage.getItem('bmp.notifications')!=='off';}
    catch{return true;}
  });
  useEffect(()=>{
    try{window.localStorage.setItem('bmp.notifications',notifications?'on':'off');}
    catch{ /* storage can be disabled in private browsing */ }
  },[notifications]);

  return <section className="bmp-account-page bmp-profile-page" aria-labelledby="bmp-profile-title">
    <header className="bmp-page-heading">
      <h1 id="bmp-profile-title">Профиль</h1>
      <p>Ваш аккаунт и настройки</p>
    </header>

    <Link to="/auth" className="bmp-profile-person" aria-label="Настройки аккаунта">
      <span className="bmp-profile-avatar"><UserRound size={48} strokeWidth={1.7} aria-hidden="true"/></span>
      <span className="bmp-profile-person-copy">
        <strong>Иван Иванов</strong>
        <span>+7 (999) 123-45-67</span>
      </span>
      <ChevronRight size={26} strokeWidth={1.9} aria-hidden="true"/>
    </Link>

    <div className="bmp-profile-links">
      <ProfileRow to="/delivery" title="Мои адреса" detail="2 адреса" Icon={MapPin}/>
      <ProfileRow to="/favorites" title="Избранное" detail={favoriteCount+' товаров'} Icon={Heart}/>
      <ProfileRow to="/bonuses" title="Мои бонусы" detail="120 бонусов" Icon={BadgePercent}/>
      <label className="bmp-account-row bmp-notifications-row">
        <span className="bmp-account-row-icon"><Bell size={27} strokeWidth={1.8} aria-hidden="true"/></span>
        <span className="bmp-account-row-copy"><span className="bmp-account-row-title">Уведомления</span></span>
        <span className="bmp-toggle">
          <input type="checkbox" checked={notifications} onChange={event=>setNotifications(event.target.checked)}
            aria-label="Уведомления" />
          <span className="bmp-toggle-track" aria-hidden="true"/>
        </span>
      </label>
      <ProfileRow to="/orders" title="Мои заказы" Icon={ReceiptText}/>
      <ProfileRow to="/support" title="Поддержка" Icon={Headset}/>
      <ProfileRow to="/about" title="О приложении" Icon={Info}/>
    </div>
    <Link to="/auth" className="bmp-profile-logout"><LogOut size={26} strokeWidth={1.9} aria-hidden="true"/>Выйти из аккаунта</Link>
  </section>;
}
