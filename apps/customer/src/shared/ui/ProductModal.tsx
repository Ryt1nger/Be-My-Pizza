import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Flame, Minus, Plus, Ruler, Weight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import { useCartStore } from '@/features/cart/cartStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';
import type { Product } from '@/domain/catalog';

const formatRub=(amount:number)=>amount.toLocaleString('ru-RU')+' ₽';
const decoration:Record<string,string>={
  mozzarella:'🧀',bacon:'🥓',mushrooms:'🍄',jalapeno:'🌶️'
};

export function ProductModal({productId,onClose}:{productId:string;onClose:()=>void}){
  const {data:product,isLoading}=useQuery({
    queryKey:['catalog','product',productId],
    queryFn:()=>catalogGateway.getProduct(productId)
  });
  const add=useCartStore(state=>state.add);
  const closeButtonRef=useRef<HTMLButtonElement>(null);
  const dialogRef=useRef<HTMLElement>(null);
  const [variantId,setVariantId]=useState('');
  const [selected,setSelected]=useState<string[]>([]);
  const [quantity,setQuantity]=useState(1);
  const [closing,setClosing]=useState(false);
  const timeoutRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{
    setVariantId(product?.variants[0]?.id??'');
    setSelected([]);
    setQuantity(1);
    setClosing(false);
  },[product?.id]);

  const requestClose=useCallback(()=>{
    if(closing)return;
    setClosing(true);
    timeoutRef.current=window.setTimeout(onClose,230);
  },[closing,onClose]);

  useEffect(()=>{
    const previousOverflow=document.body.style.overflow;
    const oldFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    document.body.style.overflow='hidden';
    const frame=window.requestAnimationFrame(()=>closeButtonRef.current?.focus());
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();requestClose();}
      if(event.key==='Tab'){
        const items=dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
        if(!items?.length)return;
        const first=items[0],last=items[items.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    window.addEventListener('keydown',onKey);
    return()=>{
      document.body.style.overflow=previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown',onKey);
      if(timeoutRef.current!==null)window.clearTimeout(timeoutRef.current);
      oldFocus?.focus();
    };
  },[requestClose]);

  const toggleModifier=(modifierId:string,groupMax:number)=>{
    setSelected(previous=>previous.includes(modifierId)
      ?previous.filter(id=>id!==modifierId)
      :previous.length<groupMax?[...previous,modifierId]:previous);
  };
  const selectedVariant=product?.variants.find(v=>v.id===variantId);
  const base=selectedVariant?.priceRub??product?.priceRub??null;
  const extraPrice=product?.modifierGroups.flatMap(g=>g.modifiers).reduce(
    (sum,m)=>sum+(selected.includes(m.id)?(m.priceRub??0):0),0)??0;
  const total=base===null?null:(base+extraPrice)*quantity;

  const addToCart=()=>{
    if(!product||base===null)return;
    const modifiers=[...selected].sort();
    const key=[product.id,variantId||'base',...modifiers].join(':');
    add({key,productId:product.id,variantId:variantId||undefined,modifierIds:modifiers,quantity});
    requestClose();
  };

  return <div className={'bmp-product-overlay'+(closing?' bmp-product-overlay--closing':'')}
    onPointerDown={event=>{if(event.target===event.currentTarget)requestClose();}}>
    <section ref={dialogRef} className="bmp-product-sheet" role="dialog" aria-modal="true"
      aria-labelledby="bmp-product-sheet-title">
      <div className="bmp-product-grabber" aria-hidden="true"/>
      <button ref={closeButtonRef} type="button" aria-label="Закрыть карточку товара"
        className="bmp-product-close" onClick={requestClose}>
        <X size={26} strokeWidth={2} aria-hidden="true"/>
      </button>
      {isLoading?<div className="bmp-product-loading" role="status">Загружаем товар…</div>:
        !product?<div className="bmp-product-loading" role="alert">Товар не найден</div>:<>
        <div className="bmp-product-scroll">
          <div className="bmp-product-hero">
            <ProductPhoto src={product.imageUrl} alt={product.name}
              className="bmp-product-hero-photo"/>
          </div>
          <div className="bmp-product-information">
            <h2 id="bmp-product-sheet-title" className="bmp-product-title">{product.name}</h2>
            {product.description&&<p className="bmp-product-description">{product.description}</p>}
            <div className="bmp-product-facts">
              {product.category==='Пиццы'&&<span className="bmp-product-fact">
                <Ruler size={20} strokeWidth={1.85} aria-hidden="true"/>
                {selectedVariant?.title??'30 см'}
              </span>}
              {product.weightGrams!=null&&<span className="bmp-product-fact">
                <Weight size={20} strokeWidth={1.85} aria-hidden="true"/>
                {product.weightGrams} г
              </span>}
              {product.id==='ham-bacon'&&<span className="bmp-product-popular">
                <Flame size={16} fill="#F65A12" color="#F65A12" aria-hidden="true"/>
                Популярная
              </span>}
            </div>
            {product.variants.length>0&&<section className="bmp-product-option-group" aria-labelledby="bmp-product-size-label">
              <h3 id="bmp-product-size-label">Размер</h3>
              <div className="bmp-product-variants">
                {product.variants.map(variant=><button key={variant.id} type="button"
                  aria-pressed={variantId===variant.id}
                  className={'bmp-product-variant'+(variantId===variant.id?' bmp-product-variant--active':'')}
                  onClick={()=>setVariantId(variant.id)}>
                  {variant.title}
                  {product.variants.length>1&&variant.priceRub!==product.priceRub
                    &&variant.priceRub!=null&&product.priceRub!=null
                    &&<span>+{formatRub(variant.priceRub-product.priceRub)}</span>}
                </button>)}
              </div>
            </section>}
            {product.modifierGroups.map(group=><section key={group.id} className="bmp-product-option-group"
              aria-label={group.title}>
              <h3>{group.title}</h3>
              <div className="bmp-product-extras">
                {group.modifiers.map(mod=><button type="button" key={mod.id}
                  className={'bmp-product-extra'+(selected.includes(mod.id)?' bmp-product-extra--selected':'')}
                  aria-pressed={selected.includes(mod.id)}
                  onClick={()=>toggleModifier(mod.id,group.maxSelected)}>
                  <span className="bmp-product-extra-visual" aria-hidden="true">{decoration[mod.id]??'🍕'}</span>
                  <span className="bmp-product-extra-name">{mod.title}</span>
                  <span className="bmp-product-extra-price">
                    {mod.priceRub!==null?'+'+formatRub(mod.priceRub):'Уточняется'}
                  </span>
                  {selected.includes(mod.id)&&<Check className="bmp-product-extra-check" size={16} strokeWidth={3} aria-hidden="true"/>}
                </button>)}
              </div>
            </section>)}
          </div>
        </div>
        <div className="bmp-product-actionbar">
          <div className="bmp-product-counter" aria-label="Количество">
            <button type="button" aria-label="Уменьшить количество"
              disabled={quantity<=1} onClick={()=>setQuantity(n=>Math.max(1,n-1))}>
              <Minus size={20} strokeWidth={2.3} aria-hidden="true"/>
            </button>
            <output aria-label={'Количество: '+quantity}>{quantity}</output>
            <button type="button" aria-label="Увеличить количество"
              disabled={quantity>=99} onClick={()=>setQuantity(n=>Math.min(99,n+1))}>
              <Plus size={20} strokeWidth={2.3} aria-hidden="true"/>
            </button>
          </div>
          <button type="button" className="bmp-product-add" disabled={total===null} onClick={addToCart}>
            <span>{total===null?'Цена уточняется':'Добавить в корзину'}</span>
            {total!==null&&<strong>{formatRub(total)}</strong>}
          </button>
        </div>
      </>}
    </section>
  </div>;
}
