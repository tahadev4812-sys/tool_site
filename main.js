/* MakerMath — shared helpers + calculator runtime (vanilla JS, no dependencies) */
(function (root) {
  'use strict';

  var MM = {};

  /* ---------- Number helpers ---------- */
  MM.fmt = function (n, d) {
    d = d === undefined ? 2 : d;
    if (!isFinite(n)) return '–';
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  };
  MM.ceilTo = function (n, step) { return Math.ceil(n / step - 1e-9) * step; };
  MM.round = function (n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; };
  MM.frac = function (yards) { // 2.25 -> "2 1/4"
    var whole = Math.floor(yards), q = Math.round((yards - whole) * 4);
    if (q === 4) { whole += 1; q = 0; }
    var f = ['', ' ¼', ' ½', ' ¾'][q];
    return (whole || !q ? whole : '') + f;
  };

  root.MM = MM;
  if (typeof document === 'undefined') { // Node (tests)
    if (typeof module !== 'undefined') module.exports = MM;
    return;
  }

  /* ---------- Mobile menu ---------- */
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- Homepage search + category filter ---------- */
  var search = document.getElementById('tool-search');
  var cards = [].slice.call(document.querySelectorAll('.tool[data-name]'));
  if (cards.length) {
    var cat = 'all', empty = document.getElementById('no-results');
    var apply = function () {
      var q = (search ? search.value : '').trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var ok = (cat === 'all' || c.dataset.cat === cat) && (!q || c.dataset.name.indexOf(q) > -1);
        c.hidden = !ok; if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    if (search) search.addEventListener('input', apply);
    [].forEach.call(document.querySelectorAll('.chip[data-cat]'), function (chip) {
      chip.addEventListener('click', function () {
        cat = chip.dataset.cat;
        [].forEach.call(document.querySelectorAll('.chip[data-cat]'), function (c) {
          c.classList.toggle('active', c === chip); c.setAttribute('aria-pressed', c === chip);
        });
        apply();
      });
    });
  }

  /* ---------- Calculator runtime ---------- */
  MM.calc = function (compute) {
    var form = document.getElementById('calc-form');
    if (!form) return;
    var out = document.getElementById('result');
    var formErr = document.getElementById('form-error');
    var unitSel = form.querySelector('select[name="units"]');
    var lastText = '';

    function visible(el) { var f = el.closest('.field'); return !f || !f.hidden; }

    // Conditional fields: data-show-if="name=value[,value]"
    function syncConditions() {
      [].forEach.call(form.querySelectorAll('[data-show-if]'), function (f) {
        var p = f.dataset.showIf.split('='), el = form.elements[p[0]];
        f.hidden = !(el && p[1].split(',').indexOf(el.value) > -1);
      });
    }
    // Unit labels + per-unit default values
    var prevUnit = unitSel ? unitSel.value : null;
    function syncUnits() {
      if (!unitSel) return;
      var u = unitSel.value;
      [].forEach.call(form.querySelectorAll('.unit[data-u-' + u + ']'), function (s) { s.textContent = s.getAttribute('data-u-' + u); });
      [].forEach.call(form.querySelectorAll('input[data-default-' + u + ']'), function (i) {
        var old = i.getAttribute('data-default-' + prevUnit);
        if (i.value === '' || i.value === old) i.value = i.getAttribute('data-default-' + u);
      });
      [].forEach.call(form.querySelectorAll('input[data-eg-' + u + ']'), function (i) {
        i.placeholder = 'e.g. ' + i.getAttribute('data-eg-' + u);
      });
      prevUnit = u;
    }
    // Preset dropdown (e.g. blanket sizes): value "WxH" in inches
    [].forEach.call(form.querySelectorAll('select[data-targets]'), function (sel) {
      sel.addEventListener('change', function () {
        if (sel.value === 'custom') return;
        var t = sel.dataset.targets.split(','), wh = sel.value.split('x'), k = unitSel && unitSel.value === 'cm' ? 2.54 : 1;
        form.elements[t[0]].value = MM.round(wh[0] * k, 1);
        form.elements[t[1]].value = MM.round(wh[1] * k, 1);
      });
    });

    form.addEventListener('change', function (e) {
      if (e.target === unitSel) syncUnits();
      syncConditions();
    });
    syncConditions(); syncUnits();

    function clearErrors() {
      formErr.hidden = true;
      [].forEach.call(form.querySelectorAll('.field.invalid'), function (f) {
        f.classList.remove('invalid'); var e = f.querySelector('.field-error'); if (e) e.hidden = true;
      });
    }
    function fieldError(el, msg) {
      var f = el.closest('.field'); f.classList.add('invalid');
      var e = f.querySelector('.field-error'); e.textContent = msg; e.hidden = false;
    }

    function collect() {
      var v = {}, bad = null;
      [].forEach.call(form.elements, function (el) {
        if (!el.name || !visible(el)) return;
        if (el.tagName === 'SELECT') { v[el.name] = el.value; return; }
        if (el.type !== 'number') return;
        var label = el.dataset.label || el.name, raw = el.value.trim();
        if (raw === '') {
          if (el.required) { fieldError(el, 'Please enter ' + label.toLowerCase() + '.'); bad = bad || el; }
          return;
        }
        var n = parseFloat(raw), min = el.dataset.min !== undefined ? +el.dataset.min : 0;
        if (isNaN(n)) { fieldError(el, 'Enter a valid number.'); bad = bad || el; return; }
        if (n < 0) { fieldError(el, 'Negative numbers are not allowed.'); bad = bad || el; return; }
        if (el.hasAttribute('data-positive') && n <= 0) { fieldError(el, label + ' must be greater than zero.'); bad = bad || el; return; }
        if (n < min) { fieldError(el, label + ' must be at least ' + min + '.'); bad = bad || el; return; }
        if (el.dataset.max !== undefined && n > +el.dataset.max) { fieldError(el, label + ' can be at most ' + el.dataset.max + '.'); bad = bad || el; return; }
        v[el.name] = n;
      });
      return { v: v, bad: bad };
    }

    function render(r) {
      var h = '<div class="result-top"><div class="result-label">' + r.headline.label + '</div>' +
        '<div class="result-value">' + r.headline.value + '</div>' +
        (r.headline.sub ? '<div class="result-sub">' + r.headline.sub + '</div>' : '') + '</div>';
      h += '<table class="result-table"><tbody>';
      r.rows.forEach(function (row) {
        h += row.section ? '<tr class="sep"><th colspan="2">' + row.section + '</th></tr>'
          : '<tr><th scope="row">' + row[0] + '</th><td>' + row[1] + '</td></tr>';
      });
      h += '</tbody></table>';
      if (r.notes && r.notes.length) {
        h += '<div class="notes">' + r.notes.map(function (n) {
          return '<p' + (n.k ? ' class="' + n.k + '"' : '') + '>' + n.t + '</p>';
        }).join('') + '</div>';
      }
      h += '<div class="result-actions"><button type="button" id="copy-btn">Copy result</button></div>';
      out.innerHTML = h; out.hidden = false;
      lastText = r.headline.label + ': ' + r.headline.value.replace(/<[^>]+>/g, '') + '\n' + r.rows.filter(function (x) { return !x.section; })
        .map(function (x) { return x[0] + ': ' + String(x[1]).replace(/<[^>]+>/g, ''); }).join('\n') + '\n' + location.href;
      var cb = document.getElementById('copy-btn');
      cb.addEventListener('click', function () {
        var done = function () { cb.textContent = 'Copied ✓'; setTimeout(function () { cb.textContent = 'Copy result'; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(lastText).then(done, done); else done();
      });
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); clearErrors();
      var c = collect();
      if (c.bad) {
        formErr.textContent = 'Please fix the highlighted field' + (form.querySelectorAll('.field.invalid').length > 1 ? 's' : '') + ' and try again.';
        formErr.hidden = false; out.hidden = true; c.bad.focus(); return;
      }
      var r = compute(c.v);
      if (r.error) { formErr.textContent = r.error; formErr.hidden = false; out.hidden = true; return; }
      render(r);
    });
    form.addEventListener('reset', function () {
      setTimeout(function () { clearErrors(); out.hidden = true; prevUnit = unitSel ? unitSel.value : null; syncConditions(); syncUnits(); }, 0);
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
