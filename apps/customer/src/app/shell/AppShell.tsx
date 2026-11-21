import { useEffect,useState } from 'react';
import { Outlet,NavLink,Link,useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BrandIcon } from '@/shared/ui/BrandIcon';
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
  <header className="relative z-30 bg-background">
   <div className="relative mx-auto flex h-[56px] max-w-[1280px] items-center justify-between px-4 sm:h-[64px] sm:px-6 md:h-[74px] md:px-8">
    <button type="button" onClick={()=>setDrawerOpen(true)} aria-label="Открыть меню" aria-expanded={drawerOpen}
       className="flex h-11 w-11 items-center justify-center md:hidden">
      <BrandIcon name="menu" size={35}/>
    </button>
    <Link to="/" aria-label="Главная — Be My Pizza" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"><BrandLogo/></Link>
    <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Основная навигация">
     {tabs.map(t=><NavLink key={t.to} to={t.to} end={t.to==='/'} className={({isActive})=>'bmp-body-strong text-sm '+(isActive?'text-primary':'text-muted')}>{t.name}</NavLink>)}
    </nav>
    <Link to="/cart" aria-label={cartCount>0?'Корзина: '+cartCount+' товаров':'Корзина'} className="relative flex h-11 w-11 items-center justify-center md:ml-5">
      <BrandIcon name="cart" size={37}/>
      {cartCount>0&&<span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount>99?'99+':cartCount}</span>}
    </Link>
   </div>
  </header>
  <main className="mx-auto min-h-[calc(100dvh-135px)] max-w-[1280px] px-4 pb-[132px] pt-0 md:px-8 md:pb-16 md:pt-5"><Outlet/></main>
  <nav aria-label="Нижняя навигация"
    className="fixed bottom-[max(8px,env(safe-area-inset-bottom))] left-[11px] right-[11px] z-40 grid h-[80px] grid-cols-5 rounded-[32px] border border-white/85 bg-[#FFFDF9]/97 px-[4px] shadow-[0_10px_32px_rgba(16,34,23,0.12)] backdrop-blur-sm md:hidden">
   {tabs.map(t=><NavLink to={t.to} key={t.to} end={t.to==='/'} className={({isActive})=>'flex min-w-0 flex-col items-center justify-center gap-[4px] rounded-3xl px-[1px] leading-tight '+(isActive?'text-primary':'text-muted')}>
      {({isActive})=><><BrandIcon name={t.icon} size={33} className={isActive?'':'opacity-75'}/><span className={'bmp-nav-label truncate text-center '+(isActive?'font-bold':'')}>{t.name}</span></>}
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
