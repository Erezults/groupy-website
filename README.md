# Groupy Calendar — website

Marketing & support site for the **Groupy Calendar** app.
Live at **https://groupy-web.erezults.com** (GitHub Pages + custom domain).

Static HTML/CSS/JS — no build step, no dependencies. Bilingual: Hebrew (RTL, default)
at `/`, English (LTR) at `/en/`.

## Structure
```
index.html          Hebrew landing (RTL)
faq.html            Hebrew FAQ
privacy.html        Privacy policy
en/index.html       English landing (LTR)
en/faq.html         English FAQ
assets/css|js|img   shared styles, scripts, images (screenshots in img/screens/{he,en})
CNAME               custom domain for GitHub Pages
.nojekyll           serve files as-is (no Jekyll processing)
```

## Hosting — GitHub Pages
- Source: `main` branch, root (`/`). Settings → Pages.
- Custom domain `groupy-web.erezults.com` is set via the `CNAME` file.
- DNS (at Porkbun): a **CNAME** record `groupy-web` → `erezults.github.io`.
- HTTPS is provisioned automatically by GitHub once DNS resolves (enable "Enforce HTTPS").

Edit the HTML and `git push` — Pages redeploys automatically.

## Key facts (kept in sync with the app)
- Download links → `https://apps.apple.com/app/id6779937306` (Groupy Calendar).
- **No prices** anywhere — pricing is shown only in the app / App Store.
- No "free / forever / חינם / לתמיד" wording; entry tier is **Basic / בסיסי**.
- Source of truth for copy: the app's App Store listing + the in-app paywall.

> Mirror of `website/` in the private app repo (`Erezults/GroupyNative`). When app
> features or subscription copy change, update both this repo's pages and the FAQ.
