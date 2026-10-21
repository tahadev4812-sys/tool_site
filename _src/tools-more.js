/* Home & DIY and Pet calculators. Each `compute` is stringified into its page, so it must be self-contained (it may use the global MM helpers). */

module.exports = [
/* ------------------------------------------------------------------ PAINT */
{
  slug: 'paint-calculator', cat: 'home', icon: '🎨',
  h1: 'Paint Calculator',
  title: 'Paint Calculator – How Much Paint Do I Need?',
  description: 'Free paint calculator: enter your room size, doors, windows and coats to see how many gallons or liters of paint to buy for walls and ceiling.',
  card: 'Find out how many gallons or liters of paint a room needs, minus doors and windows.',
  keywords: 'paint calculator how much paint do i need room walls ceiling gallons liters coverage',
  intro: 'Enter the size of your room, subtract doors and windows, choose the number of coats, and get the amount of paint to buy in gallons and liters.',
  units: [['ft', 'Feet (ft)'], ['m', 'Meters (m)']],
  unitsLabel: 'Room measured in',
  fields: [
    { name: 'length', label: 'Room length', unit: { ft: 'ft', m: 'm' }, defaults: { ft: 14, m: 4.3 } },
    { name: 'width', label: 'Room width', unit: { ft: 'ft', m: 'm' }, defaults: { ft: 12, m: 3.7 } },
    { name: 'height', label: 'Wall height', unit: { ft: 'ft', m: 'm' }, defaults: { ft: 8, m: 2.4 } },
    { name: 'coats', type: 'select', label: 'Number of coats', options: [['1', '1 coat'], ['2', '2 coats (recommended)'], ['3', '3 coats']], value: '2' },
    { name: 'doors', label: 'Doors', value: 1, step: 1, positive: false, max: 20, hint: 'Each door is about 20 sq ft (1.9 m²).' },
    { name: 'windows', label: 'Windows', value: 2, step: 1, positive: false, max: 30, hint: 'Each window is about 15 sq ft (1.4 m²).' },
    { name: 'ceiling', type: 'select', label: 'Paint the ceiling too?', options: [['no', 'No — walls only'], ['yes', 'Yes — include ceiling']], value: 'no' },
    { name: 'cov', label: 'Paint coverage', unit: { ft: 'sq ft / gal', m: 'm² / L' }, defaults: { ft: 350, m: 8.6 }, hint: 'See the can. Most paint covers 350–400 sq ft per gallon.' },
  ],
  compute: function (v) {
    var m = v.units === 'm', k = m ? 3.28084 : 1;
    var l = v.length * k, w = v.width * k, h = v.height * k;
    var doors = Math.round(v.doors || 0), wins = Math.round(v.windows || 0);
    var walls = Math.max(0, 2 * (l + w) * h - doors * 20 - wins * 15);
    var ceil = v.ceiling === 'yes' ? l * w : 0;
    var coats = parseInt(v.coats, 10);
    var cov = m ? v.cov * 40.746 : v.cov;            // sq ft per US gallon
    var area = (walls + ceil) * coats, gal = area / cov, liters = gal * 3.78541;
    var a = function (sqft) { return m ? MM.fmt(sqft / 10.7639, 1) + ' m²' : MM.fmt(sqft, 0) + ' sq ft'; };
    return {
      headline: { label: 'Paint needed', value: m ? MM.fmt(liters, 1) + ' L' : MM.fmt(gal, 2) + ' gal', sub: m ? '≈ ' + MM.fmt(gal, 2) + ' US gallons' : '≈ ' + MM.fmt(liters, 1) + ' liters' },
      rows: [
        { section: 'Area to paint' },
        ['Wall area (after doors & windows)', a(walls)],
        v.ceiling === 'yes' ? ['Ceiling area', a(ceil)] : ['Ceiling', 'Not included'],
        ['Area × ' + coats + (coats > 1 ? ' coats' : ' coat'), a(area)],
        { section: 'Paint to buy' },
        ['US gallons', MM.fmt(gal, 2)], ['Liters', MM.fmt(liters, 1)],
        ['1-gallon cans (rounded up)', String(Math.ceil(gal - 1e-9))],
        ['5-liter tins (rounded up)', String(Math.ceil(liters / 5 - 1e-9))]
      ],
      notes: [{ t: 'Add a primer coat for bare drywall, dark colours or stained surfaces. Textured walls and bare plaster soak up 10–20% more paint.' }]
    };
  },
  steps: [
    'Pick <strong>feet or meters</strong> and measure the <strong>length, width and height</strong> of the room.',
    'Enter the number of <strong>doors and windows</strong> — their area is subtracted from the walls.',
    'Choose how many <strong>coats</strong> you plan to apply. Two coats is standard for a colour change.',
    'Tick <strong>ceiling</strong> if you are painting it too, and check the <strong>coverage</strong> printed on the can.',
    'Press <strong>Calculate</strong> and buy the number of cans shown (rounded up).'
  ],
  formula: {
    code: `wall area = 2 × (length + width) × height − doors × 20 − windows × 15\nceiling area = length × width            <span class="c">// optional</span>\n\npaint (gal) = (wall + ceiling area) × coats ÷ coverage per gallon\nliters = gallons × 3.785`,
    example: 'A 14 × 12 ft room with 8 ft walls, 1 door and 2 windows: 2 × (14 + 12) × 8 = 416 sq ft, minus 20 and 30 = <strong>366 sq ft</strong>. Two coats = 732 sq ft. At 350 sq ft per gallon that is <strong>2.09 gallons</strong>, so buy 3 one-gallon cans (or two gallons and a quart).'
  },
  table: {
    title: 'Paint needed by room size',
    head: ['Room (ft)', 'Wall area*', 'Gallons for 2 coats'],
    rows: [['10 × 10', '285 sq ft', '1.6'], ['10 × 12', '317 sq ft', '1.8'], ['12 × 12', '349 sq ft', '2.0'], ['12 × 14', '381 sq ft', '2.2'], ['14 × 16', '445 sq ft', '2.5'], ['16 × 20', '541 sq ft', '3.1']],
    note: '*8 ft ceilings, one door and one window deducted, ceiling not included, 350 sq ft per gallon.'
  },
  sections: [
    { h2: 'Why paint estimates are often wrong', html: '<p>Eyeballing the amount of paint usually leads to either a second trip to the store or a garage full of half-used cans. The most common mistakes are forgetting to count <strong>two coats</strong>, ignoring the ceiling and trusting a coverage figure that does not match your surface. Smooth, primed drywall reaches the full coverage on the can; rough stucco, textured plaster or porous bare wood can use up to 20% more.</p>' },
    { h2: 'Primer, colour changes and dark shades', html: '<p>A primer coat evens out porosity and blocks stains, so the topcoat goes further. Moving from a dark colour to a light one, or covering a bold shade, often needs primer plus two coats. If you’re painting over a similar colour in good condition, one coat may be enough for a quick refresh.</p><ul><li>Buy all the paint you need at once so the batch colour matches.</li><li>Keep a small amount for touch-ups, labelled with the room and date.</li></ul>' },
    { h2: 'Don’t forget trim and doors', html: '<p>This calculator covers walls and, optionally, the ceiling. Skirting boards (baseboards), window frames and doors are normally painted with a different, harder-wearing finish. A quart or litre is usually enough for the trim of an average room.</p>' }
  ],
  faqs: [
    ['How much paint do I need for a 12 × 12 room?', 'With 8 ft ceilings, one door and one window, a 12 × 12 ft room has about 349 sq ft of wall. Two coats need about 2 gallons of paint at 350 sq ft per gallon.'],
    ['How many square feet does a gallon of paint cover?', 'Most interior paint covers 350–400 square feet per gallon on smooth, primed walls. Rough surfaces use more. Check the can for the exact rate.'],
    ['Should I subtract doors and windows?', 'Yes. The calculator removes about 20 sq ft per door and 15 sq ft per window, a standard estimate. It leads to a more accurate amount, particularly in rooms with large windows.'],
    ['How many coats of paint do I need?', 'Two coats is the norm for a good finish and an even colour. One coat can be enough when repainting the same colour or using a paint-and-primer product on a clean wall.'],
    ['Do I need to paint the ceiling separately?', 'Ceilings use flat ceiling paint. Use the “include ceiling” option to add the area, or calculate the ceiling on its own if you use a different paint.'],
    ['Can I use litres and meters?', 'Yes. Switch to meters and the calculator accepts coverage in m² per liter and gives the answer in liters and 5-liter tins.'],
    ['What if my room is not rectangular?', 'Split the room into rectangles, calculate each, and add the results. For an L-shaped room that is two calculations.']
  ],
  related: ['grout-calculator', 'concrete-calculator', 'epoxy-resin-calculator', 'quilt-backing-calculator']
},

/* ------------------------------------------------------------------ GROUT */
{
  slug: 'grout-calculator', cat: 'home', icon: '🧱',
  h1: 'Grout Calculator',
  title: 'Grout Calculator – How Much Grout Do I Need?',
  description: 'Grout calculator for tile floors and walls: enter area, tile size and joint width to find the pounds or kilograms of grout and bags to buy.',
  card: 'Estimate the pounds or kilograms of grout for any tile size and joint width.',
  keywords: 'grout calculator how much grout do i need tile joint floor wall bathroom kitchen',
  intro: 'Enter your area, tile size and grout-joint width to see how much grout to buy — in pounds or kilograms — including a waste allowance.',
  units: [['imperial', 'Imperial (in, sq ft)'], ['metric', 'Metric (mm, m²)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'area', label: 'Area to tile', unit: { imperial: 'sq ft', metric: 'm²' }, defaults: { imperial: 100, metric: 10 } },
    { name: 'tl', label: 'Tile length', unit: { imperial: 'in', metric: 'mm' }, defaults: { imperial: 12, metric: 300 } },
    { name: 'tw', label: 'Tile width', unit: { imperial: 'in', metric: 'mm' }, defaults: { imperial: 12, metric: 300 } },
    { name: 'tt', label: 'Tile thickness (joint depth)', unit: { imperial: 'in', metric: 'mm' }, defaults: { imperial: 0.375, metric: 10 }, hint: 'Floor tile: 3/8 in (10 mm). Wall tile: 1/4 in (6 mm).' },
    { name: 'jw', label: 'Grout joint width', unit: { imperial: 'in', metric: 'mm' }, defaults: { imperial: 0.125, metric: 3 }, hint: '1/8 in is 3 mm; 1/16 in is 1.6 mm.' },
    { name: 'waste', label: 'Extra for waste', unit: '%', value: 10, positive: false, max: 100 },
  ],
  compute: function (v) {
    var m = v.units === 'metric', ik = m ? 1 / 25.4 : 1;
    var areaIn2 = (m ? v.area * 10.7639 : v.area) * 144;
    var tl = v.tl * ik, tw = v.tw * ik, tt = v.tt * ik, jw = v.jw * ik;
    var vol = areaIn2 * ((tl + tw) / (tl * tw)) * jw * tt;      // in³ of joint
    var lb = vol * 0.0672, waste = v.waste || 0, lbT = lb * (1 + waste / 100), kgT = lbT * 0.45359;
    var bags = m ? Math.ceil(kgT / 5 - 1e-9) : Math.ceil(lbT / 10 - 1e-9);
    return {
      headline: { label: 'Grout needed', value: m ? MM.fmt(kgT, 1) + ' kg' : MM.fmt(lbT, 1) + ' lb', sub: m ? '≈ ' + MM.fmt(lbT, 1) + ' lb' : '≈ ' + MM.fmt(kgT, 1) + ' kg' },
      rows: [
        { section: 'Grout' },
        ['Joint volume', MM.fmt(vol, 1) + ' in³ · ' + MM.fmt(vol * 16.387 / 1000, 2) + ' L'],
        ['Grout weight (no waste)', MM.fmt(lb, 1) + ' lb · ' + MM.fmt(lb * 0.45359, 1) + ' kg'],
        ['With ' + waste + '% waste', MM.fmt(lbT, 1) + ' lb · ' + MM.fmt(kgT, 1) + ' kg'],
        { section: 'Bags to buy' },
        [m ? '5 kg bags (rounded up)' : '10 lb bags (rounded up)', String(bags)]
      ],
      notes: [{ t: 'Based on cement-based grout at about 1.86 kg/L. Epoxy grout is slightly denser and sold by volume — check the kit size.' }]
    };
  },
  steps: [
    'Choose <strong>imperial or metric</strong> units and enter the total <strong>area to be tiled</strong>.',
    'Enter the <strong>tile length and width</strong>. For square tiles, enter the same number twice.',
    'Enter the <strong>tile thickness</strong> (which sets joint depth) and the <strong>grout joint width</strong>.',
    'Keep the <strong>10% waste</strong> allowance for mixing losses and spills, and press <strong>Calculate</strong>.',
    'Buy the number of <strong>bags</strong> shown. Leftover grout is useful for later repairs.'
  ],
  formula: {
    code: `joint volume (in³) = area (in²) × (tile L + tile W) ÷ (tile L × tile W) × joint width × joint depth\ngrout weight (lb) = joint volume × 0.0672      <span class="c">// cement grout ≈ 1.86 kg/L</span>\ntotal = weight × (1 + waste% ÷ 100)`,
    example: '100 sq ft of 12 × 12 in tile with 1/8 in joints, 3/8 in deep: area = 14,400 in². (12 + 12) ÷ 144 = 0.1667. Volume = 14,400 × 0.1667 × 0.125 × 0.375 = 112.5 in³ → 7.56 lb. Add 10% waste = <strong>8.3 lb</strong>, so one 10 lb bag is enough.'
  },
  table: {
    title: 'Grout needed per 100 sq ft',
    head: ['Tile size', '1/8" joint, 3/8" deep'],
    rows: [['3 × 6 in (subway)', '22.7 lb'], ['4 × 4 in', '22.7 lb'], ['6 × 6 in', '15.1 lb'], ['12 × 12 in', '7.6 lb'], ['12 × 24 in', '5.7 lb'], ['24 × 24 in', '3.8 lb']],
    note: 'Excludes waste. Smaller tiles mean far more joint length, so they use many times more grout than large-format tiles.'
  },
  sections: [
    { h2: 'Why tile size changes grout so much', html: '<p>Grout fills the gaps between tiles, so what matters is the total <em>length</em> of the joints. A square foot of 4-inch tile has three times as much joint as a square foot of 12-inch tile. Wider and deeper joints add still more volume. That is why mosaic and subway tile projects need many bags of grout while large-format porcelain needs very little.</p>' },
    { h2: 'Choosing joint width', html: '<p>Joint width is set by the tile type. Rectified porcelain is often laid with narrow 1/16 to 1/8 inch joints; hand-made or natural-stone tiles need 3/16 inch or wider to hide variations in size. Unsanded grout suits joints up to 1/8 inch; sanded grout resists shrinking and cracking in wider joints.</p>' },
    { h2: 'Mixing and applying grout', html: '<ul><li>Mix only what you can use in 30 minutes.</li><li>Pack the joints with a rubber float held at 45°, then remove excess diagonally.</li><li>Wipe with a damp sponge once the grout has firmed up, and seal cement-based grout after it has cured.</li></ul>' }
  ],
  faqs: [
    ['How much grout do I need for 100 square feet of tile?', 'It depends on tile size. With 12 × 12 in tile and 1/8 in joints, about 8 lb including waste. With 4 × 4 in tile it is around 25 lb.'],
    ['How do I calculate grout for tile?', 'Multiply the area by the joint length per unit of area, then by joint width and depth to get volume, then by grout density. The formula is shown above and the calculator does it for you.'],
    ['What should the joint depth be?', 'Normally the full thickness of the tile — typically 3/8 inch for floor tile and 1/4 inch for wall tile. Enter the tile thickness as the depth.'],
    ['Sanded or unsanded grout?', 'Use sanded grout for joints wider than 1/8 inch and unsanded for narrow joints or delicate surfaces that could scratch.'],
    ['Does the calculator work for metric tile?', 'Yes. Switch to metric, then enter the area in m² and tile and joint sizes in millimeters.'],
    ['How much extra grout should I buy?', 'Ten percent extra is sensible. Uneven substrates, hand-made tile and wide joints can use more.'],
    ['Does epoxy grout use the same amount?', 'Roughly, yes, though epoxy grout is sold in kits by volume. Use the liters figure in the result to compare.']
  ],
  related: ['paint-calculator', 'concrete-calculator', 'epoxy-resin-calculator', 'quilt-backing-calculator']
},

/* ------------------------------------------------------------------ CONCRETE */
{
  slug: 'concrete-calculator', cat: 'home', icon: '🏗️',
  h1: 'Concrete Calculator',
  title: 'Concrete Calculator – Cubic Yards & Bags Needed',
  description: 'Concrete calculator for slabs, patios and pads: get cubic yards, cubic feet, cubic meters and the number of 80 lb, 60 lb and 50 lb bags with a waste allowance.',
  card: 'Cubic yards and bag counts for slabs, patios, footings and pads.',
  keywords: 'concrete calculator cubic yards slab patio bags 80 lb how much concrete do i need',
  intro: 'Enter the length, width and thickness of your slab to see the concrete volume in cubic yards and how many bags of mix you need.',
  units: [['imperial', 'Imperial (ft, in)'], ['metric', 'Metric (m, cm)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'length', label: 'Length', unit: { imperial: 'ft', metric: 'm' }, defaults: { imperial: 10, metric: 3 } },
    { name: 'width', label: 'Width', unit: { imperial: 'ft', metric: 'm' }, defaults: { imperial: 10, metric: 3 } },
    { name: 'thick', label: 'Thickness', unit: { imperial: 'in', metric: 'cm' }, defaults: { imperial: 4, metric: 10 }, hint: 'Patios and walkways: 4 in (10 cm). Driveways: 5–6 in (13–15 cm).' },
    { name: 'waste', label: 'Extra for waste', unit: '%', value: 10, positive: false, max: 100, hint: 'Covers spillage and uneven ground.' },
  ],
  compute: function (v) {
    var m = v.units === 'metric', cuft;
    if (m) cuft = v.length * v.width * (v.thick / 100) * 35.3147;
    else cuft = v.length * v.width * (v.thick / 12);
    var waste = v.waste || 0, tot = cuft * (1 + waste / 100);
    var yd = tot / 27, m3 = tot / 35.3147;
    return {
      headline: { label: 'Concrete needed', value: m ? MM.fmt(m3, 2) + ' m³' : MM.fmt(yd, 2) + ' yd³', sub: (m ? '≈ ' + MM.fmt(yd, 2) + ' cubic yards' : '≈ ' + MM.fmt(m3, 2) + ' cubic meters') + ' · includes ' + waste + '% extra' },
      rows: [
        { section: 'Volume' },
        ['Slab volume (no waste)', MM.fmt(cuft, 1) + ' ft³'],
        ['With waste — cubic feet', MM.fmt(tot, 1)], ['With waste — cubic yards', MM.fmt(yd, 2)], ['With waste — cubic meters', MM.fmt(m3, 2)],
        { section: 'Bagged mix (rounded up)' },
        ['80 lb bags (0.60 ft³ each)', String(Math.ceil(tot / 0.6 - 1e-9))],
        ['60 lb bags (0.45 ft³ each)', String(Math.ceil(tot / 0.45 - 1e-9))],
        ['50 lb bags (0.375 ft³ each)', String(Math.ceil(tot / 0.375 - 1e-9))]
      ],
      notes: [yd > 1.5 ? { t: 'For more than about 1.5 cubic yards, ready-mix delivery is usually quicker and cheaper than bagged mix.' } : { t: 'Small jobs like this are well suited to bagged mix.' },
        { t: 'Slabs usually sit on 4 in (10 cm) of compacted gravel; add that volume separately.' }]
    };
  },
  steps: [
    'Choose <strong>imperial or metric</strong> units, then enter the slab <strong>length</strong> and <strong>width</strong>.',
    'Enter the <strong>thickness</strong>. Four inches (10 cm) is standard for patios and paths.',
    'Keep the <strong>10% waste</strong> allowance, or raise it for uneven ground.',
    'Press <strong>Calculate</strong> to see cubic yards, cubic meters and the number of bags.',
    'For anything over about 1.5 cubic yards, ask a ready-mix supplier for a quote.'
  ],
  formula: {
    code: `volume (ft³) = length (ft) × width (ft) × thickness (in) ÷ 12\ntotal = volume × (1 + waste% ÷ 100)\n\ncubic yards = ft³ ÷ 27 · cubic meters = ft³ ÷ 35.315\n80 lb bags = ft³ ÷ 0.60 · 60 lb = ft³ ÷ 0.45 · 50 lb = ft³ ÷ 0.375`,
    example: 'A 10 × 10 ft patio, 4 in thick: 10 × 10 × (4 ÷ 12) = 33.3 ft³. Add 10% = 36.7 ft³ = <strong>1.36 cubic yards</strong>, or <strong>62 bags</strong> of 80 lb mix.'
  },
  table: {
    title: 'Concrete for a 4 inch slab',
    head: ['Slab size (ft)', 'Cubic feet', 'Cubic yards', '80 lb bags'],
    rows: [['10 × 10', '33.3', '1.23', '56'], ['10 × 12', '40.0', '1.48', '67'], ['12 × 12', '48.0', '1.78', '80'], ['16 × 16', '85.3', '3.16', '143'], ['20 × 20', '133.3', '4.94', '223'], ['24 × 24', '192.0', '7.11', '320']],
    note: 'Without waste allowance. Add 10% when ordering.'
  },
  sections: [
    { h2: 'Cubic yards: the unit concrete is sold in', html: '<p>In the US and Canada, ready-mix concrete is ordered by the cubic yard — a cube three feet on each side, equal to 27 cubic feet. UK and Australian suppliers use cubic meters, which is why this calculator reports both. Because delivery trucks usually have a minimum order, it often makes sense to order slightly more rather than risk running short during the pour.</p>' },
    { h2: 'Choose the right thickness', html: '<p>Thickness determines strength and cost. A <strong>4 inch</strong> slab suits footpaths, patios and shed bases. Garage floors and driveways that carry vehicles are usually <strong>5–6 inches</strong>. Heavy loads need engineering advice and steel reinforcement.</p><ul><li>Compact the sub-base before pouring.</li><li>Use reinforcement mesh or rebar for driveways and large slabs.</li><li>Cut control joints to guide cracking.</li></ul>' },
    { h2: 'Bagged mix or ready-mix?', html: '<p>One 80 lb bag makes about 0.6 cubic feet. A cubic yard therefore needs 45 bags — about 3,600 lb to lift and mix by hand. For small repairs, fence posts and steps, bags are ideal. For larger slabs, a delivered load saves time and gives a more consistent mix.</p>' }
  ],
  faqs: [
    ['How much concrete do I need for a 10 × 10 slab?', 'At 4 inches thick, a 10 × 10 ft slab needs 33.3 cubic feet, or about 1.23 cubic yards. With 10% extra, order about 1.36 cubic yards.'],
    ['How many 80 lb bags of concrete are in a yard?', 'About 45 bags of 80 lb mix make one cubic yard, because each bag yields roughly 0.6 cubic feet.'],
    ['How thick should a concrete patio be?', 'Four inches is standard for patios, paths and shed bases. Driveways usually need 5–6 inches.'],
    ['Do I need extra concrete for waste?', 'Yes, 5–10% extra is normal because of spillage, uneven ground and slightly over-dug sub-bases.'],
    ['How do I convert cubic feet to cubic yards?', 'Divide the number of cubic feet by 27, since one cubic yard equals 27 cubic feet.'],
    ['Can I calculate in metric?', 'Yes. Switch to metric and enter meters for length and width and centimeters for thickness. Results include cubic meters.'],
    ['Does this include the gravel base?', 'No. Calculate gravel separately; a 4 inch compacted base is typical under slabs.']
  ],
  related: ['grout-calculator', 'paint-calculator', 'river-table-epoxy-calculator', 'epoxy-resin-calculator']
},

/* ------------------------------------------------------------------ DOG CHOCOLATE */
{
  slug: 'dog-chocolate-toxicity-calculator', cat: 'pets', icon: '🍫',
  h1: 'Dog Chocolate Toxicity Calculator',
  title: 'Dog Chocolate Toxicity Calculator – Is It Dangerous?',
  description: 'Dog chocolate toxicity calculator: estimate the theobromine dose in mg/kg from your dog’s weight and the type and amount eaten, and see when to call a vet.',
  card: 'Estimate theobromine dose from your dog’s weight and the chocolate eaten.',
  keywords: 'dog chocolate toxicity calculator dog ate chocolate theobromine how much chocolate is toxic to dogs',
  button: 'Check risk',
  noun: 'calculator',
  intro: 'Enter your dog’s weight and the chocolate they ate to estimate the theobromine dose. This is only a guide — if you are worried, call a vet or poison hotline straight away.',
  units: [['imperial', 'Pounds & ounces (lb, oz)'], ['metric', 'Kilograms & grams (kg, g)']],
  unitsLabel: 'Units',
  fields: [
    { name: 'weight', label: 'Dog’s weight', unit: { imperial: 'lb', metric: 'kg' }, defaults: { imperial: 20, metric: 9 } },
    { name: 'type', type: 'select', label: 'Type of chocolate', options: [['milk', 'Milk chocolate'], ['dark', 'Dark / semisweet chocolate'], ['baking', 'Baking (unsweetened) chocolate'], ['cocoa', 'Cocoa powder'], ['white', 'White chocolate']], value: 'dark' },
    { name: 'amount', label: 'Amount eaten', unit: { imperial: 'oz', metric: 'g' }, defaults: { imperial: 2, metric: 57 }, full: true, hint: 'A standard milk chocolate bar is about 1.5 oz (43 g).' },
  ],
  compute: function (v) {
    var m = v.units === 'metric';
    var kg = m ? v.weight : v.weight / 2.20462, oz = m ? v.amount / 28.35 : v.amount;
    var t = { milk: [58, 58, 'Milk chocolate'], dark: [138, 138, 'Dark / semisweet chocolate'], baking: [390, 390, 'Baking chocolate'], cocoa: [400, 737, 'Cocoa powder'], white: [1, 1, 'White chocolate'] }[v.type];
    var lo = t[0] * oz / kg, hi = t[1] * oz / kg;
    var lvl, cls;
    if (hi >= 60) { lvl = 'Severe — seizures possible'; cls = 'danger'; }
    else if (hi >= 40) { lvl = 'Serious — heart and nerve signs likely'; cls = 'danger'; }
    else if (hi >= 20) { lvl = 'Mild signs expected'; cls = 'danger'; }
    else { lvl = 'Below the usual toxic threshold'; cls = 'warn'; }
    var safe = 20 * kg / t[1];
    var dose = lo === hi ? MM.fmt(lo, 1) : MM.fmt(lo, 0) + '–' + MM.fmt(hi, 0);
    var notes = [
      { k: cls, t: 'Call your vet, an emergency clinic or the <strong>ASPCA Animal Poison Control Center: (888) 426-4435</strong> (consultation fee may apply) or Pet Poison Helpline <strong>(855) 764-7661</strong> now. Do not wait for symptoms.' },
      { t: 'Signs: vomiting, restlessness, fast heartbeat, tremors. Treatment works best when started within hours.' }
    ];
    if (v.type === 'white') notes.push({ t: 'White chocolate has very little theobromine, but the fat and sugar can cause stomach upset and pancreatitis.' });
    return {
      headline: { label: 'Estimated dose', value: dose + ' mg/kg', sub: lvl },
      rows: [
        { section: 'Estimate' },
        ['Chocolate', t[2]], ['Theobromine eaten', MM.fmt(t[0] * oz, 0) + (t[0] === t[1] ? '' : '–' + MM.fmt(t[1] * oz, 0)) + ' mg'],
        ['Dose per kg of body weight', dose + ' mg/kg'],
        ['Dog’s weight', MM.fmt(kg, 1) + ' kg · ' + MM.fmt(kg * 2.20462, 1) + ' lb'],
        { section: 'Reference' },
        ['Mild signs begin at about', '20 mg/kg'], ['Severe signs at about', '40–50 mg/kg'], ['Seizures at about', '60 mg/kg+'],
        ['Amount of this chocolate at 20 mg/kg', m ? MM.fmt(safe * 28.35, 0) + ' g' : MM.fmt(safe, 2) + ' oz']
      ],
      notes: notes
    };
  },
  steps: [
    'Choose <strong>lb and oz</strong> or <strong>kg and grams</strong> and enter your dog’s <strong>weight</strong>.',
    'Select the <strong>type of chocolate</strong>. Darker and more bitter means more dangerous.',
    'Enter the <strong>amount eaten</strong> (the weight of the chocolate, not the whole wrapper).',
    'Press <strong>Check risk</strong> to see the estimated theobromine dose and risk level.',
    '<strong>Call a vet or poison hotline</strong> regardless of the result. This tool is not a diagnosis.'
  ],
  formula: {
    code: `theobromine (mg) = ounces eaten × mg per ounce\ndose (mg/kg) = theobromine (mg) ÷ dog weight (kg)\n\nmg per ounce (approx.): milk 58 · dark/semisweet 138\nbaking 390 · cocoa powder 400–737\n\nmild signs ≥ 20 mg/kg · severe ≥ 40–50 · seizures ≥ 60`,
    example: 'A 20 lb dog (9.1 kg) eats 2 oz of dark chocolate: 2 × 138 = 276 mg of theobromine. 276 ÷ 9.1 = <strong>30 mg/kg</strong> — in the range where mild to moderate signs can appear, so contact a vet.'
  },
  table: {
    title: 'Theobromine content of common chocolates',
    head: ['Chocolate', 'Theobromine per ounce', 'Danger level'],
    rows: [['White chocolate', 'Trace', 'Low (fat risk)'], ['Milk chocolate', '≈ 58 mg', 'Moderate'], ['Dark / semisweet', '≈ 138 mg', 'High'], ['Baking chocolate', '≈ 390 mg', 'Very high'], ['Cocoa powder', '≈ 400–737 mg', 'Very high']],
    note: 'Values are approximate averages from veterinary references (e.g., Merck Veterinary Manual) and vary by brand and cocoa percentage.'
  },
  sections: [
    { h2: 'Why chocolate is dangerous for dogs', html: '<p>Chocolate contains <strong>theobromine</strong> and caffeine, stimulants that dogs process very slowly. The longer they remain in the body, the more they affect the heart, nervous system and kidneys. The risk depends on three things: the <em>type</em> of chocolate (darker means more theobromine), the <em>amount</em>, and the <em>size</em> of the dog. A small dog that eats one square of baking chocolate can be in more danger than a large dog that eats a whole milk chocolate bar.</p>' },
    { h2: 'What to do if your dog ate chocolate', html: '<ol><li>Remove any remaining chocolate and wrappers.</li><li>Note the type, how much was eaten and roughly when.</li><li>Call your vet or a poison helpline <strong>immediately</strong>; don’t wait for symptoms, which can take 6–12 hours.</li><li>Don’t induce vomiting unless a vet instructs you to.</li></ol>' },
    { h2: 'Other foods that are toxic', html: '<p>Chocolate is not the only danger. Grapes and raisins, xylitol (a sweetener in sugar-free gum and some peanut butters), onions, garlic and macadamia nuts can all be harmful. Keep these out of reach, especially at Easter, Halloween and Christmas.</p>' }
  ],
  faqs: [
    ['How much chocolate is toxic to a dog?', 'Mild signs can appear at about 20 mg/kg of theobromine, severe signs at 40–50 mg/kg, and seizures from about 60 mg/kg. For a 20 lb dog, that is roughly 1.3 oz of dark chocolate for mild signs.'],
    ['My dog ate a small piece of milk chocolate. Should I worry?', 'Milk chocolate has less theobromine, so a small piece is often low-risk for large dogs, but small dogs, puppies and dogs with heart problems can still be affected. Call your vet for advice.'],
    ['What are the symptoms of chocolate poisoning in dogs?', 'Vomiting, diarrhea, excessive thirst, restlessness, rapid breathing, a racing heart, muscle tremors and seizures. Signs usually appear within 6–12 hours.'],
    ['Is white chocolate safe for dogs?', 'It contains very little theobromine, but the fat and sugar can cause vomiting or pancreatitis. It is not recommended.'],
    ['Which phone number should I call?', 'Your own vet or nearest emergency clinic first. You can also call the ASPCA Animal Poison Control Center at (888) 426-4435 or the Pet Poison Helpline at (855) 764-7661; fees may apply.'],
    ['Is this calculator a substitute for a vet?', 'No. It gives a rough estimate only. Chocolate varies by brand, and the health of your dog matters too. Always seek professional advice.'],
    ['What about cocoa powder and baked goods?', 'Cocoa powder is the most concentrated source. For baked goods such as brownies, estimate the amount of chocolate or cocoa in them and ask your vet.']
  ],
  related: ['dog-age-calculator', 'candle-wax-calculator', 'yarn-calculator', 'paint-calculator']
},

/* ------------------------------------------------------------------ DOG AGE */
{
  slug: 'dog-age-calculator', cat: 'pets', icon: '🐕',
  h1: 'Dog Age Calculator',
  title: 'Dog Age Calculator – Dog Years to Human Years',
  description: 'Dog age calculator: convert your dog’s age to human years using the classic 7x rule, a size-adjusted chart and the newer 2019 epigenetic formula.',
  card: 'Convert dog years to human years using three popular methods, adjusted for size.',
  keywords: 'dog age calculator dog years to human years how old is my dog',
  intro: 'Find out how old your dog is in human years. Enter their age and size to compare the classic 7× rule, a size-adjusted chart and the newer scientific formula.',
  fields: [
    { name: 'years', label: 'Dog’s age — years', unit: 'yrs', value: 5, step: 1, positive: false, max: 30 },
    { name: 'months', type: 'select', label: 'Additional months', options: [...Array(12).keys()].map((i) => [String(i), i + (i === 1 ? ' month' : ' months')]), value: '0' },
    { name: 'size', type: 'select', label: 'Dog size', full: true, options: [['small', 'Small — under 20 lb (9 kg)'], ['medium', 'Medium — 21–50 lb (10–22 kg)'], ['large', 'Large — 51–100 lb (23–45 kg)'], ['giant', 'Giant — over 100 lb (45 kg)']], value: 'medium' },
  ],
  compute: function (v) {
    var age = v.years + parseInt(v.months, 10) / 12;
    if (age <= 0) return { error: 'Please enter an age greater than zero.' };
    var rate = { small: 4, medium: 5, large: 6, giant: 7 }[v.size];
    var adj = age <= 1 ? 15 * age : age <= 2 ? 15 + 9 * (age - 1) : 24 + (age - 2) * rate;
    var classic = age * 7, epi = age >= 0.25 ? 16 * Math.log(age) + 31 : null;
    var senior = { small: 10, medium: 8, large: 7, giant: 6 }[v.size];
    var stage = age < 1 ? 'Puppy' : age < 3 ? 'Young adult' : age < senior ? 'Adult' : 'Senior';
    return {
      headline: { label: 'Human age (size-adjusted)', value: MM.fmt(adj, 0) + ' years', sub: 'Life stage: ' + stage + ' · dog age ' + MM.fmt(age, 1) + ' years' },
      rows: [
        { section: 'Three methods compared' },
        ['Classic 7× rule', MM.fmt(classic, 0) + ' years'],
        ['Size-adjusted (AVMA-style)', MM.fmt(adj, 0) + ' years'],
        ['Epigenetic formula (2019)', epi === null ? 'Use for dogs 3 months+' : MM.fmt(epi, 0) + ' years'],
        { section: 'Notes' },
        ['Senior age for this size', 'from about ' + senior + ' years']
      ],
      notes: [{ t: 'Large dogs age faster in the later years; small dogs often live to 14–16 and giant breeds to 8–10. Use this as a guide to plan vet checks, not as a medical measure.' }]
    };
  },
  steps: [
    'Enter your dog’s <strong>age in years</strong> and choose any <strong>extra months</strong>.',
    'Select the <strong>size category</strong> that matches your dog’s adult weight.',
    'Press <strong>Calculate</strong> to see the human-age equivalent from three methods.',
    'Compare the results — the size-adjusted figure is the most practical for everyday use.'
  ],
  formula: {
    code: `classic = dog age × 7\n\nsize-adjusted: year 1 = 15 · year 2 = +9 (total 24)\nthen + 4 (small) · 5 (medium) · 6 (large) · 7 (giant) per year\n\nepigenetic (2019) = 16 × ln(dog age) + 31`,
    example: 'A 5-year-old medium dog: classic = 35. Size-adjusted = 24 + (5 − 2) × 5 = <strong>39 years</strong>. Epigenetic = 16 × ln(5) + 31 = 16 × 1.609 + 31 = <strong>56.8 years</strong>.'
  },
  table: {
    title: 'Dog age to human age chart',
    head: ['Dog age', 'Small', 'Medium', 'Large', 'Giant'],
    rows: [['1 year', '15', '15', '15', '15'], ['2 years', '24', '24', '24', '24'], ['4 years', '32', '34', '36', '38'], ['6 years', '40', '44', '48', '52'], ['8 years', '48', '54', '60', '66'], ['10 years', '56', '64', '72', '80'], ['12 years', '64', '74', '84', '94'], ['14 years', '72', '84', '96', '108']],
    note: 'Human-year equivalents from the size-adjusted method.'
  },
  sections: [
    { h2: 'Why “one dog year equals seven human years” is wrong', html: '<p>The 7× rule is a convenient myth. Dogs mature much faster than people in the first two years — a one-year-old dog is roughly like a 15-year-old teenager — and slow down afterwards. The pace also depends on size: large dogs age faster than small dogs, so a 10-year-old Great Dane is considerably older than a 10-year-old Chihuahua.</p>' },
    { h2: 'The newer epigenetic formula', html: '<p>In 2019, researchers at the University of California, San Diego compared DNA methylation patterns in Labrador Retrievers with those of humans. They found that dogs age rapidly at first and then more slowly, which fits a logarithmic curve: <em>human age = 16 × ln(dog age) + 31</em>. The study looked at one breed, so it is best viewed as an interesting data point rather than an exact conversion.</p>' },
    { h2: 'Caring for your dog at every life stage', html: '<ul><li><strong>Puppies:</strong> vaccinations, socialisation and training.</li><li><strong>Adults:</strong> annual check-ups, dental care and a healthy weight.</li><li><strong>Seniors:</strong> twice-yearly vet visits, joint support and softer bedding.</li></ul>' }
  ],
  faqs: [
    ['How do I calculate my dog’s age in human years?', 'The simplest way is to multiply by 7, but a more accurate approach counts the first year as 15 and the second as 9, then adds 4–7 years per year depending on size.'],
    ['Do big dogs age faster than small dogs?', 'Yes. Large and giant breeds reach old age earlier and have shorter lifespans than small breeds.'],
    ['How old is a 1-year-old dog in human years?', 'About 15 human years. Dogs reach adolescence and sexual maturity within their first year.'],
    ['What is the epigenetic dog age formula?', 'It is human age = 16 × ln(dog age) + 31, from a 2019 study of DNA methylation in Labradors.'],
    ['When is a dog considered a senior?', 'Small dogs from about 10 years, medium dogs from 8, large dogs from 7 and giant breeds from about 6.'],
    ['How old is my dog if I adopted it?', 'Ask your vet to estimate by checking teeth, coat and eyes. Enter that estimate for a rough human age.'],
    ['Is this a medical tool?', 'No. It is an estimate for interest and planning only; talk to your vet about your dog’s health.']
  ],
  related: ['dog-chocolate-toxicity-calculator', 'yarn-calculator', 'candle-wax-calculator', 'paint-calculator']
},
];
