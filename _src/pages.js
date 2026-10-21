/* Required info pages (About, Contact, Privacy Policy, Terms). Replace placeholders marked [..] before launch. */
module.exports = (SITE) => {
  const N = SITE.name, E = SITE.email, D = SITE.domain.replace('https://', '');
  const updated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return [
    {
      slug: 'about', key: 'about', h1: `About ${N}`, title: `About Us`,
      desc: `${N} builds free, accurate online calculators for home projects, hobbies, pets and everyday questions, with clear formulas, worked examples and honest estimates.`,
      html: `
<p class="lead" style="font-size:20px;color:var(--muted)">${N} is a growing library of free calculators that take the guesswork out of home projects, hobbies, pet care and everyday decisions.</p>
<h2>Why these calculators exist</h2>
<p>Anyone who has poured too little epoxy, run out of yarn one row from the end of a blanket, or bought three cans of paint too many knows how frustrating a bad estimate is. Most online calculators are cluttered, hide their maths, or simply give an answer without explaining it.</p>
<p>${N} was created to fix that. Every tool is designed to be fast on a phone, clear about its assumptions, and open about its formula, so you can check the numbers and adjust them for your own project.</p>
<h2>What you can expect</h2>
<ul>
<li><strong>Transparent formulas.</strong> Each page shows the exact equation and a worked example.</li>
<li><strong>Private by design.</strong> Calculations run in your browser; the numbers you enter are never sent to our servers.</li>
<li><strong>Imperial and metric.</strong> Made for readers in the US, UK, Canada and Australia.</li>
<li><strong>Honest limits.</strong> Results are estimates, and we say when a product label or a professional should have the final word.</li>
</ul>
<h2>Who runs ${N}</h2>
<p>${N} is an independent project run by a small team of developers and hobbyists. [Add a short personal introduction here: your name, your craft or DIY background, and why you started the site.] We test every calculator against hand-worked examples before it goes live.</p>
<h2>Get in touch</h2>
<p>Have a suggestion for a new calculator, or found a number that looks wrong? We’d love to hear from you — visit our <a href="../contact/">contact page</a>.</p>`
    },
    {
      slug: 'contact', key: 'contact', h1: 'Contact Us', title: 'Contact',
      desc: `Contact the ${N} team with questions, corrections or ideas for new calculators. We read every message and reply as quickly as we can.`,
      html: `
<p>We’d love to hear from you. Whether you’ve found an error, want a calculator added or have a question about advertising or partnerships, send us an email.</p>
<h2>Email</h2>
<p><a href="mailto:${E}">${E}</a></p>
<h2>What to include</h2>
<ul>
<li>The name of the calculator and the values you entered, if you’re reporting a result that looks wrong.</li>
<li>The device and browser you’re using, if the page does not display properly.</li>
<li>Details of the calculator you’d like us to build and the project you’re working on.</li>
</ul>
<p>We usually reply within a few working days. We can’t give personal veterinary, structural or medical advice — for those, please contact a qualified professional.</p>`
    },
    {
      slug: 'privacy-policy', key: 'privacy', h1: 'Privacy Policy', title: 'Privacy Policy',
      desc: `How ${N} collects and uses data, including cookies, Google Analytics and Google AdSense advertising, and the choices you have to control your privacy.`,
      html: `
<p class="meta">Last updated: ${updated}</p>
<p>This Privacy Policy explains what information ${N} (“we”, “us”, “${D}”) collects when you use our website, how we use it, and the choices you have. By using the site you agree to this policy.</p>

<h2>Information you enter in calculators</h2>
<p>All calculations run locally in your browser. The numbers you type into our calculators are not transmitted to or stored on our servers.</p>

<h2>Image tools</h2>
<p>Our image tools (converter, compressor, resizer and image-to-text) process your files locally in your browser. Your images are not uploaded to or stored on our servers. The image-to-text tool downloads an open-source text-recognition engine and language data from the jsDelivr content delivery network and Tesseract language servers; those providers may receive your IP address, but not your image.</p>

<h2>Information we collect automatically</h2>
<p>Like most websites, we and our partners may collect technical information such as your IP address, browser type, device, pages visited, time spent and referring website. This data is used to operate, secure and improve the site.</p>

<h2>Cookies</h2>
<p>Cookies are small files stored on your device. We and third parties use cookies and similar technologies to remember preferences, measure traffic and show advertising. You can block or delete cookies in your browser settings, though some features may not work as well.</p>

<h2>Google Analytics</h2>
<p>We may use Google Analytics to understand how visitors use the site. Google Analytics uses cookies to collect information such as pages viewed and approximate location, and sends it to Google. You can opt out with the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google Analytics opt-out browser add-on</a>.</p>

<h2>Advertising and Google AdSense</h2>
<p>We may display ads served by Google AdSense and other third-party advertising partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.</p>
<p>You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" rel="noopener">Google Ads Settings</a>, or opt out of some third-party vendors’ use of cookies by visiting <a href="https://www.aboutads.info" rel="noopener">aboutads.info</a>. Visitors in the UK and EU can also use <a href="https://www.youronlinechoices.com" rel="noopener">youronlinechoices.com</a>. Learn how Google uses data at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>

<h2>Affiliate links</h2>
<p>Some pages may contain affiliate links. If you buy through them we may earn a commission at no extra cost to you.</p>

<h2>Your rights</h2>
<p>Depending on where you live (for example, the UK and EU under GDPR, California under the CCPA, Canada under PIPEDA, or Australia under the Privacy Act) you may have the right to access, correct, delete or restrict the use of your personal data, or to object to its processing. To make a request, email <a href="mailto:${E}">${E}</a>.</p>

<h2>Children’s privacy</h2>
<p>${N} is not directed at children under 13 and we do not knowingly collect their personal information.</p>

<h2>Third-party links</h2>
<p>Our site may link to other websites. We are not responsible for their privacy practices; please review their policies.</p>

<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. Changes take effect when posted on this page, with the date above updated.</p>

<h2>Contact</h2>
<p>Questions about this policy? Email <a href="mailto:${E}">${E}</a>.</p>`
    },
    {
      slug: 'terms', key: 'terms', h1: 'Terms of Use', title: 'Terms of Use',
      desc: `The terms for using ${N}: our calculators provide estimates only, with no guarantee of accuracy, and you are responsible for how you use the results.`,
      html: `
<p class="meta">Last updated: ${updated}</p>
<p>By accessing or using ${N} (“the site”), you agree to these Terms of Use. If you do not agree, please do not use the site.</p>

<h2>Calculators provide estimates only</h2>
<p>The calculators and information on this site are provided for general guidance. Results are estimates based on standard formulas and assumptions. Real-world conditions — materials, temperature, technique, product formulation and waste — will vary. Always check manufacturer instructions, allow a safety margin, and verify critical quantities before buying or starting work.</p>

<h2>No professional advice</h2>
<p>Nothing on this site is professional, engineering, construction, veterinary or medical advice. The pet-related calculators, including the dog chocolate toxicity calculator, are <strong>not a substitute for a veterinarian</strong>. If your pet may have eaten something harmful, contact a vet or an animal poison hotline immediately.</p>

<h2>No warranty</h2>
<p>The site is provided “as is” and “as available” without warranties of any kind, express or implied, including accuracy, completeness, reliability or fitness for a particular purpose. We do not guarantee that the site will be uninterrupted or error-free.</p>

<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, ${N} and its owners will not be liable for any direct, indirect, incidental or consequential loss or damage — including wasted materials, project failure, injury or loss to pets or property — arising from your use of, or reliance on, the site or its results.</p>

<h2>Acceptable use</h2>
<p>You agree not to misuse the site, attempt to disrupt it, scrape it in a way that harms performance, or use it for unlawful purposes.</p>

<h2>Intellectual property</h2>
<p>The text, design and code of this site are owned by ${N} unless stated otherwise. You may link to any page and share results for personal use, but may not copy or republish the content at scale without permission.</p>

<h2>Advertising and third-party links</h2>
<p>The site may display advertising and links to third-party sites. We do not endorse or control them and are not responsible for their content or practices.</p>

<h2>Changes</h2>
<p>We may update these terms at any time. Continued use of the site after changes means you accept the revised terms.</p>

<h2>Contact</h2>
<p>Questions about these terms? Email <a href="mailto:${E}">${E}</a>.</p>`
    },
  ];
};
