import fs from 'node:fs';
import path from 'node:path';
import {treeSvg, markSvg, knotSvg, GOLD} from './tree.mjs';

const out = 'dist';
fs.mkdirSync(path.join(out, 'assets'), {recursive: true});

// ---------------------------------------------------------------- facts
const origin = 'https://treeoflif.org';
const phone = {display: '(402) 870-8800', intl: '+1 (402) 870-8800', tel: '+14028708800'};
// WhatsApp uses the same number. Confirm it is registered on WhatsApp before launch.
const whatsapp = '14028708800';
const tax = 'The Tree of LIF Ltd is an Arizona nonprofit corporation. We have not yet received IRS tax-exempt status, so gifts are not tax-deductible at this time.';
const mission = 'Our mission is to serve humanity with compassion and integrity, cultivating healing, resilience, and opportunity so every individual can grow, flourish, and reach their full potential.';
const stories = JSON.parse(fs.readFileSync('content/stories.json', 'utf8'));

// ---------------------------------------------------------------- icons
const icon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const arrow = icon('<path d="M4 12h15M13 6l6 6-6 6"/>');
const icons = {
  menu: icon('<path d="M4 8h16M4 16h16"/>'),
  close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
  phone: icon('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  chat: icon('<path d="M4 20l1.4-4.2A8 8 0 1 1 8.6 19z"/><path d="M9 10h6M9 13.5h4"/>'),
  text: icon('<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  pin: icon('<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
};

// ---------------------------------------------------------------- images
// Reads width and height from a WebP header so every <img> reserves its space.
function webpSize(file) {
  const b = fs.readFileSync(file);
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === 'VP8L') { const bits = b.readUInt32LE(21); return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}
function img(name, alt, {sizes = '100vw', cls = '', eager = false} = {}) {
  const [w, h] = webpSize(`${out}/assets/${name}.webp`);
  const [sw] = webpSize(`${out}/assets/${name}-800.webp`);
  const srcset = sw < w ? ` srcset="/assets/${name}-800.webp ${sw}w, /assets/${name}.webp ${w}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="/assets/${name}.webp"${srcset} width="${w}" height="${h}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const figure = (name, alt, caption, {cls = '', sizes, label} = {}) =>
  `<figure class="photo ${cls}">${img(name, alt, {sizes})}<figcaption>${label ? `<span>${label}</span>` : ''}${caption}</figcaption></figure>`;
const medallion = (name, alt) => `<div class="medallion">${img(name, alt, {sizes: '(min-width: 900px) 420px, 70vw', eager: true})}<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49.3" fill="none" stroke="${GOLD}" stroke-width=".35" opacity=".8"/><circle cx="50" cy="50" r="47.6" fill="none" stroke="${GOLD}" stroke-width=".18" opacity=".45"/></svg><span class="star s1"></span><span class="star s2"></span></div>`;

// ---------------------------------------------------------------- parts
const link = (href, text, cls = 'text-link', attrs = '') => `<a class="${cls}" href="${href}"${attrs}>${text}${arrow}</a>`;
const button = (href, text, cls = '') => link(href, text, `button ${cls}`.trim());
const eyebrow = text => `<p class="eyebrow">${text}</p>`;
const waLink = (text = '') => `https://wa.me/${whatsapp}${text ? '?text=' + encodeURIComponent(text) : ''}`;
// The original logo: the medallion in the header, the full lockup in the footer.
const brand = `<a class="brand" href="/" aria-label="The Tree of LIF, home"><img src="/assets/medallion-104.webp" width="60" height="52" alt=""><span class="brand-word"><small>The Tree of</small>LIF</span></a>`;
const lockup = `<a class="footer-logo" href="/" aria-label="The Tree of LIF, home"><img src="/assets/logo-original-520.webp" width="520" height="493" alt="The Tree of LIF Ltd logo: a tree in a gold ring with a crescent moon, stars and roots woven into a knot" loading="lazy" decoding="async"></a>`;
const nav = [['/work/', 'Our work'], ['/stories/', 'Stories'], ['/about/', 'About'], ['/involved/', 'Get involved']];
const current = (href, here) => here === href ? ' aria-current="page"' : '';

const header = here => `<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner">${brand}
<nav class="navigation" aria-label="Main">${nav.map(([h, t]) => `<a href="${h}"${current(h, here)}>${t}</a>`).join('')}</nav>
<div class="header-actions"><a class="help-link" href="/help/"${current('/help/', here)}>Get help</a>${button('/give/', 'Give', 'small')}
<details class="menu"><summary aria-label="Menu"><span class="open">${icons.menu}</span><span class="shut">${icons.close}</span></summary><div class="menu-panel"><nav aria-label="Mobile">${[...nav, ['/give/', 'Give'], ['/contact/', 'Contact'], ['/help/', 'Get help in Arizona']].map(([h, t]) => `<a href="${h}"${current(h, here)}>${t}</a>`).join('')}</nav><div class="menu-foot"><a href="tel:${phone.tel}">${phone.intl}</a><span>Maricopa, Arizona</span></div></div></details></div></div></header>`;

const footer = `<footer class="site-footer"><div class="wrap">
<div class="footer-top"><div class="footer-brand">${lockup}<p>Rooted in Arizona.<br>Reaching into Benin.<br>Everyone is welcome.</p></div>
<div class="footer-cols"><div><h2>Explore</h2><ul><li><a href="/work/">Our work</a></li><li><a href="/stories/">Stories</a></li><li><a href="/about/">About</a></li><li><a href="/involved/">Get involved</a></li></ul></div>
<div><h2>Support</h2><ul><li><a href="/give/">Give once</a></li><li><a href="/give/?frequency=monthly">Give monthly</a></li><li><a href="/help/">Get help in Arizona</a></li></ul></div>
<div><h2>Contact</h2><ul><li><a href="tel:${phone.tel}">${phone.intl}</a></li><li><a href="${waLink()}">WhatsApp</a></li><li><span>Maricopa, Arizona</span></li><li><span class="muted">Email address coming soon</span></li></ul></div></div></div>
<div class="footer-knot"><img src="/assets/knot-footer.svg" width="320" height="80" alt=""></div>
<div class="footer-bottom"><p>The Tree of LIF Ltd · Arizona nonprofit corporation · ACC Business ID 25008232 · Formed January 2026</p><div class="footer-legal"><a href="/privacy/">Privacy</a><a href="/donation-terms/">Donation terms</a></div></div>
</div></footer>`;

const jsonLd = JSON.stringify({'@context': 'https://schema.org', '@type': 'NGO', name: 'The Tree of LIF Ltd', alternateName: 'The Tree of LIF', url: origin, logo: origin + '/icon-512.png', telephone: phone.intl, foundingDate: '2026-01-24', founder: {'@type': 'Person', name: 'Codjo D. Tchokpodo'}, address: {'@type': 'PostalAddress', addressLocality: 'Maricopa', addressRegion: 'AZ', addressCountry: 'US'}, description: 'A faith-rooted nonprofit serving neighbors in Maricopa, Arizona and families in Benin.'});

function page(route, title, description, body, {cls = '', home = false} = {}) {
  const here = route ? `/${route}/` : '/';
  const file = path.join(out, route, 'index.html');
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const fullTitle = home ? `The Tree of LIF · ${title}` : `${title} · The Tree of LIF`;
  fs.writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${fullTitle}</title><meta name="description" content="${description}"><meta name="theme-color" content="#102d27"><link rel="canonical" href="${origin}${here}"><meta property="og:type" content="website"><meta property="og:site_name" content="The Tree of LIF"><meta property="og:title" content="${fullTitle}"><meta property="og:description" content="${description}"><meta property="og:url" content="${origin}${here}"><meta property="og:image" content="${origin}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="The Tree of LIF: a gold tree with woven roots, and the words From Maricopa to Cotonou"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/assets/gloock.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/hanken.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/styles.css">${home ? `<script type="application/ld+json">${jsonLd}</script>` : ''}<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.lifReady)document.documentElement.classList.remove('js')},3000)</script><script src="/main.js" defer></script></head><body class="page-${route.split('/')[0] || 'home'} ${cls}">${header(here)}<main id="main">${body}</main>${footer}</body></html>`);
}

// Interior page opening: text on the left, a medallion photograph or the knot on the right.
const intro = ({label, title, lede, visual = '', actions = ''}) => `<section class="intro${visual ? ' has-visual' : ''}"><div class="wrap intro-inner"><div class="intro-copy">${eyebrow(label)}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div>${visual ? `<div class="intro-visual">${visual}</div>` : ''}</div></section>`;
const knotRule = (light = true) => `<div class="knot-rule" aria-hidden="true">${light ? knotSvg({ink: '#9db39a', casing: '#f3f5ef', width: 2.6}) : knotSvg({ink: '#5d7d6b', casing: '#102d27', width: 2.6})}</div>`;

// ---------------------------------------------------------------- home
const story = stories[0];
const facts = s => `<dl class="facts"><div><dt>When</dt><dd>${s.date}</dd></div><div><dt>Where</dt><dd>CNHU-HKM, ${s.place}</dd></div><div><dt>With</dt><dd>${s.partner}</dd></div><div><dt>Who</dt><dd>${s.team}</dd></div></dl>`;

const home = `
<section class="hero"><div class="wrap hero-inner">
<div class="hero-copy">${eyebrow('Maricopa, Arizona · Cotonou, Benin')}<h1>From Maricopa to Cotonou, we show up in person.</h1>
<p class="lede">The Tree of LIF is a young, faith-rooted nonprofit. At home in Arizona we help neighbors find food, shelter and a way into recovery. In Benin we visit hospital patients and help families with their bills.</p>
<div class="actions">${button('/give/', 'Give to the work')}${link('/stories/easter-cotonou/', 'Read the Easter story', 'text-link on-dark')}</div></div>
<div class="hero-art">${treeSvg()}<p class="place left"><span>Our roots</span>Maricopa, Arizona</p><p class="place right"><span>Our branches</span>Cotonou, Benin</p></div>
</div></section>

<section class="plate" aria-label="From the Easter 2026 outreach"><picture><source media="(max-width: 700px)" srcset="/assets/arrival-square-800.webp">${img('arrival', 'Volunteers walk into CNHU-HKM hospital; the shirt in front reads ONG The Tree of LIF, en collaboration avec l’Église de la Paix du Christ', {sizes: '100vw'})}</picture>
<div class="plate-caption wrap"><p><span>Easter 2026 · Day 1</span>Volunteers from The Tree of LIF and Église de la Paix du Christ arrive at CNHU-HKM, the national teaching hospital in Cotonou.</p></div></section>

<section class="statement"><div class="wrap"><p class="statement-text reveal">We are a small team. We go where people are, listen first, and help with the practical thing: a meal, a coat, a call to a shelter, a hospital bill paid.</p>
<div class="statement-meta reveal"><p>Founded in Maricopa, Arizona in January 2026 by Codjo D. Tchokpodo.</p>${link('/about/', 'About The Tree of LIF')}</div></div></section>

<section class="section work-overview"><div class="wrap">
<div class="section-head reveal">${eyebrow('Our work')}<h2>Roots in Arizona, branches in Benin.</h2></div>
<div class="two-places">
<article class="place-col reveal"><header><p class="place-kicker">Our roots</p><h3>Maricopa, Arizona</h3></header><ul class="service-list">
<li><strong>Food and clothing</strong><span>For people experiencing homelessness.</span></li>
<li><strong>Finding shelter</strong><span>Help connecting with shelter options.</span></li>
<li><strong>Coming home</strong><span>Support after incarceration.</span></li>
<li><strong>A way into recovery</strong><span>Finding a treatment or recovery program, and walking in together.</span></li></ul>
<div class="col-actions">${link('/work/#arizona', 'Our Arizona work')}<a class="quiet-link" href="/help/">Need help? Call ${phone.display}</a></div></article>
<article class="place-col reveal"><header><p class="place-kicker">Our branches</p><h3>Benin, West Africa</h3></header><ul class="service-list">
<li><strong>Hospital visits</strong><span>Prayer, presence and help with patients’ medical bills.</span></li>
<li><strong>Staying in school</strong><span>Helping children who struggle to access education.</span></li>
<li><strong>Food and clothing</strong><span>For families in need.</span></li></ul>
<div class="col-actions">${link('/work/#benin', 'Our Benin work')}</div></article>
</div></div></section>

<section class="section dispatch"><div class="wrap">
<div class="field-head reveal"><div>${eyebrow('From the field')}<h2>Easter 2026, ward by ward at CNHU-HKM.</h2></div><p>${story.summary}</p></div>
${facts(story)}
<div class="field-grid">
${figure('handshake', 'A volunteer shakes hands with a smiling woman outside the hospital', 'A welcome outside the hospital.', {cls: 'f-a reveal', label: 'Day 1', sizes: '(min-width: 900px) 58vw, 100vw'})}
${figure('prayer', 'Two volunteers pray with a young man seated on his hospital bed', 'Praying with a young patient.', {cls: 'f-b reveal', label: 'Day 3', sizes: '(min-width: 900px) 36vw, 100vw'})}
${figure('singing', 'Volunteers sing and pray beside a seated patient', 'Singing beside a patient’s bed.', {cls: 'f-c reveal', label: 'Day 3', sizes: '(min-width: 900px) 36vw, 100vw'})}
${figure('bedside', 'Volunteers stand together at a bedside in a hospital room', 'Volunteers gathered at a bedside.', {cls: 'f-d reveal', label: 'Day 3', sizes: '(min-width: 900px) 58vw, 100vw'})}
</div>
<div class="field-foot">${button('/stories/easter-cotonou/', 'Read the Cotonou story', 'outline')}</div>
</div></section>

<section class="section give-overview"><div class="wrap give-grid">
<div class="reveal">${eyebrow('Give')}<h2>Choose where your gift goes.</h2><p class="lede-dark">Every gift supports the practical work. Choose a place, or let the team direct it to the most urgent need.</p><p class="fine">${tax}</p></div>
<div class="choices reveal">
<a class="choice" href="/give/?to=needed"><span class="choice-title">Where it is needed most</span><span class="choice-text">The team directs your gift to the current need, in Arizona or Benin.</span>${arrow}</a>
<a class="choice" href="/give/?to=arizona"><span class="choice-title">Arizona</span><span class="choice-text">Food, clothing, shelter connections, re-entry and recovery support.</span>${arrow}</a>
<a class="choice" href="/give/?to=benin"><span class="choice-title">Benin</span><span class="choice-text">Hospital visits, help with medical bills, schooling and family support.</span>${arrow}</a>
<a class="choice monthly" href="/give/?frequency=monthly"><span class="choice-title">Give monthly</span><span class="choice-text">Steady support the team can plan around.</span>${arrow}</a>
</div></div></section>

<section class="section name-story"><div class="wrap name-grid">
<p class="giant" aria-hidden="true">LIF</p>
<div class="reveal">${eyebrow('The name')}<h2>Why LIF, and not Life?</h2><p>When the organization was registered, the name Life was already taken. So we became The Tree of LIF. The idea did not change: roots that hold, room to grow, and branches that reach other people.</p>${link('/about/', 'Read our story')}</div>
</div></section>

<section class="help-band"><div class="wrap help-band-inner"><div><h2>Need help in Arizona?</h2><p>Call us. You do not need to share our faith to ask for help.</p></div><div class="actions">${button(`tel:${phone.tel}`, `Call ${phone.display}`)}${link('/help/', 'What we can help with', 'text-link on-dark')}</div></div></section>`;
page('', 'From Maricopa to Cotonou', 'A faith-rooted nonprofit helping neighbors in Maricopa, Arizona find food, shelter and recovery, and visiting hospital patients in Benin.', home, {home: true});

// ---------------------------------------------------------------- work
const services = {
  arizona: [
    ['Food and clothing', 'We support people experiencing homelessness with everyday essentials.', 'Call us to talk about what you need and what support is available right now.'],
    ['Help finding shelter', 'We help people connect with shelter options. We do not promise a bed or run an emergency housing line.', 'Tell us where you are, and we will talk through the next step.'],
    ['Support after incarceration', 'Coming home can mean starting over with very little. We walk alongside people as they reconnect with their community and look for practical help.', 'Call us, or ask a family member or caseworker to call with you.'],
    ['A way into recovery', 'We help people struggling with drug or alcohol use find a treatment or recovery program, and stay with them as they take that step. We are not a clinical treatment provider.', 'Call us. Partners in treatment and recovery are welcome to call too.'],
  ],
  benin: [
    ['Hospital visits and medical bills', 'We visit patients, pray with them, and help families with medical bills when resources allow. Our Easter 2026 outreach took place at CNHU-HKM in Cotonou.', 'Hospitals and churches in Benin can contact us to discuss working together.'],
    ['Staying in school', 'We help children who struggle to access education stay in school.', 'Contact the team to discuss education needs or a partnership.'],
    ['Food and clothing for families', 'We support families with food and clothing, working alongside people and organizations in the community.', 'Churches and community groups can contact us to coordinate.'],
  ],
};
const workBody = ['arizona', 'benin'].map(place => {
  const az = place === 'arizona';
  return `<section class="work-place" id="${place}"><div class="wrap work-grid">
<div class="work-aside">${eyebrow(az ? 'Our roots' : 'Our branches')}<h2>${az ? 'Arizona' : 'Benin'}</h2><p>${az ? 'Practical help for neighbors in and around Maricopa, toward a safer, steadier next step.' : 'Care in partnership with local churches and communities, starting in Cotonou.'}</p>${az ? button(`tel:${phone.tel}`, `Call ${phone.display}`, 'dark') : button('/contact/', 'Discuss a partnership', 'dark')}${az ? '' : figure('bedside', 'Volunteers stand together at a bedside in a hospital room', 'Easter 2026, CNHU-HKM.', {cls: 'aside-photo', sizes: '(min-width: 900px) 30vw, 100vw'})}</div>
<div class="work-list">${services[place].map(([t, text, next]) => `<article class="service reveal"><h3>${t}</h3><p>${text}</p><p class="next"><span>Next step</span>${next}</p></article>`).join('')}${az ? '' : link('/stories/easter-cotonou/', 'See the Easter outreach')}</div>
</div></section>`;
}).join('');
page('work', 'Our work', 'Food, shelter connections, re-entry and recovery support in Maricopa, Arizona. Hospital visits, schooling and family support in Benin.',
  intro({label: 'Our work', title: 'Seven ways we help, in two places.', lede: 'Our roots are in Maricopa, Arizona. Our branches reach into Benin, West Africa. Each service below says who it is for and what to do next.', visual: `<img class="intro-tree" src="/assets/tree-full.svg" width="600" height="560" alt="">`}) + workBody);

// ---------------------------------------------------------------- help (light, fast, no motion)
page('help', 'Get help in Arizona', `Call The Tree of LIF on ${phone.display} for food, clothing, shelter connections, re-entry and recovery support in Maricopa, Arizona.`, `
<div class="crisis"><div class="wrap"><p><strong>In danger right now?</strong> <a href="tel:911">Call 911</a>.</p><p><strong>In a mental health crisis?</strong> <a href="tel:988">Call</a> or <a href="sms:988">text 988</a>.</p></div></div>
<section class="help-intro"><div class="wrap">${eyebrow('Get help in Arizona')}<h1>Let’s talk about what you need.</h1><p class="lede">Call The Tree of LIF. You do not need to share our faith to ask for help.</p>
<a class="call-button" href="tel:${phone.tel}">${icons.phone}<span>Call ${phone.display}</span></a>
<p class="help-alt">Or <a href="sms:${phone.tel}">send a text</a>, or <a href="${waLink('Hello, I need help in Arizona.')}">message us on WhatsApp</a>.</p>
<p class="small">We are a small team, not an emergency service. If we miss your call, leave a message with a safe way to reach you.</p></div></section>
<div class="wrap help-body"><div class="help-main">
<section><h2>What we can help with</h2><ul class="help-list"><li>Food and clothing for people experiencing homelessness.</li><li>Finding shelter options.</li><li>Support when coming home from incarceration.</li><li>Finding a drug or alcohol treatment or recovery program.</li></ul></section>
<section><h2>What to expect when you call</h2><p>Tell us your first name, where you are, and what you need most right now. We will talk through the support available and the possible next steps.</p><p>Help depends on current resources. We cannot promise housing, a treatment place, or money.</p></section></div>
<aside class="resources" aria-labelledby="more-help"><h2 id="more-help">Other places to get support, any time</h2>
<div class="resource"><h3>Emergency</h3><a href="tel:911">Call 911</a><p>Immediate danger or a medical emergency.</p></div>
<div class="resource"><h3>988 Suicide &amp; Crisis Lifeline</h3><a href="tel:988">Call 988</a><p><a href="sms:988">Text 988</a> or <a href="https://988lifeline.org/chat/">chat online</a>. Free and confidential.</p></div>
<div class="resource"><h3>Arizona 211</h3><a href="tel:211">Call 211</a><p>Local services, including food and housing. <a href="https://211arizona.org/">211arizona.org</a></p></div>
<div class="resource"><h3>SAMHSA National Helpline</h3><a href="tel:18006624357">1-800-662-4357</a><p>Treatment referral and information for drug and alcohol use. Free, confidential, every day.</p></div>
</aside></div>`, {cls: 'calm'});

// ---------------------------------------------------------------- stories
page('stories', 'Stories from the work', 'Accounts from The Tree of LIF outreach, starting with Easter 2026 at CNHU-HKM hospital in Cotonou, Benin.',
  intro({label: 'Stories', title: 'Accounts from the field.', lede: 'Where we went, who we went with, and what happened. Each story is written from the team’s own photographs and notes.'}) +
  `<div class="wrap story-cards">${stories.map(s => `<a class="story-card reveal" href="/stories/${s.slug}/"><div class="story-card-img">${img(s.cover || 'team', s.coverAlt || '', {sizes: '(min-width: 900px) 60vw, 100vw'})}</div><div class="story-card-copy">${eyebrow(`${s.place} · ${s.date}`)}<h2>${s.title}</h2><p>${s.summary}</p><span class="text-link">Read the story${arrow}</span></div></a>`).join('')}</div>`);

for (const s of stories) {
  const chapters = s.chapters.map((c, i) => {
    const [first, ...rest] = c.photos || [];
    return `<section class="chapter" id="${c.label.toLowerCase().replace(/\s+/g, '-')}"><div class="wrap">
<div class="chapter-head reveal"><p class="chapter-label">${c.label}</p><h2>${c.heading}</h2><div class="chapter-text">${c.text.map(t => `<p>${t}</p>`).join('')}</div></div>
${first ? `<div class="chapter-photos count-${c.photos.length}${i % 2 ? ' flip' : ''}">${[first, ...rest].map((p, j) => figure(p.photo, p.alt, p.caption, {cls: `reveal ${p.wide ? 'wide' : ''}`, sizes: p.wide ? '(min-width: 900px) 80vw, 100vw' : '(min-width: 900px) 45vw, 100vw'})).join('')}</div>` : ''}
</div></section>`;
  }).join('');
  page(`stories/${s.slug}`, s.title, s.summary, `
<article class="story">
<header class="story-hero"><div class="wrap">${eyebrow(`${s.place} · ${s.date}`)}<h1>${s.title}</h1><p class="lede">${s.summary}</p>${facts(s)}</div>
<div class="story-cover">${figure(s.cover, s.coverAlt, s.coverCaption, {sizes: '100vw'})}</div></header>
${chapters}
<section class="chapter cost"><div class="wrap"><div class="chapter-head"><p class="chapter-label">The cost</p><h2>What did it cost?</h2><div class="chapter-text"><p>${s.cost}</p></div></div></div></section>
<section class="story-end"><div class="wrap"><h2>Help the next outreach happen.</h2><p>Gifts to Benin support hospital visits, help with medical bills, schooling and family support.</p><div class="actions">${button('/give/?to=benin', 'Give to Benin')}${link('/contact/', 'Ask about the outreach', 'text-link on-dark')}</div></div></section>
</article>`);
}

// ---------------------------------------------------------------- about
page('about', 'About us', 'The Tree of LIF Ltd is an Arizona nonprofit founded in Maricopa in January 2026 by Codjo D. Tchokpodo, serving neighbors in Arizona and families in Benin.',
  intro({label: 'About us', title: 'A young nonprofit, founded in Maricopa in 2026.', lede: 'Faith-rooted, open to everyone, and working in two places: our home community in Arizona, and communities in Benin, West Africa.', visual: medallion('team', 'The volunteer team outside CNHU-HKM hospital in Cotonou, Easter 2026')}) + `
<section class="section mission"><div class="wrap mission-grid">${eyebrow('Our mission')}<blockquote class="reveal"><p>${mission}</p><footer>From the bylaws of The Tree of LIF Ltd</footer></blockquote></div></section>
<section class="section people"><div class="wrap people-grid">
<div class="reveal">${eyebrow('Founder')}<h2>Codjo D. Tchokpodo</h2><p class="role">Founder and President</p><p>Codjo D. Tchokpodo founded The Tree of LIF in Maricopa, Arizona in January 2026, to serve neighbors at home and to reach families in Benin.</p><p>In Benin, the work began with the Easter 2026 hospital outreach in Cotonou, alongside the volunteers of Église de la Paix du Christ. Faith is part of the work. Care is open to everyone.</p></div>
<div class="board reveal"><h3>Board and officers</h3><p>Profiles of the board and officers will be published here once their details are confirmed.</p><h3>Partner in Benin</h3><p>Église de la Paix du Christ, Cotonou. Partner for the Easter 2026 hospital outreach.</p></div>
</div></section>
<section class="section name-story"><div class="wrap name-grid"><p class="giant" aria-hidden="true">LIF</p><div class="reveal">${eyebrow('The name')}<h2>Why “LIF”?</h2><p>The spelling is intentional. When the organization was registered, “Life” was already taken. The name still carries the idea of a tree of life: roots that hold, growth that continues, and branches that reach others.</p></div></div></section>
<section class="section record"><div class="wrap record-grid"><div class="reveal">${eyebrow('Plainly stated')}<h2>Our organization, on the record.</h2><p>${tax}</p>${link('/contact/', 'Ask us a question')}</div>
<dl class="record-list reveal"><div><dt>Legal name</dt><dd>The Tree of LIF Ltd</dd></div><div><dt>Type</dt><dd>Arizona domestic nonprofit corporation</dd></div><div><dt>Formed</dt><dd>January 24, 2026</dd></div><div><dt>ACC Business ID</dt><dd>25008232</dd></div><div><dt>IRS status</dt><dd>Tax-exempt status not yet received</dd></div><div><dt>Based in</dt><dd>Maricopa, Arizona</dd></div></dl></div></section>`);

// ---------------------------------------------------------------- give
const amounts = [25, 50, 100, 250];
page('give', 'Give', 'Give once or monthly to The Tree of LIF, for the work in Arizona, in Benin, or where it is needed most. Online payments are not yet connected.',
  intro({label: 'Give', title: 'Give to the work in Arizona and Benin.', lede: 'Choose a one-time gift or steady monthly support, and decide where it goes.'}) + `
<div class="wrap give-layout">
<form class="give-form" id="give-form" novalidate>
<fieldset class="step"><legend>How often?</legend><div class="segmented"><label><input type="radio" name="frequency" value="once" checked><span>One time</span></label><label><input type="radio" name="frequency" value="monthly"><span>Monthly</span></label></div></fieldset>
<fieldset class="step"><legend>Amount in US dollars</legend><div class="amounts">${amounts.map(a => `<button type="button" data-amount="${a}" aria-pressed="${a === 50}">$${a}</button>`).join('')}<button type="button" data-amount="other" aria-pressed="false">Other</button></div>
<div class="field other-amount" id="other-field"><label for="gift-amount">Your amount</label><div class="money"><span aria-hidden="true">$</span><input id="gift-amount" name="amount" type="number" inputmode="decimal" min="1" max="100000" step="0.01" value="50" required></div></div>
<p class="fine">Suggested amounts are examples. The team is confirming what each one buys, and will publish only real figures.</p></fieldset>
<fieldset class="step"><legend>Where should it go?</legend><div class="designations">
<label><input type="radio" name="designation" value="Where most needed" checked><span><strong>Where it is needed most</strong>The team directs it to the current need.</span></label>
<label><input type="radio" name="designation" value="Arizona"><span><strong>Arizona</strong>Food, shelter connections, re-entry and recovery.</span></label>
<label><input type="radio" name="designation" value="Benin"><span><strong>Benin</strong>Hospital visits, medical bills, schooling.</span></label></div></fieldset>
<div class="give-submit"><p class="summary" id="gift-summary">$50 one time, where it is needed most.</p><button type="submit" class="button wide" id="give-button">Review $50 gift ${arrow}</button>
<p class="fine">Preview only. Online payments are not connected yet, and you will not be charged. <a href="/donation-terms/">Donation terms</a></p>
<div class="status" id="gift-status" role="status" aria-live="polite"></div>
<noscript><p class="fine">Online payments are not connected. Call ${phone.intl} to discuss a gift.</p></noscript></div>
</form>
<aside class="give-aside"><div class="give-photo">${figure('shirt', 'A volunteer seen from behind, his shirt printed with the Tree of LIF logo and the church partnership', 'Easter 2026, Cotonou.', {sizes: '(min-width: 900px) 30vw, 100vw'})}</div>
<h2>What your gift supports</h2><ul class="aside-list"><li><strong>Food and essentials</strong>For neighbors and families who need food and clothing.</li><li><strong>A steadier next step</strong>Shelter connections, re-entry support and recovery programs in Arizona.</li><li><strong>Care and education in Benin</strong>Hospital visits, help with medical bills, and keeping children in school.</li></ul>
<p class="fine">${tax}</p><p class="fine">Online giving is being set up. To give now, <a href="tel:${phone.tel}">call ${phone.display}</a>.</p></aside>
</div>`);

// ---------------------------------------------------------------- involved & contact
const messageForm = ({kind, title, options}) => `<form class="message-form" data-kind="${kind}" novalidate>
<h2>${title}</h2><p class="fine">This opens your message in WhatsApp or your phone’s text messages, ready to send to the team. Please do not include private medical or financial details.</p>
${options ? `<fieldset class="field"><legend>I would like to</legend><div class="pills">${options.map((o, i) => `<label><input type="radio" name="interest" value="${o}"${i ? '' : ' checked'}><span>${o}</span></label>`).join('')}</div></fieldset>` : ''}
<div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" maxlength="150" required></div>
<div class="field"><label for="reply">Best way to reach you <span class="optional">(phone or email)</span></label><input id="reply" name="reply" autocomplete="tel" maxlength="254"></div>
<div class="field"><label for="message">${options ? 'Tell us a little about how you would like to help' : 'Your message'}</label><textarea id="message" name="message" maxlength="2000" rows="5" required></textarea></div>
<div class="send"><button type="submit" class="button dark" value="whatsapp">${icons.chat}Send on WhatsApp</button><button type="submit" class="button ghost" value="sms">${icons.text}Send as a text</button></div>
<div class="status" role="status" aria-live="polite"></div>
<noscript><p class="fine">Sending needs JavaScript. You can call or text ${phone.intl} instead.</p></noscript></form>`;

page('involved', 'Get involved', 'Volunteer in Arizona, partner with The Tree of LIF, or host a food or clothing drive.',
  intro({label: 'Get involved', title: 'Volunteer, partner, or host a drive.', lede: 'Bring your time, your church or your organization to the work.', visual: medallion('singing', 'Volunteers sing and pray beside a seated patient in Cotonou')}) + `
<div class="wrap split-layout"><div class="ways">
<article class="way reveal"><h2>Volunteer in Arizona</h2><p>Help with food, clothing and practical support in the Maricopa community. Tell us what you can offer and when you are free, and the team will talk through current needs with you.</p></article>
<article class="way reveal"><h2>Partner with us</h2><p>We welcome conversations with churches, shelters, re-entry and recovery programs, hospitals and community organizations, in Arizona and in Benin.</p></article>
<article class="way reveal"><h2>Host a drive</h2><p>Gather your church, workplace or friends around a food or clothing drive. Talk to the team before you collect, so your drive meets a current need.</p></article>
<p class="call-line">Prefer to talk? <a class="phone-inline" href="tel:${phone.tel}">Call ${phone.display}</a></p>
</div>${messageForm({kind: 'Get involved', title: 'Introduce yourself', options: ['Volunteer in Arizona', 'Partner with the team', 'Host a drive']})}</div>`);

page('contact', 'Contact', `Call, text or WhatsApp The Tree of LIF on ${phone.intl}. Based in Maricopa, Arizona.`,
  intro({label: 'Contact', title: 'Call, text, or message us on WhatsApp.', lede: 'Questions about the work, a partnership, or support for someone you know? The team would be glad to hear from you.'}) + `
<div class="wrap split-layout"><div>
<ul class="routes">
<li><a href="tel:${phone.tel}">${icons.phone}<span><strong>Call</strong>${phone.intl}</span>${arrow}</a></li>
<li><a href="${waLink('Hello Tree of LIF,')}">${icons.chat}<span><strong>WhatsApp</strong>Message the team</span>${arrow}</a></li>
<li><a href="sms:${phone.tel}">${icons.text}<span><strong>Text message</strong>${phone.intl}</span>${arrow}</a></li>
<li><div>${icons.pin}<span><strong>Based in</strong>Maricopa, Arizona</span></div></li></ul>
<p class="fine">Our email address is being set up. If we miss your call, leave a message with your name and a safe way to reach you.</p>
${link('/help/', 'Looking for help in Arizona?')}</div>
${messageForm({kind: 'Contact', title: 'Write to the team'})}</div>`);

// ---------------------------------------------------------------- legal and states
const legal = (route, title, description, lede, sections) => page(route, title, description,
  intro({label: title, title: lede}) + `<div class="wrap reading">${sections.map(([h, p]) => `<h2>${h}</h2>${p}`).join('')}</div>`);

legal('privacy', 'Privacy', 'How The Tree of LIF website handles your information.', 'Your information deserves care.', [
  ['Last updated', '<p>October 10, 2026. This policy covers the preview website and must be reviewed before payments or form delivery are connected.</p>'],
  ['Messages you write', '<p>The contact and involvement forms do not send anything to our servers or store what you type. When you press send, the website opens WhatsApp or your phone’s text messages with your words filled in. Nothing is sent until you send it there. WhatsApp and your mobile carrier handle that message under their own privacy policies.</p>'],
  ['Giving', '<p>Online payments are not connected. The giving preview does not collect card details or process a charge.</p>'],
  ['Cookies and analytics', '<p>This website sets no analytics or marketing cookies. Our hosting provider may process technical request data, such as IP addresses, needed to serve the website. Links to other services, such as 988 or Arizona 211, have their own privacy policies.</p>'],
  ['Questions', `<p>Call <a href="tel:${phone.tel}">${phone.intl}</a> to ask the team about privacy.</p>`],
]);
legal('donation-terms', 'Donation terms', 'Donation status and terms for giving to The Tree of LIF.', 'Giving, clearly explained.', [
  ['Current status', '<p>Online checkout is not connected. Selecting an amount or reviewing a gift does not transfer money or create a monthly donation.</p>'],
  ['Tax status', `<p>${tax}</p>`],
  ['Gift choices', '<p>You can choose one-time or monthly support, directed to Arizona, Benin, or where it is needed most. Suggested amounts are examples. Specific costs and how designated gifts are allocated are being confirmed.</p>'],
  ['Before online giving opens', '<p>The team will publish how receipts are sent, how to request a refund, how to cancel a monthly gift, and how designated funds are used, before checkout is turned on.</p>'],
  ['Talk to us', `<p>Call <a href="tel:${phone.tel}">${phone.intl}</a> to discuss a gift with the team.</p>`],
]);

page('thank-you', 'Thank you (preview)', 'A preview of the donation confirmation page. No payment has been processed.',
  `<section class="thanks"><div class="wrap"><img src="/assets/medallion-208.webp" width="119" height="104" alt="">${eyebrow('Giving flow preview')}<h1>Thank you for caring.</h1><p class="lede">This is a design preview. A real confirmation and receipt will appear only after a payment is confirmed. No donation has been recorded.</p><div class="actions">${button('/stories/easter-cotonou/', 'Read about the work')}${link('/give/', 'Return to giving', 'text-link on-dark')}</div></div></section>`);

fs.writeFileSync(path.join(out, '404.html'), fs.readFileSync(path.join(out, 'thank-you/index.html'), 'utf8')
  .replace(/<title>[^<]*<\/title>/, '<title>Page not found · The Tree of LIF</title>')
  .replace(/<section class="thanks">[\s\S]*<\/section>/, `<section class="thanks"><div class="wrap"><img src="/assets/medallion-208.webp" width="119" height="104" alt="">${eyebrow('Page not found')}<h1>This path has no page.</h1><p class="lede">The page may have moved. Here are the places most people are looking for.</p><div class="actions">${button('/', 'Go to the home page')}${link('/help/', 'Get help in Arizona', 'text-link on-dark')}</div></div></section>`));

// ---------------------------------------------------------------- brand assets
fs.writeFileSync(`${out}/assets/mark.svg`, markSvg());
fs.writeFileSync(`${out}/assets/mark-one-color.svg`, markSvg({mono: true}).replace('<svg ', '<svg color="#102d27" '));
fs.writeFileSync(`${out}/assets/tree-full.svg`, treeSvg({label: false}));
fs.writeFileSync(`${out}/assets/tree-one-color.svg`, treeSvg({mono: true, label: false}).replace('<svg ', '<svg color="#102d27" '));
fs.writeFileSync(`${out}/assets/knot.svg`, knotSvg());
fs.writeFileSync(`${out}/assets/knot-footer.svg`, knotSvg({ink: '#3f6152', casing: '#0c2420', width: 2.4}));
const lockupTree = treeSvg({label: false}).replace('<svg class="tree-art " ', '<svg x="60" y="40" width="480" height="448" ');
fs.writeFileSync(`${out}/assets/logo-lockup.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680"><rect width="600" height="680" fill="#102d27"/>${lockupTree}<text x="300" y="560" text-anchor="middle" fill="${GOLD}" font-family="Gloock, Georgia, serif" font-size="52">The Tree of LIF</text><text x="300" y="604" text-anchor="middle" fill="#b7caa2" font-family="Hanken, Arial, sans-serif" font-size="17" letter-spacing="4">MARICOPA, ARIZONA · COTONOU, BENIN</text></svg>`);

// Social card source. Rendered to dist/og.png by collateral.mjs; not deployed.
fs.mkdirSync('collateral', {recursive: true});
fs.writeFileSync('collateral/og.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/styles.css"><style>body{width:1200px;height:630px;overflow:hidden;background:var(--night)}.og{display:grid;grid-template-columns:1.15fr 1fr;align-items:center;gap:20px;height:630px;padding:0 64px 0 80px;color:var(--on-night)}.og h1{font-size:76px;line-height:1.02;margin:28px 0 26px;color:#f6f3e8}.og .brand-word{font-size:28px}.og .brand img{width:56px;height:56px}.og p{font-size:22px;color:var(--leaf);letter-spacing:.02em}.og-logo{width:100%;max-width:470px;justify-self:center}</style></head><body><div class="og"><div>${brand}<h1>From Maricopa to Cotonou, we show up in person.</h1><p>A faith-rooted nonprofit · Maricopa, Arizona · Cotonou, Benin</p></div><img class="og-logo" src="/assets/logo-original.webp" alt=""></div></body></html>`);

console.log(`Built ${10 + stories.length} pages and a 404 in ${out}/`);
