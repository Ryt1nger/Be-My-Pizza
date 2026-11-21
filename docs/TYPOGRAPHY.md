# Be My Pizza — typographic system v1.0

**Source fonts:** [Onest](https://fonts.google.com/specimen/Onest) (UI and body), [Manrope](https://fonts.google.com/specimen/Manrope) (headings/prices), hosted through Google Fonts CSS with fallback system sans. Both families have Cyrillic glyphs and open font licenses in google/fonts.

## Mobile-first size and line-height grid

| Role | Font | Mobile (390–412 CSS px) | Weight | Line height |
|---|---|---|---|---|
| H1 hero 3-line | Manrope | clamp(35px, 9.5vw, 41px) | 800 | 0.99 |
| Promo H2 | Manrope | 23px | 800 | 0.99 |
| Section H2 | Manrope | clamp(23px, 6.4vw, 29px) | 800 | 1.05 |
| Product title | Onest | clamp(13.5px, 3.65vw, 16px) | 700 | 1.19 |
| Product price (design-only) | Manrope | 19px | 800 | 1.1 |
| Body hero | Onest | clamp(13.5px, 3.7vw, 16px) | 400 | 1.30 |
| Button CTA | Onest | clamp(13px, 3.5vw, 15px) | 700 | default |
| Category/meta | Onest | 12px | 400 | 1.3 |
| Bottom nav labels | Onest | clamp(10.5px, 2.8vw, 12px) | 500/700 | 1.2 |

**Guidelines:**
1. Text contrast: dark green #083123 on warm white #FCF7F3; #646663 grey used only for secondary descriptions, not tiny on dark green.
2. Font weight 900 avoided (Manrope max 800); headings 800, UI actions 700.
3. Preserve 3-line title manually at mobile, adapt to larger screens with breakpoints.
4. If web font cannot load, system sans fallback; avoid layout changes by testing fallback and loaded fonts at 320, 390, 412, 768 CSS px.
5. Do not artificially scale body text down to fit promotional banner. Keep 11+ px for single-line compact promotional metadata; enlarge or wrap if actual content changes.
6. Use `font-display:swap` from Google Fonts and `preconnect` to fonts.gstatic.com; native packaging may later require self-hosted typography or reliable offline fallback, decided at release stage.
7. Accessibility: interactive areas min ~35–44px; user text scaling and input zoom preserved.
8. This is a first calibration to the raster JPG, NOT owner-approved type system. Need browser screenshot against 823x1910 (scale 0.5).
