# The Tree of LIF website

Responsive, buildless HTML website, based on the supplied founder brief. Private preview only; payments and message delivery are not connected.

## Run
From this directory: `npm run dev` serves `http://localhost:4173`. No dependency installation is needed for the product. `npm run build` regenerates the HTML pages from `build.mjs` and `content/stories.json`. Deploy the `dist` folder; keep the source `.openai/hosting.json` with this Site's identity. CSS, fonts and assets are retained in `dist` and are not recreated by the content generator. Do not empty dist before building.

## Edit
- Page copy and layout: `build.mjs`, shared header/footer/intro helpers.
- Color, type and spacing: `dist/tokens.css`; component/responsive styling: `dist/styles.css`.
- Interaction logic: `dist/main.js`.
- Add a story object to `content/stories.json`, matching the existing structure. Place prepared WebP assets in `dist/assets`, reference their basename, then run `npm run build`. Each story creates its own route and is automatically listed on Stories. Optional cover and coverAlt fields choose its index photograph.
- Source photos and filings remain in the parent workspace and are not deployed. Cropped files use only team/partnership scenes. Photo preparation script is `prepare-images.py`, requiring Pillow.
- `tree.mjs` generates the simplified vector tree derived from the raster brand. Full lockup, mark and one-color artwork are in `dist/assets`. This is a web adaptation, not an exact vector tracing. Raster original is preserved in the parent folder.
- `dist/og.png` is the 1200×630 share card; icons and favicon are included. `collateral.mjs` regenerates raster collateral using the locally installed design skill browser helper.

## Current working behavior
All routes, mobile navigation, help links and tap-to-call actions work. Gift amount/frequency/designation update and validate. Gift review explicitly says payments are disconnected. Contact/involvement forms download a text message locally and do not send it. Form inputs are not stored in a server database or browser storage.

## Give flow previews
`/give/` is the default; select an amount, monthly, or a custom amount normally. `/give/?preview=monthly`, `processing`, `failed`, and `success` are labelled design states. `/thank-you/` is a labelled confirmation mockup. No query string can assert a real payment. The unsent receipt email design is `templates/receipt.html`.

## Connecting a live service
For Stripe, migrate the static forms to an Astro or Next.js server endpoint. Keep public amount and designation choices; validate amount in integer cents, allowed currencies, frequency and designation server-side. Use Stripe Checkout payment or subscription mode. Do not put secret keys in the browser. Use verified Stripe webhooks for recording donations and sending receipts, with event deduplication. Read payment status from the server for thank-you, not query parameters. Publish cancellation/refund/designation terms before enabling payment. Add the official domain email and confirmed receipt sender.

For forms, replace local draft download with a validated server delivery endpoint, confirmed destination email, abuse prevention, accessible pending/error/success states, and an updated privacy policy. Do not send messages to an unconfirmed placeholder mailbox.

## Before public launch
Confirm email; board profiles; service scope; church/hospital naming permission; donation cost examples; Stripe/account and terms; final tax wording; approved original photos and permissions. Patient images are excluded. Public location is only Maricopa, Arizona; no street address or raw EIN/filing documents are in dist. The original brief retains these client questions. This list does not prevent private design review.

## Verification
All 12 pages scanned at phone and desktop; homepage also at tablet/laptop. Matrix includes Windows 125/150%, forced colors, Linux font and scrollbar emulation, Android, Firefox, WebKit and iPhone WebKit, 320px reflow, reduced motion, and translation expansion. `verify.mjs` tests internal routes/links, custom/monthly gifts, validation, demo states, message download, mobile nav, no-JS help and help's <200KB total asset budget. Test helpers use this workstation's design-skill paths; the deployed website has no such dependency.

See `CRITIQUE.md` for two review rounds and warnings. Real device touch/GPU behavior, native Safari on Apple hardware, screen readers and actual payment/delivery cannot be verified by these previews.
