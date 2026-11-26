import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './promo-carousel.css';

type Promotion={
  id:string;
  label:string;
  title:[string,string];
  description:string;
  href:string;
  theme:'combo'|'pickup'|'code';
  image:string;
  fallback:string;
};

const promotions:Promotion[]=[
  {
    id:'combo',
    label:'Акция',
    title:['Комбо','на компанию'],
    description:'2 пиццы 30 см + закуска + 2 напитка',
    href:'/menu/pizza',
    theme:'combo',
    image:'media/promotions/combo-user.webp',
    fallback:'media/promotions/combo-user.webp'
  },
  {
    id:'pickup',
    label:'−10% на самовывоз',
    title:['Забирай','выгоднее'],
    description:'Скидка 10% при самовывозе',
    href:'/menu/pizza',
    theme:'pickup',
    image:'media/promotions/pickup-pizza.webp',
    fallback:'media/hero/hero-user.webp'
  },
  {
    id:'code',
    label:'Промокод PIZZA40',
    title:['−40 ₽','на заказ'],
    description:'Введите PIZZA40 в корзине',
    href:'/menu/pizza',
    theme:'code',
    image:'media/promotions/pizza40-pizza.webp',
    fallback:'media/promotions/combo-user.webp'
  }
];

const slides=[promotions[2],...promotions,promotions[0]];
const intervalMs=3600;
const slideMs=520;

function promoBackground(promotion:Promotion){
  const url=(path:string)=>'url("'+import.meta.env.BASE_URL+path+'")';
  const overlay=promotion.theme==='pickup'
    ?'linear-gradient(90deg,rgba(251,205,188,.99) 0%,rgba(250,199,180,.93) 34%,rgba(246,185,164,.25) 65%,transparent 88%)'
    :promotion.theme==='code'
    ?'linear-gradient(90deg,rgba(44,32,81,.99) 0%,rgba(44,32,81,.91) 36%,rgba(44,32,81,.14) 78%,transparent 95%)'
    :'linear-gradient(90deg,rgba(0,65,28,.26),transparent 70%)';
  return {backgroundImage:[overlay,url(promotion.image),url(promotion.fallback)].join(',')};
}

export function PromoCarousel(){
  // Prepend the final slide and append the first: transitions across the
  // boundary stay smooth, then we snap invisibly to the matching real slide.
  const [position,setPosition]=useState(1);
  const [animate,setAnimate]=useState(true);
  const [hovered,setHovered]=useState(false);
  const [touched,setTouched]=useState(false);
  const [pageHidden,setPageHidden]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(false);
  const touchStart=useRef<number|null>(null);
  const reenableFrame=useRef<number|null>(null);
  const activeIndex=(position-1+promotions.length)%promotions.length;

  useEffect(()=>{
    const visibility=()=>setPageHidden(document.hidden);
    visibility();
    document.addEventListener('visibilitychange',visibility);
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion=()=>setReduceMotion(query.matches);
    onMotion();
    query.addEventListener?.('change',onMotion);
    return ()=>{
      document.removeEventListener('visibilitychange',visibility);
      query.removeEventListener?.('change',onMotion);
      if(reenableFrame.current!==null)window.cancelAnimationFrame(reenableFrame.current);
    };
  },[]);

  useEffect(()=>{
    if(hovered||touched||pageHidden||reduceMotion||!animate)return;
    const timer=window.setTimeout(()=>setPosition(value=>value+1),intervalMs);
    return ()=>window.clearTimeout(timer);
  },[position,hovered,touched,pageHidden,reduceMotion,animate]);

  const move=(direction:-1|1)=>{
    if(!animate)return;
    setPosition(value=>{
      // Reduced-motion users still get fully functional manual controls,
      // without relying on transitionend to reset the loop boundary.
      if(reduceMotion)return ((value-1+direction+promotions.length)%promotions.length)+1;
      return Math.max(0,Math.min(promotions.length+1,value+direction));
    });
  };
  const next=()=>move(1);
  const previous=()=>move(-1);
  const select=(index:number)=>{
    if(!animate)return;
    setPosition(index+1);
  };

  const finishSlide=(propertyName:string)=>{
    if(propertyName!=='transform')return;
    if(position!==0&&position!==promotions.length+1)return;
    setAnimate(false);
    setPosition(position===0?promotions.length:1);
    reenableFrame.current=window.requestAnimationFrame(()=>{
      reenableFrame.current=window.requestAnimationFrame(()=>{
        setAnimate(true);
        reenableFrame.current=null;
      });
    });
  };

  const touchFinish=(x:number)=>{
    const start=touchStart.current;
    touchStart.current=null;
    setTouched(false);
    if(start===null)return;
    const distance=x-start;
    if(Math.abs(distance)>45){
      if(distance<0)next();
      else previous();
    }
  };

  return <section className="bmp-promotions" aria-label="Акции и предложения">
    <div className="bmp-promo-dots" aria-label="Переключить акцию">
      {promotions.map((promotion,index)=><button key={promotion.id}
        type="button" onClick={()=>select(index)}
        aria-label={'Акция '+(index+1)+': '+promotion.title.join(' ')}
        aria-pressed={activeIndex===index}
        className={'bmp-promo-dot'+(activeIndex===index?' bmp-promo-dot--active':'')}>
        <span aria-hidden="true"/>
      </button>)}
    </div>
    <div className="bmp-promo-viewport"
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onTouchStart={event=>{
        touchStart.current=event.touches[0]?.clientX??null;
        setTouched(true);
      }}
      onTouchEnd={event=>touchFinish(event.changedTouches[0]?.clientX??0)}
      onTouchCancel={()=>{touchStart.current=null;setTouched(false);}}
      aria-roledescription="карусель">
      <div className="bmp-promo-track"
        style={{transform:'translate3d(-'+position*100+'%,0,0)',
          transition:animate&&!reduceMotion?'transform '+slideMs+'ms cubic-bezier(.22,.78,.22,1)':'none'}}
        onTransitionEnd={event=>{
          if(event.target===event.currentTarget)finishSlide(event.propertyName);
        }}>
        {slides.map((promotion,index)=>{
          const current=position===index;
          return <article key={promotion.id+'-'+index}
            className={'bmp-promo-banner bmp-promo-slide bmp-promo-slide--'+promotion.theme}
            style={promoBackground(promotion)}
            aria-hidden={!current}>
            <Link to={promotion.href}
              tabIndex={current?0:-1}
              aria-label={'Перейти к пиццам: '+promotion.title.join(' ')}
              className="bmp-promo-content">
              <span className="bmp-promo-badge">{promotion.label}</span>
              <h2 className="bmp-promo-title">{promotion.title[0]}<br/>{promotion.title[1]}</h2>
              <p className="bmp-promo-description">{promotion.description}</p>
            </Link>
            <button type="button"
              tabIndex={current?0:-1}
              onClick={next} aria-label="Следующая акция"
              className="bmp-promo-next">
              <ArrowRight strokeWidth={2.2} size={28} aria-hidden="true"/>
            </button>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
