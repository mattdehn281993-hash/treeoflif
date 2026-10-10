# Design critique

## Round 1

Reviewed every 390/1440 first screen and numbered full-page slice in `shots/r1-clean`, all four homepage first screens, matrix sheet, Windows 150% render and signature filmstrip. Scores judge rendered pixels. The scan reports no homepage FAILs; matrix warns that the homepage action falls below the short Windows viewport. Firefox and WebKit remain untested.

| Line | Score | Visible evidence |
|---|---:|---|
| Concept on the page | 3 | The homepage tree, moon and knotted roots own the concept, but Work, Contact, Involved and legal first screens revert to identical giant type in an empty green band. |
| Not the category average | 4 | The gold nocturnal tree and two named places differ meaningfully from the usual photograph-led charity hero. |
| Not a slop face | 4 | There are no pills, bento tiles, invented statistics or italic accent words; the large serif/light reading sections are conventional but do not assemble a catalog face. |
| First screen | 3 | Home explains the work and presents giving, but its only actual evidence is a small story link at the very bottom, partly beyond the 390 fold. |
| Typography | 4 | Gloock has a recognizable canopy-like contour and Hanken paragraphs remain clear at phone size, though the repeated huge secondary-page headings overwhelm their practical tasks. |
| Colour | 4 | Gold against forest night reads clearly as the primary giving action; cool pale sections hold readable dark paragraphs without confetti. |
| Richness | 4 | The custom tree and real Cotonou team/partnership photographs belong to this organization; repeated team crops are the only limitation. |
| Structure and rhythm | 4 | Home moves from places to documentary outreach to uses of support, with clear changes of ground and useful breathing space. |
| Craft | 3 | Desktop story and thank-you action pairs visibly touch edge-to-edge; Contact phone is buried after the whole download form on mobile. |
| Responsive | 3 | The 768 tree/copy composition holds and phone headings are legible, but Windows 150% pushes the main giving CTA beneath the fold and mobile Contact puts the less useful form first. |
| Everyone's computer | 3 | High Contrast keeps controls visible and 320/l10n reflow fits, but the short Windows first screen loses its body action; Firefox/Safari have no render evidence. |
| Signature | 4 | Filmstrip shows the roots visibly trace into a woven knot while the canopy settles; reduced motion retains the complete tree. |
| Screenshot test | 4 | The homepage gold tree at night is memorable enough to screenshot; the internal generic title bands are not. |

Eight of thirteen lines are at least 4; none below 3. This is a credible draft, not yet a top-studio finished site.

### Five changes

1. **Home first screen:** add a compact documentary proof link adjacent to the giving action, using the existing team photo at about 76×56px and the literal caption “Easter 2026 · Cotonou hospital outreach”. Keep the full tree and later story section. At 390, fit proof above the tree rather than below its labels.
2. **Short desktop home:** at viewport heights below 700px with widths above 1000px, reduce hero top padding to 36px, cap heading at 60px and tree around 360px. Make the body giving action and proof both visible at 1280×610. The header Give alone is not enough to fix the body hierarchy.
3. **Internal concept:** turn the current Work/About/Stories/Involved title band into a split composition with a restrained 220–280px static root/canopy fragment, or the relevant existing team photo on Stories/About. Cap desktop internal titles at 64px. Preserve quiet space; do not add decoration to Get help or legal reading pages.
4. **Contact and involvement forms:** on phone, put the contact number and “Delivery is not connected” explanation before the form, with a tap-to-call action. Involved needs its short opportunity description before fields. A downloadable draft should not visually displace the working contact route.
5. **Action pair craft:** wrap article-end and thank-you actions in a flex container with 20px horizontal/16px vertical gap and wrapping. The article screenshot currently has the first arrow directly against the solid button; thank-you has its text link glued to that button. Use the same deliberate spacing in both.

Not done by the stop rule.

## Round 2

Reviewed all four homepage first screens and every numbered homepage slice, every other page's 390/1440 first screen and numbered full-page slices in `shots/r2`, the matrix sheet, Windows 150%, Firefox, WebKit and iPhone WebKit renders, and the signature filmstrip. Long pages were reviewed as readable slices. Matrix contains warnings, no FAILs; page scans pass according to the implementation report.

| Line | Score | Visible evidence |
|---|---:|---|
| Concept on the page | 3 | The tree and documentary proof give Home a clear identity. Mobile secondary titles now have woven roots; desktop secondary headers still use the same empty green band, so concept continuity is only partial. |
| Not the category average | 4 | A gold tree at night followed by named Arizona/Benin work remains distinct from a stock charity template. |
| Not a slop face | 4 | No invented counts, testimonials, pills, bento grid or fashionable gradient ornaments appeared. |
| First screen | 4 | A real team thumbnail with Easter 2026/Cotonou caption now sits directly below the giving CTA on all homepage sizes, including phone. |
| Typography | 4 | Secondary desktop titles are more restrained; phone body copy and form labels remain legible. Engine-dependent homepage line balancing gives two different but sound three-line compositions. |
| Colour | 4 | Forest/gold actions and cool reading surfaces maintain a coherent hierarchy. High Contrast preserves useful controls. |
| Richness | 4 | The bespoke tree, team portrait and partnership-shirt photograph provide organization-specific visual substance. |
| Structure and rhythm | 4 | Homepage section changes remain clear; Contact now starts its content with the actual phone route, while Involved explains the opportunities before mobile fields. |
| Craft | 3 | Article and thank-you action pairs now have clean gaps. Contact/Involved still disclose their download-only behavior after all fields; Involved's phone number breaks between 870- and 8800 on phone. |
| Responsive | 4 | The compact short-height hero exposes CTA and proof at Windows 150%. Phone ordering, tablet composition and action wrapping are sound; no clipped content seen. |
| Everyone's computer | 4 | Firefox, WebKit and iPhone WebKit evidence is now present. The 14% desktop image warning includes different heading line breaks, not just animation timing; neither render has overlaps or missing fonts. Matrix reflow and High Contrast remain usable. |
| Signature | 4 | Filmstrip retains the tracing woven roots and settled canopy; reduced motion keeps the completed image. |
| Screenshot test | 4 | The forest-night homepage holds its distinctive silhouette and now includes immediate documentary credibility. |

Eleven of thirteen lines reach 4; none falls below 3. No rendered mechanical FAIL found. **Done by the stop rule:** make the concrete fixes below once, then stop without another broad redesign or scoring round. This judges the design preview, not readiness of unconnected payments/forms for public launch.

### Five actionable changes, ranked

1. **Concrete flow defect:** move the existing download-only/delivery-not-connected explanation directly below the Contact and Involved form headings, before the first input. Keep the concise download action at the end. The current `contact/390-full-02.png` and `involved/390-full-02.png` reveal the limitation only after the user has reached the end of the fields.
2. **Concrete typography defect:** keep the complete Involved intro phone link on one line (`white-space: nowrap` on that link). `involved/390.png` splits its final four digits onto the next line. It fits within the 350px content width when kept together.
3. **Optional concept polish:** if changing an internal desktop header later, use the same restrained root fragment already present on mobile at the right of Work/About/Stories/Involved. Do not enlarge titles again or decorate help/legal pages. This is the unresolved portion of round 1's concept request, not a launch blocker.
4. **Optional content economy:** the new home proof link and the hero's bottom “From the field: Easter in Cotonou” link lead to the same story within the same first screen. Keep the compact proof link and remove the redundant bottom story link, or use that space for the Arizona work route.
5. **Concrete preview handoff:** keep the visible download-only and payment-preview declarations until delivery and payments are actually connected; include them in the handoff checklist so the polished design cannot be mistaken for a live donation/message flow.

No further decorative changes are required. The remaining two pixel/flow defects are small and bounded.

## Fixed after the last round, not rescored
Download-only disclosure moved beneath both form headings, before fields. Involved phone is a single unbroken tap-to-call link. Measured font fallback declarations are included and selected after the base tokens. Stories index now derives from the same content file as individual story pages.

## Scan warnings and verification limits
- Interior informational/policy/story pages warn about an absent body CTA in the first screen. Their task is reading; Give and Get help remain in the shared header, and contextual actions follow relevant content. No unnecessary donation band was added.
- Form disclosure moved early and notice type increased to 15px. Remaining 14px caption/legal type is metadata; contrast passes.
- Firefox/WebKit screenshot differences include different text-wrap balance algorithms, rather than missing fonts. Both loaded the chosen fonts, retain complete headline/action/proof, and have no overlap or horizontal overflow. Accepted intentional browser variation.
- Final active flow is a clearly marked preview. Stripe payment processing and message delivery require confirmed accounts/addresses. No live payments or messages were tested.
- Emulation does not verify ClearType, screen readers, native Safari on Apple hardware, real GPU/touch latency or network performance on real phones.

## Six design tests
Swap: the gold tree, knot, moon/stars and Roots/Branches metaphor are specific to this supplied identity. Squint: title and gold action own the first screen. Face: no template assemblage of pills, bento, stock, metrics or testimonials. Specificity: token sources and type reasons are recorded in DIRECTION. Screenshot: the tree at night is the memorable scene; critic score 4. Subtraction: each home section adds identity, locations, outreach evidence, uses of support or founder context.
