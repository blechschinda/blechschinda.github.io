# blechschinda.github.io

Website of the brass band **Blechschinda**, built with **Jekyll** and hosted on
**GitHub Pages**. GitHub builds the site automatically on every push to `main`.
There is no separate build step or CI workflow.

The design is the original WordPress (OceanWP + Elementor) export. Its shared
header, footer and `<head>` are now Jekyll includes, so each page holds only its
own content.

## Layout

```
├── _config.yml               # Site title, URL, contact/social links, plugins
├── _layouts/default.html     # Page skeleton (body classes, scripts)
├── _includes/
│   ├── head.html             # <head>: title, meta/OpenGraph, CSS
│   ├── header.html           # Logo, menu, social icons, mobile menu
│   ├── menu-items.html       # Menu rendering (desktop + mobile)
│   ├── footer.html           # Footer (copyright year is set automatically)
│   └── oceanwp-css.html      # Theme customizer CSS from WordPress
├── _data/
│   ├── navigation.yml        # Menu entries
│   └── auftritte.yml         # Gig list ← most common edit
├── index.html                # Home: Über uns, Musikanten, Kontakt
├── auftritte.html            # /auftritte/ (rendered from _data/auftritte.yml)
├── galerie.html              # /galerie/
├── impressum.html            # /impressum/
├── datenschutzerklarung.html # /datenschutzerklarung/
├── 404.html
├── kontakt.html              # Redirect /kontakt/ → /#Kontakt
├── assets/                   # Theme/plugin CSS + JS, self-hosted webfonts
└── media/                    # Photos (WebP), favicons
```

## Editing content

**Gigs:** edit `_data/auftritte.yml`. Change `jahr` for the heading, and add one
entry per date:

```yaml
  - datum: 2027-05-01
    name: Maibaumaufstellen Sünching
```

**Other pages:** edit the HTML between the front matter (`---`) blocks. Page
title and description are set in the front matter. The menu is in
`_data/navigation.yml`. Email and social links are in `_config.yml`.

`sitemap.xml` is generated automatically. When a page changes materially,
bump `last_modified_at` in its front matter.

When adding photos, convert them to WebP first and keep them under ~500 KB:

```sh
cwebp -q 82 -m 6 -resize 2048 0 input.jpg -o media/2026/01/name.webp
```

## Previewing locally

With Ruby installed:

```sh
bundle install
bundle exec jekyll serve      # http://localhost:4000/
```

Or with Docker:

```sh
docker run --rm -it -p 4000:4000 -v "$PWD:/site" -w /site ruby:3.3 \
  bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

## Notes

* Asset paths are root-absolute (`/assets/…`, `/media/…`), so the site must be
  served from the domain root. That is the case for `blechschinda.github.io`
  and for a custom domain.
* Roboto and Roboto Slab are self-hosted under `assets/fonts/`. Do not switch
  them back to the Google Fonts CDN. That would send visitor IPs to Google,
  which German courts have repeatedly held to require consent.
* GitHub Pages does not support custom HTTP headers or server-side redirects.
  The Cloudflare `_headers`/`_redirects` files were therefore dropped. The two
  meaningful redirects, `/Galerie.html` and `/kontakt/`, are handled by
  `jekyll-redirect-from`.
