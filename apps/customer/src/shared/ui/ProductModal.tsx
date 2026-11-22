import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Check, Flame, Minus, Plus, Ruler, Weight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { catalogGateway } from '@/api';
import { useCartStore } from '@/features/cart/cartStore';
import { ProductPhoto } from '@/shared/ui/ProductPhoto';

const formatRub=(amount:number)=>amount.toLocaleString('ru-RU')+' ₽';
const photoAddons=new Set(['mozzarella','bacon','mushrooms','jalapeno']);

export function ProductModal({productId,onClose}:{productId:string;onClose:()=>void}){
  const {data:product,isLoading}=useQuery({
    queryKey:['catalog','product',productId],
    queryFn:()=>catalogGateway.getProduct(productId)
  });
  const add=useCartStore(state=>state.add);
  const cartLines=useCartStore(state=>state.lines);
  const setCartQuantity=useCartStore(state=>state.setQuantity);
  const removeCartLine=useCartStore(state=>state.remove);
  const navigate=useNavigate();
  const closeButtonRef=useRef<HTMLButtonElement>(null);
  const dialogRef=useRef<HTMLElement>(null);
  const [variantId,setVariantId]=useState('');
  const [selected,setSelected]=useState<string[]>([]);
  const [addedKey,setAddedKey]=useState<string|null>(null);
  const [closing,setClosing]=useState(false);
  const timeoutRef=useRef<number|null>(null);
  const closingRef=useRef(false);
  const onCloseRef=useRef(onClose);
  useEffect(()=>{onCloseRef.current=onClose;},[onClose]);

  useEffect(()=>{
    setVariantId(product?.variants[0]?.id??'');
    setSelected([]);
    setAddedKey(null);
    closingRef.current=false;
    setClosing(false);
  },[product?.id]);

  const requestClose=useCallback(()=>{
    if(closingRef.current)return;
    closingRef.current=true;
    setClosing(true);
    timeoutRef.current=window.setTimeout(()=>onCloseRef.current(),230);
  },[]);

  useEffect(()=>{
    // The sheet is portalled outside #root: inert blocks ALL background hit targets,
    // including fixed navigation. Body fixation locks scrolling on iOS and Android.
    const root=document.getElementById('root');
    const oldAriaHidden=root?.getAttribute('aria-hidden')??null;
    const hadInert=root?.hasAttribute('inert')??false;
    const oldFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const scrollY=window.scrollY;
    const body=document.body, html=document.documentElement;
    const oldBody={
      overflow:body.style.overflow,position:body.style.position,top:body.style.top,
      left:body.style.left,right:body.style.right,width:body.style.width
    };
    const oldHtmlOverflow=html.style.overflow;
    root?.setAttribute('inert','');
    root?.setAttribute('aria-hidden','true');
    html.style.overflow='hidden';
    body.style.overflow='hidden';
    body.style.position='fixed';
    body.style.top='-'+scrollY+'px';
    body.style.left='0';
    body.style.right='0';
    body.style.width='100%';
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
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown',onKey);
      if(timeoutRef.current!==null)window.clearTimeout(timeoutRef.current);
      if(!hadInert)root?.removeAttribute('inert');
      if(oldAriaHidden===null)root?.removeAttribute('aria-hidden');
      else root?.setAttribute('aria-hidden',oldAriaHidden);
      html.style.overflow=oldHtmlOverflow;
      Object.assign(body.style,oldBody);
      window.scrollTo(0,scrollY);
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
  const currentKey=product
    ?[product.id,variantId||'base',...[...selected].sort()].join(':')
    :'';
  const cartLine=cartLines.find(line=>line.key===currentKey);
  const isAdded=addedKey===currentKey&&Boolean(cartLine);
  const count=isAdded?(cartLine?.quantity??0):1;
  const total=base===null?null:(base+extraPrice)*count;
  const activeVariantIndex=Math.max(0,product?.variants.findIndex(v=>v.id===variantId)??0);

  const addToCart=()=>{
    if(!product||base===null)return;
    const modifiers=[...selected].sort();
    add({key:currentKey,productId:product.id,variantId:variantId||undefined,modifierIds:modifiers,quantity:1});
    setAddedKey(currentKey);
  };
  const adjustQuantity=(delta:number)=>{
    if(!cartLine)return;
    const next=Math.min(99,Math.max(0,cartLine.quantity+delta));
    if(next===0){removeCartLine(currentKey);setAddedKey(null);}
    else setCartQuantity(currentKey,next);
  };
  const goToCart=()=>{
    navigate('/cart');
    requestClose();
  };

  return createPortal(<div className={'bmp-product-overlay'+(closing?' bmp-product-overlay--closing':'')}
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
              className="bmp-product-hero-photo" priority/>
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
              <div className={'bmp-product-variants'+(product.variants.length===1?' bmp-product-variants--single':'')}
                role="group" aria-label="Размер пиццы"
                style={{'--bmp-segment-index':activeVariantIndex,'--bmp-segment-count':product.variants.length} as React.CSSProperties}>
                <span className="bmp-product-variant-thumb" aria-hidden="true"/>
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
                  <span className="bmp-product-extra-visual" aria-hidden="true">
                    {photoAddons.has(mod.id)
                      ?<img src={import.meta.env.BASE_URL+'media/addons/'+mod.id+'.webp'} alt="" loading="lazy"/>
                      :'🍕'}
                  </span>
                  <span className="bmp-product-extra-name">{mod.title}</span>
                  <span className="bmp-product-extra-price">
                    {mod.priceRub!==null?'+'+formatRub(mod.priceRub):'Уточняется'}
                  </span>
                  {selected.includes(mod.id)&&<Check className="bmp-product-extra-check" size={16} strokeWidth={3} aria-hidden="true"/>}
                </button>)}
                {group.modifiers.length===4&&<div className="bmp-product-extra bmp-product-extra--more"
                    aria-label="Другие добавки пока недоступны">
                  <span className="bmp-product-extra-more-dots" aria-hidden="true">•••</span>
                  <span className="bmp-product-extra-name">Ещё</span>
                </div>}
              </div>
            </section>)}
          </div>
        </div>
        <div className={'bmp-product-actionbar'+(isAdded?' bmp-product-actionbar--added':'')}>
          {isAdded&&<div className="bmp-product-counter" aria-label="Количество в корзине">
            <button type="button" aria-label="Уменьшить количество" onClick={()=>adjustQuantity(-1)}>
              <Minus size={20} strokeWidth={2.3} aria-hidden="true"/>
            </button>
            <output aria-label={'Количество: '+count}>{count}</output>
            <button type="button" aria-label="Увеличить количество"
              disabled={count>=99} onClick={()=>adjustQuantity(1)}>
              <Plus size={20} strokeWidth={2.3} aria-hidden="true"/>
            </button>
          </div>}
          <button type="button" className="bmp-product-add" disabled={total===null}
            onClick={isAdded?goToCart:addToCart}>
            <span>{total===null?'Цена уточняется':isAdded?'Перейти в корзину':'Добавить в корзину'}</span>
            {total!==null&&<strong>{formatRub(total)}</strong>}
          </button>
        </div>
      </>}
    </section>
  </div>,document.body);
}
