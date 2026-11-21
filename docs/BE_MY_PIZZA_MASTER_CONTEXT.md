# BE MY PIZZA — MASTER CONTEXT
**Version:** 1.8 · **Date:** 21 November 2026 · **Source of truth:** GitHub `Ryt1nger/Be-My-Pizza`.

> Данный документ — контекст для продолжения проекта в новом чате. После каждого завершённого действия обновляй его прямо в репозитории: зафиксируй выполненное, ссылки на коммиты, проблемы, следующее действие. Он НЕ обновляется самостоятельно между сессиями.

## START PROMPT — вставить целиком в новый чат

Ты — ведущий full-stack/frontend разработчик проекта **Be My Pizza**. Разработка уже началась, репозиторий: https://github.com/Ryt1nger/Be-My-Pizza. Прежде чем предлагать действия, открой актуальные исходники и этот документ в GitHub. Не создавай новую архитектуру без причины, не перезаписывай существующие файлы без проверки. Общайся с владельцем на русском. Делай максимум работы сам и проверяй результат, но не заявляй о выполненных коммитах/сборках без подтверждения. Для каждой завершённой задачи обновляй этот файл. Текущая цель — единый React frontend для мобильного сайта, десктопа, iOS, Android. Не переписывать бизнес-логику для каждой платформы. Мобильные JPG-макеты согласовываем ПОСТРАНИЧНО: реализовать → показать → правки → явное утверждение → следующая страница. Сначала технический фундамент, затем главная мобильная. YumaPOS — возможный CRM/POS-партнёр, НЕ подтверждён, не связывай frontend напрямую с YumaPOS. Мы работаем только локально + GitHub; серверы, Render и REG.RU откладываем. Реальные оплаты и заказы не включать, пока нет проверенного backend. Владельцу нужны аккуратный дизайн, использование настоящих изображений товаров и проверяемый результат.

## 1. Продукт и ограничения

- Один небольшой ресторан-пиццерия Be My Pizza (Москва; первоначальный охват Орехово / Царицыно / Москворечье-Сабурово — требует подтверждения перед релизом).
- Каналы: мобильный сайт, десктопный сайт, iOS и Android, общая база исходников.
- Рабочий подход: mobile first. Desktop создаётся адаптацией общей системы компонентов; для нативного контейнера используем Capacitor.
- Финальный выбор CRM/POS ещё не сделан: YumaPOS рассматривается, ранее планировалась независимая backend-система. Архитектура должна позволять подключить выбранную систему через наш серверный слой.
- Предполагаемая доставка через Яндекс Go, онлайн-оплата и фискализация; детали интеграций НЕ утверждены. Не делаем фиктивные боевые проверки.
- Владельцу важно не дублировать frontend под iOS/Android/сайт, максимально переиспользовать состояние, UI и бизнес-логику.
- Экраны утверждаются строго по одному. Никаких самостоятельных отметок «утверждено».

## 2. Текущая платформа

- Монорепозиторий npm workspaces.
- `apps/customer`: React + TypeScript + Vite + Tailwind CSS; React Router; TanStack Query; Zustand.
- `apps/customer/capacitor.config.ts`: Capacitor для Android/iOS, **временный** appId `ru.bemypizza.preview`, не использовать для релиза без согласования.
- `apps/customer/src/domain`: типы каталога, заказов.
- `apps/customer/src/api`: абстракция CatalogGateway + локальный mock.
- `apps/customer/src/features/cart`: общий state корзины; цена авторитетно определяется будущим backend, не клиентом.
- `apps/customer/src/app`: роуты и общая оболочка (не финальный визуал).
- `apps/customer/src/pages`: заглушки страниц и отдельная техническая галерея /dev/catalog.
- `apps/customer/src/shared/styles/index.css`: предварительные фирменные токены, восстановленные по JPG.
- Не развёртываем frontend/сервер пока. После разработки предполагался пилот Render и последующий перенос на REG.RU, только когда владелец решит заниматься инфраструктурой.

## 3. Исходные материалы

История файлов в беседе: пользователь загрузил `pizza.zip` с фотографиями, скриншотами старого меню и макетами. Ранее подготовлены локальные пакеты `Be_My_Pizza_Frontend_Starter.zip`, `Be_My_Pizza_Labeled_Catalog.zip`, документ `BE_MY_PIZZA_MOBILE_DESIGN_AUDIT.md` и сравнительный лист фотографий. Эти вложения находятся в чате; не предполагай, что они уже закоммичены.

**Макеты нового мобильного интерфейса: 12 JPG.**
1. Главная.
2. Меню по категориям.
3. Меню выбранной категории.
4. Карточка позиции.
5. Корзина.
6. Оформление заказа.
7. Профиль.
8. Авторизация.
9. Акции.
10. Поддержка.
11. Отслеживание заказа после оформления.
12. Раскрытое бургер-меню.

**Визуальная система (предварительно, НЕ пиксельные дизайн-токены из Figma):**
- Тёплый светлый фон `#FCF7F3`; поверхность `#FFFDF9`.
- Тёмно-зелёный `#083123` для текста, `#145421` для кнопок/акцентов.
- Оранжевый `#F65A12`; второстепенный текст `#676767`; границы `#E9E6DF`.
- Большие фотографии товаров, круглые формы, карточки, нижняя навигация с пятью вкладками.
- Для карточки пиццы — Bottom Sheet на мобильном; на desktop возможен modal, но логика общая.
- Точный шрифт, все состояния и размеры подтверждать на первом утверждаемом экране.

**Логотип:** владелец прислал отдельное изображение логотипа в чате 21.11.2026. Использовать именно этот фирменный знак; исходный бинарный файл ещё НЕ добавлен в GitHub. `BrandLogo.tsx` содержит временную типографическую заглушку. Не перерисовывать знак и не называть заглушку утверждённым логотипом.

**Меню: 15 сопоставленных по старому меню изображений, названия подтверждены владельцем**:
Пиццы — Курица с грибами; Ветчина и бекон; Маргарита; Пепперони; Баклажаны с орешками; Четыре сыра; Курица барбекю; Тунец; Груша с горгонзолой.
Закуски — Сырные палочки; Картошка по-деревенски; Наггетсы; Картошка фри; Батат фри.
Напитки — Ягодный морс.

ID и имена файлов в `apps/customer/src/api/mock/products.json` соответствуют подготовленному локальному каталогу.
Цены, описания, составы, размеры, добавки и акции НЕ утверждены — их нельзя выдумывать. Отсутствующая цена в JSON — `null`.
ВАЖНО: в текущем GitHub-репозитории есть **текстовые пути** на `public/media/products/*.webp`, но сами двоичные фотографии могут ещё отсутствовать. Доставить их из исходного ZIP отдельным шагом, проверить соответствия и доступность. Не утверждать, что все 15 изображений опубликованы, пока не проверены физические файлы.

## 4. Список маршрутов и согласование

- `/` — главная (ПЕРВАЯ на утверждение).
- `/menu` — категории.
- `/menu/:category` — товары категории.
- `/product/:slug` — товар/Bottom Sheet.
- `/cart` — корзина.
- `/checkout` — оформление.
- `/orders/:id` — отслеживание.
- `/auth` — авторизация.
- `/profile` — профиль.
- `/promotions` — акции.
- `/support` — поддержка.
- `/favorites` — избранное (референс пока отсутствует).
- `/dev/catalog` — ТОЛЬКО разработческая галерея.

**Не представлены полностью макетами:** история заказов, избранное, SMS-код, ошибки оплаты/сети, пустая корзина, ошибки загрузки, информационные уведомления. Сначала обсудить UX, не заполнять бизнес-данными от себя.

## 5. Порядок работы

1. Технический фундамент: зависимости, роуты, дизайн-токены, типы, Mock API, Caps.
2. Загрузить оригинальный логотип и 15 оптимизированных фотографий в `apps/customer/public/media/` — публичный репозиторий разрешён владельцем.
3. Проверить `npm install`, `npm run test:catalog`, `npm run typecheck`, `npm run build`; при сбоях исправить.
4. Создать начальную страницу `/` по `главная.jpg` и оригинальным товарам. Представить результат владельцу, собрать правки.
5. Только после явного утверждения главной переходить к следующей странице. При изменениях общих компонентов проверять регрессию на утверждённых.
6. После первых экранов проверить мобильную навигацию, safe area, работу в Capacitor и responsive desktop.
7. ИНТЕГРАЦИИ, реальные заказы, платежи, CRM, сервер, Render, REG.RU — позже по отдельному решению.

## 6. Статусы и ограничения проверки

- Репозиторий: `https://github.com/Ryt1nger/Be-My-Pizza` (**PUBLIC** по решению владельца от 21.11.2026).
- Запись в GitHub через подключённый инструмент подтверждена.
- Каркас frontend и текстовые типы/мак-каталог добавлены в main; проверять текущее состояние коммитов, а не доверять этому абзацу, если работа продолжалась.
- В предыдущем локальном окружении npm Registry выдавал DNS ошибку EAI_AGAIN. Сборка и Capacitor пока не были подтверждены. Нельзя называть это готовой рабочей публикацией.
- Локально в ранней версии тест каталога проходил; это не доказывает тест нового репозитория.
- Серверная инфраструктура и деплой не выполнялись.

## 7. Правила Git, безопасности и документации

- Не коммитить секреты, ключи YumaPOS, доступы к эквайрингу, персональные данные клиентов, конфигурации с паролями.
- Не переиспользовать и не менять репозиторий `Ryt1nger/AutumnBar` без явной задачи; он только возможный справочник идей.
- Публичность репозитория — осознанное решение владельца. При публикации проверять материалы на секреты.
- Ссылку на конкретный коммит и пройденные проверки указывать в результате каждой задачи.
- После каждого действия добавлять запись в журнал ниже, обновлять «Следующее действие» и при необходимости основную часть документа.

## 8. Журнал решений и работ

**До 21.11.2026:** обсуждалась самостоятельная CRM/backend, затем владелец вернулся к вероятной YumaPOS CRM. Решено не ждать интеграции, делать mobile-first единый React frontend. Владелец передал фотографии/старое меню/12 макетов; 15 товаров по фото сопоставлены и подтверждены. Выбран процесс постраничного утверждения.

**21.11.2026, старт GitHub:** создан публичный репозиторий `Ryt1nger/Be-My-Pizza` (владелец явно разрешил публичную работу). Первый коммит README `b9257ba`. Конфигурация workspace `b188816`. Приложение и Mock API `7b943b7`. Двоичные файлы и логотип на момент этой записи ещё не загружены.

**21.11.2026, эта версия:** добавлены единый Master Context, предварительный дизайн-аудит и автоматическая CI-проверка (см. следующий коммит после этой записи).

## 9. Следующее действие

Проверить latest main и GitHub Actions. Доставить оригинал логотипа и 15 фотографий из вложенных файлов, не подменяя их изображениями из поисковиков. Проверить npm-зависимости и сборку. Затем начать первую страницу мобильной главной `главная.jpg`; показать владельцу на согласование. НЕ переходить к следующей странице без утверждения.

## 10. Обновление 21.11.2026 — первый черновик главной

**Текущий коммит экрана:** `c8f18de43f061f9f76e76f255df6e82de7cf5c1e`.
**CI:** GitHub Actions run 44894816558 прошёл успешно (npm install, проверка каталога, TypeScript, Vite build).
**Состояние:** на `/` вместо заглушки создан первый **черновик** по `главная.jpg`: крупный hero, CTA в меню, промо-зона как концепт, популярные позиции «Ветчина и бекон» и «Четыре сыра», активные ссылки, временное локальное состояние избранного. Визуал пока НЕ утверждён владельцем. На desktop предусмотрена responsive-компоновка.
**Логотип:** `BrandLogo` сначала пробует `/media/brand/logo.png`, затем использует временную текстовую заглушку. Реальный файл логотипа пользователь предоставил в чате, но двоичный файл в GitHub пока отсутствует. Не заявлять, что он уже установлен.
**Фотографии:** пути в JSON есть, физические `public/media/products/*.webp` ещё не опубликованы через GitHub. Для отсутствующих файлов предусмотрен визуальный fallback. Не представлять эту версию как завершённый дизайн.
**Цены, размеры и добавки:** не подтверждены. Кнопки покупки не активированы; переход по карточке ведёт на заглушку, а не создаёт заказ.
**Инфраструктура:** только GitHub и локальная разработка; ни Render, ни REG.RU не настроены.

**Ближайшее следующее действие:** перенести исходные бинарные изображения и фирменный логотип в репозиторий, сверить первый экран с оригинальным JPG и показать его владельцу на утверждение. Только после явного утверждения переходить к следующему экрану.

**Порядок обновления журнала:** новая задача → изучить main и этот файл → изменить код → проверки/коммит → обновить этот документ с точным состоянием. Изменения не происходят автоматически вне активной рабочей сессии.

## 10. Progress update — 2026-11-21 (v1.6)

- GitHub `main`: created React/Vite/Tailwind/Capacitor workspace, shared routes, catalog gateway, 15 products with explicitly unverified prices.
- Draft homepage `/` based on `главная.jpg` added at commit `c8f18de43f`; **NOT approved**. Hero, promotion concept, two popular product cards; `/favorites` and most other routes are placeholders.
- Official owner-supplied logo is now in repository, `apps/customer/public/media/brand/logo.webp` (96px optimized WebP). Commit `2001c0065`. Keep original `image.png` from conversation for higher-resolution release asset.
- 15 real product images are present as a low-resolution **temporary shared preview atlas** at `apps/customer/public/media/catalog-preview.webp`, with `ProductPhoto` fallback selecting images by known catalog slug. Commit `4e9e58e21`. This is NOT a substitute for committing 15 separate 1000px product images; they are still in the previous starter ZIP / user upload.
- CI succeeded for `2001c0065` (npm install, catalog validate, typecheck, production build); CI for atlas commit pending at the time of this entry.
- Owner explicitly approved working in a **public** repo; never upload secrets or client data. Do not deploy yet.
- **Next:** move each full-quality original product image into `apps/customer/public/media/products/<id>.webp`, verify visual page, improve mobile homepage based on owner's feedback, and obtain explicit page approval. Update this file after every action. No desktop or next page before approval.

## 11. Progress update — 2026-11-21 (v1.7)

- CI now uploads a `customer-dist` build artifact for local inspection (commit `fbe5b593`); run `44895561659` succeeded. No deployment was made.
- The first homepage promo concept now reuses the real Pepperoni product photo via the shared `ProductPhoto` component and existing temporary atlas fallback. **Still awaiting owner page approval.** No fabricated prices or live promotions.
- Visual screenshot automation was attempted using the CI artifact, but this execution environment's Chromium policy blocks navigation even to local/test URLs; do **not** claim a browser screenshot was verified. Next visual QA can be done locally after `npm install && npm run dev`.
- Keep updating this document after each completed action, and keep actual high-resolution photos pending upload as separate files.

## 12. Progress update — 2026-11-21 (v1.8)

- Latest reviewed frontend commit `a79b27e805` passed GitHub Actions run `44895746585` (dependencies, catalog, types, production build). Artifact `customer-dist` ID `14704500061` available from this run; extracted ZIP contains index, compiled JS/CSS, logo and preview atlas.
- README rewritten with exact local run instructions, honest asset coverage, and no-hosting status.
- Visual verification: a complete CI build was acquired, but Playwright Chromium sandbox blocks local/HTTP navigation. A screenshot of the *actual rendered home page* was NOT validated; don't use blank 404 experimental files as an approval preview.
- Next high-value step: upload full product assets individually, complete/inspect mobile first screen in local browser, get explicit owner approval, then proceed to category page.


## 21.11.2026 — Demo GitHub Pages в рамке iPhone (новая задача)
- По запросу владельца отдельно от основной React-клиентской кодовой базы добавлена статическая страница `demo/index.html`: живой интерактивный iPhone-предпросмотр с Dynamic Island.
- Демостраница не является нативным приложением: рамка iPhone и статусная строка нарисованы только вокруг iframe, не попадают в iOS/Android/Web production.
- Для статического GitHub Pages SPA используется `createHashRouter` под `VITE_DEMO_PAGES=true`; локально по-прежнему `createBrowserRouter`.
- Vite получает `VITE_PUBLIC_BASE=/Be-My-Pizza/app/` только на демо-сборке. Абсолютные пути /media/ обрабатываются с учётом `import.meta.env.BASE_URL`, чтобы изображения и логотип не пропадали.
- Workflow `.github/workflows/pages.yml` собирает приложение в `site-dist/app/`, копирует обёртку в `site-dist/index.html` и публикует через GitHub Pages Actions (с `configure-pages` enablement=true).
- Предполагаемый адрес после успешного развёртывания: `https://ryt1nger.github.io/Be-My-Pizza/`. **Не заявляй, что адрес работает, пока не проверишь результат Actions и HTTP!**
- Ассеты товаров пока остаются временным сжатым фото-атласом; 15 полноразмерных файлов ещё не загружены. Цены/составы и акции не утверждены. Главная остаётся черновиком на согласовании.
- Следующее: проверить GitHub Actions Pages, устранить ошибки, подтвердить публичную доступность URL, затем провести визуальную проверку iPhone UI. Фиксировать всё в этом документе.

## 21.11.2026 — GitHub Pages permission blocker and branch-based fallback
- First GitHub Actions Pages workflow run `44900207916` succeeded at npm/catalog/TS/Vite/build packaging and **failed** at `actions/configure-pages@v5` with `Resource not accessible by integration` creating the Pages site. Github App/Actions token cannot activate Pages automatically; no public demo URL is confirmed by that run.
- Deployment workflow changed to publish static site snapshot to `gh-pages` using GitHub Actions (`peaceiris/actions-gh-pages@v4`) and `contents: write` token.
- **One-time owner action** after branch successfully published: repo Settings → Pages → Build and deployment → Source: `Deploy from a branch` → Branch: `gh-pages` → Folder: `/ (root)` → Save.
- Once GitHub Pages reports deployment success, verify `https://ryt1nger.github.io/Be-My-Pizza/`; only then describe that URL as working. Github Pages is static hosting for the demo, not Render or backend hosting.

## 21.11.2026 — Demo branch published; one GitHub Pages UI setting remains
- Workflow run **44900334645** (`Publish iPhone demo to gh-pages branch`) completed successfully: npm install, catalog check, TypeScript, Vite build, packaging and publishing.
- Published `gh-pages` branch commit **3e2b3c55ff8303f048534b921bab607e91d946b6**. Tree verification confirms `index.html` (iPhone/Dynamic Island shell), `app/index.html`, hashed JS/CSS, temporary catalog preview and owner's logo. Vite's compiled app asset paths are correct for `/Be-My-Pizza/app/`.
- Prior automatic Pages activation run **44900207916** failed because GitHub Actions token lacks permission to **create** a Pages site (`Resource not accessible by integration`). Hence branch publication success does **not** mean the public URL is active.
- Required one-time OWNER step: open `https://github.com/Ryt1nger/Be-My-Pizza/settings/pages`; under **Build and deployment**, set **Source = Deploy from a branch**, **Branch = gh-pages**, **Folder = / (root)** and **Save**. GitHub should then publish the branch.
- Expected public URL after the owner enables it: `https://ryt1nger.github.io/Be-My-Pizza/`; direct app `https://ryt1nger.github.io/Be-My-Pizza/app/`. Do not assert HTTP availability until verified. No Render, REG.RU or backend service was used.
- Demo is clickable inside the phone iframe, including hash-router navigation; native app/UI source remains frame-free. The homepage is still NOT owner-approved and product images remain temporary low-res preview. No other page is approved.
- Next task after enablement: verify public site in browser, collect screenshot/visual feedback from owner, adjust first page, then update this document again.


## 21.11.2026 — Глубокий аудит оригинального JPG главной
- Владелец выразил недовольство текущей вёрсткой и загрузил оригинал главной. Проведено прямое визуальное сравнение с текущими скриншотами; **утверждения страницы НЕТ**.
- Точная структура: iOS status, header со **словесным** логотипом, hero с заголовком в ТРИ строки и большой пиццей справа, компактный фото-промо «Комбо на компанию», «Популярное», ДВЕ товарные карточки, плавающая нижняя навигация.
- Ключевые причины плохого вида: временный 4 КБ фотоатлас, не те иконки, изменённая композиция и текст, декоративная плашка «черновик», большой пустой вертикальный зазор, не те CTA карточек.
- Владелец передал два прозрачных набора брендовых иконок (тёмно-зелёный/чёрный). Использовать их, не заменять Lucide-аналогами.
- Готовая подробная спецификация: `docs/HOMEPAGE_REFERENCE_SPEC.md` — читать перед изменениями HomePage/AppShell/ProductPhoto.
- Источники для настоящих фотографий: `Be_My_Pizza_Labeled_Catalog.zip`; 02/04/06 имеют разрешение 1254×1254. Физически загрузить отдельные фото в GitHub и перестать масштабировать 4 КБ превью.
- **Следующее действие:** корректно переверстать mobile homepage по спецификации, сохранить единый React frontend, проверить скриншоты и получить явное утверждение владельца. Не переходить к следующей странице. Статус деплоя Pages отдельно проверять.


## 21.11.2026 — Typography pass: Google Fonts + adjusted mobile density
- По новой просьбе владельца проверены Google Fonts: **Onest** (текст/навигация) и **Manrope** (заголовки/цены); оба поддерживают кириллицу, имеют OFL. Подключаются через CSS Google Fonts (предусмотрен локальный system fallback), не добавлены файлы шрифтов.
- Добавлено `docs/TYPOGRAPHY.md`: шрифты, размеры и line-height для мобильного макета 390–412 CSS px.
- Уменьшена высота header и hero, сбалансирована ширина трёхстрочного заголовка, улучшен размер текста CTA/карточек/нижней навигации; пицца справа смещена для соответствия макету.
- **Баннер «Комбо на компанию» оставлен БЕЗ фотографии**, справа явно зарезервировано место под будущее изображение, как потребовал владелец.
- Фирменные иконки сохранены, без возврата к Lucide для меню. Используются отдельные настоящие фотографии пицц, не 4 КБ атлас для 02/04/06.
- Важно: размеры калиброваны по референсу, но точность можно подтвердить только после скриншотной проверки загруженной Google Fonts в браузере; владелец ещё НЕ утверждал главную.
- Далее: проверить TypeScript/build/Pages, получить и сравнить реальный скриншот; при необходимости подкорректировать типографику, наложение пиццы, баннер и нижнюю навигацию без начала следующего экрана.


## 21.11.2026 — Browser-visual QA snapshot
- CI workflow `.github/workflows/ci.yml` now produces an extra **hash-router** preview artifact `customer-visual-review`. It is strictly for visual screenshot testing without a running HTTP server; normal build/artifact/customer Pages route stay unchanged.
- Purpose: capture actual React screenshot at 412 CSS px and compare to original JPG 823px wide (half scale) without falsely claiming pixel match. The screenshot is QA evidence only; font rendering may differ if Google Fonts CDN is unavailable.
- Next: fetch artifact for this commit, render and inspect; adjust only homepage and global shell. Do NOT approve homepage automatically.
