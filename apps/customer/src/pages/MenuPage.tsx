import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronDown, ChevronLeft, Heart, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { catalogGateway } from '@/api';
import type { Product, ProductCategory } from '@/domain/catalog';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import { PizzaProductCard } from '@/shared/ui/PizzaProductCard';
import { useProductSheetStore } from '@/features/product/productSheetStore';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';

type CategorySlug = 'pizza' | 'snacks' | 'drinks' | 'combo' | 'desserts';
type PizzaFilter = 'all' | 'meat' | 'cheese' | 'spicy';
type SortOrder = 'popular' | 'price-asc' | 'price-desc' | 'name';

const menuCategories: Array<{
  slug: CategorySlug;
  label: string;
  subtitle: string;
  description: string;
  countLabel: string;
  catalogCategory: ProductCategory | null;
}> = [
  {slug:'pizza',label:'Пицца',subtitle:'Классические и авторские рецепты',description:'Классические и авторские рецепты',countLabel:'23 позиции',catalogCategory:'Пиццы'},
  {slug:'snacks',label:'Горячие\nзакуски',subtitle:'Картофель, наггетсы, стрипсы и другое',description:'Картофель, наггетсы, стрипсы и другое',countLabel:'12 позиций',catalogCategory:'Закуски'},
  {slug:'drinks',label:'Напитки',subtitle:'Газированные, соки, вода и многое другое',description:'Газированные, соки, вода и многое другое',countLabel:'8 позиций',catalogCategory:'Напитки'},
  {slug:'combo',label:'Комбо',subtitle:'Выгодные наборы для любого случая',description:'Выгодные наборы для любого случая',countLabel:'6 комбо',catalogCategory:null},
  {slug:'desserts',label:'Десерты',subtitle:'Сладкое дополнение к вашей пицце',description:'Сладкое дополнение к вашей пицце',countLabel:'5 позиций',catalogCategory:null},
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

function SmallProductCard({product}:{product:Product}){
  const open=useProductSheetStore(s=>s.openProduct);
  return <article className="bmp-menu-small-card group min-w-0 overflow-hidden rounded-[22px] bg-[#FFFDF9]">
    <button type="button" onClick={()=>open(product.id)} className="relative block aspect-square w-full overflow-hidden rounded-t-[22px]" aria-label={'Открыть '+product.name}>
      <ProductPhoto src={product.imageUrl} alt={product.name} className="h-full w-full object-cover"/>
    </button>
    <div className="bmp-product-glass flex min-h-[112px] flex-col rounded-b-[21px] px-3 pb-3 pt-3">
      <button type="button" onClick={()=>open(product.id)} className="bmp-body-strong text-left text-[14px] leading-5 text-ink">{product.name}</button>
      <div className="mt-auto flex items-end justify-between gap-1 pt-3">
        <span className="bmp-price text-[20px]">{product.priceRub===null?'Уточняется':product.priceRub+' ₽'}</span>
        <button type="button" onClick={()=>open(product.id)}
          aria-label={'Выбрать '+product.name} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#16833D] text-white">
          <Plus size={22} strokeWidth={2.5} aria-hidden="true"/>
        </button>
      </div>
    </div>
  </article>;
}

/** Five actual, owner-supplied banner photographs; text and controls stay live DOM. */
export function MenuPage(){
  return <section className="bmp-menu-overview mx-auto">
    <div className="bmp-menu-overview-heading">
      <h1 className="bmp-display">Меню</h1>
      <p>Выберите категорию и соберите<br className="bmp-menu-subtitle-break"/> свой идеальный заказ</p>
      <Link to="/menu/pizza" className="bmp-menu-overview-search" aria-label="Перейти к поиску по меню">
        <Search size={25} strokeWidth={2.1} aria-hidden="true"/>
      </Link>
    </div>
    <div className="bmp-menu-category-grid">
      {menuCategories.map(category=><Link key={category.slug}
        to={'/menu/'+category.slug} className="bmp-menu-category-card">
        <img className="bmp-menu-category-image"
          src={import.meta.env.BASE_URL+'media/categories/'+category.slug+'.png'}
          alt="" loading={category.slug==='pizza'?'eager':'lazy'} decoding="async" />
        <span className="bmp-menu-category-body">
          <span className="bmp-menu-category-title">{category.label}</span>
          <span className="bmp-menu-category-description">{category.description}</span>
          <span className="bmp-menu-category-count">{category.countLabel}</span>
        </span>
        <span className="bmp-menu-category-arrow" aria-hidden="true">
          <ArrowRight size={23} strokeWidth={2.2}/>
        </span>
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
    let items=category?.catalogCategory?products.filter(product=>product.category===category.catalogCategory):[];
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
      {visible.map(product=>product.category==='Пиццы'
        ?<PizzaProductCard key={product.id} product={product} display={{sizeLabel:product.weightGrams?'30 см · '+product.weightGrams+' г':'Размер уточняется'}}/>
        :<SmallProductCard key={product.id} product={product}/>)}
    </div>
  </section>;
}
