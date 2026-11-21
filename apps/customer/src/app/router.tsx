import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/shell/AppShell';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { CatalogSandboxPage } from '@/pages/CatalogSandboxPage';
const page=(title:string,reference:string)=><PlaceholderPage title={title} reference={reference}/>;
export const router=createBrowserRouter([{path:'/',element:<AppShell/>,children:[
{index:true,element:page('Главная','главная.jpg')},
{path:'menu',element:page('Меню','меню по категориям.jpg')},
{path:'menu/:category',element:page('Категория','меню выбранной категории.jpg')},
{path:'product/:slug',element:page('Карточка товара','страница позиции.jpg')},
{path:'promotions',element:page('Акции','акции.jpg')},
{path:'favorites',element:page('Избранное','отдельного макета нет')},
{path:'profile',element:page('Профиль','профиль.jpg')},
{path:'cart',element:page('Корзина','корзина.jpg')},
{path:'checkout',element:page('Оформление заказа','оформление заказа.jpg')},
{path:'orders/:id',element:page('Отслеживание заказа','страница отслеживания заказа после оформления.jpg')},
{path:'auth',element:page('Авторизация','авторизация.jpg')},
{path:'support',element:page('Поддержка','поддержка.jpg')},
{path:'dev/catalog',element:<CatalogSandboxPage/>},
{path:'*',element:page('Страница не найдена','—')}
]}]);
