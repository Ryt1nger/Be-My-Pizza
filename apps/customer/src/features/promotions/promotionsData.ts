/** Display-only demo offers. Keep campaign copy aligned with checkout rules. */
export type Promotion={
  id:'combo'|'pickup'|'code';
  label:string;
  title:[string,string];
  description:string;
  href:string;
  theme:'combo'|'pickup'|'code';
  image:string;
  fallback:string;
  details:string;
};

export const promotions:Promotion[]=[
  {
    id:'combo',
    label:'Комбо для компании',
    title:['Комбо','на компанию'],
    description:'2 пиццы 30 см + закуска + 2 напитка',
    href:'/promotions',
    theme:'combo',
    image:'media/promotions/combo-user.webp',
    fallback:'media/promotions/combo-user.webp',
    details:'Идея для компании: соберите две пиццы, закуску и два напитка. Специальная цена на набор пока не подключена.'
  },
  {
    id:'pickup',
    label:'−10% на самовывоз',
    title:['Забирай','выгоднее'],
    description:'Скидка 10% при самовывозе',
    href:'/promotions',
    theme:'pickup',
    image:'media/promotions/pickup-pizza.webp',
    fallback:'media/hero/hero-user.webp',
    details:'Выберите самовывоз на экране оформления заказа, чтобы получить скидку 10%. Пока это функция демонстрационного заказа.'
  },
  {
    id:'code',
    label:'Промокод PIZZA40',
    title:['−40 ₽','на заказ'],
    description:'Введите PIZZA40 в корзине',
    href:'/promotions',
    theme:'code',
    image:'media/promotions/pizza40-pizza.webp',
    fallback:'media/promotions/combo-user.webp',
    details:'Введите промокод PIZZA40 в корзине: скидка 40 ₽ применяется к сумме заказа. Работает только в демоверсии.'
  }
];
