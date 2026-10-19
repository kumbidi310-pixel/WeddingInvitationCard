# Rubil TR & Ruby Anto — Digital Wedding Invitation

A mobile-first wedding invitation website with an editorial love-letter design, countdown, reveal interaction, directions link, photo-viewer demo, audio controls, and guestbook demo.

## Open it

1. Extract the `wedding-invitation` folder.
2. Double-click `index.html` to preview in a browser. Most features work locally.
3. For a more reliable preview, serve the folder with a static local server (for example, VS Code Live Server).

## Add your real photos and music

Create/use the `assets` folder and add these files with the exact names below (rename your files if needed). The updated page automatically loads them:

- The home page intentionally has no cover photograph.
- `photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg` — optional gallery photos. The updated `script.js` automatically loads these into the gallery; no code editing is needed.
- `wedding-song.mp3` — optional audio file. Audio begins only after the visitor presses play.

Use the couple's original photos without retouching their facial identity. Use optimized JPG/WebP images to keep the site quick on mobile. The cover image is referenced by social preview metadata; set the Open Graph image to an absolute public URL after hosting.

## Edit wedding details

`config.json` is a quick reference for all main details, including the deliberately separate closing-page date (`21 · 10 · 2026`) and signature (`Roshna`). The page's displayed content currently lives in `index.html`; update both if changing details. The countdown in `script.js` uses `2026-11-21T16:00:00+05:30` (India Standard Time).

## Share by phone / WhatsApp

To share a real clickable link with guests, publish this folder to a static web host such as GitHub Pages, Netlify, or Cloudflare Pages, then send the resulting public URL by WhatsApp/SMS. A folder on your computer is not itself a public link. For WhatsApp link previews, the page and its Open Graph cover image must be publicly accessible; previews can be cached.

## Guestbook note

The current guestbook is a working **local browser demo** using `localStorage`. Notes are visible only in the same browser/device and are not shared with other guests. To make a shared guestbook, connect a backend/database and add server-side validation, rate limiting, spam protection, and moderation. Do not claim shared submission until the backend save succeeds.

## Publish checklist

- Add your real photos and music.
- Confirm all names, venue details, date, time, and map link.
- Replace the Open Graph image URL with the public hosted cover image URL.
- Deploy the folder as a static site.
- Test on a phone, including menu, directions, audio, countdown, and guestbook.
- Add a backend if guest notes must be shared across devices.

No dependencies or build step are required. Google Fonts are optional; if unavailable, fallback fonts are used.
