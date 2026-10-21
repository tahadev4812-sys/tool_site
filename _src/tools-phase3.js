/* Phase 3 calculators (high-search-volume tools across all categories). Each `compute` is stringified into its page, so it must be self-contained (it may use the global MM helpers). */

const U = (a, b) => ({ [a[0]]: a[1], [b[0]]: b[1] });

module.exports = [
/* ------------------------------------------------------------------ KNITTING */
{
  slug: 'knitting-stitch-calculator', cat: 'craft', icon: '🧣',
  h1: 'Knitting Stitch Calculator',
  title: 'Knitting Stitch Calculator – Cast On & Row Count',
  description: 'Knitting stitch calculator: use your gauge swatch to work out how many stitches to cast on and how many rows to knit for any width and length, in inches or cm.',
  card: 'Turn your gauge swatch into a cast-on number and row count for any size.',
  keywords: 'knitting stitch calculator cast on how many stitches gauge swatch rows crochet foundation chain',
  intro: 'Count the stitches and rows in your gauge swatch, enter the size you want, and get the number of stitches to cast on and rows to work.',
  units: [['in', 'Inches (in)'], ['cm', 'Centimeters (cm)']],
  unitsLabel: 'Measuring in',
  fields: [
    { name: 'sts', label: 'Stitches counted in swatch', unit: 'sts', value: 20, step: 1 },
    { name: 'sw', label: 'Width those stitches cover', unit: U(['in', 'in'], ['cm', 'cm']), defaults: { in: 4, cm: 10 } },
    { name: 'rows', label: 'Rows counted in swatch', unit: 'rows', value: 28, step: 1 },
    { name: 'sh', label: 'Height those rows cover', unit: U(['in', 'in'], ['cm', 'cm']), defaults: { in: 4, cm: 10 } },
    { name: 'width', label: 'Finished width wanted', unit: U(['in', 'in'], ['cm', 'cm']), defaults: { in: 50, cm: 127 } },
    { name: 'height', label: 'Finished length wanted', unit: U(['in', 'in'], ['cm', 'cm']), defaults: { in: 60, cm: 152 } },
    { name: 'mult', label: 'Pattern multiple', unit: 'sts', value: 1, step: 1, hint: 'Stitch pattern repeat, e.g. 4 for a 4-stitch repeat. Use 1 for plain stitches.' },
    { name: 'edge', label: 'Edge / extra stitches', unit: 'sts', value: 2, step: 1, positive: false, hint: 'Selvedge or balancing stitches added to the pattern repeats.' },
  ],
  compute: function (v) {
    var spu = v.sts / v.sw, rpu = v.rows / v.sh;
    var m = Math.max(1, Math.round(v.mult || 1)), edge = Math.round(v.edge || 0);
    var raw = spu * v.width;
    var core = Math.max(m, Math.round((raw - edge) / m) * m), cast = core + edge;
    var rows = Math.ceil(v.height * rpu - 1e-9), u = v.units === 'cm' ? 'cm' : 'in';
    return {
      headline: { label: 'Cast on', value: MM.fmt(cast, 0) + ' stitches', sub: 'then work ' + MM.fmt(rows, 0) + ' rows for ' + MM.fmt(v.height, 1) + ' ' + u },
      rows: [
        { section: 'Your gauge' },
        ['Stitches per ' + u, MM.fmt(spu, 2)], ['Rows per ' + u, MM.fmt(rpu, 2)],
        { section: 'Project' },
        ['Exact stitches for ' + MM.fmt(v.width, 1) + ' ' + u, MM.fmt(raw, 1)],
        ['Cast on (adjusted to pattern)', MM.fmt(cast, 0) + ' sts'],
        ['Actual finished width', MM.fmt(cast / spu, 1) + ' ' + u],
        ['Rows to knit', MM.fmt(rows, 0)]
      ],
      notes: [{ t: 'Block your swatch before measuring — washing and drying can change gauge. If you are between sizes, round up to the next pattern multiple.' }]
    };
  },
  steps: [
    'Knit a <strong>swatch</strong> at least 6 in (15 cm) wide in the stitch you will use, then block it as you would the finished piece.',
    'Count the <strong>stitches and rows</strong> across a section and measure the <strong>width and height</strong> they cover.',
    'Enter the <strong>finished size</strong> you want.',
    'If your stitch pattern repeats every few stitches, enter the <strong>pattern multiple</strong>; add any <strong>edge stitches</strong>.',
    'Press <strong>Calculate</strong> to see how many stitches to cast on and rows to knit. For crochet, use it for the foundation chain.'
  ],
  formula: {
    code: `stitches per unit = swatch stitches ÷ swatch width\nrows per unit = swatch rows ÷ swatch height\n\nstitches needed = stitches per unit × finished width\ncast on = round((needed − edge) ÷ multiple) × multiple + edge\nrows = ceil(rows per unit × finished length)`,
    example: 'A 4 in swatch has 20 stitches and 28 rows, so gauge is 5 sts and 7 rows per inch. For a 50 × 60 in blanket: 5 × 50 = 250 stitches, with 2 edge stitches and a multiple of 1 → <strong>cast on 250</strong>. Rows: 7 × 60 = <strong>420 rows</strong>.'
  },
  table: {
    title: 'Cast-on guide by gauge',
    head: ['Stitches per inch', '8 in scarf', '20 in baby blanket', '50 in throw'],
    rows: [['3', '24', '60', '150'], ['4', '32', '80', '200'], ['5', '40', '100', '250'], ['6', '48', '120', '300']],
    note: 'Before edge stitches and pattern-multiple adjustments.'
  },
  sections: [
    { h2: 'Why you should always knit a swatch', html: '<p>Two knitters using the same yarn and needles can end up with different sizes, because tension is personal. A swatch measures <em>your</em> tension, so the stitch count is based on how you really knit. Even a half-stitch difference per inch adds up to several inches across a blanket or a sweater.</p>' },
    { h2: 'Pattern multiples and edge stitches', html: '<p>Many stitch patterns — ribbing, cables, lace — repeat every few stitches, and your cast-on must fit a whole number of repeats. The calculator rounds to the nearest multiple, then adds the edge stitches that sit outside the repeat. If you want a slightly larger piece, increase the width by one repeat rather than by a single stitch.</p>' },
    { h2: 'Using it for crochet', html: '<p>The same maths works for crochet: count stitches and rows in a swatch, then use the result for the number of foundation chains and rows. Remember to add the turning chain your pattern calls for.</p>' }
  ],
  faqs: [
    ['How many stitches should I cast on?', 'Multiply your stitches per inch (from a gauge swatch) by the finished width in inches, then adjust for your pattern’s stitch multiple and edge stitches. The calculator does this for you.'],
    ['How big should a gauge swatch be?', 'At least 6 inches (15 cm) square, measured in the middle where the stitches are most even. Larger is more accurate.'],
    ['What is a stitch multiple?', 'The number of stitches in one repeat of a stitch pattern. If a pattern repeats every 4 stitches, your cast-on must be a multiple of 4, plus any edge stitches.'],
    ['Does this work for crochet?', 'Yes. Count stitches and rows in a crochet swatch and use the result as the foundation chain and row count.'],
    ['Should I measure the swatch before or after blocking?', 'After. Washing and blocking can change the gauge, so measure it the way the finished piece will be treated.'],
    ['What if my swatch does not match the pattern gauge?', 'Change needle size: use larger needles if you have too many stitches per inch and smaller if you have too few.'],
    ['How do I calculate how many rows to knit?', 'Divide the rows in your swatch by its height to get rows per inch, then multiply by the finished length.']
  ],
  related: ['yarn-calculator', 'quilt-backing-calculator', 'resin-coaster-calculator', 'dog-food-calculator']
},

/* ------------------------------------------------------------------ FLOORING */
{
  slug: 'flooring-calculator', cat: 'home', icon: '🪵',
  h1: 'Flooring Calculator',
  title: 'Flooring Calculator – How Many Boxes Do I Need?',
  description: 'Flooring calculator for laminate, vinyl plank, hardwood and tile: enter your room size and box coverage to get the square footage, waste and boxes to buy.',
  card: 'Square footage, waste allowance and number of boxes for any floor.',
  keywords: 'flooring calculator how many boxes of flooring laminate vinyl plank hardwood square footage waste',
  intro: 'Enter your room size and the coverage printed on the box to see how many boxes of flooring to buy, including a waste allowance for cuts.',
  units: [['imperial', 'Imperial (ft, sq ft)'], ['metric', 'Metric (m, m²)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'length', label: 'Room length', unit: U(['imperial', 'ft'], ['metric', 'm']), defaults: { imperial: 15, metric: 4.6 } },
    { name: 'width', label: 'Room width', unit: U(['imperial', 'ft'], ['metric', 'm']), defaults: { imperial: 12, metric: 3.7 } },
    { name: 'cov', label: 'Coverage per box', unit: U(['imperial', 'sq ft'], ['metric', 'm²']), defaults: { imperial: 20, metric: 1.9 }, hint: 'Printed on the box.' },
    { name: 'waste', label: 'Extra for cuts & waste', unit: '%', value: 10, positive: false, max: 50, hint: '5–10% straight lay, 10–15% diagonal, 15–20% herringbone.' },
    { name: 'price', label: 'Price per box (optional)', required: false, positive: false, full: true, hint: 'Leave blank to skip the cost estimate.' },
  ],
  compute: function (v) {
    var m = v.units === 'metric', area = v.length * v.width, waste = v.waste || 0;
    var need = area * (1 + waste / 100), boxes = Math.ceil(need / v.cov - 1e-9);
    var bought = boxes * v.cov, f = function (a) { return m ? MM.fmt(a, 1) + ' m²' : MM.fmt(a, 0) + ' sq ft'; };
    var rows = [
      { section: 'Area' }, ['Room area', f(area)], ['With ' + waste + '% waste', f(need)],
      { section: 'Buying' }, ['Boxes (rounded up)', String(boxes)], ['Flooring you will own', f(bought)], ['Left over for repairs', f(bought - area)]
    ];
    if (v.price) rows.push(['Estimated cost', MM.fmt(boxes * v.price, 2)]);
    return {
      headline: { label: 'Boxes to buy', value: boxes + (boxes === 1 ? ' box' : ' boxes'), sub: f(area) + ' room · ' + f(bought) + ' purchased' },
      rows: rows,
      notes: [{ t: 'Keep one or two spare boxes sealed — discontinued lines and dye lots can be impossible to match later.' }]
    };
  },
  steps: [
    'Choose <strong>feet or meters</strong> and enter the room’s <strong>length and width</strong>. For L-shaped rooms, calculate each part and add the boxes.',
    'Enter the <strong>coverage per box</strong> from the packaging.',
    'Choose a <strong>waste allowance</strong> for your layout — more for diagonal or patterned floors.',
    'Optionally enter the <strong>price per box</strong> to see the total cost.',
    'Press <strong>Calculate</strong> and buy the number of boxes shown.'
  ],
  formula: {
    code: `area = length × width\nneeded = area × (1 + waste% ÷ 100)\nboxes = ceil( needed ÷ coverage per box )`,
    example: 'A 15 × 12 ft room has 180 sq ft. With 10% waste you need 198 sq ft. At 20 sq ft per box: 198 ÷ 20 = 9.9, so buy <strong>10 boxes</strong> (200 sq ft), leaving 20 sq ft spare.'
  },
  table: {
    title: 'Boxes needed by room size',
    head: ['Room (ft)', 'Area', 'Boxes (20 sq ft, 10% waste)'],
    rows: [['10 × 10', '100 sq ft', '6'], ['12 × 12', '144 sq ft', '8'], ['12 × 15', '180 sq ft', '10'], ['15 × 20', '300 sq ft', '17'], ['20 × 25', '500 sq ft', '28']],
    note: 'Check the coverage on your own product — boxes range from about 12 to 30 sq ft.'
  },
  sections: [
    { h2: 'How much waste should you allow?', html: '<p>Waste covers cut-offs at walls, doorways and corners, plus the odd damaged plank. For a straight lay in a simple rectangle, 5–10% is typical. Diagonal installs need more because every board is cut at an angle, and herringbone or chevron patterns can use 15–20%. Rooms with many alcoves, stairs or angled walls also need extra.</p>' },
    { h2: 'Before you buy', html: '<ul><li>Measure at the widest and longest points, and add closets and door openings you will floor.</li><li>Let planks acclimatise in the room for the time on the box, usually 48 hours.</li><li>Check subfloor flatness — most floating floors need it flat within 3/16 in over 10 ft.</li><li>Buy all boxes in one go so the batch numbers match.</li></ul>' },
    { h2: 'Underlay and trim', html: '<p>This calculator covers the flooring itself. Underlay is sold by area, so use the room area plus a few percent, and trim such as skirting, thresholds and quarter-round is sold by length — measure the perimeter.</p>' }
  ],
  faqs: [
    ['How do I calculate how much flooring I need?', 'Multiply room length by width for the area, add 5–15% for waste, and divide by the coverage on each box, rounding up.'],
    ['How much extra flooring should I buy?', '10% is standard for straight installs. Use 15% or more for diagonal layouts and 20% for herringbone.'],
    ['Do I measure under cabinets and appliances?', 'No, you only need to floor what is visible, though some installers floor under dishwashers to ease replacement.'],
    ['How many square feet are in a box of laminate?', 'It varies by brand. Many laminate and vinyl plank boxes cover 18–24 sq ft; check the label.'],
    ['Does this work for tile?', 'Yes, enter the coverage per carton and use 10–15% waste. Large-format and diagonal tile needs the upper end.'],
    ['Can I use metric?', 'Yes. Switch to metric and enter meters and square meters of coverage per pack.'],
    ['Why keep spare boxes?', 'Repairs later are much easier when you have planks from the same batch.']
  ],
  related: ['paint-calculator', 'grout-calculator', 'concrete-calculator', 'wood-stain-calculator']
},

/* ------------------------------------------------------------------ MULCH */
{
  slug: 'mulch-calculator', cat: 'home', icon: '🌱',
  h1: 'Mulch Calculator',
  title: 'Mulch Calculator – Cubic Yards & Bags Needed',
  description: 'Mulch calculator for garden beds: enter the length, width and depth to get cubic yards, cubic feet, cubic meters and how many 2 cu ft or 3 cu ft bags to buy.',
  card: 'Cubic yards and bag counts for garden beds, borders and play areas.',
  keywords: 'mulch calculator cubic yards how much mulch do i need bags garden bed depth',
  intro: 'Enter the size of your garden bed and the depth you want to see how much mulch to order — in cubic yards or meters and in bags.',
  units: [['imperial', 'Imperial (ft, in)'], ['metric', 'Metric (m, cm)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'length', label: 'Bed length', unit: U(['imperial', 'ft'], ['metric', 'm']), defaults: { imperial: 20, metric: 6 } },
    { name: 'width', label: 'Bed width', unit: U(['imperial', 'ft'], ['metric', 'm']), defaults: { imperial: 10, metric: 3 } },
    { name: 'depth', label: 'Mulch depth', unit: U(['imperial', 'in'], ['metric', 'cm']), defaults: { imperial: 3, metric: 7.5 }, hint: '2–4 in (5–10 cm) is typical.' },
    { name: 'waste', label: 'Extra', unit: '%', value: 5, positive: false, max: 50, hint: 'Allows for settling and uneven ground.' },
  ],
  compute: function (v) {
    var m = v.units === 'metric', cuft;
    cuft = m ? v.length * v.width * (v.depth / 100) * 35.3147 : v.length * v.width * (v.depth / 12);
    var waste = v.waste || 0, t = cuft * (1 + waste / 100), yd = t / 27, m3 = t / 35.3147;
    return {
      headline: { label: 'Mulch needed', value: m ? MM.fmt(m3, 2) + ' m³' : MM.fmt(yd, 2) + ' yd³', sub: (m ? MM.fmt(yd, 2) + ' cubic yards' : MM.fmt(m3, 2) + ' cubic meters') + ' · ' + MM.fmt(t, 1) + ' cubic feet' },
      rows: [
        { section: 'Volume (with ' + waste + '% extra)' },
        ['Cubic yards', MM.fmt(yd, 2)], ['Cubic feet', MM.fmt(t, 1)], ['Cubic meters', MM.fmt(m3, 2)], ['Liters', MM.fmt(m3 * 1000, 0)],
        { section: 'Bags (rounded up)' },
        ['2 cu ft bags', String(Math.ceil(t / 2 - 1e-9))], ['3 cu ft bags', String(Math.ceil(t / 3 - 1e-9))], ['50 liter bags', String(Math.ceil(m3 * 1000 / 50 - 1e-9))]
      ],
      notes: [{ t: yd >= 2 ? 'For two or more cubic yards, bulk delivery is usually cheaper than bags.' : 'This amount is a good fit for bagged mulch.' },
        { t: 'Keep mulch a few inches away from tree trunks and plant stems to prevent rot.' }]
    };
  },
  steps: [
    'Choose <strong>imperial or metric</strong> and measure the <strong>length and width</strong> of the bed. Split curved beds into simple rectangles.',
    'Enter the <strong>depth</strong> of mulch you want to spread.',
    'Keep the <strong>5% extra</strong> for settling, or raise it for uneven ground.',
    'Press <strong>Calculate</strong> to see bulk volume and the number of bags.'
  ],
  formula: {
    code: `volume (ft³) = length × width × depth (in) ÷ 12\ncubic yards = ft³ ÷ 27 · cubic meters = ft³ ÷ 35.315\nbags = ft³ ÷ bag size (2 or 3 ft³)`,
    example: 'A 20 × 10 ft bed with 3 in of mulch: 20 × 10 × 3 ÷ 12 = 50 ft³. Add 5% = 52.5 ft³ = <strong>1.94 cubic yards</strong>, or <strong>27 bags</strong> of 2 cu ft.'
  },
  table: {
    title: 'How far one cubic yard goes',
    head: ['Depth', 'Coverage per cubic yard'],
    rows: [['2 in (5 cm)', '162 sq ft (15 m²)'], ['3 in (7.5 cm)', '108 sq ft (10 m²)'], ['4 in (10 cm)', '81 sq ft (7.5 m²)'], ['6 in (15 cm)', '54 sq ft (5 m²)']],
    note: 'One cubic yard equals 27 cubic feet, or about 0.76 cubic meters.'
  },
  sections: [
    { h2: 'How deep should mulch be?', html: '<p>Two to three inches suits most flower and shrub beds: enough to block weeds and hold moisture without smothering roots. Use 3–4 inches around trees and in play areas, where wood chips also cushion falls. A deeper layer is not better — mulch piled against stems traps moisture and invites pests and rot.</p>' },
    { h2: 'Bags or bulk?', html: '<p>Bagged mulch is convenient for small beds, but each 2 cu ft bag covers only 12 sq ft at 2 inches deep. A cubic yard is the same as 13.5 two-cubic-foot bags and is usually much cheaper when delivered by the truck-load. If you need more than two yards, ask local landscape suppliers for a quote.</p>' },
    { h2: 'Choosing a mulch', html: '<ul><li><strong>Bark and wood chips:</strong> long-lasting, good for trees and paths.</li><li><strong>Shredded hardwood:</strong> knits together on slopes.</li><li><strong>Compost or leaf mould:</strong> feeds soil in vegetable beds.</li><li><strong>Gravel:</strong> permanent, but does not add nutrients.</li></ul>' }
  ],
  faqs: [
    ['How much mulch do I need for a 10 × 20 bed?', 'At 3 inches deep, a 200 sq ft bed needs 50 cubic feet, or about 1.85 cubic yards, plus a little extra for settling.'],
    ['How many bags of mulch are in a cubic yard?', 'A cubic yard is 27 cubic feet, so it takes 13.5 bags of 2 cu ft or 9 bags of 3 cu ft.'],
    ['How deep should I spread mulch?', 'Usually 2–4 inches. Thinner layers do not suppress weeds; thicker layers can suffocate roots.'],
    ['How often should I replace mulch?', 'Top up annually. Organic mulch decomposes, so refresh the layer to its original depth each year or two.'],
    ['Do I need landscape fabric under mulch?', 'Not always. Fabric can help on paths, but in planting beds it often stops organic mulch from feeding the soil.'],
    ['Can I use the calculator for gravel?', 'Yes — the volume is calculated the same way. For weight, multiply the cubic yards by the density from your supplier.'],
    ['What does the metric option give me?', 'Cubic meters, liters and bags of 50 liters, for UK, Canadian and Australian suppliers.']
  ],
  related: ['concrete-calculator', 'wood-stain-calculator', 'paint-calculator', 'dog-food-calculator']
},

/* ------------------------------------------------------------------ DOG FOOD */
{
  slug: 'dog-food-calculator', cat: 'pets', icon: '🦴',
  h1: 'Dog Food Calculator',
  title: 'Dog Food Calculator – How Much Should I Feed?',
  description: 'Dog food calculator: estimate your dog’s daily calories from weight and life stage, then convert to cups or grams of food per day and per meal.',
  card: 'Daily calories and cups per meal for puppies, adults and dogs on a diet.',
  keywords: 'dog food calculator how much should i feed my dog calories per day cups puppy adult',
  intro: 'Enter your dog’s weight and life stage to estimate daily calories, then turn that into cups or grams using the calorie count on your dog’s food.',
  units: [['lb', 'Pounds (lb)'], ['kg', 'Kilograms (kg)']],
  unitsLabel: 'Weight in',
  fields: [
    { name: 'weight', label: 'Dog’s weight', unit: U(['lb', 'lb'], ['kg', 'kg']), defaults: { lb: 40, kg: 18 }, hint: 'For weight loss, enter the ideal (target) weight.' },
    { name: 'stage', type: 'select', label: 'Life stage / goal', options: [['adult', 'Neutered adult'], ['intact', 'Intact adult'], ['inactive', 'Inactive or prone to weight gain'], ['loss', 'Weight loss'], ['pup', 'Puppy under 4 months'], ['pup2', 'Puppy 4 months to adult'], ['active', 'Highly active / working']], value: 'adult' },
    { name: 'kcal', label: 'Calories per cup of your food', unit: 'kcal', value: 370, hint: 'See the label. Dry dog food is often 300–450 kcal per cup.' },
    { name: 'meals', label: 'Meals per day', value: 2, step: 1, max: 8 },
  ],
  compute: function (v) {
    var kg = v.units === 'kg' ? v.weight : v.weight / 2.20462;
    var rer = 70 * Math.pow(kg, 0.75);
    var f = { adult: 1.6, intact: 1.8, inactive: 1.4, loss: 1.0, pup: 3.0, pup2: 2.0, active: 3.0 }[v.stage];
    var kcal = rer * f, cups = kcal / v.kcal, meals = Math.max(1, Math.round(v.meals));
    var grams = cups * 100;
    return {
      headline: { label: 'Daily calories', value: MM.fmt(kcal, 0) + ' kcal', sub: MM.fmt(cups, 2) + ' cups of food per day at ' + v.kcal + ' kcal per cup' },
      rows: [
        { section: 'Energy' }, ['Resting energy (RER)', MM.fmt(rer, 0) + ' kcal'], ['Life stage factor', '× ' + f],
        { section: 'Portions' }, ['Food per day', MM.fmt(cups, 2) + ' cups'], ['Food per meal (' + meals + ' meals)', MM.fmt(cups / meals, 2) + ' cups']
      ],
      notes: [{ t: 'A cup is about 100 g of typical dry food, but weigh yours for accuracy. Adjust by 10% if weight changes, and consult your vet for puppies, seniors or overweight dogs.' }]
    };
  },
  steps: [
    'Enter your dog’s <strong>weight</strong> in pounds or kilograms.',
    'Pick the <strong>life stage or goal</strong> that matches your dog.',
    'Enter the <strong>calories per cup</strong> from the food’s packaging.',
    'Choose the <strong>meals per day</strong> and press <strong>Calculate</strong>.',
    'Check your dog’s weight and body shape every few weeks, and adjust the portion by about 10% if needed.'
  ],
  formula: {
    code: `RER (kcal/day) = 70 × (weight in kg)^0.75\ndaily kcal = RER × life stage factor\n\nfactors: neutered adult 1.6 · intact adult 1.8 · inactive 1.4\nweight loss 1.0 · puppy <4 months 3.0 · puppy 4+ months 2.0\nactive / working 3.0\n\ncups per day = daily kcal ÷ kcal per cup`,
    example: 'A neutered adult dog weighing 40 lb (18.1 kg): RER = 70 × 18.1^0.75 ≈ 616 kcal. × 1.6 = <strong>985 kcal per day</strong>. At 370 kcal per cup, that is <strong>2.7 cups per day</strong>, or 1.3 cups at each of two meals.'
  },
  table: {
    title: 'Daily calories for neutered adult dogs',
    head: ['Weight', 'Calories per day', 'Cups at 370 kcal/cup'],
    rows: [['10 lb (4.5 kg)', '≈ 348', '0.9'], ['25 lb (11.3 kg)', '≈ 692', '1.9'], ['40 lb (18.1 kg)', '≈ 985', '2.7'], ['60 lb (27.2 kg)', '≈ 1,335', '3.6'], ['80 lb (36.3 kg)', '≈ 1,656', '4.5']],
    note: 'Starting estimates only — activity, breed and metabolism vary.'
  },
  sections: [
    { h2: 'Why calories beat the feeding chart on the bag', html: '<p>Feeding charts on pet food bags are broad averages and tend to overestimate for neutered, indoor dogs. Working from your dog’s own energy requirement gives a far more tailored target. The resting energy figure estimates what your dog burns just to stay alive, and the life-stage factor adds the energy used for growth, activity and recovery.</p>' },
    { h2: 'Check body condition, not just numbers', html: '<p>Use the result as a starting point, then watch your dog. You should be able to feel the ribs under a thin layer of fat, see a waist from above and a tucked belly from the side. If your dog is gaining, cut the portion by 10%; if they look too thin, add 10% and talk to your vet.</p>' },
    { h2: 'Treats and extras', html: '<p>Treats, chews and table scraps add up quickly. A good rule is to keep them under 10% of the daily calories and reduce the main meal to match. Training treats can be broken into pea-sized pieces.</p>' }
  ],
  faqs: [
    ['How much should I feed my dog per day?', 'It depends on weight, age and activity. A neutered 40 lb adult dog needs roughly 985 calories per day, about 2.7 cups of a 370 kcal-per-cup food.'],
    ['How many times a day should I feed a dog?', 'Two meals a day suit most adult dogs. Puppies often need three or four smaller meals.'],
    ['How do I find the calories in my dog food?', 'Look for “kcal per cup” or “metabolizable energy” on the packaging or the manufacturer’s website.'],
    ['How much should a puppy eat?', 'Puppies need much more energy per pound than adults — roughly two to three times resting energy. Follow your vet’s guidance and adjust as they grow.'],
    ['My dog is overweight. What should I do?', 'Select “weight loss” and enter the target weight. Slow, steady loss under a vet’s supervision is safest.'],
    ['Is a cup the same as 100 grams?', 'Roughly for dry kibble, but kibble density varies a lot, so weigh the food on a scale for accuracy.'],
    ['Is this a substitute for vet advice?', 'No. It is a general guide; dogs with health conditions have special needs.']
  ],
  related: ['cat-food-calculator', 'dog-age-calculator', 'dog-chocolate-toxicity-calculator', 'mulch-calculator']
},

/* ------------------------------------------------------------------ PERCENTAGE */
{
  slug: 'percentage-calculator', cat: 'everyday', icon: '％',
  h1: 'Percentage Calculator',
  title: 'Percentage Calculator – Percent of, Change & More',
  description: 'Free percentage calculator: find a percent of a number, what percent one number is of another, percentage change, or add and subtract a percentage.',
  card: 'Percent of a number, percentage change, add or subtract a percentage.',
  keywords: 'percentage calculator percent of a number percentage change increase decrease what percent is',
  intro: 'Pick the question you want answered, enter two numbers, and get the percentage straight away — no formulas to remember.',
  fields: [
    { name: 'mode', type: 'select', label: 'What do you want to work out?', full: true, value: 'of', options: [['of', 'What is A% of B?'], ['is', 'A is what percent of B?'], ['change', 'Percentage change from A to B'], ['add', 'Add B% to A'], ['sub', 'Subtract B% from A']] },
    { name: 'a', label: 'Number A', positive: false, value: 15 },
    { name: 'b', label: 'Number B', positive: false, value: 240 },
  ],
  compute: function (v) {
    var a = v.a, b = v.b, r, head, lab, rows = [], sub = '';
    if (v.mode === 'of') { r = a / 100 * b; lab = a + '% of ' + b; head = MM.fmt(r, 4); rows.push(['Calculation', a + ' ÷ 100 × ' + b]); }
    else if (v.mode === 'is') {
      if (b === 0) return { error: 'Number B cannot be zero.' };
      r = a / b * 100; lab = a + ' as a percent of ' + b; head = MM.fmt(r, 4) + '%'; rows.push(['Calculation', a + ' ÷ ' + b + ' × 100']);
    } else if (v.mode === 'change') {
      if (a === 0) return { error: 'Number A cannot be zero when working out a change.' };
      r = (b - a) / a * 100; lab = 'Change from ' + a + ' to ' + b; head = (r > 0 ? '+' : '') + MM.fmt(r, 4) + '%';
      sub = r > 0 ? 'an increase' : r < 0 ? 'a decrease' : 'no change'; rows.push(['Difference', MM.fmt(b - a, 4)]);
    } else if (v.mode === 'add') { r = a * (1 + b / 100); lab = a + ' plus ' + b + '%'; head = MM.fmt(r, 4); rows.push(['Amount added', MM.fmt(r - a, 4)]); }
    else { r = a * (1 - b / 100); lab = a + ' minus ' + b + '%'; head = MM.fmt(r, 4); rows.push(['Amount removed', MM.fmt(a - r, 4)]); }
    return { headline: { label: lab, value: head, sub: sub }, rows: rows, notes: [] };
  },
  steps: [
    'Choose the <strong>type of question</strong> from the drop-down, such as “What is A% of B?”.',
    'Type your first number in <strong>A</strong> and the second in <strong>B</strong>, matching the wording of your question.',
    'Press <strong>Calculate</strong> to see the answer and the calculation behind it.',
    'Change the mode to answer a different question using the same numbers.'
  ],
  formula: {
    code: `A% of B       = A ÷ 100 × B\nA is what % of B = A ÷ B × 100\n% change      = (B − A) ÷ A × 100\nadd B% to A   = A × (1 + B ÷ 100)\nsubtract B%   = A × (1 − B ÷ 100)`,
    example: '15% of 240 = 15 ÷ 100 × 240 = <strong>36</strong>. A price rising from 80 to 100 is a change of (100 − 80) ÷ 80 × 100 = <strong>+25%</strong>. Adding 20% to 50 gives 50 × 1.2 = <strong>60</strong>.'
  },
  table: {
    title: 'Quick percentage reference',
    head: ['Percent', 'Fraction', 'Of 200', 'Mental shortcut'],
    rows: [['10%', '1/10', '20', 'Move the decimal one place'], ['20%', '1/5', '40', 'Double 10%'], ['25%', '1/4', '50', 'Divide by 4'], ['50%', '1/2', '100', 'Divide by 2'], ['75%', '3/4', '150', 'Halve, then add a quarter'], ['5%', '1/20', '10', 'Half of 10%']],
    note: 'Percentages are just fractions out of 100.'
  },
  sections: [
    { h2: 'Percentage change vs. percentage points', html: '<p>If an interest rate rises from 4% to 5%, it has gone up by <strong>one percentage point</strong>, but the rate itself has increased by <strong>25%</strong> (1 ÷ 4). Mixing the two up is a very common error in news stories and spreadsheets. Use the “percentage change” mode when you compare two amounts, and describe rate differences in percentage points.</p>' },
    { h2: 'Why a 20% rise and a 20% fall do not cancel', html: '<p>Increase 100 by 20% and you reach 120. Reduce 120 by 20% and you get 96, not 100. The percentage applies to a different starting number each time. To undo a 20% increase you need a fall of about 16.7%.</p>' },
    { h2: 'Everyday uses', html: '<ul><li>Sales tax, VAT and GST added to a price.</li><li>Discounts and markups in shopping and business.</li><li>Grades, scores and survey results.</li><li>Growth in savings, rent or prices.</li></ul>' }
  ],
  faqs: [
    ['How do I calculate a percentage of a number?', 'Divide the percentage by 100 and multiply by the number. For 15% of 240: 15 ÷ 100 × 240 = 36.'],
    ['How do I work out a percentage increase?', 'Subtract the old value from the new one, divide by the old value, and multiply by 100.'],
    ['How do I add a percentage to a number?', 'Multiply the number by 1 plus the percentage as a decimal. To add 20%, multiply by 1.2.'],
    ['How do I find what percent one number is of another?', 'Divide the first number by the second and multiply by 100.'],
    ['What is the difference between percent and percentage points?', 'Percentage points are the arithmetic difference between two percentages. Percent change compares them proportionally.'],
    ['Can percentages be over 100%?', 'Yes. A value that is double the original is a 100% increase, or 200% of the original.'],
    ['Why can’t I divide by zero?', 'Percent change is relative to the starting number, so a start of zero has no defined percentage.']
  ],
  related: ['discount-calculator', 'tip-calculator', 'bmi-calculator', 'paint-calculator']
},

/* ------------------------------------------------------------------ TIP */
{
  slug: 'tip-calculator', cat: 'everyday', icon: '🧾',
  h1: 'Tip Calculator',
  title: 'Tip Calculator – Split the Bill & Tip Fast',
  description: 'Free tip calculator: enter the bill and tip percentage to see the tip, the total and each person’s share when you split the check. Works for any currency.',
  card: 'Work out the tip, the total and each person’s share of the bill.',
  keywords: 'tip calculator split bill gratuity restaurant how much to tip percentage per person',
  intro: 'Enter your bill, choose a tip percentage and the number of people to see the tip, the total and what everyone owes.',
  button: 'Calculate tip',
  fields: [
    { name: 'bill', label: 'Bill amount', value: 85.5, hint: 'Any currency — before tip.' },
    { name: 'pct', label: 'Tip percentage', unit: '%', value: 18, positive: false, max: 100 },
    { name: 'people', label: 'Split between', unit: 'people', value: 4, step: 1, max: 100 },
    { name: 'round', type: 'select', label: 'Round each share up?', options: [['no', 'No — exact amounts'], ['yes', 'Yes — to the next whole number']], value: 'no' },
  ],
  compute: function (v) {
    var n = Math.max(1, Math.round(v.people)), tip = v.bill * (v.pct || 0) / 100, total = v.bill + tip;
    var each = total / n; if (v.round === 'yes') each = Math.ceil(each - 1e-9);
    var paid = each * n;
    var rows = [
      ['Bill', MM.fmt(v.bill, 2)], ['Tip (' + (v.pct || 0) + '%)', MM.fmt(tip, 2)], ['Total', MM.fmt(total, 2)],
      ['Tip per person', MM.fmt(tip / n, 2)], ['Bill per person', MM.fmt(v.bill / n, 2)]
    ];
    if (v.round === 'yes') rows.push(['Collected after rounding', MM.fmt(paid, 2) + ' (extra tip ' + MM.fmt(paid - total, 2) + ')']);
    return { headline: { label: n > 1 ? 'Each person pays' : 'Total to pay', value: MM.fmt(each, 2), sub: 'Tip ' + MM.fmt(tip, 2) + ' · total ' + MM.fmt(total, 2) }, rows: rows, notes: [] };
  },
  steps: [
    'Enter the <strong>bill amount</strong> before the tip.',
    'Type your <strong>tip percentage</strong> — see the guide below if you are unsure.',
    'Enter how many <strong>people</strong> are splitting the check.',
    'Choose whether to <strong>round shares up</strong> to the next whole number, then press <strong>Calculate tip</strong>.'
  ],
  formula: {
    code: `tip = bill × tip% ÷ 100\ntotal = bill + tip\neach person = total ÷ number of people`,
    example: 'A bill of 85.50 with an 18% tip: tip = 85.50 × 0.18 = <strong>15.39</strong>. Total = <strong>100.89</strong>. Split between 4 people, each pays <strong>25.22</strong>.'
  },
  table: {
    title: 'Typical tipping norms',
    head: ['Country', 'Restaurants', 'Notes'],
    rows: [['United States', '15–20%', 'Tipping is expected; staff rely on it.'], ['Canada', '15–20%', 'Similar to the US.'], ['United Kingdom', '10–12.5%', 'Check whether a service charge is already included.'], ['Australia', '0–10%', 'Optional; for great service.']],
    note: 'General customs only — practices differ by venue and region.'
  },
  sections: [
    { h2: 'Tip on the pre-tax amount?', html: '<p>Many people tip on the pre-tax subtotal, while others tip on the total. Either is acceptable; the difference on a typical meal is small. Enter whichever amount you prefer as the bill. If your check already includes an automatic service charge, which is common for large parties, you generally do not need to add another tip.</p>' },
    { h2: 'Splitting fairly', html: '<p>An even split is the quickest, but it can feel unfair when some people order much more. In that case, work out each person’s own bill and tip, or round up shares so the server is covered. The “round up” option makes the maths painless — the extra goes to the tip.</p>' },
    { h2: 'Tipping beyond restaurants', html: '<ul><li>Delivery drivers and rideshare: 10–20%.</li><li>Hairdressers and barbers: 10–20%.</li><li>Taxi: round up or 10%.</li><li>Hotel housekeeping and porters: a small fixed amount per day or bag.</li></ul>' }
  ],
  faqs: [
    ['How do I calculate a 20% tip?', 'Multiply the bill by 0.2. A quick way is to find 10% by moving the decimal point one place, and then double it.'],
    ['How much should I tip at a restaurant?', 'In the US and Canada 15–20% is standard. In the UK 10–12.5% is common if no service charge is included, and in Australia a tip is optional.'],
    ['Should I tip before or after tax?', 'Either is acceptable. Many people tip on the pre-tax amount; others use the total.'],
    ['How do I split a bill with a tip?', 'Add the tip to the bill and divide the total by the number of people. The calculator shows each person’s share.'],
    ['What if service was poor?', 'Many diners lower the tip for genuinely poor service, but first consider whether the problem was in the kitchen or the staff’s control.'],
    ['Does it work with other currencies?', 'Yes. Amounts have no currency symbol, so use any currency.'],
    ['Is a service charge the same as a tip?', 'Not always. Ask whether it goes to the staff, and do not tip twice unless you want to.']
  ],
  related: ['percentage-calculator', 'discount-calculator', 'bmi-calculator', 'paint-calculator']
},

/* ------------------------------------------------------------------ DISCOUNT */
{
  slug: 'discount-calculator', cat: 'everyday', icon: '🏷️',
  h1: 'Discount Calculator',
  title: 'Discount Calculator – Sale Price & Savings',
  description: 'Discount calculator: enter the original price and discount percentage to find the sale price and savings, with optional extra discount and sales tax or VAT.',
  card: 'Sale price, savings and final cost with an optional extra discount and tax.',
  keywords: 'discount calculator sale price percent off savings how much is 30% off with tax vat',
  intro: 'Enter the original price and the percent off to see the sale price and how much you save, with an optional extra discount and sales tax.',
  fields: [
    { name: 'price', label: 'Original price', value: 120 },
    { name: 'off', label: 'Discount', unit: '% off', value: 25, positive: false, max: 100 },
    { name: 'extra', label: 'Extra discount (optional)', unit: '% off', value: 0, positive: false, max: 100, hint: 'Applied after the first discount, such as a coupon.' },
    { name: 'tax', label: 'Sales tax / VAT / GST (optional)', unit: '%', value: 0, positive: false, max: 100 },
  ],
  compute: function (v) {
    var d1 = v.price * (1 - (v.off || 0) / 100), d2 = d1 * (1 - (v.extra || 0) / 100);
    var tax = d2 * (v.tax || 0) / 100, final = d2 + tax, saved = v.price - d2;
    var rows = [['Original price', MM.fmt(v.price, 2)], ['After ' + (v.off || 0) + '% off', MM.fmt(d1, 2)]];
    if (v.extra) rows.push(['After extra ' + v.extra + '% off', MM.fmt(d2, 2)]);
    rows.push(['You save', MM.fmt(saved, 2) + ' (' + MM.fmt(saved / v.price * 100, 1) + '%)']);
    if (v.tax) rows.push(['Tax (' + v.tax + '%)', MM.fmt(tax, 2)]);
    return { headline: { label: v.tax ? 'Final price with tax' : 'Sale price', value: MM.fmt(final, 2), sub: 'You save ' + MM.fmt(saved, 2) }, rows: rows, notes: [{ t: 'Two discounts of 25% and 10% combine to 32.5% off, not 35%, because the second applies to the reduced price.' }] };
  },
  steps: [
    'Enter the <strong>original price</strong> before any discount.',
    'Type the <strong>percentage off</strong> shown on the sale tag.',
    'If you have a coupon, add it as an <strong>extra discount</strong>; it is applied after the first.',
    'Enter your <strong>sales tax or VAT</strong> to see the price you actually pay, then press <strong>Calculate</strong>.'
  ],
  formula: {
    code: `sale price = price × (1 − discount% ÷ 100)\nwith extra = sale price × (1 − extra% ÷ 100)\ntax = price after discounts × tax% ÷ 100\nfinal = price after discounts + tax`,
    example: 'A 120 jacket at 25% off = 120 × 0.75 = <strong>90</strong>. A further 10% coupon makes it 81. With 8% tax: 81 × 1.08 = <strong>87.48</strong>. You save 39 before tax.'
  },
  table: {
    title: 'Common discounts on a 100 item',
    head: ['Discount', 'Sale price', 'You save'],
    rows: [['10% off', '90', '10'], ['20% off', '80', '20'], ['25% off', '75', '25'], ['30% off', '70', '30'], ['50% off', '50', '50'], ['70% off', '30', '70']],
    note: 'For other prices, scale proportionally.'
  },
  sections: [
    { h2: 'How stacked discounts really work', html: '<p>When a store offers “20% off, then an extra 10% off”, the second discount applies to the already-reduced price. The total saving is 28%, not 30%. This calculator applies them in sequence, matching how checkouts do it, so you can see the true price before buying.</p>' },
    { h2: 'Tax, VAT and GST', html: '<p>Tax is normally added after discounts. In the US, sales tax varies by state and city; in the UK, VAT is usually already included in the shelf price; in Canada and Australia, GST (and in Canada PST or HST) is added at the till. Enter your local rate to see the figure you will actually pay.</p>' },
    { h2: 'Is the discount a real bargain?', html: '<ul><li>Compare the sale price with the price at other shops.</li><li>Be wary of inflated “original” prices.</li><li>Factor in delivery fees and returns policies.</li></ul>' }
  ],
  faqs: [
    ['How do I calculate a percentage discount?', 'Multiply the price by the discount percentage divided by 100 to get the saving, then subtract it from the price. Or multiply by (1 − discount/100) in one step.'],
    ['How much is 30% off 80?', '30% of 80 is 24, so the sale price is 56.'],
    ['Do two discounts add together?', 'No. A second discount applies to the reduced price, so 20% and 10% together equal 28% off.'],
    ['Is tax added before or after the discount?', 'Usually after: the discount reduces the price first, then tax applies to the lower amount. Check your local rules.'],
    ['How do I find the original price from the sale price?', 'Divide the sale price by (1 − discount/100). If an item costs 75 after 25% off, the original price was 75 ÷ 0.75 = 100.'],
    ['What is the percentage saved?', 'Savings divided by the original price, times 100. The calculator shows it for you.'],
    ['Does this work in any currency?', 'Yes. Amounts have no symbol, so use your own currency.']
  ],
  related: ['percentage-calculator', 'tip-calculator', 'bmi-calculator', 'flooring-calculator']
},

/* ------------------------------------------------------------------ BMI */
{
  slug: 'bmi-calculator', cat: 'everyday', icon: '⚖️',
  h1: 'BMI Calculator',
  title: 'BMI Calculator – Body Mass Index for Adults',
  description: 'BMI calculator for adults: enter your height and weight in metric or imperial units to see your body mass index, weight category and healthy weight range.',
  card: 'Body mass index and healthy weight range for adults, in metric or imperial.',
  keywords: 'bmi calculator body mass index healthy weight range adults height weight',
  intro: 'Enter your height and weight to see your body mass index, the WHO weight category and the weight range that corresponds to a healthy BMI for your height.',
  units: [['imperial', 'Imperial (ft, in, lb)'], ['metric', 'Metric (cm, kg)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'ft', label: 'Height — feet', unit: 'ft', value: 5, step: 1, showIf: 'units=imperial' },
    { name: 'inch', label: 'Height — inches', unit: 'in', value: 9, positive: false, max: 11.9, showIf: 'units=imperial' },
    { name: 'cm', label: 'Height', unit: 'cm', value: 175, showIf: 'units=metric', full: true },
    { name: 'weight', label: 'Weight', unit: U(['imperial', 'lb'], ['metric', 'kg']), defaults: { imperial: 154, metric: 70 }, full: true },
  ],
  compute: function (v) {
    var m = v.units === 'metric';
    var h = m ? v.cm / 100 : ((v.ft || 0) * 12 + (v.inch || 0)) * 0.0254;
    var kg = m ? v.weight : v.weight / 2.20462;
    if (h < 0.9 || h > 2.5) return { error: 'Please enter a realistic adult height.' };
    var bmi = kg / (h * h);
    var cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obesity';
    var lo = 18.5 * h * h, hi = 24.9 * h * h;
    var w = function (k) { return m ? MM.fmt(k, 1) + ' kg' : MM.fmt(k * 2.20462, 0) + ' lb'; };
    return {
      headline: { label: 'Your BMI', value: MM.fmt(bmi, 1), sub: cat + ' (WHO adult categories)' },
      rows: [
        { section: 'Result' }, ['BMI', MM.fmt(bmi, 1) + ' kg/m²'], ['Category', cat],
        { section: 'Healthy range for your height (BMI 18.5–24.9)' }, ['Weight range', w(lo) + ' – ' + w(hi)],
        { section: 'WHO categories' }, ['Underweight', 'below 18.5'], ['Healthy weight', '18.5 – 24.9'], ['Overweight', '25 – 29.9'], ['Obesity', '30 and above']
      ],
      notes: [{ t: 'BMI is a screening tool, not a diagnosis. It does not measure body fat, muscle or fitness. Speak with a doctor or dietitian about your health.' }]
    };
  },
  steps: [
    'Choose <strong>imperial or metric</strong> units.',
    'Enter your <strong>height</strong> (feet and inches, or centimeters).',
    'Enter your <strong>weight</strong>.',
    'Press <strong>Calculate</strong> to see your BMI, category and healthy weight range.'
  ],
  formula: {
    code: `metric:   BMI = weight (kg) ÷ height (m)²\nimperial: BMI = 703 × weight (lb) ÷ height (in)²\n\nhealthy weight range = 18.5 × h² to 24.9 × h²  (h in meters)`,
    example: 'A person who is 175 cm (1.75 m) and weighs 70 kg: BMI = 70 ÷ 1.75² = 70 ÷ 3.0625 = <strong>22.9</strong>, in the healthy range of 18.5–24.9.'
  },
  table: {
    title: 'Adult BMI categories (WHO)',
    head: ['BMI', 'Category'],
    rows: [['Below 18.5', 'Underweight'], ['18.5 – 24.9', 'Healthy weight'], ['25.0 – 29.9', 'Overweight'], ['30.0 – 34.9', 'Obesity class I'], ['35.0 – 39.9', 'Obesity class II'], ['40 and above', 'Obesity class III']],
    note: 'These cut-offs apply to adults aged 20 and over. Children use age- and sex-specific percentile charts.'
  },
  sections: [
    { h2: 'What BMI can and cannot tell you', html: '<p>Body mass index compares weight to height and is widely used to screen for weight-related health risks across populations. It is quick and free, but it cannot distinguish muscle from fat, does not show where fat is stored and may be less accurate for athletes, older adults, pregnant women and people of some ethnic backgrounds. Use it as one data point, alongside waist measurement, fitness and blood tests.</p>' },
    { h2: 'Using the healthy range', html: '<p>The range shown is the weight that gives a BMI between 18.5 and 24.9 at your height. It is a guide rather than a target; the healthiest weight for you depends on your age, build and medical history. If you want to lose or gain weight, talk with a doctor or registered dietitian.</p>' },
    { h2: 'Not for children', html: '<p>This calculator is for adults. Children and teenagers are assessed using BMI-for-age percentiles that account for growth, so use a paediatric growth chart or ask your doctor.</p>' }
  ],
  faqs: [
    ['How is BMI calculated?', 'Divide weight in kilograms by height in meters squared. In imperial units, multiply weight in pounds by 703 and divide by height in inches squared.'],
    ['What is a healthy BMI?', 'For adults, the WHO defines a healthy weight as a BMI of 18.5 to 24.9.'],
    ['Is BMI accurate for athletes?', 'Not always. Muscle weighs more than fat, so muscular people may have a high BMI without excess body fat.'],
    ['Does BMI differ for men and women?', 'The adult categories are the same, though body fat percentages at a given BMI differ between men and women.'],
    ['Can I use BMI for my child?', 'No. Children use age- and sex-specific percentile charts. Ask your doctor.'],
    ['Does age affect BMI?', 'The formula does not change, but a slightly higher BMI may be acceptable in older adults. Ask your doctor.'],
    ['Is this medical advice?', 'No. It is an informational screening tool. Please consult a health professional about your weight.']
  ],
  related: ['percentage-calculator', 'tip-calculator', 'discount-calculator', 'dog-food-calculator']
},
];
