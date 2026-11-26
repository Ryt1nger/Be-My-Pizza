import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { AppShell } from '@/app/shell/AppShell';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { CatalogSandboxPage } from '@/pages/CatalogSandboxPage';
import { HomePage } from '@/pages/HomePage';
import { PromotionsPage } from '@/pages/PromotionsPage';
import { MenuPage, MenuCategoryPage } from '@/pages/MenuPage';
import { ProductRoutePage } from '@/pages/ProductRoutePage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CartPage } from '@/pages/CartPage';
import { SupportPage } from '@/pages/SupportPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
const page=(title:string,reference:string)=><PlaceholderPage title={title} reference={reference}/>;
const routes=[
{path:'/auth',element:<AuthPage/>},
{path:'/',element:<AppShell/>,children:[
{index:true,element:<HomePage/>},
{path:'menu',element:<MenuPage/>},
{path:'menu/:category',element:<MenuCategoryPage/>},
{path:'product/:slug',element:<ProductRoutePage/>},
{path:'promotions',element:<PromotionsPage/>},
{path:'favorites',element:<FavoritesPage/>},
{path:'profile',element:<ProfilePage/>},
{path:'cart',element:<CartPage/>},
{path:'checkout',element:<CheckoutPage/>},
{path:'orders',element:<OrdersPage/>},
{path:'orders/:id',element:<OrderConfirmationPage/>},
{path:'delivery',element:page('Доставка и оплата','информация о доставке и оплате')},
{path:'about',element:page('О нас','информация о пиццерии')},
{path:'bonuses',element:page('Бонусная программа','бонусная программа')},
{path:'terms',element:page('Условия использования','юридический текст пока не предоставлен')},
{path:'privacy',element:page('Политика конфиденциальности','юридический текст пока не предоставлен')},
{path:'support',element:<SupportPage/>},
{path:'dev/catalog',element:<CatalogSandboxPage/>},
{path:'*',element:page('Страница не найдена','—')}
]}];
// Pages serves static files without an SPA fallback: use hash URLs only in that build.
// Browser history routing remains unchanged in local development and native WebView.
export const router=import.meta.env.VITE_DEMO_PAGES==='true'
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
