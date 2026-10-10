// Generates the vector Tree of LIF artwork from the supplied raster logo's elements:
// a broad tree inside a gold ring, crescent moon and stars, and roots woven into a knot.
// Deterministic: the same seed always produces the same drawing.

export const GOLD = '#e0bf78';
const BARK = '#c9a862', NIGHT = '#102d27';
const LEAVES = [['#2c5543', '#3a6650'], ['#6f9264', '#8aa877'], ['#b9c99a', '#e0bf78']];
const n0 = v => Math.round(v);

function random(seed) {
  return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
}

// A tapered limb along a quadratic curve, as one closed outline.
function limb(x0, y0, cx, cy, x1, y1, w0, w1, steps = 5) {
  const left = [], right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, mt = 1 - t;
    const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
    const dx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
    const len = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
    left.push([x - dy / len * w, y + dx / len * w]);
    right.push([x + dy / len * w, y - dx / len * w]);
  }
  return 'M' + [...left, ...right.reverse()].map(([x, y]) => `${n0(x)} ${n0(y)}`).join(' ') + 'Z';
}

function growTree(rand, scale = 1) {
  const limbs = [], tips = [];
  function grow(x, y, angle, length, width, depth) {
    const bend = (rand() - 0.5) * 0.45;
    const ex = x + Math.cos(angle) * length, ey = y + Math.sin(angle) * length;
    const mx = x + Math.cos(angle + bend) * length * 0.55, my = y + Math.sin(angle + bend) * length * 0.55;
    const endWidth = Math.max(width * 0.64, 1.2);
    limbs.push(limb(x, y, mx, my, ex, ey, width, endWidth));
    if (depth <= 1) tips.push([ex, ey]);
    if (depth <= 2) tips.push([mx, my]);
    if (depth === 0) return;
    for (let k = 0; k < 2; k++) {
      const spread = (k - 0.5) * (0.78 + rand() * 0.4);
      // Pull growth slightly upward so the crown reads as a broad, rounded oak.
      const a = (angle + spread + (rand() - 0.5) * 0.2) * 0.88 + (-Math.PI / 2) * 0.12;
      grow(ex, ey, a, length * (0.72 + rand() * 0.08), endWidth, depth - 1);
    }
  }
  // Trunk drawn as one outline that flares into the roots.
  limbs.push('M287 318C285 360 286 396 276 416C268 430 252 436 236 440L364 440C348 436 332 430 324 416C314 396 315 360 313 318Z');
  const mains = [[-2.66, 70, 12], [-2.34, 84, 14], [-1.93, 92, 14], [-1.22, 92, 14], [-0.8, 84, 14], [-0.48, 70, 12]];
  for (const [a, len, w] of mains) grow(300 + Math.cos(a) * 5, 324, a, len * scale, w, 4);
  return {limbs, tips};
}

function canopy(rand, tips, mono) {
  // Three depth layers, back to front, clustered on branch tips.
  const layers = [[], [], []];
  const mass = [];
  for (const [x, y] of tips) {
    if (rand() > 0.45 && Math.hypot((x - 300) / 205, (y - 196) / 136) < 1) mass.push(`<circle cx="${n0(x)}" cy="${n0(y)}" r="${n0(20 + rand() * 10)}"/>`);
    const count = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 28;
      const lx = x + Math.cos(a) * d, ly = y + Math.sin(a) * d - 3;
      if (Math.hypot((lx - 300) / 232, (ly - 194) / 152) > 1) continue;
      const layer = ly < 130 || rand() > 0.62 ? 2 : rand() > 0.4 ? 1 : 0;
      layers[layer].push(`<use href="#tl" transform="translate(${n0(lx)} ${n0(ly)})rotate(${n0(rand() * 360)})scale(${(1 + rand() * 0.3).toFixed(1)})"/>`);
    }
  }
  const groups = layers.map((items, i) => {
    const [a, b] = mono ? ['currentColor', 'currentColor'] : LEAVES[i];
    const op = mono ? ` opacity="${0.45 + i * 0.25}"` : '';
    return `<g class="leaves leaves-${i}" fill="${a}"${op}>${items.filter((_, j) => j % 2).join('')}</g><g class="leaves leaves-${i}" fill="${b}"${op}>${items.filter((_, j) => !(j % 2)).join('')}</g>`;
  });
  return {back: `<g class="mass" fill="${mono ? 'currentColor' : '#173e33'}" opacity="${mono ? 0.15 : 1}">${mass.join('')}</g>${groups[0]}${groups[1]}`, front: groups[2]};
}

// A Celtic plait is a billiard path: straight strands at 45° that turn at the
// edges. Alternating over and under at each crossing makes it read as woven.
export function knot({cx = 300, cy = 480, ax = 130, ay = 52, nx = 2, ny = 5, phase = Math.PI / 5, samples = 1000, round = 0.94, precision = 2} = {}) {
  const tri = u => Math.asin(round * Math.sin(u)) / Math.asin(round);
  const pts = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    pts.push([cx + ax * tri(nx * t + phase), cy + ay * tri(ny * t)]);
  }
  const n = pts.length, hits = [];
  const crosses = (p, q, r, s) => {
    const d = (q[0] - p[0]) * (s[1] - r[1]) - (q[1] - p[1]) * (s[0] - r[0]);
    if (Math.abs(d) < 1e-9) return false;
    const u = ((r[0] - p[0]) * (s[1] - r[1]) - (r[1] - p[1]) * (s[0] - r[0])) / d;
    const v = ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / d;
    return u >= 0 && u < 1 && v >= 0 && v < 1;
  };
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue;
    if (crosses(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) hits.push([i, j]);
  }
  const visits = hits.flatMap(([i, j]) => [i, j]).sort((a, b) => a - b);
  const over = visits.filter((_, order) => order % 2 === 0);
  const fmt = list => 'M' + list.map(([x, y]) => `${Math.round(x * precision) / precision} ${Math.round(y * precision) / precision}`).join(' ');
  // Thin the main path; the curve is smooth enough at a quarter of the samples.
  const full = fmt(pts.filter((_, i) => i % 4 === 0)) + 'Z';
  const span = Math.max(4, Math.round(0.24 * n / (2 * hits.length)));
  const piece = (index, half) => fmt(Array.from({length: half * 2 + 1}, (_, s) => pts[(index - half + s + n) % n]));
  // The casing is shorter than the gold so its round caps never notch the strand.
  const patches = over.map(index => ({casing: piece(index, Math.round(span * 0.55)), ink: piece(index, span)}));
  return {full, patches};
}

function sky(mono) {
  const c = mono ? 'currentColor' : GOLD;
  return `<g class="sky" fill="${c}"><path d="M118 300a32 32 0 1 0 40 42a36 36 0 0 1-40-42Z"/><path d="M470 296l4.5 13 13 4.5-13 4.5-4.5 13-4.5-13-13-4.5 13-4.5Z"/><path d="M444 344l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><path d="M494 362l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="178" cy="336" r="2.2"/><circle cx="432" cy="270" r="1.8"/><circle cx="146" cy="262" r="1.5"/><circle cx="512" cy="318" r="1.4"/></g>`;
}

const band = (d, ink, casing, w = 4.4, attrs = '') => `<path${attrs} d="${d}" stroke="${casing}" stroke-width="${w + 4}"/><path${attrs} d="${d}" stroke="${ink}" stroke-width="${w}"/>`;
const patch = (p, ink, casing, w = 4.4) => `<path d="${p.casing}" stroke="${casing}" stroke-width="${w + 4}"/><path d="${p.ink}" stroke="${ink}" stroke-width="${w}"/>`;

function parts({mono = false} = {}) {
  const rand = random(29);
  const {limbs, tips} = growTree(rand);
  const crown = canopy(rand, tips, mono);
  const k = knot();
  const ink = mono ? 'currentColor' : GOLD, bark = mono ? 'currentColor' : BARK, casing = mono ? '#fff' : NIGHT;
  // Side roots leave the knot and run out toward the two places, ending in curls.
  const tendrils = [
    'M172 470C140 470 112 474 90 486C68 498 50 494 46 478C43 465 55 458 64 465',
    'M428 470C460 470 488 474 510 486C532 498 550 494 554 478C557 465 545 458 536 465',
    'M240 430C214 424 186 428 160 440', 'M360 430C386 424 414 428 440 440',
  ];
  return {
    tips,
    defs: '<defs><path id="tl" d="M-11 0C-5-6.5 6-6.5 12 0C6 6.5-5 6.5-11 0Z"/></defs>',
    ring: `<g class="ring" fill="none" stroke="${ink}"><circle cx="300" cy="276" r="262" stroke-width="1.2" opacity=".5"/><circle cx="300" cy="276" r="252" stroke-width=".7" opacity=".28"/></g>`,
    sky: sky(mono),
    back: crown.back,
    trunk: `<path class="trunk" fill="${bark}" d="${limbs.join('')}"/>`,
    front: crown.front,
    roots: `<g class="roots" fill="none" stroke-linecap="round" stroke-linejoin="round">${tendrils.map(d => `<path class="tendril" pathLength="1" d="${d}" stroke="${ink}" stroke-width="3"/>`).join('')}${band(k.full, ink, casing, 4.4, ' class="knot" pathLength="1"')}<g class="weave">${k.patches.map(p => patch(p, ink, casing)).join('')}</g></g>`,
  };
}

const LABEL = 'A gold tree inside a ring, with a crescent moon, stars and roots woven into a knot';

export function treeSvg({mono = false, label = true, className = ''} = {}) {
  const t = parts({mono});
  return `<svg class="tree-art ${className}" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${LABEL}"` : 'aria-hidden="true"'}>${t.defs}${t.ring}${t.sky}<g class="crown">${t.back}${t.trunk}${t.front}</g>${t.roots}</svg>`;
}

// The hero tree: four stacked layers so the browser can move whole layers
// cheaply. Back and front crowns sway; the life layer holds blossoms and
// falling leaves.
export function heroTree() {
  const t = parts();
  const svg = (cls, body) => `<svg class="layer ${cls}" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${t.defs}${body}</svg>`;
  const inCrown = ([x, y]) => Math.hypot((x - 300) / 215, (y - 190) / 140) < 1;
  const blooms = t.tips.filter(inCrown).filter((_, i) => i % 6 === 0).slice(0, 48)
    .map(([x, y], i) => `<g transform="translate(${Math.round(x)} ${Math.round(y)})"><use class="bloom" href="#fl" style="--d:${(3.2 + (i * 1.37) % 9).toFixed(2)}s"/></g>`).join('');
  const falls = [[150, 210], [420, 180], [260, 120], [470, 260], [210, 290], [360, 230], [110, 260], [500, 200], [300, 160]]
    .map(([x, y], i) => `<g transform="translate(${x} ${y})"><use class="fall" href="#tl" style="--d:${(3.5 + i * 1.6).toFixed(1)}s;--x:${i % 2 ? 46 : -40}px"/></g>`).join('');
  const flower = '<g id="fl"><g fill="#f6eedb">' + [0, 72, 144, 216, 288].map(a => `<ellipse rx="4.4" ry="2.8" cx="4.2" transform="rotate(${a})"/>`).join('') + '</g><circle r="2.4" fill="#e0bf78"/></g>';
  return `<div class="tree-stage" role="img" aria-label="${LABEL}, with blossoms">
${svg('l-base', `${t.ring}${t.sky}${t.roots}`)}
${svg('l-back', `<g class="crown">${t.back}${t.trunk}</g>`)}
${svg('l-front', `<g class="crown">${t.front}</g>`)}
${svg('l-life', `<defs>${flower}</defs><g class="blooms">${blooms}</g><g class="falls" fill="#b9c99a">${falls}</g>`)}
</div>`;
}

// Simplified mark for the header, favicon and social card: ring, crown, trunk, knot.
export function markSvg({mono = false, ground = null} = {}) {
  const c = mono ? 'currentColor' : GOLD;
  const casing = ground || NIGHT;
  const crown = [[32, 22, 10.5], [21.5, 26, 8], [42.5, 26, 8], [25, 17, 7.5], [39, 17, 7.5], [32, 13, 7], [15.5, 31, 5.5], [48.5, 31, 5.5]];
  const k = knot({cx: 32, cy: 48.5, ax: 13, ay: 5.2, nx: 1, ny: 3, phase: Math.PI / 6, samples: 400, precision: 100});
  const kb = d => `<path d="${d}" stroke="${casing}" stroke-width="3.6"/><path d="${d}" stroke="${c}" stroke-width="1.7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${ground ? `<rect width="64" height="64" fill="${ground}"/>` : ''}<circle cx="32" cy="32" r="30" fill="none" stroke="${c}" stroke-width="1.8"/><g fill="${c}">${crown.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M32 33C31.5 28 29 25.5 24.5 22.5M32 33C32.5 28 35 25 39.5 21.5M28.6 25.6C27.5 22 27.8 19.5 29 16.5M35.6 24.6C36.6 21.5 36.4 18.5 35 16M25.5 23.2C22.5 22.8 20 24 18 26.5M38.6 22.3C41.5 22.2 44 23.5 46 26" fill="none" stroke="${casing}" stroke-width="1.4" stroke-linecap="round"/><path fill="${c}" d="M30.2 31c.2 4.6-.1 8.6-1.6 11.4-.7 1.2-2 1.9-3.4 2.3h13.6c-1.4-.4-2.7-1.1-3.4-2.3-1.5-2.8-1.8-6.8-1.6-11.4Z"/><g fill="none" stroke-linecap="round">${kb(k.full)}${k.patches.map(p => `<path d="${p.casing}" stroke="${casing}" stroke-width="3.6"/><path d="${p.ink}" stroke="${c}" stroke-width="1.7"/>`).join('')}</g></svg>`;
}

// The plait alone, for dividers and interior headers. `casing` matches the ground.
export function knotSvg({ink = GOLD, casing = NIGHT, width = 3.2} = {}) {
  const k = knot({cx: 160, cy: 40, ax: 150, ay: 30, nx: 3, ny: 5, phase: Math.PI / 10});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" aria-hidden="true"><g fill="none" stroke-linecap="round">${band(k.full, ink, casing, width)}${k.patches.map(p => patch(p, ink, casing, width)).join('')}</g></svg>`;
}
