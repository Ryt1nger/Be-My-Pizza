import { useEffect,useRef,useState } from 'react';
import { Outlet,NavLink,Link,useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BrandIcon } from '@/shared/ui/BrandIcon';
import { NavTabIcon } from '@/shared/ui/NavTabIcon';
import { useCartStore } from '@/features/cart/cartStore';

const tabs = [
 {to:'/',name:'Главная',icon:'home'},
 {to:'/menu',name:'Меню',icon:'categories'},
 {to:'/promotions',name:'Акции',icon:'promotion'},
 {to:'/favorites',name:'Избранное',icon:'favorite'},
 {to:'/profile',name:'Профиль',icon:'profile'},
] as const;

export function AppShell(){
 const [drawerOpen,setDrawerOpen]=useState(false);
 const [isScrolled,setIsScrolled]=useState(false);
 const headerRef=useRef<HTMLElement>(null);
 useEffect(()=>{
   // Only the header scrolls away. The fixed action buttons never remount.
   const onScroll=()=>setIsScrolled((headerRef.current?.getBoundingClientRect().bottom??Infinity)<=0);
   onScroll();
   window.addEventListener('scroll',onScroll,{passive:true});
   window.addEventListener('resize',onScroll);
   return()=>{
     window.removeEventListener('scroll',onScroll);
     window.removeEventListener('resize',onScroll);
   };
 },[]);
 const location=useLocation();
 const cartCount=useCartStore(s=>s.lines.reduce((sum,line)=>sum+line.quantity,0));
 useEffect(()=>{setDrawerOpen(false);},[location.pathname]);
 useEffect(()=>{
   if(!drawerOpen)return;
   const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setDrawerOpen(false);};
   window.addEventListener('keydown',close);
   return()=>window.removeEventListener('keydown',close);
 },[drawerOpen]);

 return <div className="min-h-dvh bg-background text-ink">
  {/* Transparent header and wordmark scroll away with the page. */}
  <header ref={headerRef} className="relative z-20 bg-transparent">
   <div className="relative mx-auto flex h-[56px] max-w-[1280px] items-center justify-center px-4 sm:h-[64px] sm:px-6 md:h-[74px] md:justify-between md:px-8">
    <Link to="/" aria-label="Главная — Be My Pizza" className="shrink-0"><BrandLogo/></Link>
    <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Основная навигация">
     {tabs.map(t=><NavLink key={t.to} to={t.to} end={t.to==='/'} className={({isActive})=>'bmp-body-strong text-sm '+(isActive?'text-primary':'text-muted')}>{t.name}</NavLink>)}
    </nav>
    <Link to="/cart" aria-label={cartCount>0?'Корзина: '+cartCount+' товаров':'Корзина'} className="relative ml-5 hidden h-[52px] w-[52px] shrink-0 items-center justify-center md:flex">
      <BrandIcon name="cart" size={54}/>
      {cartCount>0&&<span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount>99?'99+':cartCount}</span>}
    </Link>
   </div>
  </header>
  {/* One persistent pair of fixed mobile actions. Only the glass fades in. */}
  <div className="pointer-events-none fixed inset-x-0 top-[max(6px,env(safe-area-inset-top))] z-[48] px-4 sm:top-[max(10px,env(safe-area-inset-top))] sm:px-6 md:hidden">
   <div className="mx-auto flex max-w-[1280px] items-center justify-between">
    <button type="button" onClick={()=>setDrawerOpen(true)} aria-label="Открыть меню" aria-expanded={drawerOpen}
      className={'bmp-header-action pointer-events-auto '+(isScrolled?'bmp-header-action--glass':'')}>
      <Menu size={25} strokeWidth={2.25} aria-hidden="true" className="relative z-10 text-[#145421]"/>
    </button>
    <Link to="/cart" aria-label={cartCount>0?'Корзина: '+cartCount+' товаров':'Корзина'}
      className={'bmp-header-action pointer-events-auto '+(isScrolled?'bmp-header-action--glass':'')}>
      <BrandIcon name="cart" size={40} className="relative z-10"/>
      {cartCount>0&&<span className="absolute -right-[3px] -top-[3px] z-20 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount>99?'99+':cartCount}</span>}
    </Link>
   </div>
  </div>
  <main className="mx-auto min-h-[calc(100dvh-135px)] max-w-[1280px] px-4 pb-[108px] pt-0 md:px-8 md:pb-16 md:pt-5"><Outlet/></main>
  <div aria-hidden="true" className="bmp-bottom-gap-mask fixed bottom-0 left-0 right-0 z-[39] md:hidden"/>
  <nav aria-label="Нижняя навигация"
    className="bmp-bottom-glass fixed bottom-[max(8px,env(safe-area-inset-bottom))] left-[11px] right-[11px] z-40 grid h-[76px] grid-cols-5 overflow-hidden rounded-[28px] px-[3px] md:hidden">
   {tabs.map(t=><NavLink to={t.to} key={t.to} end={t.to==='/'} className={({isActive})=>'grid min-w-0 grid-rows-[36px_16px] content-center justify-items-center gap-[4px] rounded-[24px] px-[1px] '+(isActive?'text-[#095B28]':'text-[#587760]')}>
      {({isActive})=><><NavTabIcon name={t.icon} active={isActive}/><span className={'bmp-nav-label block h-[16px] max-w-full truncate text-center '+(isActive?'text-[#095B28]':'text-[#656565]')}>{t.name}</span></>}
    </NavLink>)}
  </nav>
  {drawerOpen&&<div className="fixed inset-0 z-50 md:hidden">
   <button type="button" aria-label="Закрыть меню" className="absolute inset-0 bg-black/35" onClick={()=>setDrawerOpen(false)}/>
   <aside aria-label="Боковое меню" className="absolute inset-y-0 left-0 w-[min(88vw,330px)] overflow-y-auto rounded-r-[28px] bg-background p-6 shadow-2xl">
    <div className="flex items-center justify-between"><BrandLogo/><button type="button" aria-label="Закрыть меню" onClick={()=>setDrawerOpen(false)}><X size={26}/></button></div>
    <div className="mt-10 flex flex-col gap-2">
      {tabs.map(t=><Link to={t.to} key={t.to} className="bmp-body-strong flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface"><BrandIcon name={t.icon} size={32}/>{t.name}</Link>)}
      <Link to="/support" className="bmp-body-strong rounded-xl px-3 py-3 hover:bg-surface">Поддержка</Link>
    </div>
   </aside>
  </div>}
 </div>;
}
