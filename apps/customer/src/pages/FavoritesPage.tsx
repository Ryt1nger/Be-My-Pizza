import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Heart, Plus } from 'lucide-react';
import { catalogGateway } from '@/api';
import type { Product } from '@/domain/catalog';
import { useFavoritesStore } from '@/features/favorites/favoritesStore';
import { useProductSheetStore } from '@/features/product/productSheetStore';
import { PizzaProductCard } from '@/shared/ui/PizzaProductCard';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import './account-pages.css';
import './favorites-page.css';

/* Pizzas use their existing shared card; other saved products use matching
   small menu cards with a separate remove-from-favorites heart. */
function OtherFavoriteCard({product}:{product:Product}){
  const open=useProductSheetStore(state=>state.openProduct);
  const toggle=useFavoritesStore(state=>state.toggle);
  return <article className="bmp-menu-small-card relative min-w-0 overflow-hidden rounded-[22px] bg-[#FFFDF9]">
    <button type="button" onClick={()=>open(product.id)}
      className="relative block aspect-square w-full overflow-hidden rounded-t-[22px]"
      aria-label={'Открыть '+product.name}>
      <ProductPhoto src={product.imageUrl} alt={product.name}
        className="h-full w-full object-cover"/>
    </button>
    <button type="button" onClick={()=>toggle(product.id)}
      aria-label={'Убрать '+product.name+' из избранного'} aria-pressed={true}
      className="bmp-card-favorite absolute right-[1px] top-[1px] z-20 grid h-[44px] w-[44px] place-items-center rounded-full">
      <Heart size={18} strokeWidth={2.15} className="text-primary"
        fill="currentColor" aria-hidden="true"/>
    </button>
    <div className="bmp-product-glass flex min-h-[116px] flex-col rounded-b-[21px] px-3 pb-3 pt-3">
      <button type="button" onClick={()=>open(product.id)}
        className="bmp-body-strong text-left text-[14px] leading-5 text-ink">
        {product.name}
      </button>
      <p className="bmp-body mt-1 text-[12px] text-[#6D6D6D]">{product.category}</p>
      <div className="mt-auto flex items-end justify-between gap-1 pt-3">
        <span className="bmp-price text-[20px]">
          {product.priceRub===null?'Цена уточняется':product.priceRub.toLocaleString('ru-RU')+' ₽'}
        </span>
        <button type="button" onClick={()=>open(product.id)}
          aria-label={'Выбрать '+product.name}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#16833D] text-white">
          <Plus size={22} strokeWidth={2.5} aria-hidden="true"/>
        </button>
      </div>
    </div>
  </article>;
}

export function FavoritesPage(){
  const savedIds=useFavoritesStore(state=>state.ids);
  const {data:products=[],isLoading,isError}=useQuery({
    queryKey:['catalog','favorites'],
    queryFn:()=>catalogGateway.getProducts()
  });
  const favorites=useMemo(()=>{
    const byId=new Map(products.map(product=>[product.id,product]));
    return savedIds.map(id=>byId.get(id))
      .filter((product):product is Product=>Boolean(product));
  },[savedIds,products]);

  return <section className="bmp-account-page bmp-favorites-page"
    aria-labelledby="bmp-favorites-title">
    <header className="bmp-page-heading bmp-favorites-heading">
      <h1 id="bmp-favorites-title">Избранное</h1>
      <p>{!isLoading&&!isError&&favorites.length>0
        ?'Сохранённые позиции · '+favorites.length
        :'Ваши любимые позиции всегда под рукой'}</p>
    </header>

    {isLoading&&<p className="bmp-favorites-status" role="status">Загружаем избранное…</p>}
    {isError&&<div className="bmp-favorites-error" role="alert">
      Не удалось загрузить товары. Попробуйте позже.
    </div>}

    {!isLoading&&!isError&&favorites.length===0&&
      <div className="bmp-favorites-empty" role="status">
        <div className="bmp-favorites-heart" aria-hidden="true">
          <Heart size={52} strokeWidth={1.6}/>
        </div>
        <h2>Пока нет избранных позиций</h2>
        <p>Нажмите на сердечко у понравившейся пиццы — и она появится здесь.</p>
        <Link to="/menu/pizza" className="bmp-favorites-browse">
          Выбрать пиццу <ArrowRight size={21} strokeWidth={2.1} aria-hidden="true"/>
        </Link>
      </div>}

    {!isLoading&&!isError&&favorites.length>0&&
      <div className="bmp-menu-products-grid bmp-favorites-grid" aria-label="Сохранённые товары">
        {favorites.map(product=>product.category==='Пиццы'
          ?<PizzaProductCard key={product.id} product={product}
              display={{sizeLabel:product.weightGrams?'30 см · '+product.weightGrams+' г':'Размер уточняется'}}/>
          :<OtherFavoriteCard key={product.id} product={product}/>)}
      </div>}
  </section>;
}
