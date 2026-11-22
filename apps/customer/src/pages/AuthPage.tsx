import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Clock3, Gift, Heart } from 'lucide-react';
import './auth.css';

type Country = {
  code: string;
  name: string;
  dial: string;
  length: number;
  placeholder: string;
};

const countries: Country[] = [
  { code: 'RU', name: 'Россия', dial: '+7', length: 10, placeholder: '(999) 123-45-67' },
  { code: 'KZ', name: 'Казахстан', dial: '+7', length: 10, placeholder: '(999) 123-45-67' },
  { code: 'BY', name: 'Беларусь', dial: '+375', length: 9, placeholder: '(29) 123-45-67' },
];

function formatPhone(digits: string, country: Country) {
  if (!digits) return '';
  if (country.code === 'BY') {
    let output = '(' + digits.slice(0, 2);
    if (digits.length >= 2) output += ') ';
    if (digits.length > 2) output += digits.slice(2, 5);
    if (digits.length > 5) output += '-' + digits.slice(5, 7);
    if (digits.length > 7) output += '-' + digits.slice(7, 9);
    return output;
  }
  let output = '(' + digits.slice(0, 3);
  if (digits.length >= 3) output += ') ';
  if (digits.length > 3) output += digits.slice(3, 6);
  if (digits.length > 6) output += '-' + digits.slice(6, 8);
  if (digits.length > 8) output += '-' + digits.slice(8, 10);
  return output;
}

function GoogleMark() {
  return <svg className="bmp-auth-google-mark" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.35 12.2c0-.7-.06-1.38-.18-2.04H12v3.88h5.24a4.5 4.5 0 0 1-1.94 2.94v2.46h3.14c1.83-1.69 2.91-4.19 2.91-7.24Z"/>
    <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.44-2.36l-3.14-2.46c-.87.58-1.98.91-3.3.91-2.53 0-4.68-1.7-5.45-4H3.31v2.52A9.72 9.72 0 0 0 12 21.7Z"/>
    <path fill="#FBBC05" d="M6.55 13.79a5.83 5.83 0 0 1 0-3.59V7.67H3.31a9.71 9.71 0 0 0 0 8.65l3.24-2.53Z"/>
    <path fill="#EA4335" d="M12 6.2c1.43 0 2.72.49 3.73 1.45l2.79-2.8A9.37 9.37 0 0 0 12 2.3a9.72 9.72 0 0 0-8.69 5.37l3.24 2.53c.77-2.3 2.92-4 5.45-4Z"/>
  </svg>;
}

function AppleMark() {
  return <svg className="bmp-auth-apple-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.54c-.03-3.14 2.57-4.67 2.68-4.75-1.47-2.15-3.75-2.44-4.56-2.47-1.92-.2-3.78 1.15-4.75 1.15-.98 0-2.46-1.15-4.07-1.11C4.25 5.39 2.31 6.58 1.23 8.45c-2.18 3.78-.56 9.33 1.56 12.4 1.04 1.5 2.27 3.19 3.88 3.13 1.57-.06 2.16-1.01 4.04-1.01 1.88 0 2.41 1.01 4.06.98 1.67-.03 2.73-1.52 3.73-3.04 1.21-1.73 1.71-3.42 1.74-3.5-.04-.01-3.3-1.26-3.33-5.27Zm-3.14-8.69C14.75 2.83 15.31 1.41 15.16 0c-1.21.05-2.68.82-3.55 1.84-.79.9-1.48 2.35-1.29 3.74 1.35.1 2.76-.7 3.59-1.73Z" transform="translate(2.2 0) scale(.85)"/>
  </svg>;
}

const benefits = [
  { title: 'Персональные акции', subtitle: 'Скидки, комбо и подарки', Icon: Gift },
  { title: 'Избранные блюда', subtitle: 'Сохраняйте любимое', Icon: Heart },
  { title: 'История заказов', subtitle: 'Быстрый повтор в один клик', Icon: Clock3 },
];

export function AuthPage() {
  const [country, setCountry] = useState<Country>(countries[0]);
  const [digits, setDigits] = useState('');
  const [notice, setNotice] = useState('');

  function updatePhone(value: string) {
    let next = value.replace(/\D/g, '');
    // A pasted international number should not duplicate the dial code.
    if (country.dial === '+7' && next.length > 10 && (next.startsWith('7') || next.startsWith('8'))) {
      next = next.slice(1);
    }
    if (country.dial === '+375' && next.length > 9 && next.startsWith('375')) {
      next = next.slice(3);
    }
    setDigits(next.slice(0, country.length));
    if (notice) setNotice('');
  }

  function submitPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (digits.length !== country.length) {
      setNotice('Введите номер телефона полностью.');
      return;
    }
    // No SMS provider is wired into the current project.
    setNotice('Отправка СМС пока не подключена.');
  }

  function providerClick(provider: 'Apple ID' | 'Google') {
    // Keep the visual control actionable without simulating a successful OAuth login.
    setNotice('Вход через ' + provider + ' пока не подключён.');
  }

  return <main className="bmp-auth">
    <div className="bmp-auth-frame">
      <div className="bmp-auth-art" aria-hidden="true">
        <img src={import.meta.env.BASE_URL + 'media/hero/auth-hero.webp'}
          onError={event => {
            const fallback = import.meta.env.BASE_URL + 'media/hero/hero-user.webp';
            if (event.currentTarget.src !== new URL(fallback, window.location.href).href) {
              event.currentTarget.src = fallback;
            }
          }} alt=""/>
      </div>

      <div className="bmp-auth-content">
        <Link to="/" className="bmp-auth-logo" aria-label="Be My Pizza — на главную">
          <img src={import.meta.env.BASE_URL + 'media/brand/wordmark.webp'} alt="Be My Pizza"/>
        </Link>
        <div className="bmp-auth-intro">
          <h1>Добро<br/>пожаловать<br/>в Be My Pizza!</h1>
          <p>Зарегистрируйтесь, чтобы<br/>заказывать ещё удобнее</p>
        </div>

        <div className="bmp-auth-benefits" aria-label="Преимущества личного кабинета">
          {benefits.map(({ title, subtitle, Icon }) =>
            <div className="bmp-auth-benefit" key={title}>
              <span className="bmp-auth-benefit-icon"><Icon aria-hidden="true" strokeWidth={1.9}/></span>
              <span className="bmp-auth-benefit-copy">
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </span>
            </div>
          )}
        </div>

        <form className="bmp-auth-form" onSubmit={submitPhone} noValidate>
          <label className="bmp-auth-phone" aria-label="Номер телефона">
            <span className="bmp-auth-country">
              <select aria-label="Код страны" value={country.code}
                onChange={event => {
                  const chosen = countries.find(option => option.code === event.target.value);
                  if (chosen) { setCountry(chosen); setDigits(''); setNotice(''); }
                }}>
                {countries.map(option => <option key={option.code} value={option.code}>{option.name} ({option.dial})</option>)}
              </select>
              <span className="bmp-auth-dial">{country.dial}</span>
              <ChevronDown size={19} strokeWidth={2.5} aria-hidden="true"/>
            </span>
            <input type="tel" inputMode="tel" autoComplete="tel-national"
              aria-label="Введите номер телефона" value={formatPhone(digits, country)}
              onChange={event => updatePhone(event.target.value)} maxLength={19}
              placeholder={country.placeholder}/>
          </label>
          <button className="bmp-auth-sms" type="submit">
            Получить код в СМС <ArrowRight size={24} strokeWidth={1.9} aria-hidden="true"/>
          </button>
        </form>

        <div className="bmp-auth-separator"><span>Или зарегистрируйтесь через</span></div>
        <div className="bmp-auth-providers">
          <button className="bmp-auth-provider" type="button" onClick={() => providerClick('Apple ID')}>
            <AppleMark/><span>Apple ID</span>
          </button>
          <button className="bmp-auth-provider" type="button" onClick={() => providerClick('Google')}>
            <GoogleMark/><span>Google</span>
          </button>
        </div>
        <div className="bmp-auth-notice" role="status" aria-live="polite">{notice}</div>
        <p className="bmp-auth-legal">
          Регистрируясь, вы соглашаетесь с<br/>
          <Link to="/terms">Условиями использования</Link> и <Link to="/privacy">Политикой конфиденциальности</Link>
        </p>
        <Link to="/" className="bmp-auth-skip">Пропустить</Link>
      </div>
    </div>
  </main>;
}
