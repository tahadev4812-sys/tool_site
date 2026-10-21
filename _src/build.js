#!/usr/bin/env node
/**
 * Static site generator for the calculator site.
 *   node _src/build.js
 * Edit SITE below to rename the brand / domain everywhere, then re-run.
 * Output is plain HTML files (clean folder URLs) — nothing here runs on the live site.
 */
const fs = require('fs');
const path = require('path');

/* ============ ONE CONFIG SPOT ============ */
const SITE = {
  name: 'CalcNest',                  // brand name (split on the capital letter for the two-tone logo)
  domain: 'https://calcnest.com',   // final domain, no trailing slash
  email: 'hello@calcnest.com',      // placeholder contact email
  tagline: 'Free online calculators for home, hobby, pets and everyday life',
  year: new Date().getFullYear(),
};
/* ========================================= */

const OUT = path.join(__dirname, '..');
const CATS = {
  craft: { label: 'Craft & Making', blurb: 'Resin, yarn, candles and quilting' },
  home: { label: 'Home & DIY', blurb: 'Paint, tile and concrete' },
  pets: { label: 'Pets', blurb: 'Feeding, safety and age tools' },
  everyday: { label: 'Everyday', blurb: 'Percentages, tips, discounts and BMI' },
  image: { label: 'Image Tools', blurb: 'Convert, compress, resize and read text from images' },
};
const tools = [...require('./tools-craft'), ...require('./tools-more'), ...require('./tools-phase2'), ...require('./tools-phase3'), ...require('./tools-image')];
const bySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const [nameA, nameB] = SITE.name.replace(/([a-z])([A-Z])/, '$1|$2').split('|');
const logoHtml = (r) => `<a class="logo" href="${r}" aria-label="${esc(SITE.name)} home"><span class="logo-mark" aria-hidden="true">${esc(SITE.name[0])}</span><span class="logo-text">${esc(nameA)}${nameB ? `<span>${esc(nameB)}</span>` : ''}</span></a>`;
const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#c2552d"/><text x="32" y="45" font-family="Georgia,serif" font-size="38" font-weight="700" fill="#fff" text-anchor="middle">${SITE.name[0]}</text></svg>`)}`;

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

/* ---------- shared chrome ---------- */
function head({ title, desc, url, root, ld = [], type = 'website', noindex = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta name="theme-color" content="#faf7f2">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${favicon}">
<link rel="stylesheet" href="${root}style.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>`;
}

function header(root, current = '') {
  const a = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap wrap--wide">
${logoHtml(root)}
<button class="menu-btn" aria-label="Menu" aria-expanded="false"><span></span></button>
<nav class="nav" aria-label="Main">
${a(root, 'Home', 'home')}
${a(root + '#calculators', 'All Tools', 'all')}
${a(root + 'about/', 'About', 'about')}
<a class="nav-cta" href="${root}#calculators">Browse tools</a>
</nav>
</div></header>`;
}

function footer(root) {
  const top = tools.slice(0, 6).map((t) => `<li><a href="${root}${t.slug}/">${esc(t.h1)}</a></li>`).join('');
  return `<footer class="site-footer"><div class="wrap wrap--wide">
<div class="foot-grid">
<div>${logoHtml(root)}<p>${esc(SITE.tagline)}. Fast, private, and free — every calculation runs in your browser.</p></div>
<div><h4>Popular tools</h4><ul>${top}</ul></div>
<div><h4>${esc(SITE.name)}</h4><ul>
<li><a href="${root}about/">About</a></li>
<li><a href="${root}contact/">Contact</a></li>
<li><a href="${root}privacy-policy/">Privacy Policy</a></li>
<li><a href="${root}terms/">Terms of Use</a></li></ul></div>
</div>
<div class="copy"><span>© ${SITE.year} ${esc(SITE.name)}. All rights reserved.</span><span>Results are estimates — always double-check before you buy or pour.</span></div>
</div></footer>
<script src="${root}main.js" defer></script>`;
}

/* ---------- form fields ---------- */
function unitSpan(u, firstUnit) {
  if (!u) return '';
  if (typeof u === 'string') return `<span class="unit">${esc(u)}</span>`;
  return `<span class="unit" ${Object.entries(u).map(([k, v]) => `data-u-${k}="${esc(v)}"`).join(' ')}>${esc(u[firstUnit])}</span>`;
}

function fieldHtml(f, firstUnit) {
  const id = 'f-' + f.name;
  const attrs = [f.full ? 'full' : '', ''].join(' ').trim();
  const show = f.showIf ? ` data-show-if="${f.showIf}"` : '';
  let control;
  if (f.type === 'select') {
    control = `<select id="${id}" name="${f.name}"${f.targets ? ` data-targets="${f.targets}"` : ''}>${f.options
      .map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(f.value) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  } else {
    const def = f.defaults ? Object.entries(f.defaults).map(([k, v]) => ` data-default-${k}="${v}"`).join('') : '';
    const value = f.defaults ? f.defaults[firstUnit] : f.value;
    control = `<div class="input-wrap"><input id="${id}" name="${f.name}" type="number" inputmode="decimal" step="${f.step || 'any'}" min="0"` +
      ` value="${value === undefined ? '' : value}" placeholder="${esc(f.placeholder || '')}" data-label="${esc(f.label)}"` +
      `${f.required === false ? '' : ' required'}${f.positive === false ? '' : ' data-positive'}` +
      `${f.min !== undefined ? ` data-min="${f.min}"` : ''}${f.max !== undefined ? ` data-max="${f.max}"` : ''}${def}` +
      `${f.unit ? ' class="has-unit"' : ''}>${unitSpan(f.unit, firstUnit)}</div>`;
  }
  return `<div class="field${f.full ? ' full' : ''}"${show}><label for="${id}">${esc(f.label)}</label>${control}` +
    `${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}<p class="field-error" role="alert" hidden></p></div>`;
}

/* ---------- tool page ---------- */
function toolPage(t) {
  const root = '../';
  const url = `${SITE.domain}/${t.slug}/`;
  const title = `${t.title} | ${SITE.name}`;
  const firstUnit = t.units ? t.units[0][0] : null;
  const unitsField = t.units
    ? fieldHtml({ name: 'units', type: 'select', label: t.unitsLabel || 'Units', options: t.units, value: firstUnit }, firstUnit)
    : '';
  const fields = unitsField + (t.fields || []).map((f) => fieldHtml(f, firstUnit)).join('\n');
  const faqs = t.faqs;
  const related = t.related.map((s) => bySlug[s]).filter(Boolean);

  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'WebApplication', name: t.h1, url,
      description: t.description, applicationCategory: t.appCategory || 'UtilitiesApplication', operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript', inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.domain + '/' },
        { '@type': 'ListItem', position: 2, name: CATS[t.cat].label, item: SITE.domain + '/#calculators' },
        { '@type': 'ListItem', position: 3, name: t.h1, item: url },
      ],
    },
  ];

  const extra = (t.sections || []).map((s) => `<h2>${s.h2}</h2>\n${s.html}`).join('\n');
  const body = `
<main id="main">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Home</a><span>/</span><a href="${root}#calculators">${esc(CATS[t.cat].label)}</a><span>/</span>${esc(t.h1)}</nav>
<div class="page-head"><h1>${esc(t.h1)}</h1><p class="intro">${t.intro}</p></div>

${t.app ? `<section class="calc" aria-label="${esc(t.h1)}">
<div id="img-app" data-mode="${t.app.mode}" data-format="${t.app.format || ''}" data-accept="${t.app.accept || 'image/*'}"></div>
<noscript><p class="form-error">This tool needs JavaScript enabled.</p></noscript>
</section>` : `<section class="calc" aria-label="${esc(t.h1)}">
<form id="calc-form" novalidate>
<div class="fields">
${fields}
</div>
<p class="form-error" id="form-error" role="alert" hidden></p>
<div class="actions"><button class="btn" type="submit">${esc(t.button || 'Calculate')}</button><button class="btn btn-ghost" type="reset">Reset</button></div>
</form>
<div class="result" id="result" aria-live="polite" hidden></div>
</section>`}

<div class="ad-slot"></div>

<article class="article">
<h2>How to use this ${esc(t.noun || 'calculator')}</h2>
<ol>${t.steps.map((s) => `<li>${s}</li>`).join('')}</ol>

<h2>${t.formula.title || 'The formula'}</h2>
<div class="formula" tabindex="0">${t.formula.code}</div>
<div class="example"><b>${t.formula.label || 'Worked example'}</b>${t.formula.example}</div>

<div class="ad-slot"></div>

<h2>${esc(t.table.title)}</h2>
<div class="table-wrap"><table><thead><tr>${t.table.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>${t.table.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
${t.table.note ? `<p class="table-note">${t.table.note}</p>` : ''}

${extra}

<h2>Frequently asked questions</h2>
${faqs.map(([q, a]) => `<details><summary>${q}</summary><div class="answer"><p>${a}</p></div></details>`).join('\n')}

<h2>Related ${t.app ? 'tools' : 'calculators'}</h2>
<div class="related">${related.map((r) => `<a href="${root}${r.slug}/"><span class="ri" aria-hidden="true">${r.icon}</span>${esc(r.h1)}</a>`).join('')}</div>
</article>
</div>
</main>`;

  return head({ title, desc: t.description, url, root, ld }) + '\n' + header(root, '') + body + '\n' + footer(root) +
    (t.app ? `\n<script src="${root}${t.app.script || 'img.js'}" defer></script>\n</body>\n</html>\n` : `\n<script>window.addEventListener('DOMContentLoaded',function(){MM.calc(${t.compute.toString()});});</script>\n</body>\n</html>\n`);
}

/* ---------- home ---------- */
function homePage() {
  const root = './';
  const url = SITE.domain + '/';
  const title = `${SITE.name} – Free Calculators & Online Image Tools`;
  const desc = `Free online calculators and image tools: paint, flooring, concrete, pet feeding, BMI, plus image converter, compressor, resizer and image to text.`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url, inLanguage: 'en' },
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, url, email: SITE.email },
  ];
  const cards = tools.map((t) => `<a class="tool" href="${t.slug}/" data-cat="${t.cat}" data-name="${esc((t.h1 + ' ' + t.keywords).toLowerCase())}">
<span class="tool-icon" aria-hidden="true">${t.icon}</span>
<h3>${esc(t.h1)}</h3><p>${esc(t.card)}</p><span class="tool-go">Open tool</span></a>`).join('\n');
  const chips = `<button class="chip active" data-cat="all" aria-pressed="true">All tools</button>` +
    Object.entries(CATS).map(([k, c]) => `<button class="chip" data-cat="${k}" aria-pressed="false">${c.label}</button>`).join('');
  const body = `
<main id="main">
<section class="hero"><div class="wrap">
<p class="eyebrow">Free · Fast · Private</p>
<h1>Free calculators &amp; tools for every <em>project</em>, pet &amp; everyday task</h1>
<p class="lead">From paint and flooring to pet feeding, BMI and image converters — get a clear answer in seconds. No sign-up, and your files never leave your device.</p>
<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
<input id="tool-search" type="search" placeholder="Search tools… e.g. paint, BMI, image converter" aria-label="Search tools" autocomplete="off"></div>
<div class="stats"><div><b>${tools.length}</b>free tools</div><div><b>100%</b>free to use</div><div><b>0</b>sign-ups needed</div></div>
</div></section>

<section class="section" id="calculators"><div class="wrap wrap--wide">
<div class="section-head"><h2>All tools</h2><div class="chips" role="group" aria-label="Filter by category">${chips}</div></div>
<div class="grid">
${cards}
</div>
<p class="no-results" id="no-results" hidden>No tools match your search — try a different word.</p>
</div></section>

<div class="wrap wrap--wide"><div class="ad-slot"></div></div>

<section class="section"><div class="wrap wrap--wide">
<div class="section-head"><h2>Why ${esc(SITE.name)}?</h2></div>
<div class="features">
<div class="feature"><div class="dot">✦</div><h3>Built on real formulas</h3><p>Every tool shows the exact formula and a worked example, so you can verify the result yourself.</p></div>
<div class="feature"><div class="dot">⚡</div><h3>Instant &amp; private</h3><p>Calculations run in your browser. We never see, store or send the numbers you enter.</p></div>
<div class="feature"><div class="dot">▢</div><h3>Made for every screen</h3><p>Large inputs, clear results and imperial or metric units — comfortable in the workshop or on the sofa.</p></div>
</div>
</div></section>
</main>`;
  return head({ title, desc, url, root, ld }) + '\n' + header(root, 'home') + body + '\n' + footer(root) + '\n</body>\n</html>\n';
}

/* ---------- static pages ---------- */
function staticPage({ slug, title, h1, desc, html, key }) {
  const root = '../';
  const url = `${SITE.domain}/${slug}/`;
  return head({ title: `${title} | ${SITE.name}`, desc, url, root }) + '\n' + header(root, key) +
    `\n<main id="main"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Home</a><span>/</span>${esc(h1)}</nav>
<div class="page-head"><h1>${esc(h1)}</h1></div><div class="prose">${html}</div></div></main>\n` + footer(root) + '\n</body>\n</html>\n';
}

function notFound() {
  const root = '/';
  const list = tools.map((t) => `<a href="/${t.slug}/"><span class="ri" aria-hidden="true">${t.icon}</span>${esc(t.h1)}</a>`).join('');
  return head({ title: `Page not found | ${SITE.name}`, desc: 'The page you are looking for could not be found. Try one of our free calculators instead.', url: SITE.domain + '/404.html', root, noindex: true }) + '\n' + header(root) +
    `\n<main id="main"><div class="wrap"><div class="notfound"><div class="big">404</div><h1>We couldn't find that page</h1>
<p class="intro" style="color:var(--muted)">The link may be old or mistyped. Try one of these calculators instead:</p></div>
<div class="related" style="margin-top:28px">${list}</div></div></main>\n` + footer(root) + '\n</body>\n</html>\n';
}

/* ---------- run ---------- */
const pages = require('./pages')(SITE);
tools.forEach((t) => {
  const d = t.description.length;
  if (d < 130 || d > 160) console.warn(`  ! meta description ${d} chars: ${t.slug}`);
  write(`${t.slug}/index.html`, toolPage(t));
});
write('index.html', homePage());
pages.forEach((p) => write(`${p.slug}/index.html`, staticPage(p)));
write('404.html', notFound());

const urls = [['', '1.0'], ...tools.map((t) => [t.slug + '/', '0.9']), ...pages.map((p) => [p.slug + '/', '0.4'])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p]) => `  <url><loc>${SITE.domain}/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n') + '\n</urlset>\n');
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /_src/\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
console.log(`Built ${tools.length} calculators, ${pages.length} info pages, 404, sitemap, robots.`);
