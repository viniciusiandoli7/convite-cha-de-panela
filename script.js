const CONFIG = {
  pixKey: '41356973809',
  pixName: 'VINICIUS',
  pixCity: 'SAO PAULO',
  whatsappNumber: '5511943672342',
  storageKey: 'vinicius-mariana-gifts-v2',
  confirmationsKey: 'vinicius-mariana-confirmed-guests-v2'
};

const GIFTS = [
  { name: 'Um mimo para a cozinha', value: 50, icon: '☕' },
  { name: 'Jogo de cama', value: 80, icon: '🛏️' },
  { name: 'Ajuda para montar a cozinha', value: 100, icon: '🍽️' },
  { name: 'Jogo de panelas', value: 150, icon: '🍳' },
  { name: 'Cafeteira', value: 180, icon: '☕' },
  { name: 'Um pedacinho da nossa casa', value: 200, icon: '🏡' },
  { name: 'Air Fryer', value: 250, icon: '✨' },
  { name: 'Aspirador', value: 300, icon: '🧹' },
  { name: 'Micro-ondas', value: 400, icon: '🤍' },
  { name: 'Ajuda especial para a casa nova', value: 500, icon: '🔑' }
];

let currentGuest = null;
let currentGift = null;

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const $ = id => document.getElementById(id);

function escapeHtml(str='') {
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}


function getConfirmedGuests() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.confirmationsKey) || '[]');
  } catch {
    return [];
  }
}

function saveConfirmedGuest(confirmation) {
  const list = getConfirmedGuests();
  const normalized = confirmation.name.trim().toLocaleLowerCase('pt-BR');
  const entry = {
    name: confirmation.name.trim(),
    confirmedAt: confirmation.confirmedAt
  };
  const existingIndex = list.findIndex(item => String(item.name || '').trim().toLocaleLowerCase('pt-BR') === normalized);
  if (existingIndex >= 0) list[existingIndex] = entry;
  else list.push(entry);
  list.sort((a,b) => new Date(a.confirmedAt) - new Date(b.confirmedAt));
  localStorage.setItem(CONFIG.confirmationsKey, JSON.stringify(list));
}


function renderConfirmedGuests() {
  const container = $('confirmed-list');
  if (!container) return;
  const list = getConfirmedGuests();

  const countBox = $('guest-count');
  if (countBox) {
    const total = list.length;

    const numberEl = countBox.querySelector('.guest-count-number');
    const labelEl = countBox.querySelector('.guest-count-label');
    if (numberEl) numberEl.textContent = String(total);
    if (labelEl) labelEl.textContent = total === 1 ? 'pessoa confirmada' : 'pessoas confirmadas';
  }

  if (!list.length) {
    container.innerHTML = '<p class="confirmed-empty">As confirmações vão aparecer por aqui.</p>';
    return;
  }
  container.innerHTML = list.map(item => `
    <div class="confirmed-person">
      <span class="confirmed-avatar">${escapeHtml((item.name || '?').trim().charAt(0).toUpperCase())}</span>
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>Presença confirmada</span>
      </div>
    </div>
  `).join('');
}

function renderGifts() {
  $('gift-grid').innerHTML = GIFTS.map((gift, i) => `
    <button class="gift-card" type="button" data-gift="${i}">
      <span class="gift-icon">${gift.icon}</span>
      <span class="gift-name">${escapeHtml(gift.name)}</span>
      <strong>${money(gift.value)}</strong>
      <span class="gift-cta">Escolher</span>
    </button>
  `).join('');

  document.querySelectorAll('[data-gift]').forEach(btn => {
    btn.addEventListener('click', () => openPix(GIFTS[Number(btn.dataset.gift)]));
  });
}

$('rsvp-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('rsvp-name').value.trim();
  const message = $('rsvp-msg').value.trim();

  if (!name) {
    $('rsvp-feedback').textContent = 'Preencha seu nome para confirmar 🙂';
    $('rsvp-name').focus();
    return;
  }

  currentGuest = { name, message, confirmedAt: new Date().toISOString() };
  sessionStorage.setItem('vm-rsvp', JSON.stringify(currentGuest));
  $('rsvp-feedback').textContent = '';
  $('gift-title').textContent = `Só mais um detalhe, ${name.split(' ')[0]} 🤍`;
  $('presentes').hidden = false;
  $('presentes').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('custom-gift-btn').addEventListener('click', () => {
  const raw = $('custom-value').value.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
  const value = Number(raw);
  if (!value || value < 1) {
    showToast('Digite um valor válido para o presente.');
    $('custom-value').focus();
    return;
  }
  openPix({ name: 'Presente livre', value, icon: '🤍' });
});

function openPix(gift) {
  if (!currentGuest) {
    const saved = sessionStorage.getItem('vm-rsvp');
    if (saved) currentGuest = JSON.parse(saved);
  }
  if (!currentGuest) {
    $('confirmar').scrollIntoView({ behavior: 'smooth' });
    showToast('Confirme sua presença primeiro.');
    return;
  }

  currentGift = gift;
  const txid = makeTxid();
  const payload = buildPixPayload({ key: CONFIG.pixKey, name: CONFIG.pixName, city: CONFIG.pixCity, amount: gift.value, txid });
  $('pix-summary').innerHTML = `<strong>${escapeHtml(gift.name)}</strong><br>${money(gift.value)}`;
  $('copy-pix').dataset.payload = payload;
  $('pix-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=440x440&margin=10&data=${encodeURIComponent(payload)}`;
  $('copy-feedback').textContent = '';
  $('payment-check').checked = false;
  $('mark-paid').disabled = true;
  $('pix-modal').hidden = false;
  document.body.classList.add('modal-open');
}

function closePix() {
  $('pix-modal').hidden = true;
  document.body.classList.remove('modal-open');
}

$('modal-close').addEventListener('click', closePix);
$('pix-modal').addEventListener('click', e => { if (e.target === $('pix-modal')) closePix(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('pix-modal').hidden) closePix(); });

$('copy-pix').addEventListener('click', async () => {
  const payload = $('copy-pix').dataset.payload;
  try {
    await navigator.clipboard.writeText(payload);
    $('copy-feedback').textContent = 'Pix copiado ✓ Agora é só colar no app do banco.';
  } catch {
    const ta = document.createElement('textarea');
    ta.value = payload; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    $('copy-feedback').textContent = 'Pix copiado ✓ Agora é só colar no app do banco.';
  }
});

$('payment-check').addEventListener('change', () => {
  $('mark-paid').disabled = !$('payment-check').checked;
});

$('mark-paid').addEventListener('click', () => {
  if (!currentGuest || !currentGift || !$('payment-check').checked) return;

  const confirmation = {
    name: currentGuest.name,
    message: currentGuest.message,
    gift: currentGift.name,
    value: Number(currentGift.value),
    confirmedAt: new Date().toISOString(),
    paymentDeclared: true
  };

  localStorage.setItem('vm-confirmation', JSON.stringify(confirmation));
  sessionStorage.setItem('vm-confirmation', JSON.stringify(confirmation));
  saveConfirmedGuest(confirmation);
  renderConfirmedGuests();

  closePix();
  $('presentes').hidden = true;
  $('final-title').textContent = `Presença confirmada, ${currentGuest.name.split(' ')[0]}! 🤍`;
  $('confirmacao-final').hidden = false;
  $('confirmacao-final').scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('Tudo certo! Presença finalizada 🤍');
});

function showToast(text) {
  const toast = $('toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function makeTxid() {
  return `CHA${Date.now().toString().slice(-12)}`.replace(/[^A-Za-z0-9]/g, '').slice(0, 25);
}

function emv(id, value) { return id + String(value.length).padStart(2, '0') + value; }
function sanitizePixText(value, max) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9 ]/g, '').toUpperCase().slice(0, max);
}
function buildPixPayload({ key, name, city, amount, txid='***' }) {
  const merchantAccount = emv('00','BR.GOV.BCB.PIX') + emv('01', key);
  let payload = emv('00','01') + emv('26', merchantAccount) + emv('52','0000') + emv('53','986');
  if (amount) payload += emv('54', Number(amount).toFixed(2));
  payload += emv('58','BR') + emv('59', sanitizePixText(name,25)) + emv('60', sanitizePixText(city,15));
  payload += emv('62', emv('05', txid)) + '6304';
  return payload + crc16(payload);
}
function crc16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
    crc &= 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4,'0');
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

renderGifts();
renderConfirmedGuests();
