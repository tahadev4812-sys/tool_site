/* Phase 2 calculators. Each `compute` is stringified into its page, so it must be self-contained (it may use the global MM helpers). */

module.exports = [
{
  slug: 'resin-coaster-calculator', cat: 'craft', icon: '☕',
  h1: 'Resin Coaster Calculator',
  title: 'Resin Coaster Calculator – Epoxy for a Batch',
  description: 'Resin coaster calculator: enter coaster size, thickness and quantity to see how much epoxy and hardener you need for a whole batch, with waste included.',
  card: 'Epoxy and hardener needed for a batch of round or square coasters.',
  keywords: 'resin coaster calculator how much resin for coasters epoxy coaster mold batch',
  intro: 'Planning a batch of coasters? Enter the size, thickness and how many you are pouring to see exactly how much resin and hardener to mix.',
  units: [['in', 'Inches (in)'], ['cm', 'Centimeters (cm)']],
  fields: [
    { name: 'shape', type: 'select', label: 'Coaster shape', options: [['round', 'Round'], ['square', 'Square']], value: 'round' },
    { name: 'ratio', type: 'select', label: 'Mix ratio (by volume)', options: [['1:1', '1 : 1'], ['2:1', '2 : 1']], value: '1:1' },
    { name: 'size', label: 'Diameter or side length', unit: { in: 'in', cm: 'cm' }, defaults: { in: 4, cm: 10 } },
    { name: 'depth', label: 'Thickness of resin', unit: { in: 'in', cm: 'cm' }, defaults: { in: 0.25, cm: 0.6 } },
    { name: 'count', label: 'Number of coasters', value: 4, step: 1, max: 500 },
    { name: 'waste', label: 'Extra for waste', unit: '%', value: 15, positive: false, max: 100, hint: 'Small pours lose proportionally more resin in the cup — 15% is a good start.' },
  ],
  compute: function (v) {
    var cm = v.units === 'cm', n = Math.max(1, Math.round(v.count));
    var one = v.shape === 'round' ? Math.PI * Math.pow(v.size / 2, 2) * v.depth : v.size * v.size * v.depth;
    if (cm) one /= 16.387;
    var waste = v.waste || 0, tot = one * n * (1 + waste / 100);
    var floz = tot / 1.805, ml = tot / 61.024 * 1000, r = v.ratio === '2:1' ? [2 / 3, 1 / 3] : [0.5, 0.5];
    return {
      headline: { label: 'Epoxy for ' + n + (n === 1 ? ' coaster' : ' coasters'), value: MM.fmt(floz, 1) + ' fl oz', sub: '≈ ' + MM.fmt(ml, 0) + ' ml · includes ' + waste + '% extra' },
      rows: [
        { section: 'Per coaster' },
        ['Volume', MM.fmt(one / 1.805, 2) + ' fl oz · ' + MM.fmt(one / 61.024 * 1000, 0) + ' ml'],
        { section: 'Whole batch' },
        ['Total epoxy', MM.fmt(floz, 1) + ' fl oz · ' + MM.fmt(ml, 0) + ' ml'],
        ['Resin (Part A, ' + v.ratio + ')', MM.fmt(floz * r[0], 1) + ' fl oz · ' + MM.fmt(ml * r[0], 0) + ' ml'],
        ['Hardener (Part B)', MM.fmt(floz * r[1], 1) + ' fl oz · ' + MM.fmt(ml * r[1], 0) + ' ml']
      ],
      notes: [{ t: 'Mix in small batches if your resin has a short working time, and pour all coasters from the same cup so colours match.' }]
    };
  },
  steps: [
    'Choose <strong>round or square</strong> and your measuring unit.',
    'Enter the <strong>diameter</strong> (round) or <strong>side length</strong> (square) of the mold cavity, then the <strong>resin thickness</strong>.',
    'Enter how many <strong>coasters</strong> you will pour at once.',
    'Keep the extra at <strong>15%</strong> and press <strong>Calculate</strong>.',
    'Mix the shown resin and hardener amounts together, then fill every cavity.'
  ],
  formula: {
    code: `round:  volume = π × (diameter ÷ 2)² × thickness\nsquare: volume = side × side × thickness\ntotal = volume × coasters × (1 + waste% ÷ 100)\nfluid ounces = in³ ÷ 1.805 · ml = in³ ÷ 61.024 × 1000`,
    example: 'Four round 4 in coasters, 1/4 in thick: π × 2² × 0.25 = 3.14 in³ each, so 12.57 in³ for the batch. Add 15% = 14.45 in³ ≈ <strong>8.0 fl oz</strong> (237 ml) — about 4 fl oz resin and 4 fl oz hardener at 1:1.'
  },
  table: {
    title: 'Resin per coaster at 1/4 inch thick',
    head: ['Coaster', 'Resin per coaster', 'Per dozen (15% extra)'],
    rows: [['3.5 in round', '1.3 fl oz', '18.4 fl oz'], ['4 in round', '1.7 fl oz', '24.0 fl oz'], ['4 in square', '2.2 fl oz', '30.6 fl oz'], ['4.5 in square', '2.8 fl oz', '38.7 fl oz']],
    note: 'Rounded values for resin only; mold cavities with rounded corners hold slightly less.'
  },
  sections: [
    { h2: 'Why coasters need a bigger safety margin', html: '<p>The smaller the pour, the larger the share of resin that clings to the cup, stir stick and spreader. That is why this calculator starts at 15% extra instead of 10%. If you use pigments, glitter or inclusions, they displace a little volume but you should still mix the full amount so every coaster is the same colour.</p>' },
    { h2: 'Thickness and heat', html: '<p>Most coasters are 1/4 to 3/8 inch thick, which is well within the pour limit for tabletop epoxy. If you embed flowers, shells or geodes, measure the mold cavity depth rather than the item height, and seal porous inclusions first so they do not release air bubbles into the resin.</p>' },
    { h2: 'Finishing tips', html: '<ul><li>Pop bubbles with a heat gun or torch held a hand’s width above the surface.</li><li>Cover the molds to keep dust out while the resin cures.</li><li>Cure fully before using them with hot or wet cups, and add cork or felt feet to protect furniture.</li></ul>' }
  ],
  faqs: [
    ['How much resin do I need for one 4 inch coaster?', 'A round 4 in coaster poured 1/4 in thick holds about 3.1 cubic inches, which is roughly 1.7 fl oz of mixed epoxy before waste.'],
    ['How thick should resin coasters be?', 'Between 1/4 and 3/8 inch is typical. Thinner coasters can feel fragile; thicker ones use more resin.'],
    ['How much extra resin should I mix for a coaster batch?', '15% is a sensible allowance because a high proportion of resin is left behind in cups and on tools.'],
    ['Can I use the same resin as for a table?', 'Check the product label. Many tabletop epoxies work well for coasters, but heat resistance varies, so look for a brand that lists a heat rating.'],
    ['Do I need to measure the mold?', 'Yes. Measure the cavity itself, since the outside dimensions of silicone molds are larger.'],
    ['What if my coasters are hexagons or irregular shapes?', 'Fill one cavity with water, pour it into a measuring cup and multiply that volume by the number of coasters.'],
    ['Does the calculator support metric?', 'Yes. Switch to centimeters and the result is still shown in fluid ounces and milliliters.']
  ],
  related: ['epoxy-resin-calculator', 'river-table-epoxy-calculator', 'candle-wax-calculator', 'yarn-calculator']
},
{
  slug: 'wood-stain-calculator', cat: 'home', icon: '🪑',
  h1: 'Wood Stain Calculator',
  title: 'Wood Stain Calculator – How Much Stain Do I Need?',
  description: 'Wood stain calculator for decks, fences, floors and furniture: enter the surface area and coats to estimate the quarts, gallons or liters of stain to buy.',
  card: 'Estimate stain for a deck, fence, floor or furniture from area and coats.',
  keywords: 'wood stain calculator how much stain do i need deck fence floor gallons',
  intro: 'Enter the area you are staining and the number of coats to estimate how much stain to buy, in quarts, gallons and liters.',
  units: [['ft', 'Feet (ft)'], ['m', 'Meters (m)']],
  unitsLabel: 'Measured in',
  fields: [
    { name: 'length', label: 'Surface length', unit: { ft: 'ft', m: 'm' }, defaults: { ft: 16, m: 5 } },
    { name: 'width', label: 'Surface width', unit: { ft: 'ft', m: 'm' }, defaults: { ft: 12, m: 3.6 } },
    { name: 'sides', type: 'select', label: 'Sides to stain', options: [['1', 'One side (e.g. deck top)'], ['2', 'Both sides (e.g. fence)']], value: '1' },
    { name: 'coats', type: 'select', label: 'Coats', options: [['1', '1 coat'], ['2', '2 coats']], value: '1' },
    { name: 'cov', label: 'Stain coverage', unit: { ft: 'sq ft / gal', m: 'm² / L' }, defaults: { ft: 300, m: 7.4 }, full: true, hint: 'Check the can. Typical range is 200–400 sq ft per gallon; rough or weathered wood soaks up more.' },
  ],
  compute: function (v) {
    var m = v.units === 'm', k = m ? 10.7639 : 1;
    var area = v.length * v.width * k * parseInt(v.sides, 10);
    var cov = m ? v.cov * 40.746 : v.cov, coats = parseInt(v.coats, 10);
    var gal = area * coats / cov;
    return {
      headline: { label: 'Stain needed', value: gal < 1 ? MM.fmt(gal * 4, 1) + ' qt' : MM.fmt(gal, 2) + ' gal', sub: '≈ ' + MM.fmt(gal * 3.78541, 1) + ' liters' },
      rows: [
        ['Area to stain', MM.fmt(area, 0) + ' sq ft · ' + MM.fmt(area / 10.7639, 1) + ' m²'],
        ['US gallons', MM.fmt(gal, 2)], ['US quarts', MM.fmt(gal * 4, 1)], ['Liters', MM.fmt(gal * 3.78541, 1)],
        ['1-gallon cans (rounded up)', String(Math.ceil(gal - 1e-9))]
      ],
      notes: [{ t: 'Add 10–15% for rough, weathered or unsealed wood, and test on an offcut first — absorption varies a lot between boards.' }]
    };
  },
  steps: [
    'Choose your <strong>unit</strong> and enter the <strong>length and width</strong> of the surface.',
    'Choose whether you will stain <strong>one side or both</strong> sides, and how many <strong>coats</strong>.',
    'Enter the <strong>coverage</strong> printed on the can. If you are not sure, keep the default.',
    'Press <strong>Calculate</strong> and buy the amount shown, rounded up.'
  ],
  formula: {
    code: `area = length × width × sides\nstain (gal) = area × coats ÷ coverage per gallon\nliters = gallons × 3.785 · quarts = gallons × 4`,
    example: 'A 16 × 12 ft deck, one side, one coat: 192 sq ft. At 300 sq ft per gallon, that is <strong>0.64 gallons</strong> (about 2.6 quarts), so one gallon can covers it with some left for touch-ups.'
  },
  table: {
    title: 'Typical project areas',
    head: ['Project', 'Area', 'Stain at 300 sq ft/gal (1 coat)'],
    rows: [['8 × 10 ft deck', '80 sq ft', '0.27 gal'], ['12 × 16 ft deck', '192 sq ft', '0.64 gal'], ['6 × 50 ft fence, both sides', '600 sq ft', '2.0 gal'], ['Dining table (3 × 6 ft)', '18 sq ft', '0.06 gal'], ['15 × 20 ft hardwood floor', '300 sq ft', '1.0 gal']],
    note: 'Coverage varies by product and wood. Treat these figures as a starting point.'
  },
  sections: [
    { h2: 'What changes how far stain goes', html: '<p>Stain is absorbed rather than sitting on top of the wood, so the species and condition of the surface matter. Soft, porous woods such as pine and cedar drink more than dense hardwoods, and bare, sun-weathered boards absorb more than new, smooth ones. Semi-transparent stains are applied thinly; solid stains behave more like paint and may cover less area per gallon.</p>' },
    { h2: 'Preparing the surface', html: '<ul><li>Clean off dirt, mildew and old finish; let the wood dry fully.</li><li>Sand to the grit recommended on the can.</li><li>Test the stain on a hidden area to check the colour.</li><li>Apply with the grain and wipe off any excess within the time on the label.</li></ul>' },
    { h2: 'One coat or two?', html: '<p>Many penetrating stains need only one coat; a second coat darkens the colour but is not always absorbed. Always follow the product’s instructions, because over-applied stain can stay tacky.</p>' }
  ],
  faqs: [
    ['How much stain do I need for a 12 × 16 deck?', 'A 192 sq ft deck needs roughly 0.64 gallons for one coat at 300 sq ft per gallon, so one gallon is enough.'],
    ['How many square feet does a gallon of stain cover?', 'Usually 200–400 sq ft depending on the product and wood. Read the can for the exact rate.'],
    ['Should I stain both sides of a fence?', 'Staining both sides protects the boards better and helps prevent uneven weathering. Choose “both sides” in the calculator to double the area.'],
    ['Do I need two coats of wood stain?', 'Not always. Follow the label — many stains are designed for a single coat.'],
    ['Can I use the calculator for furniture?', 'Yes. Enter the length and width of each surface and add them together, or calculate one piece at a time.'],
    ['Does this include sealer or varnish?', 'No. Calculate the topcoat separately using its own coverage rate.'],
    ['Does it work in metric?', 'Yes. Switch to meters and give the coverage in m² per liter.']
  ],
  related: ['paint-calculator', 'concrete-calculator', 'grout-calculator', 'river-table-epoxy-calculator']
},
{
  slug: 'cat-food-calculator', cat: 'pets', icon: '🐈',
  h1: 'Cat Food Calculator',
  title: 'Cat Food Calculator – How Much Should I Feed?',
  description: 'Cat food calculator: estimate your cat’s daily calories from weight and life stage, then convert to cups or cans of dry or wet food per day and per meal.',
  card: 'Daily calories and portions for kittens, adults and cats on a diet.',
  keywords: 'cat food calculator how much should i feed my cat calories per day cups wet dry portion',
  intro: 'Enter your cat’s weight and life stage to estimate daily calories, then turn that into cups or cans using the calorie count on your cat’s food.',
  units: [['lb', 'Pounds (lb)'], ['kg', 'Kilograms (kg)']],
  unitsLabel: 'Weight in',
  fields: [
    { name: 'weight', label: 'Cat’s weight', unit: { lb: 'lb', kg: 'kg' }, defaults: { lb: 10, kg: 4.5 } },
    { name: 'stage', type: 'select', label: 'Life stage / goal', options: [['adult', 'Neutered adult'], ['intact', 'Intact adult'], ['kitten', 'Kitten (under 1 year)'], ['inactive', 'Inactive or prone to weight gain'], ['loss', 'Weight loss']], value: 'adult' },
    { name: 'kcal', label: 'Calories in your food (per cup or can)', unit: 'kcal', value: 350, hint: 'See the label. Dry food is often 300–450 kcal per cup; a 3 oz can is often 70–100 kcal.' },
    { name: 'meals', label: 'Meals per day', value: 2, step: 1, max: 8 },
  ],
  compute: function (v) {
    var kg = v.units === 'kg' ? v.weight : v.weight / 2.20462;
    var rer = 70 * Math.pow(kg, 0.75);
    var f = { adult: 1.2, intact: 1.4, kitten: 2.5, inactive: 1.0, loss: 0.8 }[v.stage];
    var kcal = rer * f, units = kcal / v.kcal, meals = Math.max(1, Math.round(v.meals));
    return {
      headline: { label: 'Daily calories', value: MM.fmt(kcal, 0) + ' kcal', sub: MM.fmt(units, 2) + ' cups or cans of food per day, based on ' + v.kcal + ' kcal each' },
      rows: [
        { section: 'Energy' },
        ['Resting energy (RER)', MM.fmt(rer, 0) + ' kcal'],
        ['Life stage factor', '× ' + f],
        { section: 'Portions' },
        ['Food per day', MM.fmt(units, 2) + ' cups / cans'],
        ['Food per meal (' + meals + ' meals)', MM.fmt(units / meals, 2) + ' cups / cans']
      ],
      notes: [{ t: 'This is a starting point. Adjust by 10% if your cat gains or loses weight, and ask your vet before putting a cat on a diet, especially an overweight one.' }]
    };
  },
  steps: [
    'Enter your cat’s <strong>weight</strong> in pounds or kilograms.',
    'Pick the <strong>life stage or goal</strong> that fits best.',
    'Find the <strong>calories per cup or can</strong> on your cat food’s packaging and enter it.',
    'Choose the <strong>number of meals</strong> and press <strong>Calculate</strong>.',
    'Weigh your cat monthly and adjust the portion if their weight changes.'
  ],
  formula: {
    code: `RER (kcal/day) = 70 × (weight in kg)^0.75\ndaily kcal = RER × life stage factor\n\nfactors: neutered adult 1.2 · intact adult 1.4 · kitten 2.5\ninactive 1.0 · weight loss 0.8\n\nportion = daily kcal ÷ kcal per cup (or can)`,
    example: 'A neutered adult cat of 10 lb (4.54 kg): RER = 70 × 4.54^0.75 ≈ 218 kcal. × 1.2 = <strong>261 kcal per day</strong>. With 350 kcal per cup of dry food, that is <strong>0.75 cup per day</strong>, or about 3/8 cup at each of two meals.'
  },
  table: {
    title: 'Typical daily calories for neutered adult cats',
    head: ['Weight', 'Calories per day'],
    rows: [['6 lb (2.7 kg)', '≈ 178 kcal'], ['8 lb (3.6 kg)', '≈ 221 kcal'], ['10 lb (4.5 kg)', '≈ 261 kcal'], ['12 lb (5.4 kg)', '≈ 299 kcal'], ['14 lb (6.4 kg)', '≈ 336 kcal']],
    note: 'Calculated with the formula above and a factor of 1.2. Individual needs vary.'
  },
  sections: [
    { h2: 'Calories matter more than cups', html: '<p>The same cup can hold very different amounts of energy depending on the food, so the calories on the packaging are what count. A cup of one dry food may have 300 kcal and another 450. That is why the calculator asks for the food’s calorie content instead of guessing. Use a kitchen scale if you can: weighing food is much more accurate than scooping.</p>' },
    { h2: 'Wet food, dry food and mixing', html: '<p>Wet food has more water and fewer calories per ounce, and it helps cats get extra moisture. If you feed both, split the daily calories between them — for example half from wet and half from dry — and work out each portion separately from its own calorie count.</p>' },
    { h2: 'Signs your cat’s portion is right', html: '<ul><li>You can feel but not see the ribs.</li><li>A visible waist when viewed from above.</li><li>A steady weight over several weeks.</li></ul><p>Treats should make up no more than about 10% of daily calories.</p>' }
  ],
  faqs: [
    ['How much should I feed my cat per day?', 'An average neutered 10 lb adult cat needs roughly 260 calories per day. The right portion depends on the calories in your cat’s food, and on age, activity and health.'],
    ['How many calories does a kitten need?', 'Kittens need about 2.5 times their resting energy requirement because they are growing fast, so they eat more per pound than adult cats.'],
    ['How do I calculate cat food portions?', 'Work out daily calories, then divide by the calories in one cup or can of your food. The calculator does this and splits the total over your chosen number of meals.'],
    ['Should I feed my cat wet or dry food?', 'Both can provide complete nutrition. Wet food adds moisture; dry food is convenient and stays fresh longer. Ask your vet if your cat has a health condition.'],
    ['My cat is overweight. What do I do?', 'Choose “weight loss”, but speak with your vet first. Crash diets are dangerous for cats because fast weight loss can cause liver disease.'],
    ['How often should I feed my cat?', 'Two meals a day suits most adult cats. Kittens usually need three or four smaller meals.'],
    ['Is the calculator a replacement for veterinary advice?', 'No. It gives a standard estimate only; your cat’s health and your vet’s advice always take priority.']
  ],
  related: ['dog-age-calculator', 'dog-chocolate-toxicity-calculator', 'candle-wax-calculator', 'yarn-calculator']
},
];
