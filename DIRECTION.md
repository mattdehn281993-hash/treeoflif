# The Tree of LIF

## Brief
Based on the supplied founder brief, not self-authored. A small faith-rooted Arizona nonprofit, working in Maricopa and Benin. Primary audience: donors arriving by WhatsApp. Secondary: people who need accessible, immediate contact. Third: partner organizations. Goal: show who this is, where care happens, and how to support it or get help in ten seconds. No existing application stack. Buildless static HTML with an explicit Node content generator.

## Three directions
A. The Tree of LIF is a living tree at night. Dark forest, Gloock display, gold action, SVG illustration, scroll story, roots drawing into a knot.
B. The Tree of LIF is an outreach field journal. Cool light ground, Hanken headlines, blue accent, real photography, dated document, photograph sliding into position.
C. The Tree of LIF is cloth at desert dusk. Clay color field, heavy expanded Arial display, pale accent, woven shapes, poster grammar, pattern unfolding.

All rendered at 390 and 1440. A wins because the roots, moon, stars and two places belong to this logo. B loses brand specificity but contributes documentary photography. C loses calm and phone typography clarity. The third direction is retained for comparison, not shipped as the main site. Direction index was shown before the full build.

## Refused defaults
No smiling stock children, invented impact metrics, quote carousel, icon feature cards, bento or generic charity slogan. No warm-paper italic-accent serif composition, mono numbered labels, black pill buttons, glows or purple gradients. The dark green belongs to the supplied logo, not a generic green charity palette. No invented Arizona photographs. No patient photographs while consent is unconfirmed.

## Tokens
Night #102d27: logo's green night; gold #e4c37d: ring and roots, primary action; leaf #b7caa2: foliage, place metadata. Cool pale #f4f6f1 supports long reading. Ink #163b30 and secondary #4e6258. Deep background sections have independent light text. No user-switchable dark mode: intentional mixed dark and light scenes, color-scheme light for controls.
Gloock: sturdy, organic serif contours echo the logo's lettering and the canopy. Hanken Grotesk: clear environmental signage voice suited to practical support. Both self-hosted under OFL, retained license files. Fallbacks include Windows and Linux fonts. Seven-step type scale in dist/tokens.css; six fixed spacing steps plus 104px section spacing. Controls radius 3px. Circular boundaries only for the tree. 1280px composition, two columns with 40–80px gutters, 760px reading measure. Phone uses a compact tree after the action, native details navigation, always visible Get help.

## Signature
Load trigger. Roots trace over 3 seconds, alternating paths delayed 300ms. Canopy settles from 94% to full size over 2.2 seconds. Ease cubic-bezier(.2,.8,.2,1). It runs once, with a complete static SVG by default. Reduced motion has no animation. Get help explicitly disables every animation. No indefinite loops or per-frame layout work.

## Grammar
Who/where/action → Arizona roots and Benin branches → documented Easter outreach → specific uses of support → name/founder → practical contact. Each remaining page answers one destination question. No metric strip, testimonials or extra sections filling space.

## Voice
Warm, plain and specific, like the person running a community food drive. Prayer is part of the history; everyone is welcome.

## Content
Exact page content is authored in build.mjs before page output; outreach content is in content/stories.json. Mission reproduced verbatim. Public location only Maricopa, Arizona. Email is marked awaiting confirmation rather than a fake working mailbox. Phone from the brief. Suggested $25/$50/$100 gifts are explicitly examples, with no invented outcome mapping. Negative tax wording from the Give brief overrides its conflicting blanket phrase ban. No tax advice supplied.

## Current behavior
Giving reviews a selection but does not charge. Processing/failure/success views are explicitly labelled query-string design previews. Forms download a user-owned draft; they are not silently sent or stored. No consent-sensitive patient imagery, no home address, no raw legal PDFs in deploy output. New private preview hosting is intended; public launch remains a separate decision.
