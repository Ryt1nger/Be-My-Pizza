import { useEffect,useState } from 'react';
import { Outlet,NavLink,Link,useLocation } from 'react-router-dom';
import { Home,UtensilsCrossed,TicketPercent,Heart,UserRound,Menu,ShoppingBag,X,Headphones } from 'lucide-react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
const tabs=[{to:'/',name:'Главная',icon:Home},{to:'/menu',name:'Меню',icon:UtensilsCrossed},{to:'/promotions',name:'Акции',icon:TicketPercent},{to:'/favorites',name:'Избранное',icon:Heart},{to:'/profile',name:'Профиль',icon:UserRound}];
export function AppShell(){
const [drawerOpen,setDrawerOpen]=useState(false);const location=useLocation();
useEffect(()=>{setDrawerOpen(false)},[location.pathname]);
useEffect(()=>{if(!drawerOpen)return;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setDrawerOpen(false)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[drawerOpen]);
return <div className="min-h-dvh bg-background text-ink">
<header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-4 px-4 md:px-8">
<button className="bmp-icon-button md:hidden" aria-label="Открыть меню" aria-expanded={drawerOpen} onClick={()=>setDrawerOpen(true)}><Menu size={23}/></button>
<Link to="/" aria-label="На главную"><BrandLogo/></Link>
<nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Основная навигация">{tabs.map(t=><NavLink key={t.to} to={t.to} end={t.to==='/'} className={({isActive})=>'text-sm font-semibold '+(isActive?'text-primary':'text-muted')}>{t.name}</NavLink>)}</nav>
<Link className="bmp-icon-button ml-auto md:ml-3" to="/cart" aria-label="Корзина"><ShoppingBag size={23}/></Link></div></header>
<main className="mx-auto min-h-[calc(100dvh-160px)] max-w-[1280px] px-4 pb-28 pt-6 md:px-8 md:pb-14"><Outlet/></main>
<nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(8,49,35,.05)] md:hidden" aria-label="Нижняя навигация">{tabs.map(({to,name,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>'flex min-h-[64px] flex-col items-center justify-center gap-1 px-1 text-[10px] '+(isActive?'font-bold text-primary':'text-muted')}><Icon size={22}/><span>{name}</span></NavLink>)}</nav>
{drawerOpen&&<div className="fixed inset-0 z-50 md:hidden"><button className="absolute inset-0 bg-black/35" aria-label="Закрыть меню" onClick={()=>setDrawerOpen(false)}/><aside className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-y-auto bg-surface p-5 shadow-2xl" aria-label="Боковое меню"><div className="flex items-center justify-between"><BrandLogo/><button className="bmp-icon-button" aria-label="Закрыть меню" onClick={()=>setDrawerOpen(false)}><X/></button></div><p className="mb-5 mt-7 text-xs text-muted">Технический каркас. Вёрстка меню будет утверждаться отдельно.</p><div className="flex flex-col gap-2">{[...tabs,{to:'/support',name:'Поддержка',icon:Headphones}].map(({to,name,icon:Icon})=><Link key={to} to={to} className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium hover:bg-background"><Icon size={20}/>{name}</Link>)}</div></aside></div>}
</div>
}
