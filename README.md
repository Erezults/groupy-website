# Groupy Calendar — website

Marketing & support site for the **Groupy Calendar** app.
Live at **https://groupy-web.erezults.com** (GitHub Pages + custom domain).

Static HTML/CSS/JS — no build step, no dependencies. Bilingual: Hebrew (RTL, default)
at `/`, English (LTR) at `/en/`.

## Structure
```
index.html          Hebrew landing (RTL)
faq.html            Hebrew FAQ
privacy.html        Privacy policy (Hebrew)
auth/index.html     email-verification / password-reset landing (opens the app)
join/index.html     invite landing — deep-links groupy://join/<code>
en/index.html       English landing (LTR)
en/faq.html         English FAQ
en/privacy.html     Privacy policy (English)
assets/css|js|img   shared styles, scripts, images (screenshots in img/screens/{he,en})
scripts/check-mirror.sh  drift check against the app repo's website/ mirror
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

## Dual maintenance — mirror of the app repo

This repo is a **manual mirror** of `website/` inside the private app repo
(`Erezults/GroupyNative`). There is no automatic sync; every content change must be
applied in **both** places or the copies drift.

When app features or subscription copy change:
1. Edit the pages here (landing + FAQ + privacy, **both** Hebrew and English).
2. Apply the identical change to `GroupyNative/website/`.
3. Verify: `./scripts/check-mirror.sh` — compares this repo against the local
   `GroupyNative/website/` checkout (or `MIRROR_DIR=<path>` to point at it) and
   lists missing/differing files. Exit 0 = in sync.

Repo-specific files (`CNAME`, `README.md`, `scripts/`) are excluded from the
comparison — they intentionally exist only here.
