import { auth, db } from './firebase-platform.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { addDoc, collection, onSnapshot, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const $ = selector => document.querySelector(selector);
const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const digits = value => String(value ?? '').replace(/\D/g, '');
const CART_KEY = 'almoraBazaarCartV1';
let user = auth.currentUser, products = [], partners = [], activeCategory = 'all', searchText = '';
let cart = loadCart();

const productGrid = $('#productGrid');
const productState = $('#productState');
const productEmpty = $('#productEmpty');
const partnerList = $('#partnerList');
const partnerEmpty = $('#partnerEmpty');
const partnerDialog = $('#partnerDialog');
const basketDialog = $('#basketDialog');

function loadCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); } catch { return {}; } }
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); $('#basketCount').textContent = Object.values(cart).reduce((n, item) => n + item.qty, 0); }
function cleanPhone(value) { const n = digits(value); return n.length === 10 ? `91${n}` : n.length >= 11 && n.length <= 13 ? n : ''; }
function waHref(phone, message) { const number = cleanPhone(phone); return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : ''; }

function watchProducts() {
  onSnapshot(query(collection(db, 'marketplaceProducts'), where('status', '==', 'approved')), snap => {
    products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    const liveIds = new Set(products.map(product => product.id));
    let cartChanged = false;
    for (const id of Object.keys(cart)) if (!liveIds.has(id)) { delete cart[id]; cartChanged = true; }
    if (cartChanged) saveCart();
    productState.hidden = true;
    renderProducts();
  }, error => {
    console.error('Could not load local products', error);
    productState.hidden = false;
    productState.textContent = 'Local listings could not load right now. Please try again shortly.';
    productEmpty.hidden = true;
  });
}

function renderProducts() {
  const needle = searchText.toLowerCase();
  const visible = products.filter(p => (activeCategory === 'all' || p.category === activeCategory) &&
    [p.name, p.businessName, p.location, p.description, p.category].some(v => String(v || '').toLowerCase().includes(needle)));
  productGrid.innerHTML = visible.map(p => {
    const category = ({food:'Food & pantry',craft:'Craft & culture',home:'Home & repair',services:'Local services'})[p.category] || 'Local goods';
    return `<article class="productCard"><div class="productTop"><span class="productCategory">${safe(category)}</span><span class="productVerified">✓ APPROVED</span></div><h3>${safe(p.name || 'Local listing')}</h3><span class="productBusiness">${safe(p.businessName || 'Almora business')}${p.location ? ` · ${safe(p.location)}` : ''}</span><p>${safe(p.description || 'Ask the shop for details and current availability.')}</p><div class="productBottom"><b class="productPrice">₹${Number(p.price || 0).toLocaleString('en-IN')}<small>${safe(p.unit || 'price confirmed by shop')}</small></b><button class="productOrder" type="button" data-add="${safe(p.id)}">Add to basket</button></div><span class="productShop">Order directly from the shop · no in-app payment</span></article>`;
  }).join('');
  const filtered = activeCategory !== 'all' || Boolean(needle);
  productEmpty.hidden = products.length !== 0 || filtered;
  if (!visible.length && products.length) {
    productState.hidden = false;
    productState.textContent = 'No approved listings match this search yet.';
  } else if (!visible.length && filtered) {
    productState.hidden = false;
    productState.textContent = 'No approved listings match this search yet.';
  } else productState.hidden = true;
  productGrid.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.add)));
}

function addToCart(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;
  const existing = cart[id];
  cart[id] = { id, name:p.name || 'Local listing', businessId:p.businessId || '', businessName:p.businessName || 'Almora business', location:p.location || '', unit:p.unit || '', price:Number(p.price || 0), whatsapp:p.whatsapp || '', qty:(existing?.qty || 0) + 1 };
  saveCart();
}

function renderBasket() {
  const items = Object.values(cart);
  $('#basketItems').innerHTML = items.length ? items.map(item => `<div class="basketItem"><div><b>${safe(item.name)}</b><small>${safe(item.businessName)} · ₹${Number(item.price).toLocaleString('en-IN')} ${safe(item.unit)}</small></div><div class="basketQuantity"><button type="button" data-qty="${safe(item.id)}" data-delta="-1" aria-label="Remove one">−</button><span>${item.qty}</span><button type="button" data-qty="${safe(item.id)}" data-delta="1" aria-label="Add one">+</button></div></div>`).join('') : '<div class="marketState">Your basket is empty. Add a local listing to get started.</div>';
  $('#basketAreaWrap').hidden = $('#basketFulfilment').value !== 'delivery';
  const groups = new Map();
  for (const item of items) {
    const key = item.businessId || item.businessName;
    groups.set(key, [...(groups.get(key) || []), item]);
  }
  $('#basketCheckout').innerHTML = [...groups.entries()].map(([key, group], index) => {
    const first = group[0];
    const total = group.reduce((sum, item) => sum + item.price * item.qty, 0);
    const lines = group.map(item => `• ${item.name} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}`).join('\n');
    const delivery = $('#basketFulfilment').value === 'delivery' ? `\nDelivery requested to: ${$('#basketArea').value.trim() || '[area/landmark]'}. Please confirm the delivery charge.` : '\nI will collect from the shop.';
    const text = `Namaste ${first.businessName}! I found your listing on Almora Bazaar and would like to order:\n${lines}\nEstimated listed subtotal: ₹${total.toLocaleString('en-IN')}${delivery}\nPlease confirm stock, final price and how I can pay you directly.`;
    const url = waHref(first.whatsapp, text);
    return url ? `<a class="marketPrimary basketSeller" href="${safe(url)}" target="_blank" rel="noopener">${index ? 'Order from' : 'Message'} ${safe(first.businessName)} on WhatsApp <span>↗</span></a>` : `<p class="formStatus">${safe(first.businessName)} has no valid public WhatsApp number on this listing yet.</p>`;
  }).join('');
  $('#basketCheckout').hidden = !items.length;
  $('#basketItems').querySelectorAll('[data-qty]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.qty, qty = (cart[id]?.qty || 0) + Number(button.dataset.delta);
    if (qty <= 0) delete cart[id]; else cart[id].qty = qty;
    saveCart(); renderBasket();
  }));
}

function watchPartners() {
  onSnapshot(query(collection(db, 'localDeliveryPartners'), where('status', '==', 'approved')), snap => {
    partners = snap.docs.map(doc => doc.data()).sort((a,b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
    partnerList.innerHTML = partners.map(p => {
      const detail = [p.vehicle, p.coverageArea, p.startingFee > 0 ? `from ₹${Number(p.startingFee).toLocaleString('en-IN')}` : 'fee agreed directly'].filter(Boolean).join(' · ');
      const href = waHref(p.whatsapp, 'Namaste! I found your delivery listing on Almora Bazaar. Are you available for a local delivery?');
      return `<article class="partnerCard"><div><b>${safe(p.displayName || 'Local delivery partner')}</b><small>${safe(detail || 'Ask about area and availability')}</small></div>${href ? `<a class="partnerContact" href="${safe(href)}" target="_blank" rel="noopener">WhatsApp ↗</a>` : '<span class="partnerContact">Contact details unavailable</span>'}</article>`;
    }).join('');
    partnerEmpty.hidden = partners.length > 0;
  }, error => {
    console.error('Could not load delivery partners', error);
    partnerList.innerHTML = '<div class="partnerEmpty">Delivery partner listings could not load right now.</div>';
    partnerEmpty.hidden = true;
  });
}

function setStatus(selector, message, kind = '') { const node = $(selector); node.textContent = message; node.className = `formStatus ${kind}`.trim(); }
async function loadPublicBusinessClaims() {
  const select=$('#claimBusiness');
  try {
    const { getDocs } = await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js');
    const approved=await getDocs(query(collection(db,'businesses'),where('status','==','approved')));
    select.innerHTML='<option value="">Choose a business from the directory</option>';
    approved.forEach(d=>{const b=d.data(),option=document.createElement('option');option.value=d.id;option.textContent=`${b.name||'Local business'} · ${b.location||'Almora'}`;select.append(option)});
    if(!approved.size)select.innerHTML='<option value="">No approved public listings yet</option>';
    setStatus('#claimFormStatus','Ownership requests are private and manually verified before product access is enabled.');
  } catch(error) { console.error('Could not load business directory for ownership requests',error); select.innerHTML='<option value="">Business directory could not load</option>'; }
}
function observeSession() {
  onAuthStateChanged(auth, async currentUser => {
    user = currentUser;
    const select = $('#productBusiness');
    select.innerHTML = user ? '<option value="">Loading your approved businesses…</option>' : '<option value="">Sign in to load your businesses</option>';
    if (!user) { setStatus('#productFormStatus', 'Sign in with your approved business account to submit.'); loadPublicBusinessClaims(); return; }
    try {
      const { getDocs, getDoc, doc } = await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js');
      const snap = await getDocs(query(collection(db, 'businessOwners'), where('ownerUid', '==', user.uid)));
      const verifiedBusinesses = (await Promise.all(snap.docs.map(async ownership => {
        const profile = await getDoc(doc(db, 'businesses', ownership.id));
        return profile.exists() && profile.data().status === 'approved' ? { id:ownership.id, ...ownership.data() } : null;
      }))).filter(Boolean);
      select.innerHTML = '<option value="">Choose an approved business</option>';
      verifiedBusinesses.forEach(b => { const option = document.createElement('option'); option.value=b.id; option.textContent=`${b.name} · ${b.location || 'Almora'}`; option.dataset.name=b.name || ''; option.dataset.location=b.location || ''; select.append(option); });
      if (!verifiedBusinesses.length) {
        select.innerHTML = '<option value="">No approved business profile linked</option>';
        setStatus('#productFormStatus', 'First submit your business profile in the Business Hub. Product listings require an approved owner-linked profile.');
      } else setStatus('#productFormStatus', 'Your products are reviewed before publishing.');
      await loadPublicBusinessClaims();
    } catch (error) {
      console.error('Could not load business profile', error);
      select.innerHTML = '<option value="">Business profiles could not load</option>';
      $('#claimBusiness').innerHTML = '<option value="">Business directory could not load</option>';
    }
  });
}

$('#marketSearch').addEventListener('input', event => { searchText=event.target.value.trim(); renderProducts(); });
$('#marketFilters').querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  activeCategory=button.dataset.category;
  $('#marketFilters').querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
  renderProducts();
}));
$('#basketButton').addEventListener('click', () => { renderBasket(); basketDialog.showModal(); });
$('#basketFulfilment').addEventListener('change', renderBasket);
$('#basketArea').addEventListener('input', renderBasket);
$('#partnerApplyButton').addEventListener('click', () => {
  if (!user) { setStatus('#partnerFormStatus', 'Sign in first, then return here to apply.'); partnerDialog.showModal(); return; }
  setStatus('#partnerFormStatus', ''); partnerDialog.showModal();
});

$('#productForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!user) { setStatus('#productFormStatus', 'Sign in through the Business portal before submitting a product.', 'error'); return; }
  const business = $('#productBusiness').selectedOptions[0];
  const whatsapp = cleanPhone($('#productWhatsapp').value);
  const price = Number($('#productPrice').value);
  if (!$('#productContactConsent').checked) { setStatus('#productFormStatus', 'Confirm that the WhatsApp number may appear publicly if the listing is approved.', 'error'); return; }
  if (!business?.value) { setStatus('#productFormStatus', 'Choose one of your approved business profiles.', 'error'); return; }
  if (!whatsapp) { setStatus('#productFormStatus', 'Enter a WhatsApp number with 10 to 13 digits, including country code if needed.', 'error'); return; }
  if (!Number.isFinite(price) || price < 1 || price > 1000000) { setStatus('#productFormStatus', 'Enter a price between ₹1 and ₹10,00,000.', 'error'); return; }
  try {
    await addDoc(collection(db, 'marketplaceProductSubmissions'), {
      ownerUid:user.uid, businessId:business.value, businessName:business.dataset.name, location:business.dataset.location,
      name:$('#productName').value.trim(), category:$('#productCategory').value,
      price, unit:$('#productUnit').value.trim(), description:$('#productDescription').value.trim(),
      whatsapp, publicContactConsent:true, status:'pending', createdAt:serverTimestamp()
    });
    event.currentTarget.reset();
    setStatus('#productFormStatus', 'Submitted for review. It will appear in the Bazaar only after approval.', 'success');
  } catch (error) {
    console.error('Product submission failed', error);
    setStatus('#productFormStatus', error.code === 'permission-denied' ? 'This business account is not linked to that approved profile. Ask the town admin to verify ownership.' : 'Could not submit right now. Please try again.', 'error');
  }
});

$('#claimForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!user) { setStatus('#claimFormStatus', 'Sign in before requesting business ownership verification.', 'error'); return; }
  const businessId=$('#claimBusiness').value, phone=cleanPhone($('#claimPhone').value), evidence=$('#claimEvidence').value.trim();
  if (!businessId) { setStatus('#claimFormStatus', 'Choose the approved business you represent.', 'error'); return; }
  if (!phone) { setStatus('#claimFormStatus', 'Enter a contact number with 10 to 13 digits.', 'error'); return; }
  if (evidence.length < 10) { setStatus('#claimFormStatus', 'Add a short explanation so the moderator can verify the claim.', 'error'); return; }
  try {
    await addDoc(collection(db, 'businessOwnershipSubmissions'), { ownerUid:user.uid, businessId, applicantPhone:phone, evidenceNote:evidence, status:'pending', createdAt:serverTimestamp() });
    event.currentTarget.reset();
    setStatus('#claimFormStatus', 'Request sent privately. The team will verify before granting storefront access.', 'success');
  } catch(error) {
    console.error('Business claim failed', error);
    setStatus('#claimFormStatus', error.code === 'permission-denied' ? 'This business may already be claimed. Contact the Business Hub if you believe ownership needs review.' : 'Could not submit this request right now.', 'error');
  }
});

$('#partnerForm').addEventListener('submit', async event => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault();
  if (!user) { setStatus('#partnerFormStatus', 'Sign in with a resident account first.', 'error'); return; }
  const whatsapp = cleanPhone($('#partnerWhatsapp').value);
  if (!whatsapp) { setStatus('#partnerFormStatus', 'Enter a WhatsApp number with 10 to 13 digits.', 'error'); return; }
  if (!$('#partnerConsent').checked) { setStatus('#partnerFormStatus', 'Confirm that your contact details can be shown publicly if approved.', 'error'); return; }
  const rawFee=$('#partnerRate').value.trim();
  try {
    await addDoc(collection(db, 'deliveryPartnerSubmissions'), {
      ownerUid:user.uid, displayName:$('#partnerName').value.trim(), whatsapp,
      vehicle:$('#partnerMode').value, coverageArea:$('#partnerArea').value.trim(),
      startingFee:rawFee ? Number(rawFee) : 0, publicContactConsent:true,
      status:'pending', createdAt:serverTimestamp()
    });
    event.currentTarget.reset();
    setStatus('#partnerFormStatus', 'Application submitted. Your contact details stay private until a moderator approves the public listing.', 'success');
  } catch (error) {
    console.error('Delivery partner application failed', error);
    setStatus('#partnerFormStatus', error.code === 'permission-denied' ? 'The application did not pass the account or form checks. Sign in again and try once more.' : 'Could not submit right now. Please try again.', 'error');
  }
});

saveCart();
watchProducts();
watchPartners();
observeSession();
