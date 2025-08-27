// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
burger?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});

// Fermer les menus mobiles quand on repasse en desktop
window.addEventListener('resize', () => {
  if (!window.matchMedia('(max-width: 680px)').matches) {
    document.querySelectorAll('.dropdown.open').forEach(el => el.classList.remove('open'));
    document.querySelector('.nav')?.classList.remove('open');
    document.querySelector('.burger')?.setAttribute('aria-expanded', 'false');
  }
});

// Dropdown behavior for mobile (tap to open)
const dropdown = document.querySelector('.dropdown > .has-caret');
dropdown?.addEventListener('click', (e) => {
  // Only on mobile layout
  if (window.matchMedia('(max-width: 680px)').matches) {
    e.preventDefault();
    dropdown.parentElement.classList.toggle('open');
  }
});

// Light "devis" cart using localStorage
const STORAGE_KEY = 'duofab_quote_items';
const quoteCountEl = document.getElementById('quoteCount');

function getQuoteItems(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function setQuoteItems(items){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateQuoteCount();
}
function updateQuoteCount(){
  const n = getQuoteItems().length;
  quoteCountEl.textContent = n;
}
updateQuoteCount();

// Add-to-quote buttons
document.querySelectorAll('.add-to-quote').forEach(btn => {
  btn.addEventListener('click', () => {
    const sku = btn.dataset.sku || btn.closest('.product')?.dataset.sku;
    const items = getQuoteItems();
    if (!items.includes(sku)) items.push(sku);
    setQuoteItems(items);
    showToast(`Article ajouté au devis : ${sku}`);
  });
});

// Quote form submit (mock)
const form = document.getElementById('quoteForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // Build a simple summary payload (in real life: send to backend or email service)
  const payload = {
    file: (data.get('file') && data.get('file').name) || '(non fourni)',
    process: data.get('process'),
    material: data.get('material'),
    color: data.get('color'),
    notes: data.get('notes') || '',
    cart: getQuoteItems(),
  };

  // Store last request locally (debug)
  localStorage.setItem('duofab_last_quote', JSON.stringify(payload));

  // Clear cart to simulate request sent
  setQuoteItems([]);

  showToast("Merci ! Votre demande a été envoyée. Vous recevrez une réponse rapide avec recommandations.");
  form.reset();
});

// Simple toast
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
