/* Image to text (OCR) using Tesseract.js, loaded on demand. The image stays on the device; only the OCR engine and language data are downloaded. */
(function () {
  'use strict';
  var app = document.getElementById('img-app');
  if (!app) return;
  var LIB = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var LANGS = [['eng', 'English'], ['spa', 'Spanish'], ['fra', 'French'], ['deu', 'German'], ['ita', 'Italian'], ['por', 'Portuguese'], ['nld', 'Dutch'], ['rus', 'Russian'], ['ara', 'Arabic'], ['urd', 'Urdu'], ['hin', 'Hindi']];
  var file = null, objUrl = null, libPromise = null;

  app.innerHTML =
    '<label class="drop" id="drop" tabindex="0"><input type="file" id="file" accept="image/*" hidden>' +
    '<span class="drop-icon" aria-hidden="true">⬆</span><strong>Drop an image here, click to choose, or paste (Ctrl+V)</strong>' +
    '<span>Screenshots, photos of documents, scans · JPG, PNG, WebP, BMP</span></label>' +
    '<div class="img-item" id="prev" hidden><img class="img-thumb" id="thumb" alt="Selected image preview"><div class="img-info"><div class="img-name" id="fname"></div><div class="img-meta" id="fmeta"></div></div><button type="button" class="img-x" id="rm" aria-label="Remove image">×</button></div>' +
    '<div class="fields" style="margin-top:18px"><div class="field full"><label for="lang">Language of the text</label><select id="lang">' +
    LANGS.map(function (l) { return '<option value="' + l[0] + '">' + l[1] + '</option>'; }).join('') + '</select>' +
    '<span class="hint">Choosing the right language greatly improves accuracy. The language data (a few MB) downloads the first time you use it.</span></div></div>' +
    '<p class="form-error" id="img-err" role="alert" hidden></p>' +
    '<div class="actions"><button class="btn" id="go" type="button" disabled>Extract text</button><button class="btn btn-ghost" id="reset" type="button">Reset</button></div>' +
    '<div class="progress" id="prog" hidden><div class="bar"><i id="bar"></i></div><span id="pmsg">Starting…</span></div>' +
    '<div class="ocr-out" id="out" hidden><label for="txt" class="ocr-label">Extracted text <span id="stats"></span></label><textarea id="txt" rows="10"></textarea>' +
    '<div class="actions"><button class="btn btn-ghost" id="copy" type="button">Copy text</button><button class="btn btn-ghost" id="save" type="button">Download .txt</button></div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var drop = $('drop'), err = $('img-err');
  function showErr(m) { err.textContent = m; err.hidden = !m; }

  function pick(f) {
    showErr('');
    if (!f || (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name))) { showErr('Please choose an image file (JPG, PNG, WebP, BMP).'); return; }
    if (objUrl) URL.revokeObjectURL(objUrl);
    file = f; objUrl = URL.createObjectURL(f);
    $('thumb').src = objUrl; $('fname').textContent = f.name;
    $('fmeta').textContent = (f.size / 1024).toFixed(1) + ' KB'; $('prev').hidden = false; $('go').disabled = false; $('out').hidden = true;
  }
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); pick(e.dataTransfer.files[0]); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); } });
  $('file').addEventListener('change', function () { pick(this.files[0]); this.value = ''; });
  document.addEventListener('paste', function (e) { var fs = e.clipboardData && e.clipboardData.files; if (fs && fs.length) pick(fs[0]); });

  function reset() {
    file = null; if (objUrl) URL.revokeObjectURL(objUrl); objUrl = null;
    $('prev').hidden = true; $('go').disabled = true; $('out').hidden = true; $('prog').hidden = true; showErr('');
  }
  $('rm').addEventListener('click', reset); $('reset').addEventListener('click', reset);

  function loadLib() {
    if (window.Tesseract) return Promise.resolve();
    if (!libPromise) libPromise = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = LIB; s.crossOrigin = 'anonymous';
      s.onload = res; s.onerror = function () { libPromise = null; rej(new Error('Could not load the text-recognition engine. Check your internet connection and try again.')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  $('go').addEventListener('click', function () {
    if (!file) return;
    var go = $('go'); go.disabled = true; showErr(''); $('out').hidden = true;
    $('prog').hidden = false; $('bar').style.width = '3%'; $('pmsg').textContent = 'Loading engine…';
    loadLib().then(function () {
      return window.Tesseract.recognize(file, $('lang').value, {
        logger: function (m) {
          var p = m.progress || 0, st = m.status || '';
          $('pmsg').textContent = st.charAt(0).toUpperCase() + st.slice(1) + '… ' + Math.round(p * 100) + '%';
          $('bar').style.width = Math.max(3, Math.round(p * 100)) + '%';
        }
      });
    }).then(function (r) {
      var t = (r.data.text || '').trim();
      $('prog').hidden = true; $('out').hidden = false; $('txt').value = t;
      var words = t ? t.split(/\s+/).length : 0;
      $('stats').textContent = '· ' + words + ' words · ' + Math.round(r.data.confidence || 0) + '% confidence';
      if (!t) showErr('No text was found. Try a sharper, higher-contrast image, or choose another language.');
      $('out').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }).catch(function (e) {
      $('prog').hidden = true; showErr(e.message || 'Something went wrong while reading the image.');
    }).then(function () { go.disabled = !file; });
  });

  $('copy').addEventListener('click', function () {
    var b = this, t = $('txt').value, done = function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy text'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else { $('txt').select(); document.execCommand('copy'); done(); }
  });
  $('save').addEventListener('click', function () {
    var u = URL.createObjectURL(new Blob([$('txt').value], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a'); a.href = u; a.download = (file ? file.name.replace(/\.[^.]+$/, '') : 'text') + '.txt';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  });
})();
