import { useEffect, useState } from 'react';
import { ChevronRight, Headset, Mail, MessageSquare, Phone, Send } from 'lucide-react';

const faq=[
  {question:'Как изменить или отменить заказ?',answer:'Напишите в поддержку как можно скорее и укажите номер заказа. Возможность изменений зависит от того, начали ли готовить пиццу.'},
  {question:'Как работает доставка?',answer:'Доступность доставки и ориентировочное время зависят от адреса. Уточнить условия можно при оформлении заказа.'},
  {question:'Какие способы оплаты доступны?',answer:'Доступные для вашего заказа способы оплаты будут показаны на этапе оформления.'},
  {question:'Есть ли минимальная сумма заказа?',answer:'Если для вашего адреса действует минимальная сумма, она будет указана перед подтверждением заказа.'},
  {question:'Как применить промокод?',answer:'Откройте корзину, введите промокод в специальное поле и нажмите «Применить». Итоговую скидку проверьте перед оформлением заказа.'},
];

export function SupportPage(){
  const [composerOpen,setComposerOpen]=useState(false);
  const [message,setMessage]=useState('');
  const [showAll,setShowAll]=useState(false);
  useEffect(()=>{
    if(composerOpen){document.getElementById('bmp-support-composer')?.scrollIntoView({behavior:'smooth',block:'nearest'});}
  },[composerOpen]);
  const email='support@bemypizza.ru';
  const mailLink='mailto:'+email+'?subject='+encodeURIComponent('Вопрос по заказу Be My Pizza')+
    '&body='+encodeURIComponent(message);
  return <section className="bmp-account-page bmp-support-page" aria-labelledby="bmp-support-title">
    <header className="bmp-page-heading">
      <h1 id="bmp-support-title">Поддержка</h1>
      <p>Мы всегда на связи и готовы помочь<br className="bmp-support-heading-break"/> с вашим заказом</p>
    </header>

    <div className="bmp-support-channels">
      <button type="button" className="bmp-support-channel bmp-support-channel--active"
        onClick={()=>setComposerOpen(true)} aria-label="Написать сообщение в поддержку">
        <MessageSquare size={31} strokeWidth={1.9} aria-hidden="true"/>
        <span>Чат<br/>в приложении</span>
      </button>
      <a className="bmp-support-channel" href="tel:+74951234567">
        <Phone size={31} strokeWidth={1.9} aria-hidden="true"/>
        <span>Позвонить<small>+7 (495) 123-45-67</small></span>
      </a>
      <a className="bmp-support-channel" href={'mailto:'+email}>
        <Mail size={31} strokeWidth={1.9} aria-hidden="true"/>
        <span>Написать<small>{email}</small></span>
      </a>
    </div>

    <button type="button" className="bmp-support-chat-row" onClick={()=>setComposerOpen(value=>!value)}
      aria-expanded={composerOpen} aria-controls="bmp-support-composer">
      <span className="bmp-support-chat-icon"><Headset size={30} strokeWidth={1.9} aria-hidden="true"/></span>
      <span className="bmp-support-chat-copy"><strong>Онлайн-чат</strong><small>Связаться со службой поддержки</small></span>
      <ChevronRight className={composerOpen?'bmp-chevron-open':''} size={26} strokeWidth={1.9} aria-hidden="true"/>
    </button>

    {composerOpen&&<div id="bmp-support-composer" className="bmp-support-composer">
      <label htmlFor="bmp-support-message">Ваше сообщение</label>
      <textarea id="bmp-support-message" value={message} onChange={event=>setMessage(event.target.value)}
        rows={3} placeholder="Расскажите, чем мы можем помочь" />
      <p>Отправка откроет почтовое приложение. Онлайн-чат пока не подключён.</p>
      <a href={mailLink} className={'bmp-support-send'+(!message.trim()?' bmp-support-send--disabled':'')}
        aria-disabled={!message.trim()} onClick={event=>{if(!message.trim())event.preventDefault();}}>
        <Send size={18} aria-hidden="true"/> Отправить сообщение
      </a>
    </div>}

    <section className="bmp-support-faq" aria-labelledby="bmp-support-faq-title">
      <div className="bmp-support-faq-heading">
        <h2 id="bmp-support-faq-title">Частые вопросы</h2>
        <button type="button" onClick={()=>setShowAll(value=>!value)}>
          {showAll?'Свернуть':'Все вопросы'} <ChevronRight size={23} strokeWidth={2} aria-hidden="true"/>
        </button>
      </div>
      <div className="bmp-faq-list">
        {faq.map((item,index)=><details key={item.question} open={showAll||undefined} className="bmp-faq-item">
          <summary><span>{item.question}</span><ChevronRight size={24} strokeWidth={1.85} aria-hidden="true"/></summary>
          <p>{item.answer}</p>
        </details>)}
      </div>
    </section>

    <button type="button" className="bmp-support-bottom-action"
      onClick={()=>setComposerOpen(true)}>
      <MessageSquare size={26} strokeWidth={1.9} aria-hidden="true"/>Написать в поддержку
    </button>
  </section>;
}
