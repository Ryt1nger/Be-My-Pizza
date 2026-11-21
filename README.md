# Be My Pizza

**Единый клиентский frontend** для Mobile Web, Desktop Web, iOS и Android.

[![Customer frontend checks](https://github.com/Ryt1nger/Be-My-Pizza/actions/workflows/ci.yml/badge.svg)](https://github.com/Ryt1nger/Be-My-Pizza/actions/workflows/ci.yml)

**Дата обновления:** 21.11.2026 · **Состояние:** технический фундамент и **черновик главной страницы**. Не production, не согласованный интерфейс.

## Локальный запуск

Требуется Node.js 22+ и npm.

```bash
git clone https://github.com/Ryt1nger/Be-My-Pizza.git
cd Be-My-Pizza
npm install
npm run test:catalog
npm run typecheck
npm run dev
```

Открой http://localhost:5173

Production-сборка без серверного развёртывания:

```bash
npm run build
```

GitHub Actions проверяет код и сохраняет готовую сборку `customer-dist` как артефакт. Это **не хостинг**.

## Что в репозитории

```text
apps/customer/                React + Vite + TypeScript + Tailwind CSS
  src/app/                    маршруты и AppShell
  src/pages/                  черновик главной, остальные страницы-заглушки
  src/api/mock/               15 товаров с подтвержденными названиями
  src/domain/                 типы каталога и заказа
  src/features/               общая клиентская логика
  src/platform/               подготовка к Capacitor
  public/media/brand/         официальный логотип (webp-версия для шапки)
  public/media/               временный атлас 15 фото для preview
docs/BE_MY_PIZZA_MASTER_CONTEXT.md  полный контекст / промпт для новых чатов
docs/BE_MY_PIZZA_MOBILE_DESIGN_AUDIT.md
docs/DECISIONS.md
```

## Изображения и цены

- 15 позиций старого меню сопоставлены с фотографиями и подтверждены владельцем.
- В `public/media/catalog-preview.webp` — **низкокачественный временный атлас из настоящих фото**. `ProductPhoto` автоматически показывает фото из `/media/products/<id>.webp`, если файл есть, иначе превью из атласа.
- **15 полноразмерных фотографий в GitHub пока не загружены**; они есть в исходном пользовательском архиве и локальном Starter ZIP. Для визуального утверждения необходим перенос отдельных исходных фото.
- Цены, размеры, составы, акции ещё не подтверждены: данные хранятся как `null`/пустые массивы. Кнопки реального оформления заказа пока не подключены.
- Пользователь прислал официальный круглый логотип, его WebP-оптимизация добавлена в `public/media/brand/logo.webp`; исходный PNG остаётся у владельца.

## Процесс

1. Mobile-first — сначала утверждаем главную, затем остальные страницы по одной.
2. Один React-код для сайта и мобильных приложений. Capacitor создаст оболочки Android и iOS; нативные сборки пока не проверены.
3. Backend и CRM/POS не подключены. YumaPOS рассматривается, но интеграция не подтверждена.
4. Сейчас **только локальная разработка и GitHub**. Пилот на Render и возможный перенос на REG.RU позже по отдельному решению.
5. Каждую законченную задачу документируем в [Master Context](docs/BE_MY_PIZZA_MASTER_CONTEXT.md).

**Текущий экран:** черновик `/` по `главная.jpg`, требуется визуальная проверка и явное утверждение владельца. Остальные маршруты содержат заглушки.
