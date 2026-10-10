# The Tree of LIF website

Responsive, buildless HTML website, based on the supplied founder brief. Private preview only; payments are not connected. Contact and involvement forms hand a prepared message to WhatsApp or the phone's text messages.

## Run
From this directory: `npm run dev` serves `http://localhost:4173`. No dependency installation is needed for the product. `npm run build` regenerates the HTML pages from `build.mjs` and `content/stories.json`. Deploy the `dist` folder; keep the source `.openai/hosting.json` with this Site's identity. CSS, fonts and assets are retained in `dist` and are not recreated by the content generator. Do not empty dist before building.

## Edit
- Page copy and layout: `build.mjs`, shared header/footer/intro helpers.
- Color, type and spacing: `dist/tokens.css`; component/responsive styling: `dist/styles.css`. Both are linked directly from each page.
- Interaction logic: `dist/main.js`.
- Add a story object to `content/stories.json`, matching the existing structure: summary and facts, then `chapters` (label such as Day 1, heading, paragraphs, photos with alt text and captions; mark one photo `wide`). Add the photo to `prepare-images.py`, run it, then `npm run build`. Each story gets its own route and is listed on Stories. `cover`, `coverAlt` and `coverCaption` choose its opening photograph.
- Source photos and filings remain in the parent workspace and are not deployed. `prepare-images.py` (Pillow) crops out the JOUR titles and watermarks, neutralizes the lavender cast on the shirts, applies one shared grade, and writes a full and an 800px WebP of each photo. Crops exclude the cash, the sleeping child and patients lying in bed.
- `tree.mjs` generates the vector artwork: a grown tree with tapered limbs and layered leaves, a Celtic plait for the roots (a billiard path with alternating over and under crossings), a simplified mark for small sizes, and the plait alone for dividers. `build.mjs` writes `mark.svg`, `mark-one-color.svg`, `tree-full.svg`, `tree-one-color.svg`, `logo-lockup.svg`, `knot.svg` and `favicon.svg`. This is a web adaptation of the logo, not an exact tracing; a professional vector redraw is still recommended for print and shirts.
- The original logo is used for the header (medallion), footer (full lockup), share card and icons. `prepare-logo.py` (Pillow) cuts it out of its black background from `../ngo images/ngo logo.jpeg` and writes `logo-original*.webp`, `medallion-*.webp`, `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` and `icon-512.png`.
- `dist/og.png` is the 1200×630 share card. Its source is `collateral/og.html` (written by the build, served in dev at `/_collateral/og.html`, never deployed). With `npm run dev` running, `node collateral.mjs` regenerates the share card and PNG icons.

## Current working behavior
All routes, mobile navigation, help links and tap-to-call actions work. Gift amount (including Other), frequency and designation update and validate; links such as `/give/?to=benin` and `/give/?frequency=monthly` preselect choices. Gift review explicitly says payments are disconnected. Contact and involvement forms compose the message and open WhatsApp (`wa.me`) or the phone's text messages with it filled in; nothing is stored or sent by the website. Section reveals and the homepage signature respect reduced motion; Get help has no motion at all. `dist/404.html` is the not-found page.

## Give flow previews
`/give/` is the default; select an amount, monthly, or a custom amount normally. `/give/?preview=monthly`, `processing`, `failed`, and `success` are labelled design states. `/thank-you/` is a labelled confirmation mockup. No query string can assert a real payment. The unsent receipt email design is `templates/receipt.html`.

## Connecting a live service
For Stripe, migrate the static forms to an Astro or Next.js server endpoint. Keep public amount and designation choices; validate amount in integer cents, allowed currencies, frequency and designation server-side. Use Stripe Checkout payment or subscription mode. Do not put secret keys in the browser. Use verified Stripe webhooks for recording donations and sending receipts, with event deduplication. Read payment status from the server for thank-you, not query parameters. Publish cancellation/refund/designation terms before enabling payment. Add the official domain email and confirmed receipt sender.

For email delivery later, add a validated server endpoint, confirmed destination email, abuse prevention, accessible pending/error/success states, and an updated privacy policy. Do not send messages to an unconfirmed placeholder mailbox.

## Before public launch
Confirm that +1 (402) 870-8800 is registered on WhatsApp (the number is set once at the top of `build.mjs` and `dist/main.js`); point treeoflif.org at the host (canonical and share links already use it); email; a founder portrait; board profiles; service scope; church/hospital naming permission; donation cost examples; Stripe/account and terms; final tax wording; approved original photos and permissions. **Patient consent:** `prayer` and `singing` show seated, clothed patients (the brief lists both as usable, but consent is unconfirmed). Confirm consent before public launch, or replace them in `build.mjs` and `content/stories.json` with team-only photos (`team`, `arrival`, `handshake`, `bedside`, `shirt`). Patients lying in bed, the cash envelope and the sleeping child are never used. Public location is only Maricopa, Arizona; no street address or raw EIN/filing documents are in dist. The original brief retains these client questions. This list does not prevent private design review.

## Verification
With `npm run dev` running, `node verify.mjs` tests internal routes and links, the 404 page, preset, Other and monthly gifts, designation links, validation, demo states, the WhatsApp hand-off, mobile navigation, no-JS help and the Get help page's <200KB total budget. Test helpers use this workstation's design-skill paths; the deployed website has no such dependency.

See `CRITIQUE.md` for two review rounds and warnings. Real device touch/GPU behavior, native Safari on Apple hardware, screen readers and actual payment/delivery cannot be verified by these previews.

## Deploy on Vercel
`vercel.json` deploys the `dist` folder as a static site: Vercel runs `node build.mjs` (no install step, no dependencies) and serves `dist`, including `404.html`. Import the GitHub repository in Vercel, keep the root directory as the repository root, and deploy. Then add the treeoflif.org domain under the project's Domains settings.
