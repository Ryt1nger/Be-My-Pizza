import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, ChevronRight, ClipboardList, Headset,
  Info, MapPin, ShoppingCart, UserRound, X
} from 'lucide-react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BrandIcon } from '@/shared/ui/BrandIcon';
import { NavTabIcon } from '@/shared/ui/NavTabIcon';
import { useProductSheetStore } from '@/features/product/productSheetStore';
import { ProductModal } from '@/shared/ui/ProductModal';
import { useCartStore } from '@/features/cart/cartStore';

const tabs = [
  {to:'/',name:'Главная',icon:'home'},
  {to:'/menu',name:'Меню',icon:'categories'},
  {to:'/promotions',name:'Акции',icon:'promotion'},
  {to:'/favorites',name:'Избранное',icon:'favorite'},
  {to:'/profile',name:'Профиль',icon:'profile'},
] as const;

const drawerPrimary = [
  {to:'/',name:'Главная',icon:null},
  {to:'/menu',name:'Меню',icon:null},
  {to:'/promotions',name:'Акции',icon:null},
  {to:'/favorites',name:'Избранное',icon:null},
  {to:'/orders',name:'Мои заказы',icon:ClipboardList},
] as const;

const drawerSecondary = [
  {to:'/delivery',name:'Доставка и оплата',icon:MapPin},
  {to:'/about',name:'О нас',icon:Info},
  {to:'/support',name:'Поддержка',icon:Headset},
] as const;

/** Matching rounded, asymmetrical strokes from the owner's burger reference. */
function BurgerGlyph(){
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
    aria-hidden="true" className="relative z-10 text-[#145421]">
    <path d="M4 7H24 M4 14H19 M4 21H24"
      stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
  </svg>;
}

export function AppShell(){
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [isScrolled,setIsScrolled]=useState(false);
  const headerRef=useRef<HTMLElement>(null);
  const drawerRef=useRef<HTMLElement>(null);
  const drawerCloseRef=useRef<HTMLButtonElement>(null);
  const drawerTriggerRef=useRef<HTMLButtonElement>(null);
  const location=useLocation();
  const isCartPage=location.pathname.replace(/\/+$/, '')==='/cart';
  const hideHeaderCart=isCartPage||location.pathname.replace(/\/+$/, '')==='/profile';
  const menuFlowActive=isCartPage||location.pathname==='/checkout';
  const cartCount=useCartStore(s=>s.lines.reduce((sum,line)=>sum+line.quantity,0));
  const selectedProductId=useProductSheetStore(s=>s.productId);
  const closeProduct=useProductSheetStore(s=>s.closeProduct);

  useEffect(()=>{
    // Fixed actions stay mounted; only the individual glass layers fade in.
    const onScroll=()=>setIsScrolled((headerRef.current?.getBoundingClientRect().bottom??Infinity)<=0);
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    return()=>{
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',onScroll);
    };
  },[]);

  useLayoutEffect(()=>{
    setDrawerOpen(false);
    // Reset before the next screen paints, so fixed header actions never
    // appear midway down a newly opened order/confirmation page.
    window.scrollTo(0,0);
  },[location.pathname]);

  useEffect(()=>{
    if(!drawerOpen)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const animationFrame=window.requestAnimationFrame(()=>drawerCloseRef.current?.focus());
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        event.preventDefault();
        setDrawerOpen(false);
      }
      if(event.key!=='Tab')return;
      const elements=drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if(!elements?.length)return;
      const first=elements[0];
      const last=elements[elements.length-1];
      if(event.shiftKey && document.activeElement===first){
        event.preventDefault();last.focus();
      }else if(!event.shiftKey && document.activeElement===last){
        event.preventDefault();first.focus();
      }
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>{
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('keydown',onKeyDown);
      document.body.style.overflow=previousOverflow;
      // Don't steal focus after a navigation to a new page.
      if(document.activeElement===drawerCloseRef.current)drawerTriggerRef.current?.focus();
    };
  },[drawerOpen]);

  const closeDrawer=()=>setDrawerOpen(false);

  return <div className={'min-h-dvh bg-background text-ink'+(isCartPage?' bmp-cart-route':'')}>
    <header ref={headerRef} className="relative z-20 bg-transparent">
      <div className="relative mx-auto flex h-[56px] max-w-[1280px] items-center justify-center px-4 sm:h-[64px] sm:px-6 md:h-[74px] md:justify-between md:px-8">
        <Link to="/" aria-label="Главная — Be My Pizza" className="shrink-0"><BrandLogo/></Link>
        <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Основная навигация">
          {tabs.map(t=><NavLink key={t.to} to={t.to} end={t.to==='/'} className={({isActive})=>'bmp-body-strong text-sm '+(isActive?'text-primary':'text-muted')}>{t.name}</NavLink>)}
        </nav>
        {!hideHeaderCart&&<Link to="/cart" aria-label={cartCount>0?'Корзина: '+cartCount+' товаров':'Корзина'}
          className="relative ml-5 hidden h-[52px] w-[52px] shrink-0 items-center justify-center md:flex">
          <BrandIcon name="cart" size={54}/>
          {cartCount>0&&<span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount>99?'99+':cartCount}</span>}
        </Link>}
      </div>
    </header>

    {/* Single persistent pair of mobile buttons, never replaced on scroll. */}
    <div className="pointer-events-none fixed inset-x-0 top-[max(6px,env(safe-area-inset-top))] z-[48] px-4 sm:top-[max(10px,env(safe-area-inset-top))] sm:px-6 md:hidden">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        {location.pathname==='/profile'?<span className="h-[44px] w-[44px]" aria-hidden="true"/>:
        <button type="button" ref={drawerTriggerRef} onClick={()=>setDrawerOpen(true)}
          aria-label="Открыть меню" aria-expanded={drawerOpen}
          className={'bmp-header-action pointer-events-auto '+(isScrolled?'bmp-header-action--glass':'')}>
          <BurgerGlyph/>
        </button>}
        {hideHeaderCart?<span aria-hidden="true" className="h-[44px] w-[44px]"/>:
        <Link to="/cart" aria-label={cartCount>0?'Корзина: '+cartCount+' товаров':'Корзина'}
          className={'bmp-header-action pointer-events-auto '+(isScrolled?'bmp-header-action--glass':'')}>
          <ShoppingCart size={28} strokeWidth={2.35} className="relative z-10 block text-[#145421]" aria-hidden="true"/>
          {cartCount>0&&<span className="absolute -right-[3px] -top-[3px] z-20 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount>99?'99+':cartCount}</span>}
        </Link>}
      </div>
    </div>

    <main key={location.pathname} className="bmp-app-main bmp-page-enter mx-auto min-h-[calc(100dvh-135px)] max-w-[1280px] px-4 pb-[108px] pt-0 md:px-8 md:pb-16 md:pt-5"><Outlet/></main>

    <div aria-hidden="true" className="bmp-bottom-gap-mask fixed bottom-0 left-0 right-0 z-[39] md:hidden"/>
    <nav aria-label="Нижняя навигация"
      className="bmp-mobile-dock bmp-bottom-glass fixed bottom-[max(8px,env(safe-area-inset-bottom))] left-[11px] right-[11px] z-40 grid h-[76px] grid-cols-5 overflow-hidden rounded-[28px] px-[3px] md:hidden">
      {tabs.map(t=><NavLink to={t.to} key={t.to} end={t.to==='/'} className={({isActive})=>'bmp-mobile-tab grid min-w-0 content-center items-center justify-items-center rounded-[24px] px-[1px] '+((isActive||(menuFlowActive&&t.to==='/menu'))?'text-[#095B28]':'text-[#587760]')}>
        {({isActive})=><><NavTabIcon name={t.icon} active={isActive||(menuFlowActive&&t.to==='/menu')}/><span className={'bmp-nav-label block h-[16px] max-w-full truncate text-center '+((isActive||(menuFlowActive&&t.to==='/menu'))?'text-[#095B28]':'text-[#656565]')}>{t.name}</span></>}
      </NavLink>)}
    </nav>

    {/* Mounted while closed so both the slide-in AND slide-out animate. */}
    <div className={'bmp-drawer-root fixed inset-0 z-[60] md:hidden '+(drawerOpen?'bmp-drawer-root--open':'')}
      aria-hidden={!drawerOpen}>
      <button type="button" tabIndex={-1} aria-label="Закрыть меню"
        className="bmp-drawer-scrim absolute inset-0" onClick={closeDrawer}/>
      <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Боковое меню"
        className="bmp-drawer-panel absolute inset-y-0 left-0">
        <div className="bmp-drawer-content">
          <div className="bmp-drawer-heading">
            <Link to="/" aria-label="Главная — Be My Pizza" onClick={closeDrawer} className="bmp-drawer-wordmark"><BrandLogo/></Link>
            <button type="button" ref={drawerCloseRef} aria-label="Закрыть меню" onClick={closeDrawer}
              className="bmp-drawer-close"><X size={28} strokeWidth={1.85} aria-hidden="true"/></button>
          </div>

          <Link to="/auth" onClick={closeDrawer} className="bmp-drawer-login">
            <span className="bmp-drawer-login-icon"><UserRound size={30} strokeWidth={1.9} aria-hidden="true"/></span>
            <span className="bmp-drawer-login-copy">
              <strong>Войти в аккаунт</strong>
              <span>Бонусы, история заказов<br/>и быстрый заказ</span>
            </span>
            <ChevronRight size={24} strokeWidth={2.4} aria-hidden="true"/>
          </Link>

          <nav aria-label="Основные разделы" className="bmp-drawer-nav bmp-drawer-nav-primary">
            {drawerPrimary.map(({to,name,icon:Icon})=><NavLink key={to} to={to} onClick={closeDrawer} end={to==='/'}
              className={({isActive})=>'bmp-drawer-link '+(isActive?'bmp-drawer-link--active':'')}>
              {({isActive})=><>
                <span aria-hidden="true" className={"bmp-drawer-link-icon"+(to==='/'||to==='/menu'||to==='/promotions'||to==='/favorites'?" bmp-drawer-link-icon--brand":"")}>
                  {to==='/'?<NavTabIcon name="home" active={isActive}/>
                    :to==='/menu'?<NavTabIcon name="categories" active={isActive}/>
                    :to==='/promotions'?<NavTabIcon name="promotion" active={isActive}/>
                    :to==='/favorites'?<NavTabIcon name="favorite" active={isActive}/>
                    :Icon?<Icon size={22} strokeWidth={1.9}/>:null}
                </span>
                <span className="bmp-drawer-link-label">{name}</span>
                <ChevronRight size={22} strokeWidth={1.9} aria-hidden="true" className="bmp-drawer-chevron"/>
              </>}
            </NavLink>)}
          </nav>

          <div className="bmp-drawer-separator"/>
          <nav aria-label="Информация" className="bmp-drawer-nav bmp-drawer-nav-secondary">
            {drawerSecondary.map(({to,name,icon:Icon})=><NavLink key={to} to={to} onClick={closeDrawer}
              className={({isActive})=>'bmp-drawer-link '+(isActive?'bmp-drawer-link--active':'')}>
              <span aria-hidden="true" className="bmp-drawer-link-icon"><Icon size={22} strokeWidth={1.9}/></span>
              <span className="bmp-drawer-link-label">{name}</span>
              <ChevronRight size={22} strokeWidth={1.9} aria-hidden="true" className="bmp-drawer-chevron"/>
            </NavLink>)}
          </nav>

          <Link to="/bonuses" onClick={closeDrawer} className="bmp-drawer-promo"
            style={{backgroundImage:'linear-gradient(90deg, rgba(0,41,23,.22), transparent 70%), url("'+import.meta.env.BASE_URL+'media/promotions/bonus-drawer.webp")'}}>
            <span className="bmp-drawer-promo-label">Бонусная программа</span>
            <strong className="bmp-drawer-promo-title">Копите бонусы<br/>и оплачивайте<br/>заказы</strong>
            <span className="bmp-drawer-promo-button">Подробнее <ArrowRight size={19} strokeWidth={2} aria-hidden="true"/></span>
          </Link>

          <div className="bmp-drawer-footer">
            <MapPin size={26} strokeWidth={2} aria-hidden="true" className="bmp-drawer-location-icon"/>
            <div className="bmp-drawer-address">
              <strong>Орехово</strong>
              <span>Доставка ~ 30 мин</span>
            </div>
            <Link to="/delivery" onClick={closeDrawer} className="bmp-drawer-change">Изменить</Link>
          </div>
        </div>
      </aside>
    </div>
    {selectedProductId&&<ProductModal key={selectedProductId} productId={selectedProductId} onClose={closeProduct}/>}
  </div>;
}
