import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { AppShell } from '@/app/shell/AppShell';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { CatalogSandboxPage } from '@/pages/CatalogSandboxPage';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { ProductRoutePage } from '@/pages/ProductRoutePage';
import { AuthPage } from '@/pages/AuthPage';
const page=(title:string,reference:string)=><PlaceholderPage title={title} reference={reference}/>;
const routes=[
{path:'/auth',element:<AuthPage/>},
{path:'/',element:<AppShell/>,children:[
{index:true,element:<HomePage/>},
{path:'menu',element:<MenuPage/>},
{path:'menu/:category',element:page('Категория','меню выбранной категории.jpg')},
{path:'product/:slug',element:<ProductRoutePage/>},
{path:'promotions',element:page('Акции','акции.jpg')},
{path:'favorites',element:page('Избранное','отдельного макета нет')},
{path:'profile',element:page('Профиль','профиль.jpg')},
{path:'cart',element:page('Корзина','корзина.jpg')},
{path:'checkout',element:page('Оформление заказа','оформление заказа.jpg')},
{path:'orders',element:page('Мои заказы','история заказов')},
{path:'orders/:id',element:page('Отслеживание заказа','страница отслеживания заказа после оформления.jpg')},
{path:'delivery',element:page('Доставка и оплата','информация о доставке и оплате')},
{path:'about',element:page('О нас','информация о пиццерии')},
{path:'bonuses',element:page('Бонусная программа','бонусная программа')},
{path:'terms',element:page('Условия использования','юридический текст пока не предоставлен')},
{path:'privacy',element:page('Политика конфиденциальности','юридический текст пока не предоставлен')},
{path:'support',element:page('Поддержка','поддержка.jpg')},
{path:'dev/catalog',element:<CatalogSandboxPage/>},
{path:'*',element:page('Страница не найдена','—')}
]}];
// Pages serves static files without an SPA fallback: use hash URLs only in that build.
// Browser history routing remains unchanged in local development and native WebView.
export const router=import.meta.env.VITE_DEMO_PAGES==='true'
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
