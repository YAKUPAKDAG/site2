const PHONE = '905377019634';

// Header scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Flip cards — click to toggle (works on both desktop and mobile)
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

// Star picker
let seciliYildiz = 5;
const starIcons = document.querySelectorAll('#starPicker i');

function updateStars(val) {
  starIcons.forEach(s => {
    const sv = parseInt(s.dataset.val);
    s.classList.toggle('fa-solid', sv <= val);
    s.classList.toggle('fa-regular', sv > val);
    s.classList.toggle('active', sv <= val);
    s.setAttribute('aria-checked', sv === val ? 'true' : 'false');
  });
}

updateStars(5);

starIcons.forEach(star => {
  star.addEventListener('mouseover', () => updateStars(parseInt(star.dataset.val)));
  star.addEventListener('mouseleave', () => updateStars(seciliYildiz));
  star.addEventListener('click', () => {
    seciliYildiz = parseInt(star.dataset.val);
    updateStars(seciliYildiz);
  });
  star.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      seciliYildiz = parseInt(star.dataset.val);
      updateStars(seciliYildiz);
    }
  });
});

// XSS protection
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function buildStarHTML(count) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= count ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

// Abbreviate last name: "Ahmet Yılmaz Demir" → "Ahmet Y. D."
function abbreviateName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const rest = parts.slice(1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  return `${first} ${rest}`;
}

// Render a review card safely
function renderReviewCard(ad, hizmet, metin, yildiz) {
  const kart = document.createElement('div');
  kart.className = 'testimonial-card';
  kart.innerHTML = `
    <div class="stars">${buildStarHTML(yildiz)}</div>
    <p>"${escapeHTML(metin)}"</p>
    <div class="testimonial-author">
      <strong>${escapeHTML(abbreviateName(ad))}</strong>
      <span>${escapeHTML(hizmet)}</span>
    </div>
  `;
  return kart;
}

// localStorage persistence
const STORAGE_KEY = 'demirkol_yorumlar';

function loadReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const liste = document.getElementById('yorumlar-listesi');
    saved.forEach(r => liste.appendChild(renderReviewCard(r.ad, r.hizmet, r.metin, r.yildiz)));
  } catch (_) {}
}

function saveReview(ad, hizmet, metin, yildiz) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.push({ ad, hizmet, metin, yildiz });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (_) {}
}

// Turkish validation messages
const turkishMessages = {
  yorumAd:      'Lütfen adınızı ve soyadınızı girin.',
  yorumHizmet:  'Lütfen aldığınız hizmeti belirtin.',
  yorumMetin:   'Lütfen yorumunuzu yazın.',
  contactAd:    'Lütfen adınızı ve soyadınızı girin.',
  contactTel:   'Lütfen telefon numaranızı girin.',
};

document.querySelectorAll('input[required], textarea[required]').forEach(el => {
  el.addEventListener('invalid', () => {
    el.setCustomValidity(turkishMessages[el.id] || 'Bu alan zorunludur.');
  });
  el.addEventListener('input', () => el.setCustomValidity(''));
});

loadReviews();

// Yorum ekleme
function yorumEkle(e) {
  e.preventDefault();
  const ad = document.getElementById('yorumAd').value.trim();
  const hizmet = document.getElementById('yorumHizmet').value.trim();
  const metin = document.getElementById('yorumMetin').value.trim();

  const kart = renderReviewCard(ad, hizmet, metin, seciliYildiz);
  document.getElementById('yorumlar-listesi').appendChild(kart);
  saveReview(ad, hizmet, metin, seciliYildiz);

  e.target.reset();
  seciliYildiz = 5;
  updateStars(5);
  kart.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Contact form → WhatsApp redirect
function submitForm(e) {
  e.preventDefault();
  const ad = document.getElementById('contactAd').value.trim();
  const tel = document.getElementById('contactTel').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const hizmet = document.getElementById('contactHizmet').value;
  const mesaj = document.getElementById('contactMesaj').value.trim();

  let text = `Merhaba, ben ${ad}.`;
  if (hizmet) text += ` "${hizmet}" hizmeti hakkında bilgi almak istiyorum.`;
  if (tel) text += ` Telefonum: ${tel}.`;
  if (email) text += ` E-posta: ${email}.`;
  if (mesaj) text += ` Notum: ${mesaj}`;

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  e.target.reset();
}
