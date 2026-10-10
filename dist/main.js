// The Tree of LIF: small, progressive enhancements. Every page works without this file.
const PHONE = '+14028708800';
const WHATSAPP = '14028708800';
const root = document.documentElement;
root.classList.add('js');
window.lifReady = true;

// Header gains a hairline once the page scrolls.
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});
}

// Mobile menu closes with Escape.
const menu = document.querySelector('.menu');
if (menu) {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
}

// Sections ease in as they arrive. Calm pages and reduced motion skip this.
const reveals = document.querySelectorAll('.reveal');
const still = document.body.classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (still || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
  }), {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
  reveals.forEach(el => io.observe(el));
}

// ------------------------------------------------------------ giving preview
const giftForm = document.querySelector('#give-form');
if (giftForm) {
  const amount = giftForm.elements.amount;
  const otherField = document.querySelector('#other-field');
  const status = document.querySelector('#gift-status');
  const button = document.querySelector('#give-button');
  const summary = document.querySelector('#gift-summary');
  const presets = [...giftForm.querySelectorAll('[data-amount]')];
  const params = new URLSearchParams(location.search);
  let timer;

  const money = () => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: Number(amount.value) % 1 ? 2 : 0}).format(Number(amount.value) || 0);
  const frequency = () => giftForm.elements.frequency.value;
  const designation = () => giftForm.elements.designation.value;
  const place = () => designation() === 'Where most needed' ? 'where it is needed most' : `for ${designation()}`;

  const update = () => {
    clearTimeout(timer);
    button.disabled = false;
    const monthly = frequency() === 'monthly';
    button.firstChild.textContent = `Review ${money()}${monthly ? ' monthly' : ''} gift `;
    summary.textContent = `${money()} ${monthly ? 'every month' : 'one time'}, ${place()}.`;
    const custom = otherField.classList.contains('show');
    presets.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.amount === 'other' ? custom : !custom && Number(b.dataset.amount) === Number(amount.value))));
    status.textContent = '';
  };

  presets.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.amount === 'other') {
      otherField.classList.add('show');
      amount.select();
      amount.focus();
    } else {
      otherField.classList.remove('show');
      amount.value = b.dataset.amount;
    }
    update();
  }));
  giftForm.addEventListener('input', update);
  giftForm.addEventListener('change', update);
  giftForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!amount.checkValidity()) {
      otherField.classList.add('show');
      update();
      amount.reportValidity();
      return;
    }
    status.textContent = `You chose ${money()} ${frequency() === 'monthly' ? 'monthly' : 'one time'}, ${place()}. Online payments are not connected yet. No charge has been made. To give now, call (402) 870-8800.`;
  });

  // Links elsewhere can preselect a place or monthly giving.
  const to = {needed: 'Where most needed', arizona: 'Arizona', benin: 'Benin'}[params.get('to')];
  if (to) giftForm.elements.designation.value = to;
  if (params.get('frequency') === 'monthly') giftForm.elements.frequency.value = 'monthly';
  update();

  // Labelled design previews of each state. No query string can assert a real payment.
  const state = params.get('preview');
  if (state) {
    const banner = document.createElement('p');
    banner.className = 'policy-note';
    banner.textContent = 'Giving flow design preview. No payment is processed.';
    giftForm.prepend(banner);
    if (state === 'monthly') { giftForm.elements.frequency.value = 'monthly'; update(); }
    if (state === 'processing') {
      button.disabled = true;
      status.textContent = 'Preview: preparing secure checkout…';
      timer = setTimeout(() => { button.disabled = false; status.textContent = 'Preview complete. In the connected site, this opens Stripe Checkout. No charge has been made.'; }, 3500);
    }
    if (state === 'failed') status.textContent = 'Preview: the payment could not be completed, and no gift was recorded. Check the details and try again once payments are connected.';
    if (state === 'success') {
      status.textContent = 'Preview: a confirmed gift would show its confirmation here. No payment has been made. ';
      const a = document.createElement('a');
      a.href = '/thank-you/';
      a.textContent = 'Preview the thank-you page';
      status.append(a);
    }
  }
}

// ------------------------------------------------------------ messages
// Forms compose a message and hand it to WhatsApp or the phone's text messages.
// Nothing is sent or stored by this website.
document.querySelectorAll('.message-form').forEach(form => {
  const status = form.querySelector('[role=status]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [`Hello Tree of LIF, this is ${data.get('name').trim()}.`];
    if (data.get('interest')) lines.push(`I would like to: ${data.get('interest')}.`);
    lines.push('', data.get('message').trim());
    if (data.get('reply')) lines.push('', `You can reach me at: ${data.get('reply').trim()}`);
    const text = encodeURIComponent(lines.join('\n'));
    const via = e.submitter && e.submitter.value === 'sms' ? 'sms' : 'whatsapp';
    const href = via === 'sms' ? `sms:${PHONE}?&body=${text}` : `https://wa.me/${WHATSAPP}?text=${text}`;
    status.textContent = via === 'sms'
      ? 'Your message is ready in your text messages. Press send there to deliver it.'
      : 'Your message is ready in WhatsApp. Press send there to deliver it.';
    window.location.href = href;
  });
});
