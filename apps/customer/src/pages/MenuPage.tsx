import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, Flame, Heart, Plus, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { catalogGateway } from '@/api';
import type { Product, ProductCategory } from '@/domain/catalog';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import { useProductSheetStore } from '@/features/product/productSheetStore';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';

type CategorySlug = 'pizza' | 'snacks' | 'drinks';
type PizzaFilter = 'all' | 'meat' | 'cheese' | 'spicy';
type SortOrder = 'popular' | 'price-asc' | 'price-desc' | 'name';

const menuCategories: Array<{
  slug: CategorySlug;
  label: string;
  subtitle: string;
  description: string;
  catalogCategory: ProductCategory;
}> = [
  { slug:'pizza', label:'Пицца', subtitle:'Классические и авторские рецепты', description:'Классические и авторские рецепты', catalogCategory:'Пиццы' },
  { slug:'snacks', label:'Закуски', subtitle:'Аппетитное дополнение к заказу', description:'К любимой пицце', catalogCategory:'Закуски' },
  { slug:'drinks', label:'Напитки', subtitle:'Освежающие напитки', description:'Для отличного настроения', catalogCategory:'Напитки' },
];

const pizzaFilters: Array<{id:PizzaFilter; label:string}> = [
  {id:'all',label:'Все пиццы'},
  {id:'meat',label:'Мясные'},
  {id:'cheese',label:'Сырные'},
  {id:'spicy',label:'Острые'},
];

const pizzaGroups: Record<Exclude<PizzaFilter,'all'>,string[]> = {
  meat:['ham-bacon','pepperoni','chicken-bbq','chicken-mushrooms'],
  cheese:['four-cheeses','margherita','pear-gorgonzola'],
  spicy:['pepperoni'],
};

const popularOrder = [
  'ham-bacon','four-cheeses','margherita','pepperoni',
  'chicken-bbq','eggplant-nuts','chicken-mushrooms','tuna','pear-gorgonzola'
];

function positionsLabel(count:number){
  const tail=count%10, lastTwo=count%100;
  return count+' '+(lastTwo>=11&&lastTwo<=14?'позиций':tail===1?'позиция':tail>=2&&tail<=4?'позиции':'позиций');
}

function MenuProductCard({product}:{product:Product}){
  const openProduct=useProductSheetStore(s=>s.openProduct);
  const saved=useFavoritesStore(s=>s.ids.includes(product.id));
  const toggleFavorite=useFavoritesStore(s=>s.toggle);
  const badge=product.id==='ham-bacon'?'hit':product.id==='margherita'?'popular':null;
  return <article className="bmp-menu-pizza-card">
    <div className="bmp-menu-pizza-photo-wrap">
      <button type="button" className="bmp-menu-pizza-image-action"
        onClick={()=>openProduct(product.id)} aria-label={'Открыть '+product.name}>
        <ProductPhoto src={product.imageUrl} alt={product.name} className="bmp-menu-pizza-photo"/>
      </button>
      {badge&&<span className={'bmp-menu-pizza-badge bmp-menu-pizza-badge--'+badge}>
        {badge==='hit'?<Flame size={16} strokeWidth={2.3} aria-hidden="true"/>:<Star size={16} strokeWidth={2.2} aria-hidden="true"/>}
        {badge==='hit'?'Хит':'Популярная'}
      </span>}
      <button type="button" className="bmp-menu-pizza-favorite"
        onClick={()=>toggleFavorite(product.id)} aria-pressed={saved}
        aria-label={saved?'Убрать '+product.name+' из избранного':'Добавить '+product.name+' в избранное'}>
        <Heart size={23} strokeWidth={2} fill={saved?'currentColor':'none'} aria-hidden="true"/>
      </button>
    </div>
    <div className="bmp-menu-pizza-info">
      <button type="button" className="bmp-menu-pizza-name"
        onClick={()=>openProduct(product.id)}>{product.name}</button>
      <span className="bmp-menu-pizza-size">
        {product.category==='Пиццы'?'30 см'+(product.weightGrams?' · '+product.weightGrams+' г':''):
          product.weightGrams?product.weightGrams+' г':' '}
      </span>
      <div className="bmp-menu-pizza-bottom">
        <strong className="bmp-menu-pizza-price">
          {product.priceRub===null?'Цена уточняется':product.priceRub+' ₽'}
        </strong>
        <button type="button" onClick={()=>openProduct(product.id)}
          className="bmp-menu-pizza-add" aria-label={'Выбрать '+product.name}>
          <Plus size={25} strokeWidth={2.2} aria-hidden="true"/>
        </button>
      </div>
    </div>
  </article>;
}

/** Category landing screen: imagery areas are real, reserved elements.
 * They can be filled with cropped source images without changing the layout. */
export function MenuPage(){
  const {data:products=[]}=useQuery({queryKey:['catalog','menu'],queryFn:()=>catalogGateway.getProducts()});
  return <section className="bmp-menu-overview mx-auto max-w-[1080px]">
    <div className="bmp-menu-overview-heading">
      <h1 className="bmp-display">Меню</h1>
      <p>Выберите, что вам по вкусу</p>
    </div>
    <div className="bmp-menu-category-grid">
      {menuCategories.map(category=><Link key={category.slug}
        to={'/menu/'+category.slug} className="bmp-menu-category-card">
        <span className={'bmp-menu-category-image bmp-menu-category-image--'+category.slug} aria-hidden="true"/>
        <span className="bmp-menu-category-body">
          <span className="bmp-menu-category-title">{category.label}</span>
          <span className="bmp-menu-category-description">{category.description}</span>
          <span className="bmp-menu-category-count">
            {positionsLabel(products.filter(p=>p.category===category.catalogCategory).length)}
          </span>
        </span>
        <span className="bmp-menu-category-arrow" aria-hidden="true">↗</span>
      </Link>)}
    </div>
  </section>;
}

/** Real category routes share the same search, filters, sort and product modal. */
export function MenuCategoryPage(){
  const {category:slug}=useParams<{category:string}>();
  const category=menuCategories.find(item=>item.slug===slug);
  const [filter,setFilter]=useState<PizzaFilter>('all');
  const [sort,setSort]=useState<SortOrder>('popular');
  const [searchOpen,setSearchOpen]=useState(false);
  const [search,setSearch]=useState('');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [favoritesOnly,setFavoritesOnly]=useState(false);
  const favorites=useFavoritesStore(s=>s.ids);
  const {data:products=[],isLoading,isError}=useQuery({
    queryKey:['catalog','menu'],queryFn:()=>catalogGateway.getProducts()
  });

  const visible=useMemo(()=>{
    let items=products.filter(product=>product.category===category?.catalogCategory);
    if(category?.slug==='pizza'&&filter!=='all'){
      items=items.filter(product=>pizzaGroups[filter].includes(product.id));
    }
    const term=search.trim().toLocaleLowerCase('ru');
    if(term)items=items.filter(product=>product.name.toLocaleLowerCase('ru').includes(term));
    if(favoritesOnly)items=items.filter(product=>favorites.includes(product.id));
    return [...items].sort((a,b)=>{
      if(sort==='price-asc')return (a.priceRub??Infinity)-(b.priceRub??Infinity);
      if(sort==='price-desc')return (b.priceRub??-Infinity)-(a.priceRub??-Infinity);
      if(sort==='name')return a.name.localeCompare(b.name,'ru');
      const ai=popularOrder.indexOf(a.id),bi=popularOrder.indexOf(b.id);
      return (ai<0?999:ai)-(bi<0?999:bi);
    });
  },[products,category?.catalogCategory,category?.slug,filter,sort,search,favoritesOnly,favorites]);

  if(!category)return <Navigate to="/menu" replace/>;

  return <section className="bmp-menu-catalog mx-auto max-w-[1080px]">
    <div className="bmp-menu-catalog-heading">
      <Link to="/menu" className="bmp-menu-back" aria-label="Назад ко всем категориям">
        <ChevronLeft size={29} strokeWidth={2.3} aria-hidden="true"/>
      </Link>
      <div className="bmp-menu-heading-copy">
        <h1 className="bmp-display">{category.label}</h1>
        <p>{category.subtitle}</p>
      </div>
      <button type="button" className="bmp-menu-icon-control bmp-menu-search-trigger"
        onClick={()=>{setSearchOpen(value=>!value);setSearch('');}}
        aria-label={searchOpen?'Закрыть поиск':'Поиск по меню'} aria-expanded={searchOpen}>
        {searchOpen?<X size={24} strokeWidth={2.1}/>:<Search size={25} strokeWidth={2.1}/>}
      </button>
    </div>

    {searchOpen&&<div className="bmp-menu-search-panel">
      <Search size={19} strokeWidth={2} aria-hidden="true"/>
      <input type="search" autoFocus value={search} onChange={event=>setSearch(event.target.value)}
        placeholder={'Поиск: '+category.label.toLowerCase()} aria-label="Поиск товаров"/>
      {search&&<button type="button" onClick={()=>setSearch('')} aria-label="Очистить поиск"><X size={19}/></button>}
    </div>}

    <div className="bmp-menu-filter-bar">
      <div className="bmp-menu-filter-chips" role="group" aria-label="Фильтр товаров">
        {category.slug==='pizza'?pizzaFilters.map(item=><button key={item.id} type="button"
          aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)}
          className={'bmp-menu-filter-chip '+(filter===item.id?'bmp-menu-filter-chip--selected':'')}>
          {item.label}
        </button>):<span className="bmp-menu-filter-chip bmp-menu-filter-chip--selected">Все товары</span>}
      </div>
      <button type="button" className={'bmp-menu-icon-control bmp-menu-advanced-trigger '+(filtersOpen?'bmp-menu-icon-control--active':'')}
        aria-expanded={filtersOpen} aria-controls="bmp-menu-extra-filters"
        aria-label="Дополнительные фильтры" onClick={()=>setFiltersOpen(value=>!value)}>
        <SlidersHorizontal size={24} strokeWidth={2} aria-hidden="true"/>
      </button>
    </div>

    {filtersOpen&&<div className="bmp-menu-extra-filters" id="bmp-menu-extra-filters">
      <label className="bmp-menu-favorite-toggle">
        <input type="checkbox" checked={favoritesOnly}
          onChange={event=>setFavoritesOnly(event.target.checked)}/>
        <Heart size={19} strokeWidth={1.9} aria-hidden="true"/>
        Только избранное
      </label>
      <button type="button" onClick={()=>{setFilter('all');setFavoritesOnly(false);setSearch('');}}>
        Сбросить
      </button>
    </div>}

    <div className="bmp-menu-results-row">
      <span aria-live="polite">{isLoading?'Загрузка…':positionsLabel(visible.length)}</span>
      <div className="bmp-menu-sort-control">
        <label className="sr-only" htmlFor="bmp-menu-sort">Сортировка</label>
        <select id="bmp-menu-sort" value={sort} onChange={event=>setSort(event.target.value as SortOrder)}>
          <option value="popular">По популярности</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
          <option value="name">По названию</option>
        </select>
        <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true"/>
      </div>
    </div>

    {isError&&<p className="bmp-menu-error" role="alert">Не удалось загрузить меню.</p>}
    {!isError&&!isLoading&&visible.length===0&&<div className="bmp-menu-empty">
      <p>Ничего не найдено</p>
      <button type="button" onClick={()=>{setFilter('all');setFavoritesOnly(false);setSearch('');}}>
        Сбросить фильтры
      </button>
    </div>}
    <div className="bmp-menu-products-grid">
      {visible.map(product=><MenuProductCard key={product.id} product={product}/>)}
    </div>
  </section>;
}
