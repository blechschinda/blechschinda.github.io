# blechschinda.github.io

Website of the brass band **Blechschinda**, built with **Jekyll** and hosted on
**GitHub Pages**. GitHub builds the site automatically on every push to `main`.
There is no separate build step or CI workflow.

The design is a custom stylesheet: no WordPress theme, jQuery or icon font.
It keeps the original photos, logo, textured background, fonts (Roboto /
Roboto Slab) and colors: navy `#023861`, bright blue `#0490f9` and the logo
gold `#ffdf80`.

## Layout

```
├── _config.yml               # Site title, URL, contact data, social links
├── _layouts/default.html     # Page skeleton
├── _includes/
│   ├── head.html             # <head>: title, meta/OpenGraph, CSS
│   ├── header.html           # Logo, menu, mobile menu, social icons
│   ├── footer.html           # Footer (copyright year is set automatically)
│   ├── page-banner.html      # Title band on sub pages (optional photo)
│   └── icon.html             # Inline SVG icons
├── _data/
│   ├── auftritte.yml         # Gig list ← most common edit
│   ├── musikanten.yml        # Musician cards on the home page
│   ├── galerie.yml           # Gallery photos
│   ├── downloads.yml         # Files listed on /downloads/
│   └── navigation.yml        # Menu entries
├── index.html                # Home: hero, Über uns, Musikanten, Kontakt
├── auftritte.html            # /auftritte/
├── galerie.html              # /galerie/ (with lightbox)
├── downloads.html            # /downloads/ (logo + group photos)
├── downloads/                # The downloadable files + ZIP
├── impressum.html            # /impressum/
├── datenschutzerklarung.html # /datenschutzerklarung/
├── 404.html
├── kontakt.html              # Redirect /kontakt/ → /#Kontakt
├── assets/
│   ├── css/site.css          # All styles; colors are variables at the top
│   ├── js/site.js            # Menu, dialect switch, gig status, lightbox
│   └── fonts/                # Self-hosted Roboto / Roboto Slab
└── media/                    # Photos (WebP), favicons
```

## Editing content

**Gigs:** edit `_data/auftritte.yml`. Change `jahr` for the heading, and add one
entry per date:

```yaml
  - datum: 2027-05-01
    name: Maibaumaufstellen Sünching
```

The visitor's browser marks past dates as "Vorbei" and highlights the next gig.
Once every date has passed, a "Saison ist vorbei" note appears automatically.

**Musicians:** edit `_data/musikanten.yml`. Each entry has a name, instrument,
photo and text.

**Gallery:** add an entry to `_data/galerie.yml`. `src` is the grid image,
`gross` the large version for the lightbox, and `breite`/`hoehe` its pixel
size.

**Downloads:** put the file in `downloads/` and add an entry to
`_data/downloads.yml`. The ZIP (`blechschinda-pressepaket.zip`) does not update
by itself, so rebuild it when files change.

**Contact data:** phone numbers, address and email are in `_config.yml`. They
are used on the home page, in the footer and in the search-engine data.

`sitemap.xml` is generated automatically. When a page changes materially,
bump `last_modified_at` in its front matter.

When adding photos, convert them to WebP first and keep them under ~500 KB:

```sh
cwebp -q 82 -m 6 -resize 2048 0 input.jpg -o media/name.webp
```

## Previewing locally

Docker Desktop: start the `blechschinda-preview` container and open
http://localhost:4000/. Pages rebuild automatically when you save a file. To
recreate the container (e.g. after changing the `Gemfile`):

```sh
docker compose up -d --build
```

With Ruby installed instead: `bundle install`, then `bundle exec jekyll serve`.

## Notes

* Asset paths are root-absolute (`/assets/…`, `/media/…`), so the site must be
  served from the domain root.
* Fonts are self-hosted on purpose. Loading them from Google Fonts would send
  visitor IPs to Google, which German courts have held to require consent.
* GitHub Pages does not support custom HTTP headers or server-side redirects.
  `/Galerie.html` and `/kontakt/` are redirected via `jekyll-redirect-from`.
