/* Image tools: convert, compress, resize. Everything runs in the browser via <canvas>; files are never uploaded. */
(function () {
  'use strict';
  var app = document.getElementById('img-app');
  if (!app) return;
  var mode = app.dataset.mode, defFmt = app.dataset.format || 'png', accept = app.dataset.accept || 'image/*';
  var FM = {
    png: { mime: 'image/png', ext: 'png', label: 'PNG' },
    jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPG' },
    webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' }
  };
  var items = [], timer = null, runId = 0;

  var fmtOpts = function (sel, withKeep) {
    return (withKeep ? '<option value="keep">Keep original format</option>' : '') +
      Object.keys(FM).map(function (k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + FM[k].label + '</option>'; }).join('');
  };
  var opts = '';
  if (mode === 'convert') {
    opts = '<div class="field"><label for="o-fmt">Convert to</label><select id="o-fmt">' + fmtOpts(defFmt) + '</select></div>' +
      '<div class="field" id="q-wrap"><label for="o-q">Quality: <span id="q-val">90</span>%</label><input id="o-q" type="range" min="10" max="100" value="90"></div>';
  } else if (mode === 'compress') {
    opts = '<div class="field"><label for="o-fmt">Output format</label><select id="o-fmt"><option value="jpeg">JPG (best for photos)</option><option value="webp">WebP (smallest)</option></select></div>' +
      '<div class="field"><label for="o-q">Quality: <span id="q-val">75</span>%</label><input id="o-q" type="range" min="10" max="100" value="75"></div>' +
      '<div class="field"><label for="o-max">Max width (optional)</label><div class="input-wrap"><input id="o-max" class="has-unit" type="number" min="1" step="1" placeholder="e.g. 1600"><span class="unit">px</span></div></div>';
  } else if (mode === 'resize') {
    opts = '<div class="field"><label for="o-by">Resize by</label><select id="o-by"><option value="percent">Percentage</option><option value="width">Width (keeps ratio)</option><option value="height">Height (keeps ratio)</option></select></div>' +
      '<div class="field"><label for="o-val" id="o-val-l">Scale</label><div class="input-wrap"><input id="o-val" class="has-unit" type="number" min="1" step="1" value="50"><span class="unit" id="o-unit">%</span></div></div>' +
      '<div class="field"><label for="o-fmt">Output format</label><select id="o-fmt">' + fmtOpts('keep', true) + '</select></div>';
  }

  app.innerHTML =
    '<label class="drop" id="drop" tabindex="0"><input type="file" id="file" multiple accept="' + accept + '" hidden>' +
    '<span class="drop-icon" aria-hidden="true">⬆</span><strong>Drop images here, or click to choose</strong>' +
    '<span>JPG, PNG, WebP, GIF or BMP · processed privately on your device</span></label>' +
    '<div class="img-opts fields">' + opts + '</div>' +
    '<p class="form-error" id="img-err" role="alert" hidden></p>' +
    '<div class="img-list" id="list"></div>' +
    '<div class="actions" id="acts" hidden><button class="btn" id="dl-all" type="button">Download all</button><button class="btn btn-ghost" id="clear" type="button">Clear</button></div>';

  var $ = function (id) { return document.getElementById(id); };
  var drop = $('drop'), fileIn = $('file'), list = $('list'), err = $('img-err'), acts = $('acts');

  function showErr(m) { err.textContent = m; err.hidden = !m; }
  function size(b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB'; }
  function opt(id) { var e = $(id); return e ? e.value : null; }

  /* ---- add files ---- */
  function add(files) {
    showErr('');
    var bad = 0;
    [].forEach.call(files, function (f) {
      if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(f.name)) { bad++; return; }
      items.push({ file: f, url: URL.createObjectURL(f), out: null, err: '' });
    });
    if (bad) showErr(bad + ' file(s) skipped — only image files are supported.');
    schedule(0);
  }
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); add(e.dataTransfer.files); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileIn.click(); } });
  fileIn.addEventListener('change', function () { add(fileIn.files); fileIn.value = ''; });
  document.addEventListener('paste', function (e) {
    var fs = e.clipboardData && e.clipboardData.files; if (fs && fs.length) add(fs);
  });

  /* ---- option changes ---- */
  app.querySelector('.img-opts').addEventListener('input', function (e) {
    if (e.target.id === 'o-q') $('q-val').textContent = e.target.value;
    if (e.target.id === 'o-by') {
      var by = e.target.value;
      $('o-val-l').textContent = by === 'percent' ? 'Scale' : by === 'width' ? 'New width' : 'New height';
      $('o-unit').textContent = by === 'percent' ? '%' : 'px';
      $('o-val').value = by === 'percent' ? 50 : 800;
    }
    var f = $('o-fmt'), q = $('q-wrap');
    if (q && f) q.hidden = f.value === 'png';
    items.forEach(function (it) { it.out = null; });
    schedule(250);
  });

  /* ---- processing ---- */
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(run, ms); }

  function load(it) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('This file could not be read. HEIC/HEIF photos are not supported by most browsers.')); };
      im.src = it.url;
    });
  }

  function outFormat(it) {
    var f = opt('o-fmt') || defFmt;
    if (f === 'keep') { var t = it.file.type; f = t === 'image/jpeg' ? 'jpeg' : t === 'image/webp' ? 'webp' : 'png'; }
    return f;
  }

  function convert(it) {
    return load(it).then(function (im) {
      var w = im.naturalWidth, h = im.naturalHeight;
      if (mode === 'compress') {
        var mx = parseInt(opt('o-max'), 10);
        if (mx > 0 && w > mx) { h = Math.round(h * mx / w); w = mx; }
      } else if (mode === 'resize') {
        var by = opt('o-by'), v = parseFloat(opt('o-val'));
        if (!(v > 0)) throw new Error('Enter a number greater than zero.');
        if (by === 'percent') { w = Math.round(w * v / 100); h = Math.round(h * v / 100); }
        else if (by === 'width') { h = Math.round(h * v / w); w = Math.round(v); }
        else { w = Math.round(w * v / h); h = Math.round(v); }
      }
      w = Math.max(1, w); h = Math.max(1, h);
      if (w * h > 120e6) throw new Error('The result would be too large for your browser. Try a smaller size.');
      var key = outFormat(it), fm = FM[key];
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var ctx = c.getContext('2d');
      if (key === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, 0, 0, w, h);
      var q = (parseInt(opt('o-q'), 10) || 90) / 100;
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { b ? res({ blob: b, w: w, h: h, fm: fm, url: URL.createObjectURL(b) }) : rej(new Error('Your browser could not create ' + fm.label + ' files.')); }, fm.mime, key === 'png' ? undefined : q);
      });
    });
  }

  function outName(it, fm) {
    var base = it.file.name.replace(/\.[^.]+$/, '') || 'image';
    return base + (mode === 'compress' ? '-compressed' : mode === 'resize' ? '-resized' : '') + '.' + fm.ext;
  }

  function run() {
    var id = ++runId;
    render();
    items.reduce(function (p, it) {
      return p.then(function () {
        if (id !== runId || it.out || it.err) return;
        return convert(it).then(function (o) { it.out = o; }, function (e) { it.err = e.message; }).then(function () { if (id === runId) render(); });
      });
    }, Promise.resolve());
  }

  function render() {
    list.innerHTML = '';
    acts.hidden = !items.length;
    items.forEach(function (it, i) {
      var row = document.createElement('div'); row.className = 'img-item';
      var th = document.createElement('img'); th.alt = ''; th.src = (it.out && it.out.url) || it.url; th.className = 'img-thumb';
      var info = document.createElement('div'); info.className = 'img-info';
      var nm = document.createElement('div'); nm.className = 'img-name'; nm.textContent = it.out ? outName(it, it.out.fm) : it.file.name;
      var meta = document.createElement('div'); meta.className = 'img-meta';
      if (it.err) { meta.textContent = it.err; meta.classList.add('bad'); }
      else if (!it.out) meta.textContent = 'Processing… (' + size(it.file.size) + ')';
      else {
        var d = Math.round((1 - it.out.blob.size / it.file.size) * 100);
        meta.textContent = size(it.file.size) + ' → ' + size(it.out.blob.size) + ' · ' + it.out.w + '×' + it.out.h + ' px' +
          (mode === 'compress' ? (d >= 0 ? ' · ' + d + '% smaller' : ' · ' + (-d) + '% larger — try a lower quality') : '');
      }
      info.appendChild(nm); info.appendChild(meta);
      row.appendChild(th); row.appendChild(info);
      if (it.out) {
        var a = document.createElement('a'); a.className = 'btn btn-sm'; a.textContent = 'Download';
        a.href = it.out.url; a.download = outName(it, it.out.fm); row.appendChild(a);
      }
      var x = document.createElement('button'); x.type = 'button'; x.className = 'img-x'; x.setAttribute('aria-label', 'Remove ' + it.file.name); x.textContent = '×';
      x.addEventListener('click', function () { dispose(it); items.splice(items.indexOf(it), 1); render(); });
      row.appendChild(x);
      list.appendChild(row);
    });
    var ready = items.filter(function (it) { return it.out; }).length;
    $('dl-all').textContent = ready > 1 ? 'Download all (' + ready + ')' : 'Download';
    $('dl-all').disabled = !ready;
  }

  function dispose(it) { URL.revokeObjectURL(it.url); if (it.out) URL.revokeObjectURL(it.out.url); }
  $('clear').addEventListener('click', function () { items.forEach(dispose); items = []; runId++; showErr(''); render(); });
  $('dl-all').addEventListener('click', function () {
    items.filter(function (it) { return it.out; }).forEach(function (it, i) {
      setTimeout(function () {
        var a = document.createElement('a'); a.href = it.out.url; a.download = outName(it, it.out.fm);
        document.body.appendChild(a); a.click(); a.remove();
      }, i * 250);
    });
  });

  var q = $('q-wrap'), f = $('o-fmt'); if (q && f) q.hidden = f.value === 'png';
  render();
})();
