/* Craft & Making calculators. Each `compute` is stringified into its page, so it must be self-contained (it may use the global MM helpers). */

const LEN_UNITS = [['in', 'Inches (in)'], ['cm', 'Centimeters (cm)']];
const L = { in: 'in', cm: 'cm' };

module.exports = [
/* ------------------------------------------------------------------ 1. EPOXY */
{
  slug: 'epoxy-resin-calculator', cat: 'craft', icon: '🧪',
  h1: 'Epoxy Resin Calculator',
  title: 'Epoxy Resin Calculator – How Much Resin Do I Need?',
  description: 'Free epoxy resin calculator: find out how much epoxy you need for any pour. Enter size and depth to get gallons, ounces, liters and the resin-to-hardener split.',
  card: 'Work out exactly how much epoxy and hardener a pour needs, with waste built in.',
  keywords: 'epoxy resin calculator how much epoxy do i need resin pour coaster tabletop',
  intro: 'Enter the size and depth of your pour to see how much epoxy to mix — in gallons, ounces, liters and milliliters, with the resin and hardener split worked out.',
  units: LEN_UNITS,
  fields: [
    { name: 'shape', type: 'select', label: 'Pour shape', options: [['rectangle', 'Rectangle / square'], ['circle', 'Circle / round']], value: 'rectangle' },
    { name: 'ratio', type: 'select', label: 'Mix ratio (by volume)', options: [['1:1', '1 : 1 (resin : hardener)'], ['2:1', '2 : 1 (resin : hardener)']], value: '1:1' },
    { name: 'length', label: 'Length', unit: L, defaults: { in: 24, cm: 60 }, showIf: 'shape=rectangle' },
    { name: 'width', label: 'Width', unit: L, defaults: { in: 12, cm: 30 }, showIf: 'shape=rectangle' },
    { name: 'diameter', label: 'Diameter', unit: L, defaults: { in: 12, cm: 30 }, showIf: 'shape=circle' },
    { name: 'depth', label: 'Depth (thickness of pour)', unit: L, defaults: { in: 0.25, cm: 0.6 }, hint: '1/8 in = 0.125 · 1/4 in = 0.25 · 1/2 in = 0.5' },
    { name: 'waste', label: 'Extra for waste', unit: '%', value: 10, positive: false, max: 100, hint: 'Covers resin left in cups, drips and uneven surfaces. 10% is a safe default.' },
  ],
  compute: function (v) {
    var cm = v.units === 'cm', vol;
    if (v.shape === 'circle') vol = Math.PI * Math.pow(v.diameter / 2, 2) * v.depth;
    else vol = v.length * v.width * v.depth;
    if (cm) vol = vol / 16.387;                     // cm³ -> in³
    var base = vol, waste = v.waste || 0;
    vol = base * (1 + waste / 100);
    var gal = vol / 231, floz = vol / 1.805, l = vol / 61.024, ml = l * 1000;
    var r = v.ratio === '2:1' ? [2 / 3, 1 / 3] : [0.5, 0.5];
    var g = ml * 1.1;
    return {
      headline: {
        label: 'Total epoxy needed',
        value: gal >= 1 ? MM.fmt(gal, 2) + ' gal' : MM.fmt(floz, 1) + ' fl oz',
        sub: '≈ ' + MM.fmt(l, 2) + ' liters · includes ' + MM.fmt(waste, 0) + '% extra'
      },
      rows: [
        { section: 'Total volume' },
        ['Pour volume (no waste)', MM.fmt(base, 1) + ' in³'],
        ['US gallons', MM.fmt(gal, 3)],
        ['US fluid ounces', MM.fmt(floz, 1)],
        ['Liters', MM.fmt(l, 3)],
        ['Milliliters', MM.fmt(ml, 0)],
        { section: 'Mix split (' + v.ratio + ')' },
        ['Resin (Part A)', MM.fmt(floz * r[0], 1) + ' fl oz · ' + MM.fmt(ml * r[0], 0) + ' ml'],
        ['Hardener (Part B)', MM.fmt(floz * r[1], 1) + ' fl oz · ' + MM.fmt(ml * r[1], 0) + ' ml'],
        { section: 'Approximate weight' },
        ['Mixed epoxy', MM.fmt(g, 0) + ' g · ' + MM.fmt(g / 28.35, 1) + ' oz']
      ],
      notes: [
        { t: 'Weight assumes about 1.1 g per ml. It varies by product — check the label before mixing by weight.' },
        v.depth > (cm ? 5 : 2) ? { k: 'warn', t: 'Pours deeper than about 2 in (5 cm) usually need a deep-pour epoxy or several layers, or the resin may overheat.' } : { t: 'Always mix a little extra — running short mid-pour leaves a visible line.' }
      ]
    };
  },
  steps: [
    'Choose the <strong>unit</strong> you measured in — inches or centimeters — and pick the shape of your piece.',
    'Enter the <strong>length and width</strong> (or diameter) of the area you plan to cover, then the <strong>depth</strong> of the pour.',
    'Select the <strong>mix ratio</strong> printed on your epoxy: most table-top and art resins are 1:1, many deep-pour systems are 2:1.',
    'Leave <strong>waste at 10%</strong> unless you have a reason to change it, then press <strong>Calculate</strong>.',
    'Buy at least the total shown, and mix the resin and hardener amounts exactly as listed.'
  ],
  formula: {
    code: `<span class="c">// rectangle</span>\nvolume (in³) = length × width × depth\n<span class="c">// circle</span>\nvolume (in³) = π × (diameter ÷ 2)² × depth\n<span class="c">// centimeters: convert cm³ to in³</span>\nvolume (in³) = volume (cm³) ÷ 16.387\n<span class="c">// add waste</span>\ntotal = volume × (1 + waste% ÷ 100)\n\nUS gallons = total ÷ 231\nfluid ounces = total ÷ 1.805\nliters = total ÷ 61.024\nml = liters × 1000`,
    example: 'A 24 in × 12 in board poured 1/4 in deep: 24 × 12 × 0.25 = <b style="display:inline;color:inherit;font-size:inherit;letter-spacing:0;text-transform:none">72 in³</b>. Add 10% waste → 79.2 in³ = <strong>0.34 gallons</strong>, <strong>43.9 fl oz</strong> or about <strong>1.3 liters</strong>. With a 1:1 ratio that is roughly 22 fl oz of resin and 22 fl oz of hardener.'
  },
  table: {
    title: 'Epoxy coverage chart',
    head: ['Pour depth', 'Fl oz per sq ft', 'Liters per m²'],
    rows: [['1/16 in (1.6 mm)', '5.0', '1.6'], ['1/8 in (3.2 mm)', '10.0', '3.2'], ['1/4 in (6.4 mm)', '19.9', '6.4'], ['3/8 in (9.5 mm)', '29.9', '9.5'], ['1/2 in (12.7 mm)', '39.9', '12.7'], ['1 in (25.4 mm)', '79.8', '25.4'], ['2 in (50.8 mm)', '159.6', '50.8']],
    note: 'Figures are for resin only, with no waste allowance. Add 10% to each value for a practical buying amount.'
  },
  sections: [
    { h2: 'How much extra epoxy should you mix?', html: '<p>Epoxy that clings to mixing cups and stir sticks is gone for good, and a flat-looking surface is rarely perfectly level. Most makers add <strong>10% for flat, sealed surfaces</strong> such as coasters and trays, and <strong>15–20%</strong> for porous wood, live-edge slabs, rough molds or anything you have not sealed first. Wood soaks up resin into its grain, so a seal coat before the main pour saves material and reduces bubbles.</p><p>Running short is much worse than having a little left over. A second batch poured after the first has started to gel may not bond cleanly and can leave a visible seam in clear work.</p>' },
    { h2: 'Pour depth and heat', html: '<p>Epoxy cures through an exothermic reaction, meaning it generates its own heat. In a thin layer the heat escapes easily. In a thick pour it builds up, which can cause yellowing, cracking, shrinkage or even smoking. Tabletop and art epoxies are usually rated for roughly <strong>1/8 to 1/2 inch per layer</strong>, while deep-pour formulas can reach 2 inches or more. Always follow the maximum depth on your product’s data sheet and pour in several layers when the calculator shows a deeper total.</p>' },
    { h2: 'Mixing tips for clean results', html: '<ul><li>Measure resin and hardener separately, then combine them — never eyeball the ratio.</li><li>Stir for the full time on the label, scraping the sides and bottom of the container.</li><li>Pour the mix into a second clean cup and stir again to catch unmixed resin.</li><li>Work at the temperature the manufacturer recommends; cold resin is thick and traps bubbles.</li></ul>' }
  ],
  faqs: [
    ['How much epoxy do I need for a 1/8 inch coat on a table?', 'A flood coat 1/8 in thick needs about 10 fluid ounces of mixed epoxy per square foot. A 3 ft × 5 ft table (15 sq ft) therefore needs roughly 150 fl oz, or 1.2 gallons, before waste.'],
    ['Is epoxy measured by volume or by weight?', 'It depends on the brand. Many 1:1 and 2:1 resins are mixed by <em>volume</em>, but some systems specify weight. Check the label — the calculator lists both volume and an approximate weight.'],
    ['Why do I need extra epoxy for waste?', 'Some resin always stays in the mixing cup, runs over edges or soaks into porous surfaces. A 10% buffer prevents a partial pour, which is hard to fix.'],
    ['How do I convert cubic inches to gallons?', 'There are 231 cubic inches in one US gallon, so divide your volume in cubic inches by 231. For fluid ounces, divide by 1.805.'],
    ['Can I use this calculator for molds?', 'Yes, for simple rectangular or round molds. For irregular shapes, fill the mold with water, pour the water into a measuring jug and use that volume instead.'],
    ['How deep can I pour epoxy at once?', 'Standard table-top epoxy is usually limited to around 1/8 to 1/2 inch per pour. Deep-pour epoxy is formulated for thicker layers, often up to 2 inches. Never exceed the depth stated by the manufacturer.'],
    ['Does the calculator work in metric units?', 'Yes. Switch the unit to centimeters and the calculator converts cm³ to cubic inches, then reports gallons, ounces, liters and milliliters together.']
  ],
  related: ['river-table-epoxy-calculator', 'candle-wax-calculator', 'grout-calculator', 'paint-calculator']
},

/* ------------------------------------------------------------------ 2. RIVER TABLE */
{
  slug: 'river-table-epoxy-calculator', cat: 'craft', icon: '🌊',
  h1: 'River Table Epoxy Calculator',
  title: 'River Table Epoxy Calculator – How Much Epoxy?',
  description: 'River table epoxy calculator: estimate how much epoxy you need for the river and an optional flood coat, with the number of deep-pour layers worked out for you.',
  card: 'Estimate epoxy for the river, an optional flood coat, and how many layers to pour.',
  keywords: 'river table epoxy calculator how much epoxy for river table live edge slab deep pour',
  intro: 'Plan your live-edge river table: enter the river size and depth to see total epoxy, the resin and hardener split, and how many layers a deep pour will need.',
  units: LEN_UNITS,
  fields: [
    { name: 'length', label: 'River length', unit: L, defaults: { in: 72, cm: 183 }, hint: 'Usually the same as the table length.' },
    { name: 'rivwidth', label: 'Average river width', unit: L, defaults: { in: 6, cm: 15 }, hint: 'Measure at several points and average them.' },
    { name: 'depth', label: 'Pour depth', unit: L, defaults: { in: 2, cm: 5 }, hint: 'Usually the thickness of your slabs.' },
    { name: 'rivers', type: 'select', label: 'Number of rivers', options: [['1', '1 river'], ['2', '2 rivers'], ['3', '3 rivers']], value: '1' },
    { name: 'maxpour', label: 'Max depth per pour', unit: L, defaults: { in: 2, cm: 5 }, hint: 'Check your epoxy’s data sheet.' },
    { name: 'ratio', type: 'select', label: 'Mix ratio (by volume)', options: [['1:1', '1 : 1'], ['2:1', '2 : 1']], value: '2:1' },
    { name: 'flood', type: 'select', label: 'Add a flood coat?', options: [['no', 'No'], ['yes', 'Yes — coat the whole top']], value: 'no' },
    { name: 'tablewidth', label: 'Full tabletop width', unit: L, defaults: { in: 36, cm: 91 }, showIf: 'flood=yes' },
    { name: 'coat', label: 'Flood coat thickness', unit: L, defaults: { in: 0.125, cm: 0.3 }, showIf: 'flood=yes', hint: '1/8 in is typical.' },
    { name: 'waste', label: 'Extra for waste', unit: '%', value: 10, positive: false, max: 100, full: true },
  ],
  compute: function (v) {
    var cm = v.units === 'cm', n = parseInt(v.rivers, 10);
    var river = v.length * v.rivwidth * v.depth * n, flood = 0;
    if (v.flood === 'yes') flood = v.length * v.tablewidth * v.coat;
    var k = cm ? 1 / 16.387 : 1;
    river *= k; flood *= k;
    var waste = v.waste || 0, f = 1 + waste / 100;
    var tot = (river + flood) * f;
    var floz = tot / 1.805, l = tot / 61.024, gal = tot / 231, ml = l * 1000;
    var layers = Math.ceil(v.depth / v.maxpour - 1e-9);
    var r = v.ratio === '2:1' ? [2 / 3, 1 / 3] : [0.5, 0.5];
    var rows = [
      { section: 'Volume breakdown' },
      ['River epoxy (' + n + (n > 1 ? ' rivers' : ' river') + ')', MM.fmt(river * f / 1.805, 1) + ' fl oz'],
    ];
    if (flood) rows.push(['Flood coat epoxy', MM.fmt(flood * f / 1.805, 1) + ' fl oz']);
    rows.push(
      { section: 'Total (with ' + waste + '% waste)' },
      ['US gallons', MM.fmt(gal, 2)], ['US fluid ounces', MM.fmt(floz, 1)],
      ['Liters', MM.fmt(l, 2)], ['Milliliters', MM.fmt(ml, 0)],
      { section: 'Mix split (' + v.ratio + ')' },
      ['Resin (Part A)', MM.fmt(gal * r[0], 2) + ' gal · ' + MM.fmt(l * r[0], 2) + ' L'],
      ['Hardener (Part B)', MM.fmt(gal * r[1], 2) + ' gal · ' + MM.fmt(l * r[1], 2) + ' L'],
      { section: 'Layers' },
      ['Pours needed for the river', layers + (layers > 1 ? ' layers' : ' layer')]
    );
    if (layers > 1) rows.push(['Epoxy per river layer', MM.fmt(river * f / layers / 1.805, 1) + ' fl oz']);
    return {
      headline: { label: 'Total epoxy for your river table', value: MM.fmt(gal, 2) + ' gal', sub: '≈ ' + MM.fmt(l, 1) + ' liters · ' + MM.fmt(floz, 0) + ' fl oz' },
      rows: rows,
      notes: layers > 1
        ? [{ k: 'warn', t: 'Your depth is more than the maximum pour of ' + v.maxpour + ' ' + v.units + ', so plan <strong>' + layers + ' layers</strong>. Pour the next layer inside the manufacturer’s recoat window — usually while the previous one is tacky.' }]
        : [{ t: 'Your depth fits in a single pour. Seal the wood and the mold joints first so epoxy does not leak.' }]
    };
  },
  steps: [
    'Pick your <strong>units</strong> and measure the river: its <strong>length</strong>, <strong>average width</strong> and the <strong>depth</strong> you will pour.',
    'Choose how many <strong>rivers</strong> run through the table (1–3). If you have two, enter the average width of each.',
    'Enter the <strong>maximum pour depth</strong> from your epoxy’s data sheet — typically 2 in (5 cm) for deep-pour epoxy.',
    'Switch on the <strong>flood coat</strong> if you plan to coat the whole top, and add the full tabletop width.',
    'Press <strong>Calculate</strong> to see the total volume, resin and hardener amounts and the number of layers.'
  ],
  formula: {
    code: `river volume = length × avg river width × depth × rivers\nflood coat   = length × table width × coat thickness\n\ntotal = (river + flood) × (1 + waste% ÷ 100)\nlayers = ceil( depth ÷ max pour depth )\n\n<span class="c">// in³ → gallons ÷ 231 · fl oz ÷ 1.805 · liters ÷ 61.024</span>`,
    example: 'A 72 in long table with one 6 in wide river poured 2 in deep: 72 × 6 × 2 = 864 in³. A 1/8 in flood coat over a 36 in wide top adds 72 × 36 × 0.125 = 324 in³. Together that is 1,188 in³; with 10% waste = 1,306.8 in³, which is about <strong>5.7 gallons</strong>. Depth 2 in ÷ max pour 2 in = <strong>1 layer</strong>.'
  },
  table: {
    title: 'Typical river table sizes and epoxy needed',
    head: ['Table (L × river W × depth)', 'Epoxy, no waste', 'With 10% waste'],
    rows: [['48 × 4 × 1.5 in', '1.25 gal', '1.4 gal'], ['60 × 5 × 2 in', '2.6 gal', '2.9 gal'], ['72 × 6 × 2 in', '3.7 gal', '4.1 gal'], ['84 × 8 × 2 in', '5.8 gal', '6.4 gal'], ['96 × 10 × 2.5 in', '10.4 gal', '11.4 gal']],
    note: 'River epoxy only, single river, no flood coat. Add the flood coat separately using the calculator above.'
  },
  sections: [
    { h2: 'Why river tables use so much epoxy', html: '<p>Volume grows quickly with depth. A river that is 6 inches wide and 2 inches deep along a 6 ft table holds about 3.7 gallons — and wide, curving rivers with irregular edges often hold more than the straight-line maths suggests. That is why measuring the <strong>average</strong> width matters: measure the river at the narrowest point, the widest point and a few places between, then average the numbers.</p>' },
    { h2: 'Pouring deep without cracking', html: '<p>Deep-pour epoxy is formulated to release heat slowly, but even the best products have a maximum thickness per pour. If your slabs are 3 inches thick and your epoxy tops out at 2 inches, the calculator will recommend two layers. For best results, pour the second layer while the first is still tacky so the layers chemically bond. Waiting until the first layer has fully cured means sanding between coats.</p><ul><li>Keep the shop at the temperature stated on the data sheet.</li><li>Warm the resin bottles in a water bath on cold days to reduce bubbles.</li><li>Seal the wood with a thin coat first so air does not escape into the river.</li></ul>' },
    { h2: 'Do I need a flood coat?', html: '<p>A flood coat is a thin layer of epoxy poured over the whole tabletop after the river has cured and been sanded flat. It protects the wood, deepens the grain and gives a glass-like finish. At 1/8 inch it adds about 10 fl oz per square foot, so budget for it separately when buying epoxy.</p>' }
  ],
  faqs: [
    ['How much epoxy do I need for a river table?', 'Multiply river length × average river width × depth to get the volume in cubic inches, then divide by 231 for US gallons. A 6 ft table with a 6 in wide river poured 2 in deep needs about 3.7 gallons plus waste.'],
    ['How deep can I pour a river table in one go?', 'It depends on the epoxy. Deep-pour formulas are commonly rated for 2 in per pour; some go to 3 in or more. Tabletop epoxy is usually limited to around 1/8–1/2 in. Always follow the manufacturer’s data sheet.'],
    ['What is a flood coat on a river table?', 'A thin, final layer of epoxy over the entire tabletop that seals the wood and gives a smooth, glossy finish. It is typically about 1/8 inch thick.'],
    ['Should I use a 1:1 or 2:1 epoxy?', 'Both work. 2:1 deep-pour epoxies are popular because they react more slowly and generate less heat. The ratio affects how much of each part you buy, not the total volume.'],
    ['How much extra epoxy should I mix?', '10% is typical, but go to 15–20% for live-edge slabs with cracks, voids or porous wood because the epoxy fills them first.'],
    ['Why does my river table keep leaking?', 'Gaps between the mold and the slabs let low-viscosity epoxy escape. Seal every seam with tape and silicone before you pour, and test with a small amount first.'],
    ['Can I use this for a bar top or charcuterie board?', 'Yes. Enter the dimensions of the area that will be filled with epoxy and set the number of rivers to one. For a bar top coat, use the flood coat option.']
  ],
  related: ['epoxy-resin-calculator', 'concrete-calculator', 'paint-calculator', 'candle-wax-calculator']
},

/* ------------------------------------------------------------------ 3. YARN */
{
  slug: 'yarn-calculator', cat: 'craft', icon: '🧶',
  h1: 'Yarn Calculator',
  title: 'Yarn Calculator – How Much Yarn Do I Need?',
  description: 'Free yarn calculator for crochet and knitting. Use a gauge swatch to find the yardage and number of skeins you need for any blanket, scarf or sweater.',
  card: 'Use your gauge swatch to calculate total yardage and how many skeins to buy.',
  keywords: 'yarn calculator how much yarn do i need blanket yarn calculator crochet yarn calculator knitting skeins',
  intro: 'Measure a small swatch, enter your project size, and get the yardage and number of skeins you need — accurate for any stitch pattern and any yarn.',
  units: LEN_UNITS,
  unitsLabel: 'Measuring in',
  fields: [
    { name: 'preset', type: 'select', label: 'Blanket size preset (optional)', full: true, targets: 'pw,ph', options: [['custom', 'Custom size'], ['30x36', 'Baby — 30 × 36 in'], ['50x60', 'Throw — 50 × 60 in'], ['66x90', 'Twin — 66 × 90 in'], ['80x90', 'Full — 80 × 90 in'], ['90x100', 'Queen — 90 × 100 in'], ['108x100', 'King — 108 × 100 in']], value: 'custom' },
    { name: 'sw', label: 'Swatch width', unit: L, defaults: { in: 4, cm: 10 } },
    { name: 'sh', label: 'Swatch height', unit: L, defaults: { in: 4, cm: 10 } },
    { name: 'sy', label: 'Yards used in swatch', unit: 'yd', value: 8, hint: 'Weigh the swatch or unravel it and measure the yarn.' },
    { name: 'spy', label: 'Yards per skein', unit: 'yd', value: 220, hint: 'Printed on the yarn label.' },
    { name: 'pw', label: 'Project width', unit: L, defaults: { in: 50, cm: 127 } },
    { name: 'ph', label: 'Project height / length', unit: L, defaults: { in: 60, cm: 152 } },
    { name: 'extra', label: 'Extra yarn for safety', unit: '%', value: 10, positive: false, max: 100, full: true, hint: 'Covers swatch differences, tension changes, joins and weaving in ends.' },
  ],
  compute: function (v) {
    var perArea = v.sy / (v.sw * v.sh);
    var area = v.pw * v.ph, extra = v.extra || 0;
    var yards = perArea * area * (1 + extra / 100);
    var skeins = Math.ceil(yards / v.spy - 1e-9);
    var plain = perArea * area;
    return {
      headline: { label: 'Skeins to buy', value: skeins + (skeins === 1 ? ' skein' : ' skeins'), sub: MM.fmt(yards, 0) + ' yards · ' + MM.fmt(yards * 0.9144, 0) + ' meters needed' },
      rows: [
        { section: 'Yardage' },
        ['Yarn per square ' + (v.units === 'cm' ? 'cm' : 'inch'), MM.fmt(perArea, 4) + ' yd'],
        ['Project area', MM.fmt(area, 0) + ' ' + (v.units === 'cm' ? 'cm²' : 'in²')],
        ['Yardage without extra', MM.fmt(plain, 0) + ' yd'],
        ['Total with ' + extra + '% extra', MM.fmt(yards, 0) + ' yd'],
        ['Total in meters', MM.fmt(yards * 0.9144, 0) + ' m'],
        { section: 'Skeins' },
        ['Skeins of ' + v.spy + ' yd each', String(skeins)],
        ['Yarn left over', MM.fmt(skeins * v.spy - yards, 0) + ' yd']
      ],
      notes: [{ t: 'Buy all your skeins from the same dye lot at once, so the colour matches across the project.' }]
    };
  },
  steps: [
    'Make a <strong>gauge swatch</strong> (about 4 × 4 in or 10 × 10 cm) in the stitch pattern and hook or needle size you plan to use.',
    'Measure the <strong>swatch width and height</strong>, then work out the <strong>yards used</strong> — unravel it and measure, or weigh it and compare to the skein weight.',
    'Pick a <strong>blanket preset</strong> or type your own <strong>project width and height</strong>. Use the same unit for the swatch and the project.',
    'Enter the <strong>yards per skein</strong> from the label and keep the 10% extra allowance.',
    'Press <strong>Calculate</strong> to see the total yardage and number of skeins to buy.'
  ],
  formula: {
    code: `yards per square unit = swatch yards ÷ (swatch width × swatch height)\ntotal yards = yards per square unit × project width × project height × (1 + extra% ÷ 100)\nskeins = ceil( total yards ÷ yards per skein )\nmeters = yards × 0.9144`,
    example: 'A 4 × 4 in swatch uses 8 yards, so each square inch needs 8 ÷ 16 = 0.5 yd. A 50 × 60 in throw is 3,000 in², so it needs 1,500 yd; add 10% = <strong>1,650 yards</strong>. With 220 yd skeins: 1,650 ÷ 220 = 7.5 → <strong>8 skeins</strong>.'
  },
  table: {
    title: 'Standard blanket sizes and yardage guide',
    head: ['Blanket', 'Size (in)', 'Approx. yards*', 'Skeins of 220 yd'],
    rows: [['Baby', '30 × 36', '590', '3'], ['Throw', '50 × 60', '1,650', '8'], ['Twin', '66 × 90', '3,270', '15'], ['Full', '80 × 90', '3,950', '18'], ['Queen', '90 × 100', '4,950', '23'], ['King', '108 × 100', '5,900', '27']],
    note: '*Based on a worsted-weight swatch using 0.5 yd per square inch and 10% extra. Your own gauge swatch will give a more accurate result.'
  },
  sections: [
    { h2: 'Why the swatch method is the most accurate', html: '<p>Rules of thumb such as “a throw needs 1,500 yards” ignore the things that actually decide yardage: your tension, your hook or needle size, and the stitch pattern. A dense single crochet fabric can use almost twice as much yarn per square inch as an open mesh. By measuring a real swatch in the exact stitch you will use, the calculator scales up your own consumption instead of guessing.</p>' },
    { h2: 'How to measure yarn used in a swatch', html: '<p>The easiest method is to weigh it. Weigh your swatch on a kitchen scale, then divide by the weight of a full skein and multiply by the skein’s yardage. For example, a swatch weighing 10 g from a 100 g, 220 yd skein used <em>10 ÷ 100 × 220 = 22 yd</em>. If you do not own a scale, unravel the swatch and measure the strand against a tape measure.</p>' },
    { h2: 'How much extra yarn should I buy?', html: '<p>The default 10% covers weaving in ends, joining new skeins and small differences between swatch and finished fabric. Go higher (15–20%) for lace, cables or colour-work, which consume more yarn. Always buy from one dye lot: shades vary between batches and a visible stripe halfway up a blanket is hard to hide.</p>' }
  ],
  faqs: [
    ['How much yarn do I need for a blanket?', 'It depends on the size, yarn weight and stitch. As a rough guide, a worsted-weight baby blanket takes about 600 yd, a throw about 1,650 yd and a queen about 5,000 yd. A gauge swatch gives a far more reliable figure.'],
    ['How do I find yards per skein?', 'Look on the yarn label; it is printed as yards and meters, for example “220 yd / 201 m”. Yards per skein differ widely between brands and weights.'],
    ['Does the calculator work for knitting and crochet?', 'Yes. The swatch method works for any stitch, in knitting or crochet, as long as you use the same stitch pattern for the swatch and the project.'],
    ['Can I use centimeters?', 'Yes. Switch to centimeters and enter your swatch and project sizes in cm. The yardage remains in yards, with the metric total shown in meters.'],
    ['What if my swatch is not 4 inches?', 'Any size works. The calculator divides the yards used by the swatch area, so a 3 × 5 in swatch is just as valid as a 4 × 4 in one — but bigger swatches are more reliable.'],
    ['How many skeins do I need for a scarf?', 'A typical scarf of 8 × 60 in uses about 240–400 yards of worsted yarn, so usually 2 skeins. Enter your swatch and scarf size for an exact number.'],
    ['Should I round up the number of skeins?', 'Always. The calculator rounds up automatically, so you never end up one partial skein short.']
  ],
  related: ['quilt-backing-calculator', 'epoxy-resin-calculator', 'candle-wax-calculator', 'dog-age-calculator']
},

/* ------------------------------------------------------------------ 4. CANDLE */
{
  slug: 'candle-wax-calculator', cat: 'craft', icon: '🕯️',
  h1: 'Candle Wax Calculator',
  title: 'Candle Wax & Fragrance Calculator – How Much Wax?',
  description: 'Candle wax calculator: work out how much wax and fragrance oil you need for any container size and batch, in ounces, grams and pounds, with load warnings.',
  card: 'Calculate wax and fragrance oil for any container size, batch size and fragrance load.',
  keywords: 'candle wax calculator how much wax for candle fragrance oil calculator soy paraffin coconut beeswax',
  intro: 'Enter your container size, how many candles you are making and your fragrance load to see exactly how much wax and fragrance oil to weigh out.',
  units: [['floz', 'Fluid ounces (fl oz)'], ['ml', 'Milliliters (ml)']],
  unitsLabel: 'Container size in',
  fields: [
    { name: 'cap', label: 'Container capacity (each)', unit: { floz: 'fl oz', ml: 'ml' }, defaults: { floz: 8, ml: 240 } },
    { name: 'count', label: 'Number of candles', value: 6, step: 1, hint: 'Whole candles only.' },
    { name: 'wax', type: 'select', label: 'Wax type', options: [['soy', 'Soy wax'], ['paraffin', 'Paraffin wax'], ['coconut', 'Coconut wax blend'], ['beeswax', 'Beeswax']], value: 'soy' },
    { name: 'load', label: 'Fragrance load', unit: '%', value: 8, positive: false, max: 12, hint: 'Allowed range 0–12%. Most waxes work at 6–10%.' },
  ],
  compute: function (v) {
    var floz = v.units === 'ml' ? v.cap / 29.574 : v.cap;
    var n = Math.max(1, Math.round(v.count)), load = v.load || 0;
    var waxEach = floz * 0.86, fragEach = waxEach * load / 100;
    var waxTot = waxEach * n, fragTot = fragEach * n;
    var info = {
      soy: 'Soy wax usually performs best with a 6–10% fragrance load and a cure time of 1–2 weeks.',
      paraffin: 'Paraffin wax typically holds 6–10% fragrance and gives a strong hot throw.',
      coconut: 'Coconut wax blends usually accept 6–10% fragrance and give a creamy finish.',
      beeswax: 'Beeswax has a natural scent and usually works best at 3–6% fragrance load.'
    };
    var notes = [{ t: info[v.wax] }];
    if (load > 10) notes.unshift({ k: 'warn', t: 'A fragrance load above 10% is high — check your wax manufacturer’s maximum load to avoid sweating, poor burn or fire risk.' });
    if (v.wax === 'beeswax' && load > 6) notes.push({ k: 'warn', t: 'Beeswax rarely needs more than 6% fragrance oil.' });
    return {
      headline: {
        label: 'Wax to melt',
        value: waxTot >= 16 ? MM.fmt(waxTot / 16, 2) + ' lb' : MM.fmt(waxTot, 1) + ' oz',
        sub: MM.fmt(waxTot * 28.35, 0) + ' g wax + ' + MM.fmt(fragTot, 1) + ' oz (' + MM.fmt(fragTot * 28.35, 0) + ' g) fragrance oil'
      },
      rows: [
        { section: 'Per candle' },
        ['Container size', MM.fmt(floz, 1) + ' fl oz'],
        ['Wax', MM.fmt(waxEach, 2) + ' oz · ' + MM.fmt(waxEach * 28.35, 0) + ' g'],
        ['Fragrance oil (' + load + '%)', MM.fmt(fragEach, 2) + ' oz · ' + MM.fmt(fragEach * 28.35, 1) + ' g'],
        { section: 'Whole batch (' + n + (n === 1 ? ' candle)' : ' candles)') },
        ['Total wax', MM.fmt(waxTot, 1) + ' oz · ' + MM.fmt(waxTot * 28.35, 0) + ' g · ' + MM.fmt(waxTot / 16, 2) + ' lb'],
        ['Total fragrance oil', MM.fmt(fragTot, 1) + ' oz · ' + MM.fmt(fragTot * 28.35, 0) + ' g']
      ],
      notes: notes
    };
  },
  steps: [
    'Choose whether you measure containers in <strong>fluid ounces or milliliters</strong> and enter the capacity of one jar.',
    'Enter how many <strong>candles</strong> you plan to pour in this batch.',
    'Select your <strong>wax type</strong> to see wax-specific fragrance advice.',
    'Set your <strong>fragrance load</strong> — 6–10% suits most waxes. Check your wax supplier’s recommended maximum.',
    'Press <strong>Calculate</strong>, then weigh the wax and fragrance oil on a scale rather than measuring by volume.'
  ],
  formula: {
    code: `wax per candle (oz) = container fl oz × 0.86\n<span class="c">// milliliters: fl oz = ml ÷ 29.574</span>\nfragrance (oz) = wax oz × (fragrance load% ÷ 100)\n\ntotal wax = wax per candle × number of candles\ngrams = oz × 28.35 · pounds = oz ÷ 16`,
    example: 'Six 8 fl oz jars: wax per candle = 8 × 0.86 = 6.88 oz, so the batch needs 41.3 oz (<strong>2.58 lb</strong>) of wax. At 8% load, fragrance = 6.88 × 0.08 = 0.55 oz per candle, or <strong>3.3 oz</strong> (94 g) in total.'
  },
  table: {
    title: 'Common container sizes and wax needed',
    head: ['Container', 'Capacity (fl oz)', 'Wax (oz)', 'Fragrance at 8% (oz)'],
    rows: [['4 oz jar', '4', '3.4', '0.28'], ['8 oz jar', '8', '6.9', '0.55'], ['9 oz tumbler', '9', '7.7', '0.62'], ['12 oz jar', '12', '10.3', '0.83'], ['16 oz jar', '16', '13.8', '1.10']],
    note: 'Values are per candle. Wax weight uses 0.86 oz of wax per fluid ounce of container capacity, which leaves some headspace below the rim.'
  },
  sections: [
    { h2: 'Why weigh wax instead of measuring volume?', html: '<p>A fluid ounce is a measure of space, not mass, so a jar’s capacity does not equal the weight of wax it holds. Different waxes have different densities, and melted wax is lighter than solid wax. Weighing on a digital scale is far more accurate than scooping flakes into a measuring cup. This calculator uses a standard conversion of <strong>0.86 oz of wax for every fl oz of container capacity</strong>, which gives you a sensible fill with headspace.</p>' },
    { h2: 'Choosing a fragrance load', html: '<p>Fragrance load is the weight of fragrance oil as a percentage of wax weight. More is not always better. Too much fragrance oil can make candles sweat, produce a weaker flame, leave oily pools or even be a fire hazard. Most soy, paraffin and coconut waxes work best at 6–10%; beeswax is lower. Always follow the maximum load given by your wax supplier and the flashpoint of your fragrance oil.</p>' },
    { h2: 'Cure time and testing', html: '<p>Natural waxes such as soy and coconut need time for the fragrance to bind with the wax. Let candles cure for <strong>1–2 weeks</strong> before testing the scent throw, and always burn-test a sample of each new combination of wax, wick, container and fragrance before you sell or gift them.</p>' }
  ],
  faqs: [
    ['How much wax do I need for an 8 oz candle jar?', 'About 6.9 oz of wax by weight. The calculator multiplies the container’s fluid-ounce capacity by 0.86 to leave sensible room below the rim.'],
    ['What is a good fragrance load for soy candles?', 'Most soy waxes work well at 6–10%. Check your wax supplier’s technical sheet for the maximum recommended load.'],
    ['How do I calculate fragrance oil for a candle?', 'Multiply the weight of wax by the fragrance load percentage. For 10 oz of wax at 8% load, you need 10 × 0.08 = 0.8 oz of fragrance oil.'],
    ['Why does the calculator warn about loads over 10%?', 'Most waxes cannot hold more than around 10% fragrance oil. Overloading can cause sweating, poor burning and safety problems, so always check your manufacturer’s maximum.'],
    ['Should I measure wax in ounces or grams?', 'Whichever your scale shows. The calculator gives ounces, grams and pounds so you can use whichever is most convenient.'],
    ['Does the wax type change the amount of wax?', 'The amount of wax per container is a standard estimate for all four wax types. The type changes the fragrance advice, because each wax holds a different amount of fragrance oil.'],
    ['Can I use the calculator for tins, jars and tumblers?', 'Yes — any container. Enter its capacity to the rim; the 0.86 factor leaves headspace.']
  ],
  related: ['epoxy-resin-calculator', 'yarn-calculator', 'quilt-backing-calculator', 'dog-chocolate-toxicity-calculator']
},

/* ------------------------------------------------------------------ 5. QUILT */
{
  slug: 'quilt-backing-calculator', cat: 'craft', icon: '🧵',
  h1: 'Quilt Backing Calculator',
  title: 'Quilt Backing Calculator – How Much Fabric?',
  description: 'Quilt backing calculator: find out how many yards of fabric you need for your quilt back, comparing vertical and horizontal seams on standard or wide fabric.',
  card: 'Find how many yards of backing fabric you need, with vertical and horizontal seam options.',
  keywords: 'quilt backing calculator how much fabric for quilt backing yardage wide backing',
  intro: 'Enter your quilt size and the width of your fabric to see exactly how many yards of backing to buy, comparing both seam layouts.',
  units: LEN_UNITS,
  fields: [
    { name: 'qw', label: 'Quilt width', unit: L, defaults: { in: 60, cm: 152 } },
    { name: 'ql', label: 'Quilt length', unit: L, defaults: { in: 80, cm: 203 } },
    { name: 'extra', label: 'Extra per side', unit: L, defaults: { in: 4, cm: 10 }, hint: '4 in (10 cm) per side is standard for longarm quilting.' },
    { name: 'fabric', type: 'select', label: 'Fabric width', options: [['40', 'Standard 42–44 in (use 40 in)'], ['104', 'Wide backing 108 in (use 104 in)']], value: '40' },
  ],
  compute: function (v) {
    var k = v.units === 'cm' ? 1 / 2.54 : 1;
    var qw = v.qw * k, ql = v.ql * k, ex = v.extra * k, usable = +v.fabric;
    var bw = qw + 2 * ex, bl = ql + 2 * ex;
    var pv = Math.ceil(bw / usable - 1e-9), yv = pv * bl / 36;
    var ph = Math.ceil(bl / usable - 1e-9), yh = ph * bw / 36;
    var qv = MM.ceilTo(yv, 0.25), qh = MM.ceilTo(yh, 0.25);
    var vert = qv <= qh, best = vert ? qv : qh, panels = vert ? pv : ph;
    var dim = function (n) { return v.units === 'cm' ? MM.fmt(n * 2.54, 0) + ' cm' : MM.fmt(n, 1) + ' in'; };
    return {
      headline: {
        label: 'Buy at least',
        value: MM.frac(best) + ' yards',
        sub: (panels === 1 ? 'one piece, no seam needed' : panels + ' panels, seams run ' + (vert ? 'vertically (top to bottom)' : 'horizontally (side to side)')) + ' · ' + MM.fmt(best * 0.9144, 2) + ' m'
      },
      rows: [
        { section: 'Backing size needed' },
        ['Backing width', dim(bw)], ['Backing length', dim(bl)],
        { section: 'Option A — vertical seams' },
        ['Panels', String(pv)], ['Yardage', MM.frac(qv) + ' yd'],
        { section: 'Option B — horizontal seams' },
        ['Panels', String(ph)], ['Yardage', MM.frac(qh) + ' yd'],
        { section: 'Recommended' },
        ['Best option', vert ? 'A — vertical seams' : 'B — horizontal seams'],
        ['Yardage to buy', MM.frac(best) + ' yd · ' + MM.fmt(best * 0.9144, 2) + ' m']
      ],
      notes: [{ t: qv === qh ? 'Both layouts need the same yardage, so choose the seam placement you prefer.' : 'Pick the layout with the lowest yardage shown above to save money.' },
        { t: 'Yardage is rounded up to the nearest ¼ yard. Pre-washing may shrink fabric by 2–5%, so consider buying a little extra.' }]
    };
  },
  steps: [
    'Choose <strong>inches or centimeters</strong> and enter your finished <strong>quilt width and length</strong>.',
    'Set the <strong>extra per side</strong>. Four inches (10 cm) on every edge is the usual allowance for quilting and squaring up.',
    'Pick your <strong>fabric width</strong>: standard 42–44 in cotton (40 in usable after trimming selvedges) or 108 in wide backing (104 in usable).',
    'Press <strong>Calculate</strong> to compare vertical and horizontal seam layouts.',
    'Buy the <strong>recommended yardage</strong>, which is rounded up to the nearest quarter yard.'
  ],
  formula: {
    code: `backing W = quilt W + 2 × extra\nbacking L = quilt L + 2 × extra\n\n<span class="c">// vertical seams</span>\npanels = ceil(backing W ÷ usable width) · yards = panels × backing L ÷ 36\n<span class="c">// horizontal seams</span>\npanels = ceil(backing L ÷ usable width) · yards = panels × backing W ÷ 36\n\nround up to the nearest ¼ yard`,
    example: 'A 60 × 80 in quilt with 4 in extra per side needs a 68 × 88 in back. On 40 in usable fabric: <strong>vertical seams</strong> = 2 panels × 88 ÷ 36 = 4.89 → <strong>5 yd</strong>; <strong>horizontal seams</strong> = 3 panels × 68 ÷ 36 = 5.67 → 5¾ yd. The vertical layout is cheaper.'
  },
  table: {
    title: 'Standard quilt sizes and backing yardage',
    head: ['Quilt', 'Finished size (in)', 'Standard 42" fabric', '108" wide fabric'],
    rows: [['Baby / crib', '36 × 52', '2½ yd', '1¼ yd'], ['Lap', '50 × 65', '3¼ yd', '1¾ yd'], ['Twin', '70 × 90', '5½ yd', '2¼ yd'], ['Full / double', '86 × 90', '8 yd', '2¾ yd'], ['Queen', '90 × 108', '8¼ yd', '3¼ yd'], ['King', '108 × 108', '9¾ yd', '6½ yd']],
    note: 'Typical industry figures including a 4 in allowance per side. Use the calculator above for your exact size.'
  },
  sections: [
    { h2: 'Why backing needs to be bigger than the quilt top', html: '<p>The quilt back must be larger than the top so there is room to load it on a longarm frame, to clamp it during hand quilting, and to allow for “draw-up” — the slight shrinking that happens as quilting stitches pull the layers together. Four inches on each side is the standard allowance; use 2–3 inches for a domestic machine and up to 6 inches if you are sending the quilt to a professional quilter.</p>' },
    { h2: 'Wide backing or standard cotton?', html: '<p>Wide-backing fabric, around 108 inches, lets you use a single piece for most quilts up to queen size, with no seams to match. It often costs more per yard, but you buy fewer yards. Standard quilting cotton is more widely available in prints, but needs one or two seams. For small quilts such as baby and lap sizes, standard cotton is usually cheaper; for queen and king quilts, wide backing is generally the better value.</p>' },
    { h2: 'Seam placement tips', html: '<ul><li>Press seams open to reduce bulk and help the needle glide.</li><li>Trim away selvedges before joining panels; they shrink differently and can pucker.</li><li>A centre seam is the most common, but an off-centre seam is often easier to line up on a longarm.</li></ul>' }
  ],
  faqs: [
    ['How much fabric do I need for quilt backing?', 'Add 8 inches to the quilt width and length (4 in per side), then divide by the usable fabric width to find the number of panels. Multiply by the backing length in yards. The calculator does it for you and rounds up to the nearest ¼ yard.'],
    ['What is the usable width of quilting fabric?', 'Standard quilting cotton is sold at 42–44 in wide, but about 40 in is usable once the selvedges are trimmed. Wide backing at 108 in gives roughly 104 in usable.'],
    ['Should I run the seam vertically or horizontally?', 'Choose whichever needs fewer yards, as shown by the calculator. A vertical seam usually saves fabric on tall quilts; a horizontal seam can save fabric on very wide ones.'],
    ['How much extra backing do I need for a longarm quilter?', 'Most longarmers ask for 4–6 inches extra on each side. Check with your quilter before you buy.'],
    ['Do I need to pre-wash the backing fabric?', 'It’s a good idea. Cotton can shrink 2–5% in the wash, so buy a little extra if you pre-wash.'],
    ['Can I use the calculator in metric?', 'Yes. Switch to centimeters and enter your sizes in cm. The calculator converts to inches internally and shows the result in yards and meters.'],
    ['Why round up to the nearest quarter yard?', 'Fabric shops usually cut in ¼ yard increments, so rounding up makes sure you buy enough fabric.']
  ],
  related: ['yarn-calculator', 'candle-wax-calculator', 'epoxy-resin-calculator', 'paint-calculator']
},
];
