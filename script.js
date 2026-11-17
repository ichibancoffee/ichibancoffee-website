// Ichiban Coffee - small enhancements: mobile menu and enquiry form
(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Send the enquiry without leaving the page (falls back to a normal form post without JavaScript)
  var form = document.getElementById('enquiry');
  if (!form || !window.fetch) return;
  var status = form.querySelector('.form__status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form._honey && form._honey.value) return;
    status.classList.remove('is-error');
    status.textContent = 'Sending…';
    button.disabled = true;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });

    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.body.success) === 'false') throw new Error(res.body.message || 'Failed');
        form.reset();
        if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_name: 'enquiry' });
        status.textContent = 'Thank you. We’ve received your enquiry and will be in touch shortly.';
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = 'Sorry, that didn’t go through. Please email coffeeichiban@gmail.com or call +91 98840 61496.';
      })
      .then(function () { button.disabled = false; });
  });
})();
