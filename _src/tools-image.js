/* Image tools. They are rendered by img.js / ocr.js, so they carry no `fields` or `compute`. Everything runs in the visitor's browser. */

const base = { cat: 'image', noun: 'tool', appCategory: 'MultimediaApplication' };

module.exports = [
/* ------------------------------------------------------------------ CONVERTER */
{
  ...base, slug: 'image-converter', icon: '🖼️', app: { mode: 'convert', format: 'png' },
  h1: 'Image Converter',
  title: 'Image Converter – JPG, PNG & WebP Online',
  description: 'Free image converter: change JPG, PNG and WebP files from one format to another in seconds. Batch convert, adjust quality, and keep your files private.',
  card: 'Convert images between JPG, PNG and WebP — in bulk, privately.',
  keywords: 'image converter change image extension jpg png webp convert picture format online',
  intro: 'Drop in one or more pictures, choose the format you need, and download the converted files. Nothing is uploaded — it all happens in your browser.',
  steps: [
    'Drag your <strong>images</strong> onto the box, or click it to choose files. You can add several at once.',
    'Pick the <strong>format</strong> to convert to: PNG, JPG or WebP.',
    'For JPG and WebP, set the <strong>quality</strong>. Around 85–90% is a good balance of size and sharpness.',
    'Press <strong>Download</strong> beside a file, or <strong>Download all</strong> to save everything.'
  ],
  formula: {
    title: 'How the conversion works', label: 'In plain words',
    code: `1. your browser decodes the image into raw pixels\n2. the pixels are drawn on an off-screen canvas\n3. the canvas is re-encoded as PNG, JPG or WebP\n4. the new file is handed to you as a download\n\n<span class="c">// no upload, no server, no account</span>`,
    example: 'Converting a 3 MB PNG photo to JPG at 85% quality typically gives a file a fraction of the size with no visible difference. Converting the same picture to WebP is often smaller still. Transparent areas turn white when you save as JPG, because JPG cannot store transparency.'
  },
  table: {
    title: 'JPG vs PNG vs WebP',
    head: ['Format', 'Best for', 'Transparency', 'File size'],
    rows: [['JPG', 'Photos and complex images', 'No', 'Small'], ['PNG', 'Logos, screenshots, text, graphics', 'Yes', 'Large for photos'], ['WebP', 'Websites — photos and graphics', 'Yes', 'Smallest']],
    note: 'JPG and WebP are “lossy”: lower quality means smaller files. PNG is lossless, so the quality slider does not apply.'
  },
  sections: [
    { h2: 'Which format should you choose?', html: '<p>Use <strong>JPG</strong> for photographs and anything shared widely, since every device opens it. Choose <strong>PNG</strong> when you need sharp edges, text or transparency, such as logos and screenshots. <strong>WebP</strong> gives smaller files than both and is supported by all current browsers, which makes it ideal for websites that need to load quickly — but a few older programs and some upload forms still reject it.</p>' },
    { h2: 'Why the file size changes', html: '<p>Different formats store the same picture in different ways. Converting a photo from PNG to JPG throws away detail that the eye barely notices, so the file shrinks a lot. Going the other way — JPG to PNG — cannot restore detail that is already gone, and the PNG will usually be <em>larger</em>, not better.</p>' },
    { h2: 'Your files stay on your device', html: '<p>Many converters upload pictures to a server. This one does not: the work is done by your own browser, so private photos, ID scans and client images never leave your computer or phone. It also means there is no file-size queue, and it keeps working even on a slow connection once the page has loaded.</p>' }
  ],
  faqs: [
    ['How do I change an image file extension?', 'Renaming the extension does not convert a file. Use a converter: add the image, choose the new format and download the result, which is properly re-encoded.'],
    ['Is it safe to convert private photos here?', 'Yes. The conversion happens inside your browser and the image is never sent to our servers.'],
    ['Will converting reduce the quality?', 'Converting to PNG is lossless. JPG and WebP are lossy, but at 85–90% quality the difference is rarely visible.'],
    ['Why does my transparent PNG get a white background?', 'JPG does not support transparency, so transparent areas are filled with white. Choose PNG or WebP to keep transparency.'],
    ['Can I convert many images at once?', 'Yes. Add several files together; each is converted and listed with its own download button.'],
    ['Does it support HEIC from iPhones?', 'Most browsers cannot open HEIC. Safari can. Otherwise, set your iPhone camera to “Most Compatible” or share the photo as JPG.'],
    ['Is there a file size limit?', 'There is no upload limit, but very large images need a lot of memory. If a huge file fails, try resizing it first.']
  ],
  related: ['jpg-to-png-converter', 'png-to-jpg-converter', 'image-compressor', 'image-resizer']
},

/* ------------------------------------------------------------------ JPG -> PNG */
{
  ...base, slug: 'jpg-to-png-converter', icon: '🟦', app: { mode: 'convert', format: 'png', accept: 'image/jpeg,.jpg,.jpeg' },
  h1: 'JPG to PNG Converter',
  title: 'JPG to PNG Converter – Free & Private',
  description: 'Convert JPG to PNG online for free. Turn JPEG photos into lossless PNG files in your browser — no upload, no sign-up, and batch conversion supported.',
  card: 'Turn JPG or JPEG photos into lossless PNG files instantly.',
  keywords: 'jpg to png converter jpeg to png convert jpg to png online free',
  intro: 'Add your JPG or JPEG pictures and get PNG files back in a second. Your images never leave your device.',
  steps: [
    'Drop your <strong>JPG or JPEG</strong> files into the box, or click to browse.',
    'Leave <strong>Convert to</strong> on PNG — it is already selected for this tool.',
    'Wait a moment for each file to appear in the list with its new size.',
    'Click <strong>Download</strong> for one file, or <strong>Download all</strong> for the whole batch.'
  ],
  formula: {
    title: 'What happens to your JPG', label: 'Good to know',
    code: `JPG  → decoded to pixels → PNG (lossless)\n\nPNG keeps every pixel exactly as the JPG shows it\nbut cannot bring back detail JPG already discarded`,
    example: 'A 1.2 MB JPG photo often becomes a 4–8 MB PNG. The picture looks identical, because PNG stores the image without further loss — it just uses far more space than JPG’s compressed format.'
  },
  table: {
    title: 'When to convert JPG to PNG',
    head: ['Situation', 'Convert?', 'Why'],
    rows: [['You will edit the image repeatedly', 'Yes', 'PNG does not degrade on every save'], ['You need a transparent background later', 'Yes', 'PNG supports transparency (the JPG itself has none)'], ['A site or tool only accepts PNG', 'Yes', 'Format requirement'], ['You just want a smaller file', 'No', 'PNG of a photo is much bigger']],
    note: 'Converting does not add transparency by itself; use an editor to remove the background.'
  },
  sections: [
    { h2: 'Why people convert JPG to PNG', html: '<p>JPG saves space by discarding detail every time it is compressed, so re-saving a JPG repeatedly makes it worse. Converting to PNG once locks in the current quality, which is useful before editing, adding text or layering a picture in a design. PNG is also required by some design tools, app stores and templates.</p>' },
    { h2: 'Expect a bigger file', html: '<p>PNG compresses without loss, so photographs make large files. That is normal. If size matters more than perfect fidelity — for a website, for example — keep the JPG or convert it to WebP instead.</p>' },
    { h2: 'Private by design', html: '<p>Conversion happens locally in your browser. Your pictures are not uploaded, stored or shared, which makes this safe for personal and work images.</p>' }
  ],
  faqs: [
    ['How do I convert a JPG to PNG?', 'Add the JPG file to the box above, leave the format on PNG, and download the converted file when it appears.'],
    ['Does converting JPG to PNG improve quality?', 'No. It keeps the quality you already have, but cannot restore detail lost when the JPG was created.'],
    ['Why is my PNG much larger than the JPG?', 'PNG stores the image without lossy compression, which takes more space for photographs.'],
    ['Will the PNG have a transparent background?', 'No. A JPG has no transparency, so the PNG will keep the same solid background. Remove it with an image editor if you need transparency.'],
    ['Can I convert several JPG files at once?', 'Yes, add as many as you like and use Download all.'],
    ['Are JPG and JPEG the same?', 'Yes. They are the same format; “jpg” is the three-letter version of the extension.'],
    ['Are my images uploaded?', 'No. Everything runs in your browser.']
  ],
  related: ['png-to-jpg-converter', 'image-converter', 'webp-to-jpg-converter', 'image-compressor']
},

/* ------------------------------------------------------------------ PNG -> JPG */
{
  ...base, slug: 'png-to-jpg-converter', icon: '🟧', app: { mode: 'convert', format: 'jpeg', accept: 'image/png,.png' },
  h1: 'PNG to JPG Converter',
  title: 'PNG to JPG Converter – Free & Private',
  description: 'Convert PNG to JPG online for free. Shrink big PNG files into small JPG images in your browser with adjustable quality — no upload and no sign-up needed.',
  card: 'Convert PNG to smaller JPG files with adjustable quality.',
  keywords: 'png to jpg converter png to jpeg convert png to jpg online reduce size',
  intro: 'Add PNG images, set the quality and download lightweight JPG files. It all happens on your device.',
  steps: [
    'Drag your <strong>PNG</strong> files into the box, or click to choose them.',
    'The output is already set to <strong>JPG</strong>. Adjust the <strong>quality</strong> slider if you want a smaller or sharper file.',
    'Check the new size shown next to each file.',
    'Download each file, or use <strong>Download all</strong>.'
  ],
  formula: {
    title: 'What happens to transparency', label: 'Important',
    code: `PNG pixel with transparency\n        ↓\nfilled with white background\n        ↓\nJPG (lossy, no transparency)\n\nquality 90 → sharp · 75 → web standard · 50 → small`,
    example: 'A logo with a transparent background will have a white background after conversion, because JPG cannot be transparent. A 4 MB PNG screenshot often drops under 600 KB as a JPG at 85% quality.'
  },
  table: {
    title: 'Choosing JPG quality',
    head: ['Quality', 'Use it for', 'Result'],
    rows: [['90–100%', 'Printing, archiving', 'Near-original, larger file'], ['80–90%', 'Photos you share or post', 'Looks identical, much smaller'], ['60–75%', 'Websites and email', 'Small, minor detail loss'], ['Below 50%', 'Thumbnails only', 'Visible blockiness']],
    note: 'JPG works best for photos. Sharp text and flat colours can show fuzzy edges at low quality.'
  },
  sections: [
    { h2: 'Why convert PNG to JPG?', html: '<p>PNG is perfect for graphics but heavy for photographs. A phone screenshot or a photo saved as PNG can be many megabytes, which slows websites, fills up storage and exceeds email and form-upload limits. JPG uses lossy compression to make the same picture a fraction of the size, which is usually the quickest way to get under a size limit.</p>' },
    { h2: 'Watch out for transparency and text', html: '<p>If your PNG has a transparent background, it will turn white. For screenshots full of small text, keep quality high (90%+) or stay with PNG, as heavy JPG compression can make letters look smudged.</p>' },
    { h2: 'No uploads', html: '<p>The conversion runs in your browser, so screenshots and personal pictures are never sent anywhere.</p>' }
  ],
  faqs: [
    ['How do I convert PNG to JPG?', 'Add the PNG file to the box, choose a quality, and download the JPG once it appears in the list.'],
    ['Will the PNG’s transparent background be kept?', 'No. JPG does not support transparency, so transparent areas become white.'],
    ['What quality should I choose?', '85–90% is a good default. Use 70–80% if you need a much smaller file.'],
    ['Why is my JPG smaller than the PNG?', 'JPG discards fine detail the eye rarely notices, whereas PNG keeps every pixel.'],
    ['Can I convert many PNGs together?', 'Yes. Add several files and download them all at once.'],
    ['Is converting PNG to JPG reversible?', 'Not fully. Converting back to PNG will not restore detail lost during JPG compression, so keep your original.'],
    ['Are my files private?', 'Yes. Nothing leaves your device.']
  ],
  related: ['jpg-to-png-converter', 'image-converter', 'image-compressor', 'image-resizer']
},

/* ------------------------------------------------------------------ WEBP -> JPG */
{
  ...base, slug: 'webp-to-jpg-converter', icon: '🟩', app: { mode: 'convert', format: 'jpeg', accept: 'image/webp,.webp' },
  h1: 'WebP to JPG Converter',
  title: 'WebP to JPG Converter – Free & Private',
  description: 'Convert WebP to JPG online for free. Make WebP images work everywhere by saving them as JPG files in your browser, with batch support and no upload.',
  card: 'Make WebP images open everywhere by converting them to JPG.',
  keywords: 'webp to jpg converter webp to jpeg convert webp to png online free',
  intro: 'Got a WebP image that will not open or upload? Add it here and download a normal JPG in seconds — nothing leaves your device.',
  steps: [
    'Drop your <strong>WebP</strong> images into the box, or click to browse your files.',
    'Output is set to <strong>JPG</strong>; switch to PNG in the menu if you need transparency.',
    'Adjust <strong>quality</strong> if you want, then wait for the converted files to appear.',
    'Download one by one, or all together.'
  ],
  formula: {
    title: 'WebP to JPG at a glance', label: 'Tip',
    code: `WebP → decoded by your browser → JPG\n\nwant to keep transparency?  choose PNG instead\nwant the smallest file?    keep it as WebP`,
    example: 'A 180 KB WebP banner becomes a JPG of around 250–350 KB. JPG is a bit larger, but it opens in practically every app, printer service and upload form.'
  },
  table: {
    title: 'Where WebP is and isn’t accepted',
    head: ['Where', 'WebP support', 'Best choice'],
    rows: [['Modern browsers', 'Yes', 'WebP'], ['Older photo editors', 'Sometimes', 'JPG'], ['Email, Word, PowerPoint', 'Partly', 'JPG'], ['Print shops and forms', 'Often no', 'JPG or PNG']],
    note: 'Support is improving, but JPG remains the safest format for sharing.'
  },
  sections: [
    { h2: 'Why WebP images cause problems', html: '<p>WebP was designed for fast websites, and browsers show it happily. The trouble starts when you save such a picture and try to use it elsewhere: some editors, social uploads, print services and older versions of office software refuse it. Converting it to JPG solves the problem for photographs.</p>' },
    { h2: 'Transparent WebP files', html: '<p>Many WebP graphics have transparent backgrounds. JPG fills those areas with white, so for logos and cut-outs choose <strong>PNG</strong> from the format menu instead.</p>' },
    { h2: 'Animated WebP', html: '<p>Animated WebP files are converted to a still image of the first frame, because JPG cannot hold animation.</p>' }
  ],
  faqs: [
    ['How do I convert WebP to JPG?', 'Add the WebP file, keep JPG selected as the output, and download the converted picture.'],
    ['Why can’t I open WebP files?', 'Some older programs do not support WebP. Converting to JPG or PNG makes the image compatible.'],
    ['Does WebP to JPG lose quality?', 'Slightly, because JPG is lossy. At 90% quality the difference is hard to see.'],
    ['What about transparency?', 'JPG cannot be transparent. Choose PNG if you need it.'],
    ['Will animated WebP stay animated?', 'No. The output is a still image of the first frame.'],
    ['Can I convert several files?', 'Yes. Batch conversion is supported, with a Download all button.'],
    ['Is it private?', 'Yes. The files are processed in your browser and never uploaded.']
  ],
  related: ['image-converter', 'png-to-jpg-converter', 'jpg-to-png-converter', 'image-compressor']
},

/* ------------------------------------------------------------------ COMPRESSOR */
{
  ...base, slug: 'image-compressor', icon: '🗜️', app: { mode: 'compress', format: 'jpeg' },
  h1: 'Image Compressor',
  title: 'Image Compressor – Reduce Image Size Online',
  description: 'Free image compressor: reduce JPG, PNG and WebP file size right in your browser. Control quality, set a maximum width, and see exactly how much you save.',
  card: 'Shrink image file sizes with adjustable quality and a max-width limit.',
  keywords: 'image compressor reduce image size compress jpg png online kb mb smaller',
  intro: 'Make pictures smaller for email, websites and uploads. Choose a quality, see the savings straight away, and download — no upload needed.',
  steps: [
    'Add your <strong>images</strong> by dragging them in or clicking the box.',
    'Choose <strong>JPG</strong> or <strong>WebP</strong> output, then set the <strong>quality</strong> (70–80% suits most web use).',
    'Optionally enter a <strong>maximum width</strong>, such as 1600 px, to shrink very large photos even more.',
    'Compare the before and after sizes, then download your files.'
  ],
  formula: {
    title: 'How compression saves space', label: 'Two levers',
    code: `1. quality  → lower quality, smaller file\n2. dimensions → fewer pixels, smaller file\n\nphone photo: 4000 × 3000 px, 4 MB\n  → max width 1600 px, quality 75% → about 250 KB`,
    example: 'A 4 MB phone photo resized to 1600 px wide at 75% quality usually lands between 200 and 400 KB — roughly 90% smaller — and still looks sharp on a screen.'
  },
  table: {
    title: 'Recommended settings',
    head: ['Use', 'Max width', 'Quality'],
    rows: [['Website hero image', '1920 px', '75–80%'], ['Blog or product photo', '1200–1600 px', '75%'], ['Email attachment', '1280 px', '70%'], ['Social media post', '1080 px', '80%'], ['Thumbnail', '400–600 px', '65–70%']],
    note: 'Start with these and lower the quality until you can just see a difference, then step back up.'
  },
  sections: [
    { h2: 'Smaller images, faster pages', html: '<p>Large pictures are the most common reason web pages load slowly. Compressing images before you publish them improves speed, helps search rankings and saves visitors’ mobile data. For email and forms, it helps you stay under attachment limits.</p>' },
    { h2: 'PNG files', html: '<p>PNG is lossless, so there is no quality slider that can shrink it. To compress a PNG photo, convert it to JPG or WebP here; flat graphics with few colours are better left as PNG.</p>' },
    { h2: 'Larger result?', html: '<p>Occasionally a file that is already heavily optimised gets bigger when re-encoded. If that happens, the tool tells you — lower the quality or keep the original.</p>' }
  ],
  faqs: [
    ['How do I reduce the size of an image?', 'Add it to the compressor, lower the quality a little and optionally set a maximum width. Download the smaller version.'],
    ['What is the best quality setting?', 'For the web, 75–80% balances size and clarity. Go higher for printing.'],
    ['Will compression make my photo blurry?', 'At moderate settings the loss is not visible. Very low quality causes blockiness around edges.'],
    ['Can I compress PNG files?', 'PNG is lossless, so convert PNG photos to JPG or WebP for large savings.'],
    ['Is my image uploaded?', 'No. Compression happens in your browser.'],
    ['How do I get an image under 100 KB?', 'Set a maximum width of 800–1000 px and quality of about 60–70%, then check the result and adjust.'],
    ['Does compressing remove metadata?', 'Yes. Re-encoding drops EXIF data such as camera details and location, which also helps privacy.']
  ],
  related: ['image-resizer', 'image-converter', 'png-to-jpg-converter', 'image-to-text-converter']
},

/* ------------------------------------------------------------------ RESIZER */
{
  ...base, slug: 'image-resizer', icon: '📐', app: { mode: 'resize', format: 'keep' },
  h1: 'Image Resizer',
  title: 'Image Resizer – Change Image Size Online',
  description: 'Free image resizer: scale pictures by percentage, width or height in your browser. Keeps the aspect ratio, supports batches and never uploads your files.',
  card: 'Resize images by percentage, width or height while keeping the ratio.',
  keywords: 'image resizer resize image online change image dimensions pixels width height percentage',
  intro: 'Resize one picture or a whole batch to the exact size you need. Pick a percentage, width or height — the aspect ratio is kept automatically.',
  steps: [
    'Add your <strong>images</strong> to the box.',
    'Choose how to resize: by <strong>percentage</strong>, <strong>width</strong> or <strong>height</strong>, and enter the value.',
    'Keep <strong>original format</strong>, or pick PNG, JPG or WebP for the output.',
    'Check the new dimensions in the list and download your resized pictures.'
  ],
  formula: {
    title: 'How resizing keeps the proportions', label: 'Example',
    code: `by width:   new height = old height × (new width ÷ old width)\nby height:  new width  = old width × (new height ÷ old height)\nby percent: both sides × (percent ÷ 100)`,
    example: 'A 4000 × 3000 px photo set to <strong>1200 px wide</strong> becomes 1200 × 900 px (3000 × 1200 ÷ 4000 = 900). Setting it to <strong>50%</strong> gives 2000 × 1500 px.'
  },
  table: {
    title: 'Common image sizes',
    head: ['Use', 'Size (px)'],
    rows: [['Instagram square post', '1080 × 1080'], ['Instagram portrait post', '1080 × 1350'], ['Instagram / Facebook story', '1080 × 1920'], ['YouTube thumbnail', '1280 × 720'], ['X (Twitter) header', '1500 × 500'], ['LinkedIn banner', '1584 × 396'], ['Pinterest pin', '1000 × 1500']],
    note: 'Platforms change their recommendations from time to time — check the latest guidance before you publish.'
  },
  sections: [
    { h2: 'Percentage, width or height?', html: '<p>Use <strong>percentage</strong> to shrink everything by the same amount, for example 50% for half-size pictures. Use <strong>width</strong> when a website or template specifies a width, such as 1200 px, and let the height follow. Use <strong>height</strong> for banners and icons where the height is the fixed measurement.</p>' },
    { h2: 'Enlarging has limits', html: '<p>Making an image smaller is safe. Making it larger cannot add detail that was never there, so enlarged pictures look soft or pixelated. If you need a bigger version, start with the highest-resolution original you have.</p>' },
    { h2: 'Resizing vs cropping', html: '<p>Resizing changes the overall dimensions while keeping the whole picture. If you need a specific shape, like a square avatar from a wide photo, you will also need to crop it in an editor.</p>' }
  ],
  faqs: [
    ['How do I resize an image without losing quality?', 'Shrinking an image loses very little visible quality. Use the original file, keep the format lossless (PNG) or high quality (90%+), and avoid enlarging.'],
    ['Does the aspect ratio stay the same?', 'Yes. You set one value (percentage, width or height) and the other side is calculated automatically.'],
    ['Can I resize many images at once?', 'Yes. Every file is resized with the same setting and you can download all of them together.'],
    ['What size should I use for a website?', 'For full-width images, 1600–1920 px is plenty. For blog photos, 1200 px usually works well.'],
    ['Does resizing change the file size?', 'Usually yes. Fewer pixels means a smaller file. Use the compressor for extra savings.'],
    ['Are my images uploaded?', 'No. All resizing happens in your browser.'],
    ['Can I make an image bigger?', 'You can, but the image will look softer because no new detail is created.']
  ],
  related: ['image-compressor', 'image-converter', 'jpg-to-png-converter', 'image-to-text-converter']
},

/* ------------------------------------------------------------------ OCR */
{
  ...base, slug: 'image-to-text-converter', icon: '🔤', app: { mode: 'ocr', script: 'ocr.js' },
  h1: 'Image to Text Converter',
  title: 'Image to Text Converter – Free Online OCR',
  description: 'Free image to text converter (OCR): extract text from photos, screenshots and scanned documents in 11 languages, then copy it or download a .txt file.',
  card: 'Extract text from photos, screenshots and scans with free OCR.',
  keywords: 'image to text converter ocr extract text from image picture to text screenshot scan online free',
  intro: 'Upload a picture of text — a screenshot, scan or photo of a page — and get editable text you can copy or download. Your image stays on your device.',
  steps: [
    'Drop an <strong>image</strong> into the box, click to choose one, or <strong>paste</strong> a screenshot with Ctrl+V.',
    'Select the <strong>language</strong> of the text for the most accurate result.',
    'Press <strong>Extract text</strong> and wait while the progress bar completes. The first run downloads the language data.',
    'Edit the text if needed, then <strong>copy</strong> it or <strong>download</strong> it as a .txt file.'
  ],
  formula: {
    title: 'How OCR works', label: 'Under the hood',
    code: `1. clean the image and find lines of text\n2. split lines into words and characters\n3. a trained model predicts each character\n4. the characters are joined into text\n\n<span class="c">// runs in your browser using Tesseract.js (open source)</span>`,
    example: 'A sharp, well-lit screenshot of an English paragraph usually comes out with 95% or higher accuracy. A blurry, tilted or low-contrast photo can drop well below that — use the tips in the table below.'
  },
  table: {
    title: 'Tips for accurate text recognition',
    head: ['Do this', 'Why it helps'],
    rows: [['Use a sharp, high-resolution picture', 'Letters need enough pixels to be recognised'], ['Keep the page straight and flat', 'Tilted or curved text confuses line detection'], ['Make sure the lighting is even', 'Shadows reduce contrast between text and paper'], ['Choose the correct language', 'The model uses language-specific patterns'], ['Crop out pictures and borders', 'Non-text areas produce random characters']],
    note: 'Handwriting and decorative fonts are much harder for OCR and may need manual correction.'
  },
  sections: [
    { h2: 'What you can use OCR for', html: '<p>OCR (optical character recognition) turns text in a picture into text you can search, edit and copy. It is handy for digitising printed pages, pulling quotes from a screenshot, copying text from a whiteboard photo, reading old documents, or extracting details from receipts and business cards.</p>' },
    { h2: 'Privacy', html: '<p>Your image is processed locally in your browser and is never uploaded to a server. The tool downloads the open-source recognition engine and the language data the first time you use it, which is why the first run takes a little longer.</p>' },
    { h2: 'Supported languages', html: '<p>English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Arabic, Urdu and Hindi. Pick the one that matches your text; mixed-language documents work best when you choose the main language.</p>' }
  ],
  faqs: [
    ['How do I convert an image to text?', 'Add the image, choose the language, press Extract text and copy the result when it appears.'],
    ['Is this image to text converter free?', 'Yes. It is free with no sign-up, and there is no limit on the number of images.'],
    ['Are my images uploaded to a server?', 'No. The recognition runs in your browser. Only the OCR engine and language data are downloaded.'],
    ['Why is the text inaccurate?', 'Blurry, small, tilted or low-contrast images reduce accuracy. Try a clearer picture and make sure the correct language is selected.'],
    ['Can it read handwriting?', 'Not reliably. It is designed for printed text, and handwriting usually needs manual correction.'],
    ['Which image formats work?', 'JPG, PNG, WebP and BMP. For PDFs, take a screenshot of the page first.'],
    ['Why does the first conversion take longer?', 'The engine and language data download the first time, then your browser can reuse them.']
  ],
  related: ['image-compressor', 'image-resizer', 'image-converter', 'percentage-calculator']
},
];
